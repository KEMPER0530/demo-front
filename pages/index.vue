<template>
  <div class="dashboard-page">
    <div class="ambient ambient-left" />
    <div class="ambient ambient-right" />
    <main class="dashboard-shell">
      <section class="hero fade-up">
        <p class="eyebrow">Dashboard</p>
        <h1>機能一覧</h1>
        <p>主要機能へアクセスできます。</p>
      </section>

      <section class="actions-grid">
        <NuxtLink to="/inquiry" class="action-card fade-up delay-1">
          <span class="action-label">メール送信機能</span>
          <small>お問い合わせフォームへ</small>
        </NuxtLink>
        <NuxtLink v-if="isLoggedInAndAllowed" to="/search" class="action-card fade-up delay-2">
          <span class="action-label">Qiita記事</span>
          <small>検索ページへ</small>
        </NuxtLink>
        <NuxtLink v-if="isLoggedInAndAllowed" to="/gpt" class="action-card fade-up delay-3">
          <span class="action-label">OpenAI</span>
          <small>チャットページへ</small>
        </NuxtLink>
        <button class="action-card logout-card fade-up delay-3" @click.prevent="logout">
          <span class="action-label">Logout</span>
          <small>サインアウト</small>
        </button>
      </section>

      <PacmanGame class="fade-up delay-2" />
    </main>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const auth = useAuth();

const isLoggedInAndAllowed = computed(() => {
  if (!auth.user.value) {
    return false;
  }
  const username = auth.user.value.email || auth.user.value.username;
  return username === config.public.allowedUsername;
});

const logout = async () => {
  await auth.logout();
  await navigateTo('/signin');
};
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  color: #f7fbff;
  background:
    radial-gradient(circle at 10% 12%, rgba(0, 221, 255, 0.2), transparent 38%),
    radial-gradient(circle at 88% 75%, rgba(255, 161, 0, 0.2), transparent 42%),
    linear-gradient(135deg, #0a172e, #101626 44%, #141112 100%);
}

.ambient {
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  filter: blur(2px);
  animation: float 10s ease-in-out infinite;
}

.ambient-left {
  width: 370px;
  height: 370px;
  top: -110px;
  left: -80px;
  background: radial-gradient(circle at 40% 35%, rgba(18, 242, 255, 0.35), rgba(17, 112, 255, 0.02) 68%);
}

.ambient-right {
  width: 330px;
  height: 330px;
  right: -90px;
  bottom: -70px;
  background: radial-gradient(circle at 30% 30%, rgba(255, 174, 0, 0.35), rgba(255, 80, 0, 0.03) 72%);
  animation-delay: -3s;
}

.dashboard-shell {
  width: min(1160px, 100%);
  margin: 0 auto;
  padding: clamp(1.2rem, 2.6vw, 2.2rem);
  position: relative;
  z-index: 1;
}

.hero {
  margin-top: 0.7rem;
  margin-bottom: 1.2rem;
  padding: clamp(1.2rem, 2.2vw, 1.9rem);
  border-radius: 20px;
  border: 1px solid rgba(145, 195, 255, 0.24);
  background: linear-gradient(148deg, rgba(6, 24, 53, 0.7), rgba(17, 20, 30, 0.66));
  box-shadow: 0 15px 34px rgba(0, 0, 0, 0.32);
}

.hero h1 {
  margin: 0.2rem 0 0.65rem;
  font-size: clamp(1.6rem, 4vw, 2.6rem);
  line-height: 1.22;
}

.hero p {
  margin: 0;
  color: rgba(223, 235, 251, 0.92);
  line-height: 1.7;
}

.eyebrow {
  margin: 0;
  font-size: 0.85rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(119, 217, 255, 0.95);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 12px;
  margin-bottom: 1rem;
}

.action-card {
  border: 1px solid rgba(161, 210, 255, 0.24);
  border-radius: 16px;
  text-decoration: none;
  color: #ffffff;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background: linear-gradient(132deg, rgba(13, 43, 89, 0.8), rgba(18, 22, 34, 0.8));
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.26);
  transition: transform 0.24s ease, filter 0.24s ease, border-color 0.24s ease;
}

.action-card:hover {
  transform: translateY(-2px) scale(1.01);
  filter: saturate(1.1);
  border-color: rgba(211, 237, 255, 0.55);
}

.action-label {
  font-weight: 700;
  font-size: 1.08rem;
}

.action-card small {
  opacity: 0.82;
  margin-top: 0.28rem;
}

.logout-card {
  cursor: pointer;
  width: 100%;
  text-align: left;
  background: linear-gradient(132deg, rgba(111, 27, 34, 0.86), rgba(39, 16, 20, 0.84));
}

.fade-up {
  opacity: 0;
  transform: translateY(16px);
  animation: fade-up 0.72s ease forwards;
}

.delay-1 {
  animation-delay: 0.08s;
}

.delay-2 {
  animation-delay: 0.16s;
}

.delay-3 {
  animation-delay: 0.24s;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(12px, -10px) scale(1.04);
  }
}
</style>
