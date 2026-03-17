"""MCP Meta Ads Server

Meta (Facebook/Instagram) advertising management via Model Context Protocol.
Mirrors the patterns of mcp-google-ads — raw requests to Graph API + FastMCP.
"""

from typing import Optional
from pydantic import Field
import os
import json
import requests
import webbrowser
import logging
import hashlib
import stat
import secrets
from datetime import datetime, timedelta
from pathlib import Path
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

from mcp.server.fastmcp import FastMCP


# ============================================================
# LOGGING
# ============================================================

_log_level = getattr(logging, os.environ.get("LOG_LEVEL", "WARNING").upper(), logging.WARNING)
logging.basicConfig(
    level=_log_level,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("meta_ads_server")


# ============================================================
# SERVER INIT
# ============================================================

mcp = FastMCP(
    "meta-ads-server",
    dependencies=["requests", "python-dotenv"],
)


# ============================================================
# CONSTANTS & ENV
# ============================================================

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    logger.warning("python-dotenv not installed, skipping .env file loading")

META_APP_ID = os.environ.get("META_APP_ID", "")
META_APP_SECRET = os.environ.get("META_APP_SECRET", "")
META_ACCESS_TOKEN = os.environ.get("META_ACCESS_TOKEN", "")
META_AD_ACCOUNT_ID = os.environ.get("META_AD_ACCOUNT_ID", "")
META_AUTH_TYPE = os.environ.get("META_AUTH_TYPE", "oauth")
META_API_VERSION = os.environ.get("META_API_VERSION", "v24.0")

GRAPH_API_BASE = f"https://graph.facebook.com/{META_API_VERSION}"
TOKEN_FILE = Path(__file__).parent / "meta_ads_token.json"
OAUTH_SCOPES = ["ads_read", "ads_management", "pages_read_engagement"]
OAUTH_REDIRECT_PORT = 9876


# ============================================================
# AUTH — OAuth + System User Token dual support
# ============================================================

_oauth_code = None
_oauth_error = None


class _OAuthCallbackHandler(BaseHTTPRequestHandler):
    """HTTP handler for OAuth redirect callback."""

    def do_GET(self):
        global _oauth_code, _oauth_error
        parsed = urlparse(self.path)
        params = parse_qs(parsed.query)

        if "code" in params:
            _oauth_code = params["code"][0]
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(
                b"<html><body><h1>Authorization successful!</h1>"
                b"<p>You can close this window and return to the terminal.</p>"
                b"</body></html>"
            )
        elif "error" in params:
            _oauth_error = params.get("error_description", params["error"])[0]
            self.send_response(400)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(
                f"<html><body><h1>Authorization failed</h1>"
                f"<p>{_oauth_error}</p></body></html>".encode()
            )
        else:
            self.send_response(400)
            self.end_headers()

    def log_message(self, format, *args):
        pass  # suppress default HTTP server logs


def _save_token(token_data: dict):
    """Save token data to JSON file."""
    TOKEN_FILE.write_text(json.dumps(token_data, indent=2))
    try:
        os.chmod(TOKEN_FILE, stat.S_IRUSR | stat.S_IWUSR)
    except OSError:
        pass
    logger.debug(f"Token saved to {TOKEN_FILE}")


def _load_token() -> dict | None:
    """Load token data from JSON file."""
    if TOKEN_FILE.exists():
        try:
            return json.loads(TOKEN_FILE.read_text())
        except (json.JSONDecodeError, IOError) as e:
            logger.warning(f"Failed to load token file: {e}")
    return None


def _exchange_code_for_token(code: str) -> dict:
    """Exchange OAuth authorization code for short-lived access token."""
    redirect_uri = f"http://localhost:{OAUTH_REDIRECT_PORT}/callback"
    resp = requests.post(
        f"{GRAPH_API_BASE}/oauth/access_token",
        data={
            "client_id": META_APP_ID,
            "client_secret": META_APP_SECRET,
            "redirect_uri": redirect_uri,
            "code": code,
        },
    )
    if resp.status_code != 200:
        raise Exception(f"Token exchange failed (HTTP {resp.status_code})")
    return resp.json()


def _exchange_for_long_lived_token(short_token: str) -> dict:
    """Exchange short-lived token for long-lived token (~60 days)."""
    resp = requests.post(
        f"{GRAPH_API_BASE}/oauth/access_token",
        data={
            "grant_type": "fb_exchange_token",
            "client_id": META_APP_ID,
            "client_secret": META_APP_SECRET,
            "fb_exchange_token": short_token,
        },
    )
    if resp.status_code != 200:
        raise Exception(f"Long-lived token exchange failed (HTTP {resp.status_code})")
    return resp.json()


def _run_oauth_flow() -> str:
    """Run interactive OAuth flow via local HTTP server. Returns long-lived token."""
    global _oauth_code, _oauth_error
    _oauth_code = None
    _oauth_error = None
    oauth_state = secrets.token_urlsafe(32)

    if not META_APP_ID or not META_APP_SECRET:
        raise ValueError(
            "META_APP_ID and META_APP_SECRET environment variables must be set for OAuth"
        )

    redirect_uri = f"http://localhost:{OAUTH_REDIRECT_PORT}/callback"
    scope = ",".join(OAUTH_SCOPES)
    auth_url = (
        f"https://www.facebook.com/{META_API_VERSION}/dialog/oauth"
        f"?client_id={META_APP_ID}"
        f"&redirect_uri={redirect_uri}"
        f"&scope={scope}"
        f"&response_type=code"
        f"&state={oauth_state}"
    )

    server = HTTPServer(("localhost", OAUTH_REDIRECT_PORT), _OAuthCallbackHandler)
    server.timeout = 120

    logger.info("Opening browser for Meta OAuth login...")
    webbrowser.open(auth_url)

    while _oauth_code is None and _oauth_error is None:
        server.handle_request()
    server.server_close()

    if _oauth_error:
        raise Exception(f"OAuth authorization failed: {_oauth_error}")

    # Exchange code → short-lived token → long-lived token
    token_data = _exchange_code_for_token(_oauth_code)
    short_token = token_data["access_token"]

    long_lived_data = _exchange_for_long_lived_token(short_token)
    access_token = long_lived_data["access_token"]
    expires_in = long_lived_data.get("expires_in", 5184000)  # default 60 days

    _save_token(
        {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_at": (
                datetime.now() + timedelta(seconds=expires_in)
            ).isoformat(),
        }
    )
    return access_token


def _validate_token(token: str) -> bool:
    """Check if a token is still valid via /me endpoint."""
    try:
        resp = requests.get(
            f"{GRAPH_API_BASE}/me",
            headers={"Authorization": f"Bearer {token}"},
            timeout=10,
        )
        return resp.status_code == 200
    except requests.RequestException:
        return False


def get_access_token() -> str:
    """Get a valid access token. Dispatches to system_user or OAuth based on config."""
    auth_type = META_AUTH_TYPE.lower()

    # System user: just return the env token
    if auth_type == "system_user":
        if not META_ACCESS_TOKEN:
            raise ValueError(
                "META_ACCESS_TOKEN must be set when META_AUTH_TYPE=system_user"
            )
        return META_ACCESS_TOKEN

    # OAuth: check saved token → env token → run OAuth flow
    token_data = _load_token()
    if token_data:
        token = token_data.get("access_token", "")
        expires_at = token_data.get("expires_at", "")
        if expires_at:
            try:
                exp = datetime.fromisoformat(expires_at)
                if datetime.now() < exp - timedelta(days=1):
                    if _validate_token(token):
                        return token
                    logger.warning("Saved token failed validation, re-authenticating")
            except ValueError:
                pass

    if META_ACCESS_TOKEN and _validate_token(META_ACCESS_TOKEN):
        return META_ACCESS_TOKEN

    return _run_oauth_flow()


# ============================================================
# API HELPERS
# ============================================================


def format_account_id(account_id: str) -> str:
    """Ensure account ID has 'act_' prefix."""
    account_id = str(account_id).strip()
    if not account_id.startswith("act_"):
        account_id = f"act_{account_id}"
    return account_id


def meta_api_get(endpoint: str, params: dict | None = None) -> dict:
    """GET request to Meta Graph API."""
    token = get_access_token()
    url = f"{GRAPH_API_BASE}/{endpoint}"
    if params is None:
        params = {}
    headers = {"Authorization": f"Bearer {token}"}

    resp = requests.get(url, params=params, headers=headers)
    if resp.status_code != 200:
        raise Exception(f"API GET {endpoint} failed ({resp.status_code})")
    return resp.json()


def meta_api_post(endpoint: str, data: dict | None = None) -> dict:
    """POST request to Meta Graph API (form-encoded)."""
    token = get_access_token()
    url = f"{GRAPH_API_BASE}/{endpoint}"
    if data is None:
        data = {}
    headers = {"Authorization": f"Bearer {token}"}

    resp = requests.post(url, data=data, headers=headers)
    if resp.status_code != 200:
        raise Exception(
            f"API POST {endpoint} failed ({resp.status_code})"
        )
    return resp.json()


def meta_api_delete(endpoint: str) -> dict:
    """DELETE request to Meta Graph API."""
    token = get_access_token()
    url = f"{GRAPH_API_BASE}/{endpoint}"
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.delete(url, headers=headers)
    if resp.status_code != 200:
        raise Exception(
            f"API DELETE {endpoint} failed ({resp.status_code})"
        )
    return resp.json()


