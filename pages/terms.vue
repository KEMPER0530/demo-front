<template>
  <div class="policy-page">
    <main class="policy-card">
      <p class="policy-kicker">Legal</p>
      <h1>利用規約</h1>
      <p class="domain">対象ドメイン: <b>kemper0530.com</b></p>
      <section>
        <h2>第1条（適用）</h2>
        <p>
          本規約は、TikTok連携機能を含む本サービスの利用条件を定めるものです。利用者は本規約に同意のうえ利用します。
        </p>
      </section>
      <section>
        <h2>第2条（禁止事項）</h2>
        <p>
          不正アクセス、なりすまし、権利侵害、第三者に損害を与える行為、法令違反行為を禁止します。
        </p>
      </section>
      <section>
        <h2>第3条（免責）</h2>
        <p>
          外部サービス連携に起因する障害や一時停止等により発生した損害について、運営者は合理的範囲で対応します。
        </p>
      </section>
      <div class="policy-links">
        <nuxt-link to="/privacy">プライバシーポリシー</nuxt-link>
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
    radial-gradient(circle at 14% 16%, rgba(0, 220, 255, 0.17), transparent 34%),
    linear-gradient(138deg, #0a1731, #14131d 58%, #1d1412 100%);
}

.policy-card {
  width: min(860px, 100%);
  border-radius: 20px;
  border: 1px solid rgba(171, 214, 255, 0.25);
  background: linear-gradient(145deg, rgba(9, 25, 53, 0.8), rgba(14, 16, 21, 0.82));
  color: #edf5ff;
  padding: clamp(1.2rem, 3vw, 2rem);
  box-shadow: 0 18px 38px rgba(0, 0, 0, 0.35);
  animation: fade-up 0.65s ease-out;
}

.policy-kicker {
  margin: 0;
  font-size: 0.8rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(129, 215, 255, 0.95);
}

h1 {
  margin: 0.3rem 0 0.2rem;
  font-size: clamp(1.6rem, 4vw, 2.4rem);
}

.domain {
  color: rgba(220, 233, 251, 0.94);
}

h2 {
  margin: 1.2rem 0 0.3rem;
  font-size: 1.05rem;
}

p {
  margin: 0;
  line-height: 1.7;
  color: rgba(217, 231, 249, 0.95);
}

.policy-links {
  margin-top: 1.4rem;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.policy-links a {
  text-decoration: none;
  color: #9ed6ff;
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
