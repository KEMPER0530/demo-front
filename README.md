# demo-front

Nuxt.js（Vue 2）で作られたフロントエンドアプリです。  
主に次の機能を提供します。

- AWS Cognito を使ったログイン/サインアップ
- お問い合わせフォーム送信（AppSync 経由）
- Qiita 記事検索
- OpenAI を使ったチャット画面

---

## プロジェクト解説

このプロジェクトは、画面と処理を次のように分けています。

- `pages/`
  - URLに対応する「ページ本体」です。
  - 例: `/search` の画面は `pages/search/index.vue`。
- `components/`
  - ページの中で使う部品です。
  - 例: 検索フォーム、入力欄、ボタンなど。
- `plugins/`
  - アプリ起動時に一度だけ実行する初期設定です。
  - 例: Amplify 設定、Element UI 設定、FontAwesome 設定。
- `src/`
  - API 通信で使う定義です。
  - 例: GraphQL の Query/Mutation。
- `test/`
  - ユニットテストです。品質を守るための自動チェックです。

---

## プロジェクト構成

```text
demo-front/
├─ .github/workflows/
│  └─ test.yml                 # GitHub Actions（push時にテスト実行）
├─ assets/                     # スタイルなどの静的アセット
├─ components/                 # 画面部品
├─ pages/                      # ルーティング対象ページ
├─ plugins/                    # Vue/Nuxt 起動時プラグイン
├─ src/
│  ├─ appsync-exports.js       # AppSync 接続情報（環境変数）
│  └─ graphql/
│     ├─ mutations.js          # GraphQL Mutation 定義
│     └─ query.js              # GraphQL Query 定義
├─ store/                      # Vuex ストア
├─ test/                       # Jest テスト
├─ jest.config.js              # テスト設定（カバレッジ含む）
├─ nuxt.config.js              # Nuxt 設定
└─ package.json                # 依存関係とスクリプト
```

---

## 開発環境

- Node.js 20 系（ローカル検証済み）
- Yarn 1.x
- Nuxt 2 / Vue 2

---

## セットアップ

```bash
yarn install
```

---

## ローカル実行

```bash
yarn dev
```

---

## テスト

### 実行方法

```bash
yarn test --runInBand
```

### テストで何を確認しているか

- AppSync の設定値読み込み（`src/appsync-exports.js`）
- GraphQL 定義（`src/graphql/*.js`）
- プラグイン初期化（`plugins/*.js`）

### カバレッジ方針

- `jest.config.js` でカバレッジ対象を明示
- グローバル閾値を 100% に設定
  - `branches: 100`
  - `functions: 100`
  - `lines: 100`
  - `statements: 100`

---

## GitHub Actions（push時の自動テスト）

`push` されたら、すべてのブランチでテストを自動実行します。

設定ファイル:

- `.github/workflows/test.yml`

処理内容:

1. リポジトリを checkout
2. Node.js をセットアップ
3. `yarn install --frozen-lockfile`
4. `yarn test --runInBand`

---

## 補足

環境変数は `.env` を参照します。  
本番用の値は GitHub Secrets やホスティング環境側で安全に管理してください。