def fetch_all_pages(
    endpoint: str, params: dict | None = None, max_pages: int = 10
) -> list:
    """Fetch all pages of a cursor-paginated API response."""
    if params is None:
        params = {}
    all_data = []

    for _ in range(max_pages):
        result = meta_api_get(endpoint, params)
        data = result.get("data", [])
        all_data.extend(data)

        paging = result.get("paging", {})
        cursors = paging.get("cursors", {})
        after = cursors.get("after")
        if not after or not paging.get("next"):
            break
        params["after"] = after

    return all_data


# ============================================================
# READ TOOLS (14)
# ============================================================


# --- #1 list_ad_accounts ---
@mcp.tool()
async def list_ad_accounts() -> str:
    """List all accessible Meta ad accounts."""
    try:
        fields = "id,name,account_status,currency,timezone_name,amount_spent"
        data = fetch_all_pages("me/adaccounts", {"fields": fields, "limit": "100"})

        if not data:
            return "No ad accounts found."

        status_map = {
            1: "ACTIVE",
            2: "DISABLED",
            3: "UNSETTLED",
            7: "PENDING_RISK_REVIEW",
            8: "PENDING_SETTLEMENT",
            9: "IN_GRACE_PERIOD",
            100: "PENDING_CLOSURE",
            101: "CLOSED",
        }

        lines = ["Meta Ad Accounts:", "=" * 70]
        for acc in data:
            status_code = acc.get("account_status", 0)
            status = status_map.get(status_code, f"UNKNOWN({status_code})")
            currency = acc.get("currency", "")
            spent = acc.get("amount_spent", "0")
            lines.append(f"  Account ID: {acc.get('id', 'N/A')}")
            lines.append(f"  Name:       {acc.get('name', 'N/A')}")
            lines.append(f"  Status:     {status}")
            lines.append(f"  Currency:   {currency}")
            lines.append(f"  Timezone:   {acc.get('timezone_name', 'N/A')}")
            lines.append(f"  Total Spent: {float(spent) / 100:.2f} {currency}")
            lines.append("-" * 70)

        return "\n".join(lines)

    except Exception as e:
        return f"Error listing ad accounts: {str(e)}"


# --- #2 get_campaign_performance ---
@mcp.tool()
async def get_campaign_performance(
    account_id: str = Field(
        description="Meta ad account ID (e.g. 'act_123456' or '123456')"
    ),
    date_preset: str = Field(
        default="last_30d",
        description="Date preset: 'today', 'yesterday', 'last_7d', 'last_14d', 'last_30d', 'last_90d', 'this_month', 'last_month'",
    ),
    limit: int = Field(default=50, description="Maximum campaigns to return"),
) -> str:
    """Campaign performance metrics with actions breakdown."""
    try:
        act_id = format_account_id(account_id)
        fields = (
            "campaign_id,campaign_name,objective,"
            "impressions,clicks,spend,cpc,cpm,ctr,"
            "reach,frequency,conversions,actions,cost_per_action_type"
        )
        params = {
            "fields": fields,
            "date_preset": date_preset,
            "level": "campaign",
            "limit": str(limit),
        }
        data = fetch_all_pages(f"{act_id}/insights", params)

        if not data:
            return f"No campaign performance data found for {act_id} ({date_preset})."

        lines = [
            f"Campaign Performance for {act_id} ({date_preset}):",
            "=" * 80,
        ]
        for row in data:
            lines.append(
                f"  Campaign: {row.get('campaign_name', 'N/A')} "
                f"(ID: {row.get('campaign_id', 'N/A')})"
            )
            lines.append(f"  Objective:    {row.get('objective', 'N/A')}")
            lines.append(f"  Impressions:  {row.get('impressions', '0'):>12}")
            lines.append(f"  Reach:        {row.get('reach', '0'):>12}")
            lines.append(f"  Clicks:       {row.get('clicks', '0'):>12}")
            lines.append(f"  Spend:        {row.get('spend', '0'):>12}")
            lines.append(f"  CPC:          {row.get('cpc', 'N/A'):>12}")
            lines.append(f"  CPM:          {row.get('cpm', 'N/A'):>12}")
            lines.append(f"  CTR:          {row.get('ctr', 'N/A'):>12}%")

            actions = row.get("actions", [])
            if actions:
                lines.append("  Actions:")
                for action in actions:
                    lines.append(
                        f"    - {action.get('action_type', 'unknown')}: "
                        f"{action.get('value', '0')}"
                    )
            lines.append("-" * 80)

        return "\n".join(lines)

    except Exception as e:
        return f"Error getting campaign performance: {str(e)}"


# --- #3 get_adset_performance ---
@mcp.tool()
async def get_adset_performance(
    account_id: str = Field(description="Meta ad account ID"),
    date_preset: str = Field(default="last_30d", description="Date preset"),
    campaign_id: str = Field(
        default="", description="Optional: filter by campaign ID"
    ),
    limit: int = Field(default=50, description="Maximum ad sets to return"),
) -> str:
    """Ad set performance metrics, optionally filtered by campaign."""
    try:
        act_id = format_account_id(account_id)
        fields = (
            "adset_id,adset_name,campaign_name,"
            "impressions,clicks,spend,cpc,cpm,ctr,"
            "reach,frequency,conversions,actions"
        )
        params = {
            "fields": fields,
            "date_preset": date_preset,
            "level": "adset",
            "limit": str(limit),
        }
        if campaign_id:
            params["filtering"] = json.dumps(
                [{"field": "campaign.id", "operator": "EQUAL", "value": campaign_id}]
            )

        data = fetch_all_pages(f"{act_id}/insights", params)

        if not data:
            return f"No ad set performance data found for {act_id}."

        lines = [f"Ad Set Performance for {act_id} ({date_preset}):", "=" * 80]
        for row in data:
            lines.append(
                f"  Ad Set:  {row.get('adset_name', 'N/A')} "
                f"(ID: {row.get('adset_id', 'N/A')})"
            )
            lines.append(f"  Campaign: {row.get('campaign_name', 'N/A')}")
            lines.append(
                f"  Impressions: {row.get('impressions', '0'):>10}  "
                f"Clicks: {row.get('clicks', '0'):>8}  "
                f"Spend: {row.get('spend', '0'):>10}"
            )
            lines.append(
                f"  CPC: {row.get('cpc', 'N/A')}  "
                f"CPM: {row.get('cpm', 'N/A')}  "
                f"CTR: {row.get('ctr', 'N/A')}%"
            )
            lines.append("-" * 80)

        return "\n".join(lines)

    except Exception as e:
        return f"Error getting ad set performance: {str(e)}"


# --- #4 get_ad_performance ---
@mcp.tool()
async def get_ad_performance(
    account_id: str = Field(description="Meta ad account ID"),
    date_preset: str = Field(default="last_30d", description="Date preset"),
    campaign_id: str = Field(
        default="", description="Optional: filter by campaign ID"
    ),
    limit: int = Field(default=50, description="Maximum ads to return"),
) -> str:
    """Get performance metrics for individual ads."""
    try:
        act_id = format_account_id(account_id)
        fields = (
            "ad_id,ad_name,adset_name,campaign_name,"
            "impressions,clicks,spend,cpc,cpm,ctr,"
            "reach,conversions,actions"
        )
        params = {
            "fields": fields,
            "date_preset": date_preset,
            "level": "ad",
            "limit": str(limit),
        }
        if campaign_id:
            params["filtering"] = json.dumps(
                [{"field": "campaign.id", "operator": "EQUAL", "value": campaign_id}]
            )

        data = fetch_all_pages(f"{act_id}/insights", params)

        if not data:
            return f"No ad performance data found for {act_id}."

        lines = [f"Ad Performance for {act_id} ({date_preset}):", "=" * 80]
        for row in data:
            lines.append(
                f"  Ad:       {row.get('ad_name', 'N/A')} "
                f"(ID: {row.get('ad_id', 'N/A')})"
            )
            lines.append(f"  Ad Set:   {row.get('adset_name', 'N/A')}")
            lines.append(f"  Campaign: {row.get('campaign_name', 'N/A')}")
            lines.append(
                f"  Impressions: {row.get('impressions', '0'):>10}  "
                f"Clicks: {row.get('clicks', '0'):>8}  "
                f"Spend: {row.get('spend', '0'):>10}"
            )
            lines.append(
                f"  CPC: {row.get('cpc', 'N/A')}  "
                f"CPM: {row.get('cpm', 'N/A')}  "
                f"CTR: {row.get('ctr', 'N/A')}%"
            )
            actions = row.get("actions", [])
            if actions:
                lines.append("  Actions:")
                for action in actions[:5]:
                    lines.append(
                        f"    - {action.get('action_type', 'unknown')}: "
                        f"{action.get('value', '0')}"
                    )
            lines.append("-" * 80)

        return "\n".join(lines)

    except Exception as e:
        return f"Error getting ad performance: {str(e)}"


