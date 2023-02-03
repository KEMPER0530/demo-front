# mail-form-demo-front

[![CircleCI](https://circleci.com/gh/circleci/circleci-docs.svg?style=shield)](https://circleci.com/gh/KEMPER0530/mailform-demo-front)

![MailDemo_ALL](https://user-images.githubusercontent.com/43329853/145825310-1f23376d-18c1-4164-bd48-1e1292c824f4.png)

AWS SES でメール送信、Qiita の記事検索ができます。
フロント部分は Nuxt.js で作成しており、AWS S3 上でホスティングしております。
AppSync(GraphQL)を用いて送信内容をバックエンド側へ渡しております。

## 開発環境

- Nuxt.js
- Node.js v16.13.0
- Yarn Ver 1.22.17

## 機能一覧（フロント）

- ログイン機能
- サインアップ機能
- メール送信フォーム
- Qiita 記事検索
- OpenAiを利用したChat機能
