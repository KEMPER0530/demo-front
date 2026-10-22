# Security remediation (2026-10-22)

- Chat text is rendered as escaped text; user/model HTML is never executed.
- `CHATGPT_API_KEY` is no longer included in public runtime configuration. Static hosting must use `CHAT_GPT_PROXY_URL`, an HTTPS backend that verifies the Cognito ID token on every request, applies authorization and rate limits, and keeps the upstream API key server-side. Without that proxy, chat fails closed with a maintenance message. The proxy is not provisioned in this repository.
- CircleCI no longer writes or uploads `.env` to the public site bucket. Environment variables for public runtime configuration must be present during `yarn generate`.
- Before production release: revoke/reissue any OpenAI key previously supplied to the frontend; inspect the deployed bucket and remove any existing `.env` object and versions containing secrets; invalidate `/.env` in the CDN. The change stops future uploads but cannot revoke already downloaded secrets. These production operations have not been executed by this PR.
- Dependabot automatic merges now require a successful pull-request run from this repository at the current PR SHA and use a SHA lease when merging.

Nuxt is updated to 4.6.2 and CI uses Node 22.23.4 to meet its patched runtime requirement. The Yarn Classic lock is regenerated from the updated manifest.

Validation: seven unit/security regression tests passed. Yarn audit reports zero critical findings and three high dependency paths involving two packages: `node-forge` (GHSA-86w9-cpqp-85rv) and `braces` (GHSA-vfj7-8cjw-p6xm). Both advisories list no patched release (`<0.0.0`); Nuxt 4.6.2 still includes them through CLI/dev-server and build glob dependencies. These remain unresolved rather than being ignored or replaced with incompatible packages.

`npm test` passed all seven tests and the Nuxt 4.6.2 production build under Node 22.23.4.

A clean `yarn install --frozen-lockfile` also passed with the existing alias postinstall script. No npm lockfile is committed; CI continues using Yarn Classic.