# --- #5 get_ad_creatives ---
@mcp.tool()
async def get_ad_creatives(
    account_id: str = Field(description="Meta ad account ID"),
    limit: int = Field(default=50, description="Maximum creatives to return"),
) -> str:
    """Get ad creatives including images, videos, and copy text."""
    try:
        act_id = format_account_id(account_id)
        fields = (
            "id,name,status,"
            "creative{id,name,title,body,image_url,thumbnail_url,"
            "object_story_spec,effective_object_story_id}"
        )
        data = fetch_all_pages(
            f"{act_id}/ads", {"fields": fields, "limit": str(limit)}
        )

        if not data:
            return f"No ads/creatives found for {act_id}."

        lines = [f"Ad Creatives for {act_id}:", "=" * 80]
        for ad in data:
            lines.append(
                f"  Ad: {ad.get('name', 'N/A')} (ID: {ad.get('id', 'N/A')})"
            )
            lines.append(f"  Status: {ad.get('status', 'N/A')}")

            creative = ad.get("creative", {})
            if creative:
                lines.append(f"  Creative ID: {creative.get('id', 'N/A')}")
                if creative.get("title"):
                    lines.append(f"  Title: {creative['title']}")
                if creative.get("body"):
                    lines.append(f"  Body: {creative['body']}")
                if creative.get("image_url"):
                    lines.append(f"  Image: {creative['image_url']}")

                oss = creative.get("object_story_spec", {})
                if oss:
                    link_data = oss.get("link_data", {})
                    if link_data:
                        lines.append(f"  Link: {link_data.get('link', 'N/A')}")
                        lines.append(
                            f"  Message: {link_data.get('message', 'N/A')}"
                        )
                        cta = link_data.get("call_to_action", {})
                        lines.append(f"  CTA: {cta.get('type', 'N/A')}")

                    video_data = oss.get("video_data", {})
                    if video_data:
                        lines.append(
                            f"  Video Title: {video_data.get('title', 'N/A')}"
                        )
                        lines.append(
                            f"  Video Message: {video_data.get('message', 'N/A')}"
                        )
            lines.append("-" * 80)

        return "\n".join(lines)

    except Exception as e:
        return f"Error getting ad creatives: {str(e)}"


# --- #6 get_account_info ---
@mcp.tool()
async def get_account_info(
    account_id: str = Field(description="Meta ad account ID"),
) -> str:
    """Get detailed account information including currency, timezone, spend cap."""
    try:
        act_id = format_account_id(account_id)
        fields = (
            "id,name,account_status,currency,timezone_name,"
            "timezone_offset_hours_utc,age,amount_spent,balance,"
            "business_name,business_city,business_country_code,"
            "spend_cap,min_daily_budget,is_prepay_account,owner"
        )
        result = meta_api_get(act_id, {"fields": fields})

        status_map = {
            1: "ACTIVE",
            2: "DISABLED",
            3: "UNSETTLED",
            7: "PENDING_RISK_REVIEW",
            9: "IN_GRACE_PERIOD",
            100: "PENDING_CLOSURE",
            101: "CLOSED",
        }

        status_code = result.get("account_status", 0)
        currency = result.get("currency", "")
        spent = result.get("amount_spent", "0")

        lines = [f"Account Info for {act_id}:", "=" * 60]
        lines.append(f"  Name:           {result.get('name', 'N/A')}")
        lines.append(
            f"  Status:         "
            f"{status_map.get(status_code, f'UNKNOWN({status_code})')}"
        )
        lines.append(f"  Currency:       {currency}")
        lines.append(
            f"  Timezone:       {result.get('timezone_name', 'N/A')} "
            f"(UTC{result.get('timezone_offset_hours_utc', '')})"
        )
        lines.append(f"  Business:       {result.get('business_name', 'N/A')}")
        lines.append(
            f"  Country:        {result.get('business_country_code', 'N/A')}"
        )
        lines.append(f"  Total Spent:    {float(spent) / 100:.2f} {currency}")

        if result.get("spend_cap"):
            lines.append(
                f"  Spend Cap:      {float(result['spend_cap']) / 100:.2f} {currency}"
            )
        if result.get("balance"):
            lines.append(
                f"  Balance:        {float(result['balance']) / 100:.2f} {currency}"
            )
        lines.append(f"  Prepay:         {result.get('is_prepay_account', 'N/A')}")
        lines.append(f"  Account Age:    {result.get('age', 'N/A')} days")

        return "\n".join(lines)

    except Exception as e:
        return f"Error getting account info: {str(e)}"


# --- #7 get_image_assets ---
@mcp.tool()
async def get_image_assets(
    account_id: str = Field(description="Meta ad account ID"),
    limit: int = Field(default=30, description="Maximum images to return"),
) -> str:
    """List image assets (ad images) in an ad account's image library."""
    try:
        act_id = format_account_id(account_id)
        fields = "id,name,hash,url,url_128,width,height,created_time,status"
        data = fetch_all_pages(
            f"{act_id}/adimages", {"fields": fields, "limit": str(limit)}
        )

        if not data:
            return f"No image assets found for {act_id}."

        lines = [f"Image Assets for {act_id}:", "=" * 70]
        for img in data:
            lines.append(f"  Name:    {img.get('name', 'N/A')}")
            lines.append(f"  Hash:    {img.get('hash', 'N/A')}")
            lines.append(
                f"  Size:    {img.get('width', '?')}x{img.get('height', '?')}"
            )
            lines.append(f"  Status:  {img.get('status', 'N/A')}")
            lines.append(f"  Created: {img.get('created_time', 'N/A')}")
            lines.append(
                f"  URL:     {img.get('url_128', img.get('url', 'N/A'))}"
            )
            lines.append("-" * 70)

        return "\n".join(lines)

    except Exception as e:
        return f"Error getting image assets: {str(e)}"


# --- #8 get_video_assets ---
@mcp.tool()
async def get_video_assets(
    account_id: str = Field(description="Meta ad account ID"),
    limit: int = Field(default=30, description="Maximum videos to return"),
) -> str:
    """List video assets in an ad account."""
    try:
        act_id = format_account_id(account_id)
        fields = "id,title,length,created_time,updated_time,thumbnails,source"
        data = fetch_all_pages(
            f"{act_id}/advideos", {"fields": fields, "limit": str(limit)}
        )

        if not data:
            return f"No video assets found for {act_id}."

        lines = [f"Video Assets for {act_id}:", "=" * 70]
        for vid in data:
            lines.append(f"  Title:    {vid.get('title', 'N/A')}")
            lines.append(f"  ID:       {vid.get('id', 'N/A')}")
            length = vid.get("length", 0)
            lines.append(f"  Duration: {float(length):.1f}s")
            lines.append(f"  Created:  {vid.get('created_time', 'N/A')}")
            thumbs = vid.get("thumbnails", {}).get("data", [])
            if thumbs:
                lines.append(f"  Thumbnail: {thumbs[0].get('uri', 'N/A')}")
            lines.append("-" * 70)

        return "\n".join(lines)

    except Exception as e:
        return f"Error getting video assets: {str(e)}"


# --- #9 get_custom_audiences ---
@mcp.tool()
async def get_custom_audiences(
    account_id: str = Field(description="Meta ad account ID"),
    limit: int = Field(default=50, description="Maximum audiences to return"),
) -> str:
    """List custom audiences including lookalike and retargeting audiences."""
    try:
        act_id = format_account_id(account_id)
        fields = (
            "id,name,description,approximate_count_lower_bound,"
            "approximate_count_upper_bound,subtype,time_created,"
            "time_updated,delivery_status,operation_status"
        )
        data = fetch_all_pages(
            f"{act_id}/customaudiences", {"fields": fields, "limit": str(limit)}
        )

        if not data:
            return f"No custom audiences found for {act_id}."

        lines = [f"Custom Audiences for {act_id}:", "=" * 70]
        for aud in data:
            lines.append(f"  Name:     {aud.get('name', 'N/A')}")
            lines.append(f"  ID:       {aud.get('id', 'N/A')}")
            lines.append(f"  Type:     {aud.get('subtype', 'N/A')}")
            lower = aud.get("approximate_count_lower_bound", "?")
            upper = aud.get("approximate_count_upper_bound", "?")
            lines.append(f"  Size:     {lower} - {upper}")
            if aud.get("description"):
                lines.append(f"  Desc:     {aud['description']}")
            lines.append(f"  Created:  {aud.get('time_created', 'N/A')}")
            delivery = aud.get("delivery_status", {})
            if isinstance(delivery, dict):
                lines.append(f"  Delivery: {delivery.get('status', 'N/A')}")
            lines.append("-" * 70)

        return "\n".join(lines)

    except Exception as e:
        return f"Error getting custom audiences: {str(e)}"


# --- #10 get_insights ---
@mcp.tool()
async def get_insights(
    account_id: str = Field(description="Meta ad account ID"),
    level: str = Field(
        default="account",
        description="Level: 'account', 'campaign', 'adset', or 'ad'",
    ),
    fields: str = Field(
        default="impressions,clicks,spend,cpc,cpm,ctr,reach,frequency",
        description="Comma-separated metrics (e.g. 'impressions,clicks,spend,conversions,actions')",
    ),
    date_preset: str = Field(default="last_30d", description="Date preset"),
    breakdowns: str = Field(
        default="",
        description="Breakdowns: 'age', 'gender', 'country', 'placement', 'platform_position', 'device_platform'",
    ),
    time_increment: str = Field(
        default="",
        description="Time granularity: '1' for daily, '7' for weekly, 'monthly', 'all_days'",
    ),
    limit: int = Field(default=100, description="Maximum rows"),
    format: str = Field(default="table", description="'table' or 'json'"),
) -> str:
    """Flexible insights query with custom breakdowns and time granularity."""
    try:
        act_id = format_account_id(account_id)
        params = {
            "fields": fields,
            "date_preset": date_preset,
            "level": level,
            "limit": str(limit),
        }
        if breakdowns:
            params["breakdowns"] = breakdowns
        if time_increment:
            params["time_increment"] = time_increment

        data = fetch_all_pages(f"{act_id}/insights", params)

        if not data:
            return f"No insights data found for {act_id} at {level} level."

        if format.lower() == "json":
            return json.dumps(data, indent=2, ensure_ascii=False)

        # Table format
        all_keys = []
        for row in data:
            for key in row.keys():
                if key not in all_keys and key != "date_stop":
                    all_keys.append(key)

        lines = [
            f"Insights for {act_id} (level={level}, {date_preset}):",
            "=" * 100,
        ]
        for row in data:
            row_parts = []
            for key in all_keys:
                val = row.get(key, "")
                if isinstance(val, list):
                    action_strs = []
                    for a in val[:5]:
                        if isinstance(a, dict):
                            action_strs.append(
                                f"{a.get('action_type', '?')}:{a.get('value', '0')}"
                            )
                    val = "; ".join(action_strs) if action_strs else str(val)
                row_parts.append(f"  {key}: {val}")
            lines.append("\n".join(row_parts))
            lines.append("-" * 100)

        return "\n".join(lines)

    except Exception as e:
        return f"Error getting insights: {str(e)}"


