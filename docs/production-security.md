# 本番の秘密情報対策

対象: `s3nuxt.kemper0530.com` / S3 `nuxt-mail-demo` / CloudFront `EYKEA7W3EI8O3`

## 2026-10-22 の対応

- 公開URL `/.env` が HTTP 200 で環境変数を返し、OpenAIキーが含まれていることを確認した。秘密値はログやこの文書へ記載していない。
- バケットポリシーへ `DenyPublicDotEnvRead` を追加し、`.env` と `.env.*` に対する `s3:GetObject` / `s3:GetObjectVersion` を拒否した。既存のサイト配信許可は保持している。
- CloudFrontで `/.env*` を無効化し、完了を確認した。その後 `/.env` は HTTP 404、トップページは HTTP 200 となった。
- PR #39 の修正が本番へ反映され、トップページの公開設定に `chatGptProxyUrl` があり、`chatGptApiKey` が含まれないことを確認した。

## OpenAIキーの失効・再発行

AWSのIAM権限ではOpenAIキーを失効できない。OpenAIのキー所有者またはプロジェクト管理者が、OpenAI Platformで対象キーを失効する。秘密値をチャットへ貼り付けない。

新しいキーは認証・認可・レート制限を行う中継APIのサーバー側だけで保管する。CircleCIの `CHATGPT_API_KEY` やNuxtの公開設定へ新しいキーを登録しない。中継APIのURLは `CHAT_GPT_PROXY_URL` としてビルド時に渡す。中継API未設定時はチャットを利用できない。

## 再発防止

`.env` をS3へアップロードしない。サイトを再デプロイしても `.env` 読み取り拒否ポリシーは維持する。既存のキーは公開停止後も漏えい済みとして扱い、失効する。
