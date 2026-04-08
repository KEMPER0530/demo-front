[![CircleCI](https://circleci.com/gh/KEMPER0530/demo-front.svg?style=shield)](https://circleci.com/gh/KEMPER0530/demo-front)

# demo-front

Nuxt 3（Vue 3）で構築したフロントエンドアプリです。主な機能は以下です。

- AWS Cognito 認証（Sign In / Sign Up / Activate）
- 問い合わせフォーム（AppSync GraphQL Mutation）
- Qiita 記事検索
- OpenAI チャット画面
- パックマン風ミニゲーム（Pac Dot Rush）

## 技術スタック

- Nuxt `3.13.2`
- Vue `3`
- AWS Amplify `6.x`
- Sass

## CI

- CircleCI: https://circleci.com/gh/KEMPER0530/demo-front
- GitHub Actions: `.github/workflows/test.yml`

## 構成方針

Zenn の「Vue.js 環境構築とディレクトリ構造」の `src` 中心の考え方を参考にしつつ、Nuxt 3 向けに調整しています。  
参考: https://zenn.dev/code_journey_ys/articles/bbe3b67bed48e2

- アプリ本体は `src/` に集約する
- Nuxt のページ、ミドルウェア、プラグインも `srcDir: 'src/'` で `src/` 配下に寄せる
- 外部連携は `src/services/`、純粋ロジックは `src/utils/` に分離する
- ルート直下には `nuxt.config.ts`、`public/` など最小限の責務だけを残す

## ディレクトリ構成

```text
demo-front/
├─ public/
│  └─ favicon.ico
├─ src/
│  ├─ app.vue
│  ├─ assets/
│  │  └─ css/
│  ├─ components/
│  │  ├─ gpt/                      # OpenAI UI
│  │  ├─ inquiry/                  # 問い合わせフォーム UI
│  │  ├─ pacman/                   # Pacman 描画 UI
│  │  ├─ search/                   # 検索画面 UI
│  │  └─ DashboardBackLink.vue     # 共通戻る導線
│  ├─ composables/
│  │  └─ useAuth.ts
│  ├─ middleware/
│  │  ├─ auth.global.ts
│  │  └─ guest.ts
│  ├─ pages/
│  │  ├─ gpt/
│  │  ├─ inquiry/
│  │  ├─ pacman/
│  │  └─ search/
│  ├─ plugins/
│  │  └─ amplify.client.ts
│  ├─ services/
│  │  └─ appsync/
│  │     ├─ appsync-exports.js
│  │     └─ graphql/
│  │        ├─ mutations.js
│  │        └─ query.js
│  ├─ store/
│  │  └─ index.js
│  └─ utils/
│     └─ pacman/                   # Pacman のゲームロジック
├─ test/
│  ├─ appsync-config.spec.mjs
│  └─ graphql.spec.mjs
├─ nuxt.config.ts
└─ package.json
```

## セットアップ

前提:

- Node.js `20.10.0` 以上
- npm `10` 以上

```bash
npm install
```

## ローカル起動

```bash
npm run dev
```

起動後:

- `http://localhost:3000`

## ビルド

```bash
npm run build
```

プレビュー:

```bash
npm run preview
```

## テスト

ユニットテスト:

```bash
npm run test:unit
```

ユニットテスト + Nuxt ビルド確認:

```bash
npm test
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

- `src/middleware/auth.global.ts` で以下を公開ページとして許可:
  - `/signin`
  - `/signup`
  - `/activate`
  - `/privacy`
  - `/terms`
- それ以外は未ログイン時 `/signin` へリダイレクト
- `src/middleware/guest.ts` はログイン済みユーザーを `/` へリダイレクト
- ダッシュボード（`/`）上で `Qiita記事` と `OpenAI` のカードを表示する条件:
  - ログイン済み
  - `ログインユーザーの email` が `ALLOWED_USERNAME` と一致

## Nuxt3 コンポーネント命名の注意

- Nuxt3 の自動インポートでは、ネストしたコンポーネント名はプレフィックス付きになります
- 本プロジェクトの例:
  - `src/components/search/Navbar.vue` -> `SearchNavbar`
  - `src/components/gpt/Chatform.vue` -> `GptChatform`

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