# --- #11 get_ad_previews ---
@mcp.tool()
async def get_ad_previews(
    ad_id: str = Field(description="Meta ad ID"),
    ad_format: str = Field(
        default="DESKTOP_FEED_STANDARD",
        description="Preview format: 'DESKTOP_FEED_STANDARD', 'MOBILE_FEED_STANDARD', 'INSTAGRAM_STANDARD', 'INSTAGRAM_STORY'",
    ),
) -> str:
    """Get an HTML preview of an ad. Returns an iframe-embeddable snippet."""
    try:
        result = meta_api_get(f"{ad_id}/previews", {"ad_format": ad_format})
        data = result.get("data", [])
        if not data:
            return f"No preview available for ad {ad_id} in format {ad_format}."

        lines = [f"Ad Preview for {ad_id} ({ad_format}):", "=" * 60]
        for preview in data:
            lines.append(preview.get("body", ""))

        return "\n".join(lines)

    except Exception as e:
        return f"Error getting ad preview: {str(e)}"


# --- #12 download_ad_images ---

AD_IMAGES_DIR = Path(__file__).parent / "ad_images"


@mcp.tool()
async def download_ad_images(
    account_id: str = Field(description="Meta ad account ID"),
    ad_id: str = Field(
        default="",
        description="Optional: specific ad ID. If empty, downloads all active ads in the account.",
    ),
    limit: int = Field(default=10, description="Maximum ads to process"),
) -> str:
    """Download ad creative images to local files for visual analysis."""
    try:
        act_id = format_account_id(account_id)
        AD_IMAGES_DIR.mkdir(exist_ok=True)

        # Get ads with creative details
        fields = (
            "id,name,status,effective_status,"
            "creative{id,name,title,body,image_url,image_hash,"
            "object_story_spec,thumbnail_url}"
        )

        if ad_id:
            # Single ad
            result = meta_api_get(ad_id, {"fields": fields})
            ads = [result]
        else:
            ads = fetch_all_pages(
                f"{act_id}/ads", {"fields": fields, "limit": str(limit)}
            )

        if not ads:
            return "No ads found."

        lines = ["Ad Creative Images Downloaded:", "=" * 80]
        downloaded = 0

        for ad in ads:
            ad_name = ad.get("name", "unnamed")
            ad_obj_id = ad.get("id", "unknown")
            creative = ad.get("creative", {})

            if not creative:
                continue

            # Collect all image URLs from the creative
            image_urls = []

            # Direct image_url
            if creative.get("image_url"):
                image_urls.append(("main", creative["image_url"]))

            # Thumbnail
            if creative.get("thumbnail_url"):
                image_urls.append(("thumb", creative["thumbnail_url"]))

            # From object_story_spec
            oss = creative.get("object_story_spec", {})
            if oss:
                link_data = oss.get("link_data", {})
                if link_data:
                    if link_data.get("picture"):
                        image_urls.append(("link_picture", link_data["picture"]))
                    # Carousel images
                    for i, child in enumerate(
                        link_data.get("child_attachments", [])
                    ):
                        if child.get("picture"):
                            image_urls.append(
                                (f"carousel_{i}", child["picture"])
                            )
                        if child.get("image_hash"):
                            image_urls.append(
                                (f"carousel_{i}_hash", child["image_hash"])
                            )

                video_data = oss.get("video_data", {})
                if video_data and video_data.get("image_url"):
                    image_urls.append(("video_thumb", video_data["image_url"]))

            if not image_urls:
                lines.append(f"  [{ad_name}] No images found in creative")
                continue

            # Download each image
            for img_type, url in image_urls:
                try:
                    # Generate safe filename
                    safe_name = (
                        ad_name.replace(" ", "_")
                        .replace("/", "_")
                        .replace("\\", "_")[:50]
                    )
                    url_hash = hashlib.md5(url.encode()).hexdigest()[:8]
                    filename = f"{safe_name}_{img_type}_{url_hash}.jpg"
                    filepath = AD_IMAGES_DIR / filename

                    # Download
                    resp = requests.get(url, timeout=30)
                    if resp.status_code == 200:
                        filepath.write_bytes(resp.content)
                        size_kb = len(resp.content) / 1024
                        downloaded += 1

                        lines.append(f"  Ad: {ad_name} (ID: {ad_obj_id})")
                        lines.append(f"  Type: {img_type}")
                        lines.append(f"  File: {filepath}")
                        lines.append(f"  Size: {size_kb:.1f} KB")

                        # Include creative text info for context
                        if creative.get("body"):
                            body = creative["body"]
                            if len(body) > 150:
                                body = body[:150] + "..."
                            lines.append(f"  Body: {body}")
                        if creative.get("title"):
                            lines.append(f"  Title: {creative['title']}")

                        lines.append("-" * 80)
                    else:
                        lines.append(
                            f"  [{ad_name}] Download failed ({resp.status_code})"
                        )
                except Exception as dl_err:
                    lines.append(f"  [{ad_name}] Download error: {dl_err}")

        lines.append(f"\nTotal: {downloaded} image(s) downloaded to {AD_IMAGES_DIR}")

        return "\n".join(lines)

    except Exception as e:
        return f"Error downloading ad images: {str(e)}"


# --- #13 analyze_ad_creative ---
@mcp.tool()
async def analyze_ad_creative(
    account_id: str = Field(description="Meta ad account ID"),
    ad_id: str = Field(
        default="",
        description="Optional: specific ad ID. If empty, analyzes all active ads.",
    ),
    limit: int = Field(default=10, description="Maximum ads to analyze"),
) -> str:
    """Get full creative details (text, images, CTA, targeting) for A/B analysis."""
    try:
        act_id = format_account_id(account_id)

        fields = (
            "id,name,status,effective_status,"
            "creative{id,name,title,body,image_url,thumbnail_url,"
            "object_story_spec,asset_feed_spec,url_tags},"
            "adset{id,name,targeting,optimization_goal}"
        )

        if ad_id:
            result = meta_api_get(ad_id, {"fields": fields})
            ads = [result]
        else:
            ads = fetch_all_pages(
                f"{act_id}/ads",
                {
                    "fields": fields,
                    "limit": str(limit),
                    "filtering": json.dumps(
                        [
                            {
                                "field": "effective_status",
                                "operator": "IN",
                                "value": ["ACTIVE", "PAUSED"],
                            }
                        ]
                    ),
                },
            )

        if not ads:
            return "No ads found."

        lines = ["Ad Creative Analysis:", "=" * 80]

        for ad in ads:
            ad_name = ad.get("name", "N/A")
            lines.append(f"  AD: {ad_name}")
            lines.append(f"  ID: {ad.get('id', 'N/A')}")
            lines.append(
                f"  Status: {ad.get('effective_status', 'N/A')}"
            )

            creative = ad.get("creative", {})
            if creative:
                lines.append(f"  --- Creative ---")
                if creative.get("title"):
                    lines.append(f"  Title: {creative['title']}")
                if creative.get("body"):
                    lines.append(f"  Body: {creative['body']}")
                if creative.get("image_url"):
                    lines.append(f"  Image URL: {creative['image_url']}")
                if creative.get("thumbnail_url"):
                    lines.append(f"  Thumbnail: {creative['thumbnail_url']}")

                oss = creative.get("object_story_spec", {})
                if oss:
                    link_data = oss.get("link_data", {})
                    if link_data:
                        lines.append(f"  Link: {link_data.get('link', 'N/A')}")
                        lines.append(
                            f"  Message: {link_data.get('message', 'N/A')}"
                        )
                        if link_data.get("name"):
                            lines.append(
                                f"  Headline: {link_data['name']}"
                            )
                        if link_data.get("description"):
                            lines.append(
                                f"  Description: {link_data['description']}"
                            )
                        cta = link_data.get("call_to_action", {})
                        if cta:
                            lines.append(f"  CTA: {cta.get('type', 'N/A')}")
                            cta_link = cta.get("value", {}).get("link", "")
                            if cta_link:
                                lines.append(f"  CTA Link: {cta_link}")

                        # Carousel
                        children = link_data.get("child_attachments", [])
                        if children:
                            lines.append(
                                f"  Carousel Cards: {len(children)}"
                            )
                            for i, child in enumerate(children):
                                lines.append(f"    Card {i+1}:")
                                if child.get("name"):
                                    lines.append(
                                        f"      Headline: {child['name']}"
                                    )
                                if child.get("description"):
                                    lines.append(
                                        f"      Desc: {child['description']}"
                                    )
                                if child.get("link"):
                                    lines.append(
                                        f"      Link: {child['link']}"
                                    )

                    video_data = oss.get("video_data", {})
                    if video_data:
                        lines.append(f"  Video Title: {video_data.get('title', 'N/A')}")
                        lines.append(
                            f"  Video Message: {video_data.get('message', 'N/A')}"
                        )

                # Asset feed spec (dynamic creative)
                afs = creative.get("asset_feed_spec", {})
                if afs:
                    lines.append(f"  --- Dynamic Creative ---")
                    bodies = afs.get("bodies", [])
                    if bodies:
                        lines.append(f"  Body Variants: {len(bodies)}")
                        for b in bodies:
                            lines.append(f"    - {b.get('text', 'N/A')}")
                    titles = afs.get("titles", [])
                    if titles:
                        lines.append(f"  Title Variants: {len(titles)}")
                        for t in titles:
                            lines.append(f"    - {t.get('text', 'N/A')}")

            # Adset / Targeting info
            adset = ad.get("adset", {})
            if adset:
                lines.append(f"  --- Targeting ---")
                lines.append(f"  Ad Set: {adset.get('name', 'N/A')}")
                lines.append(
                    f"  Optimization: {adset.get('optimization_goal', 'N/A')}"
                )
                targeting = adset.get("targeting", {})
                if targeting:
                    geo = targeting.get("geo_locations", {})
                    countries = geo.get("countries", [])
                    if countries:
                        lines.append(f"  Countries: {', '.join(countries)}")
                    age_min = targeting.get("age_min", "")
                    age_max = targeting.get("age_max", "")
                    if age_min or age_max:
                        lines.append(f"  Age: {age_min}-{age_max}")

            lines.append("=" * 80)

        return "\n".join(lines)

    except Exception as e:
        return f"Error analyzing ad creatives: {str(e)}"


