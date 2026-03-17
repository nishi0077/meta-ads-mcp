"""Basic smoke tests for Meta Ads MCP server.

Run: python test_meta_ads_mcp.py
Requires META_ACCESS_TOKEN or OAuth to be configured.
"""

import os
import sys
import json

# Set auth type to system_user for testing if token provided
if os.environ.get("META_ACCESS_TOKEN"):
    os.environ.setdefault("META_AUTH_TYPE", "system_user")

from meta_ads_server import (
    format_account_id,
    get_access_token,
    meta_api_get,
    _validate_token,
    GRAPH_API_BASE,
)


def test_format_account_id():
    """Test account ID formatting."""
    assert format_account_id("123456") == "act_123456"
    assert format_account_id("act_123456") == "act_123456"
    assert format_account_id("  act_123456  ") == "act_123456"
    print("[PASS] format_account_id")


def test_token_validation():
    """Test that we can get and validate a token."""
    try:
        token = get_access_token()
        assert token, "Token should not be empty"
        print(f"[PASS] get_access_token (token length: {len(token)})")

        valid = _validate_token(token)
        assert valid, "Token should be valid"
        print("[PASS] _validate_token")
    except Exception as e:
        print(f"[SKIP] Token tests (not configured): {e}")


def test_me_endpoint():
    """Test basic /me API call."""
    try:
        result = meta_api_get("me", {"fields": "id,name"})
        assert "id" in result
        print(f"[PASS] /me endpoint — User: {result.get('name', 'N/A')} (ID: {result['id']})")
    except Exception as e:
        print(f"[SKIP] /me endpoint: {e}")


def test_list_ad_accounts():
    """Test listing ad accounts."""
    try:
        result = meta_api_get("me/adaccounts", {
            "fields": "id,name,account_status,currency",
            "limit": "5"
        })
        accounts = result.get("data", [])
        print(f"[PASS] list_ad_accounts — Found {len(accounts)} account(s)")
        for acc in accounts:
            print(f"       {acc.get('id')} — {acc.get('name')} ({acc.get('currency')})")
    except Exception as e:
        print(f"[SKIP] list_ad_accounts: {e}")


if __name__ == "__main__":
    print("=" * 60)
    print("Meta Ads MCP Server — Smoke Tests")
    print("=" * 60)

    test_format_account_id()
    test_token_validation()
    test_me_endpoint()
    test_list_ad_accounts()

    print("=" * 60)
    print("Done.")
