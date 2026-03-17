# Meta Ads MCP Server

**AIと会話するだけで、Meta広告（Facebook / Instagram）を管理・分析できるMCPサーバー**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-green.svg)](https://www.python.org/downloads/)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-purple.svg)](https://modelcontextprotocol.io/)

普段Meta広告マネージャーでやっている操作 ― レポートの確認、キャンペーン作成、ターゲティング変更、予算調整、クリエイティブ管理まで ― を、AIとのチャットだけで完結できます。広告マネージャーを開く必要はありません。

---

## 特徴

- **30のツール** — 読み取り18 + 書き込み12で、Meta広告の管理を網羅
- **安全設計** — 書き込み操作はデフォルトで `dry_run`（プレビューのみ）。新規作成はすべて PAUSED 状態
- **OAuth対応** — ブラウザでFacebookログインするだけで認証完了。トークンは約60日間有効
- **Claude Desktop / Claude Code / Cursor 対応** — MCP互換のAIクライアントならどれでも使用可能
- **依存最小** — Python + requests + python-dotenv のみ。追加SDKは不要

---

## クイックスタート

### 1. リポジトリをクローン

```bash
git clone https://github.com/nishi0077/meta-ads-mcp.git
cd meta-ads-mcp
```

### 2. 依存パッケージをインストール

```bash
python -m venv .venv

# Mac/Linux:
source .venv/bin/activate
# Windows:
.venv\Scripts\activate

pip install -r requirements.txt
```

### 3. 環境変数を設定

```bash
cp .env.example .env
```

`.env` を編集して Meta App の情報を入力します（[Meta App の作成方法はこちら](#meta-app-の作成)）。

```env
META_AUTH_TYPE=oauth
META_APP_ID=あなたのアプリID
META_APP_SECRET=あなたのApp Secret
META_AD_ACCOUNT_ID=act_xxxxxxxxxxxxx   # 任意。空でもOK
META_API_VERSION=v24.0
```

### 4. 初回認証

```bash
python meta_ads_server.py
```

ブラウザが開き、Facebookログイン画面が表示されます。ログインして「許可」するとトークンが保存されます（約60日間有効）。

### 5. AIクライアントに接続

#### Claude Desktop

設定ファイル（Mac: `~/Library/Application Support/Claude/claude_desktop_config.json` / Windows: `%APPDATA%\Claude\claude_desktop_config.json`）に追加：

```json
{
  "mcpServers": {
    "meta-ads": {
      "command": "/path/to/meta-ads-mcp/.venv/bin/python",
      "args": ["/path/to/meta-ads-mcp/meta_ads_server.py"]
    }
  }
}
```

> Windows の場合、`command` は `.venv\\Scripts\\python.exe` に変更してください。

#### Claude Code

```bash
claude mcp add meta-ads -- python /path/to/meta-ads-mcp/meta_ads_server.py
```

#### Cursor

Cursorの設定 → MCP → 「Add new MCP server」で以下を設定：

- **Name:** `meta-ads`
- **Type:** `command`
- **Command:** `python /path/to/meta-ads-mcp/meta_ads_server.py`

---

## 使い方

接続したら、AIに話しかけるだけで使えます。

```
「アカウント一覧を見せて」

「過去30日間のキャンペーン成果を教えて」

「広告を年齢×性別でブレイクダウンして」

「キャンペーンの日予算を5,000円に変更して」

「このキャンペーンを一時停止して」

「25-45歳女性、日本向けの広告セットを作って」

「この画像をアップロードして、クリエイティブを作って」

「成果の悪い広告を停止して」

「2つの広告クリエイティブを比較分析して」

「全アカウントの今月の広告費を一覧して」
```

---

## ツール一覧

### 読み取り系（18ツール）

| ツール | 説明 |
|---|---|
| `list_ad_accounts` | アクセス可能な広告アカウント一覧 |
| `get_account_info` | アカウント詳細（通貨・タイムゾーン・残高） |
| `list_campaigns` | キャンペーン一覧（ステータス・予算・目的） |
| `get_campaign_performance` | キャンペーン成果（クリック・費用・CPC・CTR等） |
| `list_adsets` | 広告セット一覧（ターゲティング・予算） |
| `get_adset_performance` | 広告セットごとの成果比較 |
| `list_ads` | 広告一覧（クリエイティブ情報付き） |
| `get_ad_performance` | 広告別の成果比較 |
| `get_insights` | カスタムレポート（年齢・性別・配置面等でブレイクダウン） |
| `get_ad_creatives` | 広告クリエイティブ（画像・テキスト・CTA） |
| `get_ad_previews` | 広告プレビュー（HTML形式） |
| `get_image_assets` | 画像アセット一覧 |
| `get_video_assets` | 動画アセット一覧 |
| `get_custom_audiences` | カスタムオーディエンス一覧 |
| `list_pages` | Facebookページ一覧 |
| `list_instagram_accounts` | Instagramアカウント一覧 |
| `download_ad_images` | 広告画像をローカルにダウンロード |
| `analyze_ad_creative` | クリエイティブの詳細分析（A/B比較向け） |

### 書き込み系（12ツール）

| ツール | 説明 |
|---|---|
| `create_campaign` | キャンペーン作成（PAUSED） |
| `update_campaign` | キャンペーン名・予算の更新 |
| `pause_enable_campaign` | キャンペーンの一時停止・再開 |
| `update_campaign_budget` | キャンペーン予算の変更 |
| `create_adset` | 広告セット作成（ターゲティング・予算設定） |
| `update_adset` | 広告セットの更新 |
| `pause_enable_adset` | 広告セットの一時停止・再開 |
| `create_ad` | 広告作成（PAUSED） |
| `update_ad_status` | 広告の一時停止・再開 |
| `create_ad_creative` | クリエイティブ作成（画像・動画） |
| `upload_image` | 画像アップロード（URL or ローカル） |
| `create_custom_audience` | カスタムオーディエンス作成 |

### 安全設計

- 書き込み系はすべて **`dry_run=true`（プレビュー）がデフォルト**
- 「こう変わります」を確認してから `dry_run=false` で実行
- 新規作成はすべて **PAUSED（停止）状態** で作成 — うっかり配信される心配なし

---

## Meta App の作成

> 初回のみの作業です。5分程度で完了します。

### 1. App の作成

1. [Meta for Developers](https://developers.facebook.com/) にアクセスしてログイン
2. 「マイアプリ」→「アプリを作成」
3. 設定：
   - **ユースケース**: 「その他」→「次へ」
   - **アプリタイプ**: 「ビジネス」→「次へ」
   - **アプリ名**: 好きな名前（例: `My Meta Ads MCP`）
   - **ビジネスアカウント**: 自分のMeta Businessアカウントを選択
4. 「アプリを作成」

### 2. Marketing API の追加

1. アプリダッシュボードで「プロダクトを追加」
2. **Marketing API** を見つけて「設定」

### 3. App ID と App Secret の取得

1. 左メニュー「アプリ設定」→「ベーシック」
2. **アプリID** と **App Secret** をコピー

> App Secret は絶対に他人に共有しないでください。

### 4. ビジネス認証（広告の作成・編集に必要）

読み取り専用（レポート確認等）はビジネス認証なしでも使えます。広告の作成・編集には認証が必要です。

1. [Meta Business Settings](https://business.facebook.com/settings/) →「セキュリティセンター」
2. 「ビジネス認証を開始」→ 書類をアップロード（通常 2〜7 営業日）

---

## 認証方式

| 方式 | 設定 | おすすめ |
|---|---|---|
| **OAuth（デフォルト）** | `META_AUTH_TYPE=oauth` + App ID/Secret | 個人・小規模運用 |
| **System User Token** | `META_AUTH_TYPE=system_user` + `META_ACCESS_TOKEN` | 大規模・自動化 |

---

## トラブルシューティング

| 症状 | 対処法 |
|---|---|
| Python が見つからない | `python --version` で確認。3.11以上が必要 |
| 接続エラー | `.env` の設定を確認。AIクライアントを再起動 |
| トークン期限切れ | `meta_ads_token.json` を削除して `python meta_ads_server.py` で再認証 |
| 権限エラー | Meta App に `ads_read`, `ads_management` 権限があるか確認 |
| レート制限 | しばらく待って再実行。Meta API はスコアベースのレート制限 |
| APIバージョンエラー | `.env` の `META_API_VERSION` を最新に変更 |

---

## 技術情報

- **プロトコル**: [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- **API**: Meta Graph API（直接リクエスト、SDK不使用）
- **認証**: OAuth 2.0 + ローカルHTTPコールバック / System User Token
- **APIバージョン**: `v24.0`（`.env` で変更可能）

---

## ライセンス

[MIT License](LICENSE)