# --- #14 list_pages ---
@mcp.tool()
async def list_pages() -> str:
    """List Facebook Pages accessible by the authenticated user."""
    try:
        fields = "id,name,category,fan_count,verification_status,link"
        data = fetch_all_pages(
            "me/accounts", {"fields": fields, "limit": "100"}
        )

        if not data:
            return "No Facebook Pages found."

        lines = ["Facebook Pages:", "=" * 80]
        for page in data:
            lines.append(f"  Page ID:   {page.get('id', 'N/A')}")
            lines.append(f"  Name:      {page.get('name', 'N/A')}")
            lines.append(f"  Category:  {page.get('category', 'N/A')}")
            fans = page.get("fan_count")
            if fans is not None:
                lines.append(f"  Followers: {fans:,}")
            if page.get("link"):
                lines.append(f"  URL:       {page['link']}")
            lines.append("-" * 80)

        return "\n".join(lines)

    except Exception as e:
        return f"Error listing pages: {str(e)}"


# --- #13 list_instagram_accounts ---
@mcp.tool()
async def list_instagram_accounts() -> str:
    """List Instagram Business/Creator accounts connected to your Facebook Pages."""
    try:
        # First get all pages, then get connected IG accounts
        pages = fetch_all_pages(
            "me/accounts", {"fields": "id,name", "limit": "100"}
        )

        if not pages:
            return "No Facebook Pages found."

        lines = ["Instagram Accounts (via Facebook Pages):", "=" * 80]
        found = False

        for page in pages:
            page_id = page.get("id", "")
            page_name = page.get("name", "N/A")
            try:
                result = meta_api_get(
                    f"{page_id}",
                    {"fields": "instagram_business_account{id,name,username,profile_picture_url,followers_count}"},
                )
                ig = result.get("instagram_business_account")
                if ig:
                    found = True
                    lines.append(f"  Facebook Page: {page_name} ({page_id})")
                    lines.append(f"  IG Account ID: {ig.get('id', 'N/A')}")
                    lines.append(f"  IG Username:   @{ig.get('username', 'N/A')}")
                    lines.append(f"  IG Name:       {ig.get('name', 'N/A')}")
                    followers = ig.get("followers_count")
                    if followers is not None:
                        lines.append(f"  Followers:     {followers:,}")
                    lines.append("-" * 80)
            except Exception:
                continue

        if not found:
            return "No Instagram Business accounts connected to your Pages."

        return "\n".join(lines)

    except Exception as e:
        return f"Error listing Instagram accounts: {str(e)}"


# --- #14 list_campaigns ---
@mcp.tool()
async def list_campaigns(
    account_id: str = Field(description="Meta ad account ID"),
    status_filter: str = Field(
        default="",
        description="Optional: 'ACTIVE', 'PAUSED', 'ARCHIVED', or empty for all",
    ),
    limit: int = Field(default=50, description="Maximum campaigns"),
) -> str:
    """List all campaigns in an ad account with settings and budget info."""
    try:
        act_id = format_account_id(account_id)
        fields = (
            "id,name,status,effective_status,objective,buying_type,"
            "daily_budget,lifetime_budget,budget_remaining,"
            "start_time,stop_time,created_time,updated_time,"
            "special_ad_categories"
        )
        params = {"fields": fields, "limit": str(limit)}
        if status_filter:
            params["filtering"] = json.dumps(
                [
                    {
                        "field": "effective_status",
                        "operator": "IN",
                        "value": [status_filter.upper()],
                    }
                ]
            )

        data = fetch_all_pages(f"{act_id}/campaigns", params)

        if not data:
            return f"No campaigns found for {act_id}."

        lines = [f"Campaigns for {act_id}:", "=" * 80]
        for c in data:
            lines.append(
                f"  [{c.get('effective_status', 'N/A'):^10}] {c.get('name', 'N/A')}"
            )
            lines.append(
                f"  ID: {c.get('id', 'N/A')}  |  "
                f"Objective: {c.get('objective', 'N/A')}  |  "
                f"Buying: {c.get('buying_type', 'N/A')}"
            )

            daily = c.get("daily_budget")
            lifetime = c.get("lifetime_budget")
            remaining = c.get("budget_remaining")
            budget_parts = []
            if daily:
                budget_parts.append(f"Daily: {float(daily) / 100:.2f}")
            if lifetime:
                budget_parts.append(f"Lifetime: {float(lifetime) / 100:.2f}")
            if remaining:
                budget_parts.append(f"Remaining: {float(remaining) / 100:.2f}")
            if budget_parts:
                lines.append(f"  Budget: {' | '.join(budget_parts)}")

            if c.get("start_time"):
                lines.append(
                    f"  Start: {c['start_time']}  |  "
                    f"Stop: {c.get('stop_time', 'ongoing')}"
                )

            cats = c.get("special_ad_categories", [])
            if cats:
                lines.append(f"  Special Categories: {', '.join(cats)}")

            lines.append("-" * 80)

        return "\n".join(lines)

    except Exception as e:
        return f"Error listing campaigns: {str(e)}"


# --- #13 list_adsets ---
@mcp.tool()
async def list_adsets(
    account_id: str = Field(description="Meta ad account ID"),
    campaign_id: str = Field(
        default="", description="Optional: filter by campaign ID"
    ),
    status_filter: str = Field(
        default="", description="Optional: 'ACTIVE', 'PAUSED', etc."
    ),
    limit: int = Field(default=50, description="Maximum ad sets"),
) -> str:
    """List all ad sets with targeting and budget details."""
    try:
        act_id = format_account_id(account_id)
        fields = (
            "id,name,status,effective_status,campaign_id,"
            "daily_budget,lifetime_budget,budget_remaining,"
            "optimization_goal,billing_event,bid_strategy,bid_amount,"
            "targeting,start_time,end_time,created_time"
        )

        endpoint = f"{campaign_id}/adsets" if campaign_id else f"{act_id}/adsets"
        params = {"fields": fields, "limit": str(limit)}
        if status_filter:
            params["filtering"] = json.dumps(
                [
                    {
                        "field": "effective_status",
                        "operator": "IN",
                        "value": [status_filter.upper()],
                    }
                ]
            )

        data = fetch_all_pages(endpoint, params)

        if not data:
            return "No ad sets found."

        lines = ["Ad Sets:", "=" * 80]
        for s in data:
            lines.append(
                f"  [{s.get('effective_status', 'N/A'):^10}] {s.get('name', 'N/A')}"
            )
            lines.append(
                f"  ID: {s.get('id', 'N/A')}  |  "
                f"Campaign: {s.get('campaign_id', 'N/A')}"
            )
            lines.append(
                f"  Optimization: {s.get('optimization_goal', 'N/A')}  |  "
                f"Billing: {s.get('billing_event', 'N/A')}"
            )
            lines.append(f"  Bid Strategy: {s.get('bid_strategy', 'N/A')}")

            daily = s.get("daily_budget")
            lifetime = s.get("lifetime_budget")
            if daily:
                lines.append(f"  Daily Budget: {float(daily) / 100:.2f}")
            if lifetime:
                lines.append(f"  Lifetime Budget: {float(lifetime) / 100:.2f}")

            targeting = s.get("targeting", {})
            if targeting:
                geo = targeting.get("geo_locations", {})
                countries = geo.get("countries", [])
                if countries:
                    lines.append(f"  Countries: {', '.join(countries)}")
                age_min = targeting.get("age_min", "")
                age_max = targeting.get("age_max", "")
                if age_min or age_max:
                    lines.append(f"  Age: {age_min}-{age_max}")
                genders = targeting.get("genders", [])
                gender_map = {1: "Male", 2: "Female"}
                if genders:
                    lines.append(
                        f"  Gender: "
                        f"{', '.join(gender_map.get(g, str(g)) for g in genders)}"
                    )

            lines.append("-" * 80)

        return "\n".join(lines)

    except Exception as e:
        return f"Error listing ad sets: {str(e)}"


