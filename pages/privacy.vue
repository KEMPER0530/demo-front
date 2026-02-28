<template>
  <div class="policy-page">
    <main class="policy-card">
      <p class="policy-kicker">Privacy</p>
      <h1>プライバシーポリシー</h1>
      <p class="domain">対象ドメイン: <b>kemper0530.com</b></p>
      <section>
        <h2>1. 取得する情報</h2>
        <p>
          本サービスは、連携機能の提供に必要な識別情報、投稿関連情報、操作ログを取得する場合があります。
        </p>
      </section>
      <section>
        <h2>2. 利用目的</h2>
        <p>
          連携機能の提供、認証、障害調査、セキュリティ維持、品質向上のために情報を利用します。
        </p>
      </section>
      <section>
        <h2>3. 第三者提供・管理</h2>
        <p>
          法令に基づく場合を除き、本人の同意なく第三者提供は行いません。合理的な安全管理措置を講じます。
        </p>
      </section>
      <div class="policy-links">
        <nuxt-link to="/terms">利用規約</nuxt-link>
        <nuxt-link to="/signin">サインインへ戻る</nuxt-link>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  auth: false,
}
</script>

<style scoped>
.policy-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background:
    radial-gradient(circle at 88% 18%, rgba(255, 186, 0, 0.18), transparent 34%),
    linear-gradient(138deg, #101825, #12151f 58%, #1a1018 100%);
}

.policy-card {
  width: min(860px, 100%);
  border-radius: 20px;
  border: 1px solid rgba(255, 218, 145, 0.24);
  background: linear-gradient(145deg, rgba(38, 29, 6, 0.56), rgba(19, 21, 29, 0.84));
  color: #fff9ef;
  padding: clamp(1.2rem, 3vw, 2rem);
  box-shadow: 0 18px 38px rgba(0, 0, 0, 0.35);
  animation: fade-up 0.65s ease-out;
}

.policy-kicker {
  margin: 0;
  font-size: 0.8rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 211, 129, 0.95);
}

h1 {
  margin: 0.3rem 0 0.2rem;
  font-size: clamp(1.6rem, 4vw, 2.4rem);
}

.domain {
  color: rgba(252, 239, 221, 0.95);
}

h2 {
  margin: 1.2rem 0 0.3rem;
  font-size: 1.05rem;
}

p {
  margin: 0;
  line-height: 1.7;
  color: rgba(252, 241, 225, 0.95);
}

.policy-links {
  margin-top: 1.4rem;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.policy-links a {
  text-decoration: none;
  color: #ffda95;
  border-bottom: 1px solid transparent;
}

.policy-links a:hover {
  color: #ffffff;
  border-bottom-color: rgba(255, 255, 255, 0.8);
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
