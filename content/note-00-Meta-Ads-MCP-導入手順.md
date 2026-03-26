# Meta Ads MCP の導入手順（最短版）

AIと会話しながらMeta広告を操作する「MCPサーバー」の、導入だけをまとめました。細かい説明は省いています。

---

## そもそも必要なもの

- パソコンに **Python 3.11以上** が入っていること
- **Meta広告**を触る権限のあるFacebookアカウント
- **Claude Desktop** か **Cursor** など、MCPに対応したAIアプリ

---

## 手順は5つだけ

**1. ツールを手元に置く**  
配布されている方法（ZIPやgitなど）で、フォルダをPCに用意する。

**2. 仮想環境を作ってパッケージを入れる**  
フォルダを開いて、次を実行（Mac/Linuxは `python3` に読み替え）。

```
python -m venv .venv
```

Windowsなら `.venv\Scripts\activate`、Macなら `source .venv/bin/activate` のあと、

```
pip install -r requirements.txt
```

**3. Metaで「アプリ」を1つ作る**  
Meta for Developers でアプリを作成し、**Marketing API** を追加する。  
「アプリID」と「App Secret」をメモしておく。

**4. リダイレクトURLを登録する（ここを忘れがち）**  
アプリ設定で、OAuthのリダイレクト先に次を**そのまま**登録する。

```
http://localhost:9876/callback
```

**5. 設定ファイルを書く**  
フォルダにある `.env.example` をコピーして `.env` にリネームし、中身を自分用に書き換える。

- `META_APP_ID` … さっきのアプリID  
- `META_APP_SECRET` … App Secret  
- `META_AUTH_TYPE` は `oauth` のままでOK  

広告アカウントを固定したいときだけ `META_AD_ACCOUNT_ID` に `act_数字` を入れる（空でも動く場合あり）。

---

## 初回だけ：ログインしてトークンを保存

仮想環境を有効にした状態で、フォルダの中で：

```
python meta_ads_server.py
```

ブラウザが開いたらFacebookでログインして許可。終わると、トークンがファイルに保存される（だいたい60日くらいで再ログインが必要になることが多い）。

---

## AIアプリにつなぐ

**Claude Desktop** なら、設定JSONに「このPython」と「meta_ads_server.pyのパス」を指定（公式READMEのサンプルと同じ形）。  
**Cursor** なら MCP の設定で、仮想環境の `python.exe`（または `python`）と `meta_ads_server.py` を指定。

パスは**自分のPCの実際の場所**に置き換える。設定したらアプリを**一度終了してから**開き直す。

---

## うまくいかないとき

- リダイレクトURLが `http://localhost:9876/callback` と**一字一句同じ**か確認  
- Pythonのバージョンが3.11以上か確認  
- トークンがおかしいときは、READMEに書いてある通りトークンファイルを消して、もう一度 `python meta_ads_server.py` からやり直し  

細かいツール一覧やトラブルシュートの表は、リポジトリの **README** と **docs/導入手順.md** に載せてあります。

---

以上です。まずは「5. 設定 → 初回ログイン → AIに接続」まで一気に通すと、あとは会話で広告データを取りに行けるようになります。