# --- #14 list_ads ---
@mcp.tool()
async def list_ads(
    account_id: str = Field(description="Meta ad account ID"),
    adset_id: str = Field(default="", description="Optional: filter by ad set ID"),
    status_filter: str = Field(
        default="", description="Optional: 'ACTIVE', 'PAUSED', etc."
    ),
    limit: int = Field(default=50, description="Maximum ads"),
) -> str:
    """List all ads in an ad account or ad set."""
    try:
        act_id = format_account_id(account_id)
        fields = (
            "id,name,status,effective_status,adset_id,campaign_id,"
            "creative{id,name,title,body,image_url,thumbnail_url},"
            "created_time,updated_time"
        )

        endpoint = f"{adset_id}/ads" if adset_id else f"{act_id}/ads"
        params = {"fields": fields, "limit": str(limit)}
        if status_filter:
            params["filtering"] = json.dumps(
                [
                    {
                        "field": "effective_status",
                        "operator": "IN",
                        "value": [status_filter.upper()],
                    }
                ]
            )

        data = fetch_all_pages(endpoint, params)

        if not data:
            return "No ads found."

        lines = ["Ads:", "=" * 80]
        for ad in data:
            lines.append(
                f"  [{ad.get('effective_status', 'N/A'):^10}] "
                f"{ad.get('name', 'N/A')}"
            )
            lines.append(
                f"  Ad ID: {ad.get('id', 'N/A')}  |  "
                f"AdSet: {ad.get('adset_id', 'N/A')}  |  "
                f"Campaign: {ad.get('campaign_id', 'N/A')}"
            )

            creative = ad.get("creative", {})
            if creative:
                if creative.get("title"):
                    lines.append(f"  Creative Title: {creative['title']}")
                if creative.get("body"):
                    body = creative["body"]
                    if len(body) > 100:
                        body = body[:100] + "..."
                    lines.append(f"  Creative Body: {body}")

            lines.append(f"  Created: {ad.get('created_time', 'N/A')}")
            lines.append("-" * 80)

        return "\n".join(lines)

    except Exception as e:
        return f"Error listing ads: {str(e)}"


# ============================================================
# WRITE TOOLS (12) — Safety: create with PAUSED status
# ============================================================


# --- #1 create_campaign ---
@mcp.tool()
async def create_campaign(
    account_id: str = Field(description="Meta ad account ID"),
    name: str = Field(description="Campaign name"),
    objective: str = Field(
        description=(
            "Campaign objective: 'OUTCOME_AWARENESS', 'OUTCOME_ENGAGEMENT', "
            "'OUTCOME_LEADS', 'OUTCOME_SALES', 'OUTCOME_TRAFFIC', "
            "'OUTCOME_APP_PROMOTION'"
        )
    ),
    special_ad_categories: str = Field(
        default="",
        description="Comma-separated: 'HOUSING', 'EMPLOYMENT', 'CREDIT', 'ISSUES_ELECTIONS_POLITICS', or empty",
    ),
    daily_budget: float = Field(
        default=0,
        description="Daily budget in account currency (e.g. 5000 for 5000 JPY). 0 to skip.",
    ),
    lifetime_budget: float = Field(
        default=0, description="Lifetime budget. 0 to skip."
    ),
    buying_type: str = Field(default="AUCTION", description="'AUCTION' or 'RESERVED'"),
    dry_run: bool = Field(
        default=True,
        description="Preview only. Set to false to actually create (created as PAUSED).",
    ),
) -> str:
    """Create a campaign (PAUSED). dry_run=true by default."""
    try:
        act_id = format_account_id(account_id)
        categories = []
        if special_ad_categories:
            categories = [
                c.strip() for c in special_ad_categories.split(",") if c.strip()
            ]

        data = {
            "name": name,
            "objective": objective,
            "status": "PAUSED",
            "special_ad_categories": json.dumps(categories),
            "buying_type": buying_type,
        }
        if daily_budget > 0:
            data["daily_budget"] = str(int(daily_budget * 100))
        if lifetime_budget > 0:
            data["lifetime_budget"] = str(int(lifetime_budget * 100))

        preview = [
            "=== Create Campaign Preview ===",
            f"Account:    {act_id}",
            f"Name:       {name}",
            f"Objective:  {objective}",
            f"Status:     PAUSED (safety default)",
            f"Buying:     {buying_type}",
            f"Categories: {categories or 'None'}",
        ]
        if daily_budget > 0:
            preview.append(f"Daily Budget: {daily_budget:.2f}")
        if lifetime_budget > 0:
            preview.append(f"Lifetime Budget: {lifetime_budget:.2f}")

        if dry_run:
            preview.append(
                "\n[DRY RUN] No changes made. Set dry_run=false to create."
            )
            return "\n".join(preview)

        result = meta_api_post(f"{act_id}/campaigns", data)
        campaign_id = result.get("id", "unknown")
        preview.append(f"\nCampaign created successfully!")
        preview.append(f"Campaign ID: {campaign_id}")
        preview.append("Status: PAUSED — use pause_enable_campaign to activate.")

        return "\n".join(preview)

    except Exception as e:
        return f"Error creating campaign: {str(e)}"


# --- #2 update_campaign ---
@mcp.tool()
async def update_campaign(
    campaign_id: str = Field(description="Campaign ID to update"),
    name: str = Field(default="", description="New name (empty to skip)"),
    daily_budget: float = Field(default=-1, description="New daily budget (-1 to skip)"),
    lifetime_budget: float = Field(
        default=-1, description="New lifetime budget (-1 to skip)"
    ),
    dry_run: bool = Field(default=True, description="Preview only. Set false to execute."),
) -> str:
    """Update campaign name or budget. dry_run=true by default."""
    try:
        data = {}
        preview = [f"=== Update Campaign {campaign_id} ==="]

        if name:
            data["name"] = name
            preview.append(f"Name: -> {name}")
        if daily_budget >= 0:
            data["daily_budget"] = str(int(daily_budget * 100))
            preview.append(f"Daily Budget: -> {daily_budget:.2f}")
        if lifetime_budget >= 0:
            data["lifetime_budget"] = str(int(lifetime_budget * 100))
            preview.append(f"Lifetime Budget: -> {lifetime_budget:.2f}")

        if not data:
            return "No changes specified. Provide at least one field to update."

        if dry_run:
            preview.append(
                "\n[DRY RUN] No changes made. Set dry_run=false to execute."
            )
            return "\n".join(preview)

        meta_api_post(campaign_id, data)
        preview.append(f"\nCampaign {campaign_id} updated successfully.")

        return "\n".join(preview)

    except Exception as e:
        return f"Error updating campaign: {str(e)}"


# --- #3 pause_enable_campaign ---
@mcp.tool()
async def pause_enable_campaign(
    campaign_id: str = Field(description="Campaign ID"),
    action: str = Field(description="Action: 'PAUSE' or 'ENABLE'"),
    dry_run: bool = Field(default=True, description="Set false to execute."),
) -> str:
    """Pause or enable a campaign. dry_run=true by default."""
    try:
        action_upper = action.upper()
        if action_upper == "PAUSE":
            new_status = "PAUSED"
        elif action_upper == "ENABLE":
            new_status = "ACTIVE"
        else:
            return "Error: action must be 'PAUSE' or 'ENABLE'"

        preview = [
            "=== Campaign Status Change ===",
            f"Campaign ID: {campaign_id}",
            f"New Status:  {new_status}",
        ]

        if dry_run:
            preview.append(
                "\n[DRY RUN] No changes made. Set dry_run=false to execute."
            )
            return "\n".join(preview)

        meta_api_post(campaign_id, {"status": new_status})
        preview.append(f"\nCampaign status changed to {new_status}.")

        return "\n".join(preview)

    except Exception as e:
        return f"Error changing campaign status: {str(e)}"


# --- #4 create_adset ---
@mcp.tool()
async def create_adset(
    account_id: str = Field(description="Meta ad account ID"),
    campaign_id: str = Field(description="Parent campaign ID"),
    name: str = Field(description="Ad set name"),
    optimization_goal: str = Field(
        description=(
            "Optimization goal: 'LINK_CLICKS', 'IMPRESSIONS', 'REACH', "
            "'LANDING_PAGE_VIEWS', 'OFFSITE_CONVERSIONS', 'LEAD_GENERATION'"
        )
    ),
    billing_event: str = Field(
        default="IMPRESSIONS", description="'IMPRESSIONS' or 'LINK_CLICKS'"
    ),
    daily_budget: float = Field(
        default=0, description="Daily budget (0 if using campaign budget)"
    ),
    targeting_countries: str = Field(
        default="JP", description="Comma-separated country codes (e.g. 'JP,US')"
    ),
    age_min: int = Field(default=18, description="Minimum age (18-65)"),
    age_max: int = Field(default=65, description="Maximum age (18-65)"),
    genders: str = Field(
        default="", description="'male', 'female', or empty for all"
    ),
    bid_strategy: str = Field(
        default="LOWEST_COST_WITHOUT_CAP",
        description="'LOWEST_COST_WITHOUT_CAP', 'LOWEST_COST_WITH_BID_CAP', 'COST_CAP'",
    ),
    start_time: str = Field(default="", description="Optional ISO 8601 start time"),
    end_time: str = Field(default="", description="Optional ISO 8601 end time"),
    dry_run: bool = Field(
        default=True, description="Preview only. Set false to create (PAUSED)."
    ),
) -> str:
    """Create an ad set with targeting, budget, and schedule (PAUSED). dry_run=true by default."""
    try:
        act_id = format_account_id(account_id)
        countries = [c.strip() for c in targeting_countries.split(",") if c.strip()]

        targeting = {
            "geo_locations": {"countries": countries},
            "age_min": age_min,
            "age_max": age_max,
        }
        if genders:
            gender_val = genders.strip().lower()
            if gender_val == "male":
                targeting["genders"] = [1]
            elif gender_val == "female":
                targeting["genders"] = [2]

        data = {
            "campaign_id": campaign_id,
            "name": name,
            "optimization_goal": optimization_goal,
            "billing_event": billing_event,
            "bid_strategy": bid_strategy,
            "targeting": json.dumps(targeting),
            "status": "PAUSED",
        }
        if daily_budget > 0:
            data["daily_budget"] = str(int(daily_budget * 100))
        if start_time:
            data["start_time"] = start_time
        if end_time:
            data["end_time"] = end_time

        preview = [
            "=== Create Ad Set Preview ===",
            f"Account:       {act_id}",
            f"Campaign:      {campaign_id}",
            f"Name:          {name}",
            f"Optimization:  {optimization_goal}",
            f"Billing:       {billing_event}",
            f"Bid Strategy:  {bid_strategy}",
            f"Status:        PAUSED (safety default)",
            f"Countries:     {', '.join(countries)}",
            f"Age:           {age_min}-{age_max}",
            f"Gender:        {genders or 'All'}",
        ]
        if daily_budget > 0:
            preview.append(f"Daily Budget:  {daily_budget:.2f}")

        if dry_run:
            preview.append(
                "\n[DRY RUN] No changes made. Set dry_run=false to create."
            )
            return "\n".join(preview)

        result = meta_api_post(f"{act_id}/adsets", data)
        adset_id = result.get("id", "unknown")
        preview.append(f"\nAd set created successfully!")
        preview.append(f"Ad Set ID: {adset_id}")
        preview.append("Status: PAUSED — use pause_enable_adset to activate.")

        return "\n".join(preview)

    except Exception as e:
        return f"Error creating ad set: {str(e)}"


