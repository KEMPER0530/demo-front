# demo-front

Nuxt 3（Vue 3）で構築したフロントエンドアプリです。主な機能は以下です。

- AWS Cognito 認証（Sign In / Sign Up / Activate）
- 問い合わせフォーム（AppSync GraphQL Mutation）
- Qiita 記事検索
- OpenAI チャット画面
- ダッシュボード上のパックマン風ミニゲーム（Pac Dot Rush）

## 技術スタック

- Nuxt `3.13.2`
- Vue `3`
- AWS Amplify `6.x`
- Sass

## ディレクトリ構成

```text
demo-front/
├─ assets/css/                     # グローバルスタイル
├─ components/
│  ├─ Signin.vue                   # 認証: サインイン
│  ├─ Signup.vue                   # 認証: サインアップ
│  ├─ Activate.vue                 # 認証: 有効化コード入力
│  ├─ PacmanGame.vue               # Pacmanコンテナ
│  ├─ gpt/Chatform.vue             # OpenAIチャットUI
│  ├─ inquiry/                     # 問い合わせフォーム部品
│  ├─ pacman/
│  │  ├─ pacmanBoardFactory.ts     # 盤面生成
│  │  ├─ pacmanMovement.ts         # 移動判定
│  │  ├─ pacmanGhostAI.ts          # ゴーストAI
│  │  ├─ pacmanGameMixin.ts        # usePacmanGame composable
│  │  ├─ PacmanBoard.vue           # 盤面描画
│  │  ├─ PacmanStatusControls.vue  # LEVEL/LIFE/SPEED操作
│  │  └─ PacmanTouchControls.vue   # モバイル操作UI
│  └─ search/                      # 検索画面部品（Element UI 不使用）
├─ composables/useAuth.ts          # 認証状態管理
├─ middleware/
│  ├─ auth.global.ts               # 認証必須ルート制御
│  └─ guest.ts                     # ゲスト専用ルート制御
├─ pages/
│  ├─ index.vue
│  ├─ signin.vue
│  ├─ signup.vue
│  ├─ activate.vue
│  ├─ search/index.vue           # <SearchNavbar /> を描画
│  ├─ inquiry/index.vue
│  ├─ gpt/index.vue              # <GptChatform /> を描画
│  ├─ privacy.vue
│  └─ terms.vue
├─ plugins/amplify.client.ts       # Amplify初期化
├─ src/graphql/mutations.js        # GraphQL Mutation 定義
├─ app.vue
├─ nuxt.config.ts
└─ package.json
```

## セットアップ

前提:

- Node.js `20.10.0` 以上
- Yarn `1.x`

```bash
yarn install
```

## ローカル起動

```bash
yarn dev
```

起動後:

- `http://localhost:3000`

## ビルド

```bash
yarn build
```

プレビュー:

```bash
yarn preview
```

## 環境変数

`.env` に以下を設定してください（`nuxt.config.ts` の `runtimeConfig.public` で参照）。

- `MODE`
- `QIITA_API`
- `AWS_APPSYNC_REIGION`
- `AWS_APPSYNC_GRAPHQL_ENDPOINT`
- `AWS_APPSYNC_AUTHENTICATION_TYPE`
- `AWS_APPSYNC_APIKEY`
- `AWS_COGNITO_REIGION`
- `AWS_COGNITO_USERPOOLID`
- `AWS_COGNITO_USERPOOLWEBCLIENTID`
- `CHAT_GPT_API_URL`
- `CHATGPT_API_KEY`
- `CHAT_GPT_MODEL`
- `ALLOWED_USERNAME`

## 認証仕様

- `middleware/auth.global.ts` で以下を公開ページとして許可:
  - `/signin`
  - `/signup`
  - `/activate`
  - `/privacy`
  - `/terms`
- それ以外は未ログイン時 `/signin` へリダイレクト。
- `middleware/guest.ts` はログイン済みユーザーを `/` へリダイレクト。
- ダッシュボード（`/`）上で `Qiita記事` と `OpenAI` のカードを表示する条件:
  - ログイン済み
  - `ログインユーザーの email` が `ALLOWED_USERNAME` と一致

## Nuxt3 コンポーネント命名の注意

- Nuxt3 の自動インポートでは、ネストしたコンポーネント名はプレフィックス付きになります。
- 本プロジェクトの例:
  - `components/search/Navbar.vue` -> `SearchNavbar`
  - `components/gpt/Chatform.vue` -> `GptChatform`
- `pages/search/index.vue` / `pages/gpt/index.vue` では、この名前で参照してください。

## Pac Dot Rush 仕様

- 操作（PC）:
  - 移動: `Arrow` / `WASD`
  - 開始・再開: `Space`
  - 一時停止: `P`
- 操作（スマホ）:
  - 画面下部の D-Pad（↑←↓→）
  - `START` / `PAUSE` / `RESUME`
- 手動設定:
  - `LEVEL`: 1〜20
  - `LIFE`: 1〜9
  - `SPEED`: 80〜280ms（10ms刻み）
- ベストスコア保存:
  - `localStorage` キー `pac_dot_rush_best`

## 移行メモ（Vue2 -> Vue3）

- Nuxt2 設定（`nuxt.config.js`）を廃止し `nuxt.config.ts` へ移行。
- Vue2 専用プラグイン（Element UI / FontAwesome / old Amplify plugin）を削除。
- 認証処理を `this.$auth` から `useAuth()` へ移行。
- 検索画面を Element UI 依存からプレーン Vue3 実装へ置換。
- AppSync 呼び出しを Amplify v6 `generateClient()` ベースへ移行。
- Pacman 実装を Vue3 composable ベースへ移行。