# --- #5 update_adset ---
@mcp.tool()
async def update_adset(
    adset_id: str = Field(description="Ad set ID to update"),
    name: str = Field(default="", description="New name (empty to skip)"),
    daily_budget: float = Field(default=-1, description="New daily budget (-1 to skip)"),
    bid_amount: float = Field(default=-1, description="New bid amount (-1 to skip)"),
    targeting_countries: str = Field(
        default="", description="New countries (empty to skip)"
    ),
    age_min: int = Field(default=-1, description="New min age (-1 to skip)"),
    age_max: int = Field(default=-1, description="New max age (-1 to skip)"),
    dry_run: bool = Field(default=True, description="Set false to execute."),
) -> str:
    """Update ad set name, budget, targeting, or bid. dry_run=true by default."""
    try:
        data = {}
        preview = [f"=== Update Ad Set {adset_id} ==="]

        if name:
            data["name"] = name
            preview.append(f"Name: -> {name}")
        if daily_budget >= 0:
            data["daily_budget"] = str(int(daily_budget * 100))
            preview.append(f"Daily Budget: -> {daily_budget:.2f}")
        if bid_amount >= 0:
            data["bid_amount"] = str(int(bid_amount * 100))
            preview.append(f"Bid Amount: -> {bid_amount:.2f}")

        if targeting_countries or age_min >= 0 or age_max >= 0:
            targeting = {}
            if targeting_countries:
                countries = [c.strip() for c in targeting_countries.split(",")]
                targeting["geo_locations"] = {"countries": countries}
                preview.append(f"Countries: -> {', '.join(countries)}")
            if age_min >= 0:
                targeting["age_min"] = age_min
                preview.append(f"Age Min: -> {age_min}")
            if age_max >= 0:
                targeting["age_max"] = age_max
                preview.append(f"Age Max: -> {age_max}")
            data["targeting"] = json.dumps(targeting)

        if not data:
            return "No changes specified."

        if dry_run:
            preview.append(
                "\n[DRY RUN] No changes made. Set dry_run=false to execute."
            )
            return "\n".join(preview)

        meta_api_post(adset_id, data)
        preview.append(f"\nAd set {adset_id} updated successfully.")

        return "\n".join(preview)

    except Exception as e:
        return f"Error updating ad set: {str(e)}"


# --- #6 pause_enable_adset ---
@mcp.tool()
async def pause_enable_adset(
    adset_id: str = Field(description="Ad set ID"),
    action: str = Field(description="Action: 'PAUSE' or 'ENABLE'"),
    dry_run: bool = Field(default=True, description="Set false to execute."),
) -> str:
    """Pause or enable an ad set. dry_run=true by default."""
    try:
        action_upper = action.upper()
        if action_upper == "PAUSE":
            new_status = "PAUSED"
        elif action_upper == "ENABLE":
            new_status = "ACTIVE"
        else:
            return "Error: action must be 'PAUSE' or 'ENABLE'"

        preview = [
            "=== Ad Set Status Change ===",
            f"Ad Set ID:  {adset_id}",
            f"New Status: {new_status}",
        ]

        if dry_run:
            preview.append(
                "\n[DRY RUN] No changes made. Set dry_run=false to execute."
            )
            return "\n".join(preview)

        meta_api_post(adset_id, {"status": new_status})
        preview.append(f"\nAd set status changed to {new_status}.")

        return "\n".join(preview)

    except Exception as e:
        return f"Error changing ad set status: {str(e)}"


# --- #7 create_ad ---
@mcp.tool()
async def create_ad(
    account_id: str = Field(description="Meta ad account ID"),
    adset_id: str = Field(description="Parent ad set ID"),
    name: str = Field(description="Ad name"),
    creative_id: str = Field(
        description="Creative ID (create with create_ad_creative first)"
    ),
    dry_run: bool = Field(
        default=True, description="Preview only. Set false to create (PAUSED)."
    ),
) -> str:
    """Create an ad linking an ad set to a creative (PAUSED). dry_run=true by default."""
    try:
        act_id = format_account_id(account_id)
        data = {
            "adset_id": adset_id,
            "name": name,
            "creative": json.dumps({"creative_id": creative_id}),
            "status": "PAUSED",
        }

        preview = [
            "=== Create Ad Preview ===",
            f"Account:    {act_id}",
            f"Ad Set:     {adset_id}",
            f"Name:       {name}",
            f"Creative:   {creative_id}",
            f"Status:     PAUSED (safety default)",
        ]

        if dry_run:
            preview.append(
                "\n[DRY RUN] No changes made. Set dry_run=false to create."
            )
            return "\n".join(preview)

        result = meta_api_post(f"{act_id}/ads", data)
        ad_id = result.get("id", "unknown")
        preview.append(f"\nAd created successfully!")
        preview.append(f"Ad ID: {ad_id}")
        preview.append("Status: PAUSED — use update_ad_status to activate.")

        return "\n".join(preview)

    except Exception as e:
        return f"Error creating ad: {str(e)}"


# --- #8 update_ad_status ---
@mcp.tool()
async def update_ad_status(
    ad_id: str = Field(description="Ad ID"),
    action: str = Field(description="Action: 'PAUSE' or 'ENABLE'"),
    dry_run: bool = Field(default=True, description="Set false to execute."),
) -> str:
    """Pause or enable an individual ad. dry_run=true by default."""
    try:
        action_upper = action.upper()
        if action_upper == "PAUSE":
            new_status = "PAUSED"
        elif action_upper == "ENABLE":
            new_status = "ACTIVE"
        else:
            return "Error: action must be 'PAUSE' or 'ENABLE'"

        preview = [
            "=== Ad Status Change ===",
            f"Ad ID:      {ad_id}",
            f"New Status: {new_status}",
        ]

        if dry_run:
            preview.append(
                "\n[DRY RUN] No changes made. Set dry_run=false to execute."
            )
            return "\n".join(preview)

        meta_api_post(ad_id, {"status": new_status})
        preview.append(f"\nAd status changed to {new_status}.")

        return "\n".join(preview)

    except Exception as e:
        return f"Error changing ad status: {str(e)}"


# --- #9 create_ad_creative ---
@mcp.tool()
async def create_ad_creative(
    account_id: str = Field(description="Meta ad account ID"),
    name: str = Field(description="Creative name"),
    page_id: str = Field(description="Facebook Page ID to publish from"),
    message: str = Field(default="", description="Post text / primary text"),
    link: str = Field(default="", description="Destination URL"),
    headline: str = Field(default="", description="Ad headline"),
    description: str = Field(default="", description="Link description"),
    image_hash: str = Field(
        default="",
        description="Image hash (from upload_image). Required for image ads.",
    ),
    video_id: str = Field(default="", description="Video ID (for video ads)"),
    call_to_action: str = Field(
        default="LEARN_MORE",
        description="CTA: 'LEARN_MORE', 'SHOP_NOW', 'SIGN_UP', 'CONTACT_US', 'SUBSCRIBE', 'GET_OFFER'",
    ),
    instagram_actor_id: str = Field(
        default="", description="Instagram account ID (optional, for IG placements)"
    ),
    dry_run: bool = Field(default=True, description="Set false to create."),
) -> str:
    """Create an ad creative (image or video). Returns creative_id for create_ad. dry_run=true by default."""
    try:
        act_id = format_account_id(account_id)

        if video_id:
            story_spec = {
                "page_id": page_id,
                "video_data": {
                    "video_id": video_id,
                    "title": headline or name,
                    "message": message,
                    "call_to_action": {
                        "type": call_to_action,
                        "value": {"link": link} if link else {},
                    },
                },
            }
        elif image_hash:
            link_data = {
                "message": message,
                "link": link,
                "image_hash": image_hash,
                "call_to_action": {"type": call_to_action},
            }
            if headline:
                link_data["name"] = headline
            if description:
                link_data["description"] = description
            story_spec = {"page_id": page_id, "link_data": link_data}
        else:
            return "Error: Either image_hash or video_id must be provided."

        data = {
            "name": name,
            "object_story_spec": json.dumps(story_spec),
        }
        if instagram_actor_id:
            data["instagram_actor_id"] = instagram_actor_id

        preview = [
            "=== Create Ad Creative Preview ===",
            f"Account:   {act_id}",
            f"Name:      {name}",
            f"Page:      {page_id}",
            f"Type:      {'Video' if video_id else 'Image'}",
            f"Message:   {message or '(none)'}",
            f"Headline:  {headline or '(none)'}",
            f"Link:      {link or '(none)'}",
            f"CTA:       {call_to_action}",
        ]
        if image_hash:
            preview.append(f"Image:     {image_hash}")
        if video_id:
            preview.append(f"Video:     {video_id}")

        if dry_run:
            preview.append(
                "\n[DRY RUN] No changes made. Set dry_run=false to create."
            )
            return "\n".join(preview)

        result = meta_api_post(f"{act_id}/adcreatives", data)
        creative_id = result.get("id", "unknown")
        preview.append(f"\nCreative created successfully!")
        preview.append(f"Creative ID: {creative_id}")
        preview.append("Use this ID with create_ad to build an ad.")

        return "\n".join(preview)

    except Exception as e:
        return f"Error creating ad creative: {str(e)}"


# --- #10 upload_image ---
@mcp.tool()
async def upload_image(
    account_id: str = Field(description="Meta ad account ID"),
    image_url: str = Field(
        default="", description="URL of image to upload (API fetches it)"
    ),
    image_path: str = Field(
        default="", description="Local file path of image to upload"
    ),
    name: str = Field(default="", description="Optional image name"),
) -> str:
    """Upload an image and get its hash for ad creatives."""
    try:
        act_id = format_account_id(account_id)
        token = get_access_token()

        if image_url:
            data = {"url": image_url, "access_token": token}
            if name:
                data["name"] = name
            resp = requests.post(
                f"{GRAPH_API_BASE}/{act_id}/adimages", data=data
            )
        elif image_path:
            data = {"access_token": token}
            if name:
                data["name"] = name
            with open(image_path, "rb") as f:
                resp = requests.post(
                    f"{GRAPH_API_BASE}/{act_id}/adimages",
                    data=data,
                    files={"filename": f},
                )
        else:
            return "Error: Provide either image_url or image_path."

        if resp.status_code != 200:
            return f"Error uploading image (HTTP {resp.status_code})"

        result = resp.json()
        images = result.get("images", {})

        lines = ["Image uploaded successfully!"]
        for img_name, img_data in images.items():
            lines.append(f"  Name: {img_name}")
            lines.append(f"  Hash: {img_data.get('hash', 'N/A')}")
            lines.append(f"  URL:  {img_data.get('url', 'N/A')}")
            lines.append("")
            lines.append("Use the hash value with create_ad_creative.")

        return "\n".join(lines)

    except Exception as e:
        return f"Error uploading image: {str(e)}"


# --- #11 update_campaign_budget ---
@mcp.tool()
async def update_campaign_budget(
    campaign_id: str = Field(description="Campaign ID"),
    daily_budget: float = Field(
        default=-1, description="New daily budget in currency (-1 to skip)"
    ),
    lifetime_budget: float = Field(
        default=-1, description="New lifetime budget (-1 to skip)"
    ),
    dry_run: bool = Field(default=True, description="Set false to execute."),
) -> str:
    """Update a campaign's daily or lifetime budget. dry_run=true by default."""
    try:
        data = {}
        preview = ["=== Update Campaign Budget ===", f"Campaign: {campaign_id}"]

        if daily_budget >= 0:
            data["daily_budget"] = str(int(daily_budget * 100))
            preview.append(f"Daily Budget: -> {daily_budget:.2f}")
        if lifetime_budget >= 0:
            data["lifetime_budget"] = str(int(lifetime_budget * 100))
            preview.append(f"Lifetime Budget: -> {lifetime_budget:.2f}")

        if not data:
            return "No budget changes specified."

        if dry_run:
            preview.append(
                "\n[DRY RUN] No changes made. Set dry_run=false to execute."
            )
            return "\n".join(preview)

        meta_api_post(campaign_id, data)
        preview.append(f"\nCampaign budget updated successfully.")

        return "\n".join(preview)

    except Exception as e:
        return f"Error updating campaign budget: {str(e)}"


# --- #12 create_custom_audience ---
@mcp.tool()
async def create_custom_audience(
    account_id: str = Field(description="Meta ad account ID"),
    name: str = Field(description="Audience name"),
    description: str = Field(default="", description="Audience description"),
    subtype: str = Field(
        default="CUSTOM",
        description="Type: 'CUSTOM', 'WEBSITE', 'APP', 'OFFLINE_CONVERSION', 'LOOKALIKE'",
    ),
    customer_file_source: str = Field(
        default="",
        description="For CUSTOM: 'USER_PROVIDED_ONLY', 'PARTNER_PROVIDED_ONLY', 'BOTH_USER_AND_PARTNER_PROVIDED'",
    ),
    lookalike_spec: str = Field(
        default="",
        description="For LOOKALIKE: JSON with origin_audience_id, ratio (0.01-0.20), country",
    ),
    rule: str = Field(
        default="",
        description="For WEBSITE: JSON rule (URL contains, visited in last N days)",
    ),
    dry_run: bool = Field(default=True, description="Set false to create."),
) -> str:
    """Create a custom audience (retargeting, customer list, or lookalike). dry_run=true by default."""
    try:
        act_id = format_account_id(account_id)

        data = {"name": name, "subtype": subtype}
        if description:
            data["description"] = description
        if customer_file_source:
            data["customer_file_source"] = customer_file_source
        if lookalike_spec:
            data["lookalike_spec"] = lookalike_spec
        if rule:
            data["rule"] = rule

        preview = [
            "=== Create Custom Audience Preview ===",
            f"Account:  {act_id}",
            f"Name:     {name}",
            f"Type:     {subtype}",
        ]
        if description:
            preview.append(f"Desc:     {description}")

        if dry_run:
            preview.append(
                "\n[DRY RUN] No changes made. Set dry_run=false to create."
            )
            return "\n".join(preview)

        result = meta_api_post(f"{act_id}/customaudiences", data)
        audience_id = result.get("id", "unknown")
        preview.append(f"\nCustom audience created!")
        preview.append(f"Audience ID: {audience_id}")

        return "\n".join(preview)

    except Exception as e:
        return f"Error creating custom audience: {str(e)}"


# ============================================================
# RESOURCES
# ============================================================


@mcp.resource("meta://api-reference")
def meta_api_reference() -> str:
    """Meta Marketing API reference and common field values."""
    return """Meta Marketing API Reference
=============================

## Common Insights Metrics
- impressions, reach, frequency
- clicks, ctr, cpc, cpm
- spend, cost_per_action_type
- conversions, actions, action_values
- video_p25_watched_actions, video_p50_watched_actions
- video_p75_watched_actions, video_p100_watched_actions

## Common Breakdowns
- age, gender, country, region
- placement, platform_position, device_platform
- publisher_platform (facebook, instagram, messenger, audience_network)
- impression_device (desktop, mobile, tablet)

## Date Presets
- today, yesterday
- last_3d, last_7d, last_14d, last_28d, last_30d, last_90d
- this_month, last_month, this_quarter, last_quarter
- this_year, last_year

## Campaign Objectives (ODAX)
- OUTCOME_AWARENESS — Brand awareness and reach
- OUTCOME_ENGAGEMENT — Post engagement, video views, messages
- OUTCOME_LEADS — Lead generation, instant forms
- OUTCOME_SALES — Conversions, catalog sales
- OUTCOME_TRAFFIC — Website traffic, link clicks
- OUTCOME_APP_PROMOTION — App installs

## Special Ad Categories
- HOUSING, EMPLOYMENT, CREDIT, ISSUES_ELECTIONS_POLITICS

## CTA Types
- LEARN_MORE, SHOP_NOW, SIGN_UP, BOOK_TRAVEL, CONTACT_US
- SUBSCRIBE, GET_OFFER, DOWNLOAD, APPLY_NOW, WATCH_MORE
- SEND_MESSAGE, GET_QUOTE, ORDER_NOW

## Optimization Goals
- LINK_CLICKS, LANDING_PAGE_VIEWS, IMPRESSIONS, REACH
- OFFSITE_CONVERSIONS, LEAD_GENERATION, POST_ENGAGEMENT
- VIDEO_VIEWS, THRUPLAY, APP_INSTALLS
"""


# ============================================================
# PROMPTS
# ============================================================


@mcp.prompt("meta_ads_workflow")
def meta_ads_workflow() -> str:
    """Recommended workflow for Meta Ads management."""
    return """Recommended Meta Ads Workflow
==============================

## Step 1: Discover Accounts
   list_ad_accounts()

## Step 2: Review Current State
   get_account_info(account_id="act_XXX")
   list_campaigns(account_id="act_XXX")
   get_campaign_performance(account_id="act_XXX")

## Step 3: Deep Dive into Performance
   get_adset_performance(account_id="act_XXX")
   get_ad_performance(account_id="act_XXX")
   get_insights(account_id="act_XXX", breakdowns="age,gender")

## Step 4: Create New Campaign (if needed)
   create_campaign(..., dry_run=true)   # Preview first
   create_campaign(..., dry_run=false)  # Actually create

## Step 5: Create Ad Set with Targeting
   create_adset(..., dry_run=true)
   create_adset(..., dry_run=false)

## Step 6: Create Creative and Ad
   upload_image(account_id="act_XXX", image_url="...")
   create_ad_creative(..., image_hash="...", dry_run=false)
   create_ad(..., creative_id="...", dry_run=false)

## Step 7: Activate (after review)
   pause_enable_campaign(campaign_id="...", action="ENABLE", dry_run=false)
   pause_enable_adset(adset_id="...", action="ENABLE", dry_run=false)
   update_ad_status(ad_id="...", action="ENABLE", dry_run=false)

SAFETY: All creations default to PAUSED. Always review before enabling.
"""


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    mcp.run(transport="stdio")
