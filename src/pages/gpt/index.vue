<template>
  <div class="gpt-status-page">
    <div class="ambient ambient-a" />
    <div class="ambient ambient-b" />
    <main class="gpt-status-shell">
      <div v-if="status === 'loading'" class="status-card">
        <p class="status-kicker">OpenAI</p>
        <h1>状態を確認しています</h1>
        <p>内部の疎通確認が終わるまで少し待ってください。</p>
      </div>

      <div v-else-if="status === 'maintenance'" class="status-card maintenance-card">
        <p class="status-kicker">Maintenance</p>
        <h1>OpenAIページは現在工事中です</h1>
        <p>現在は利用できません。内部確認でエラーが返ったため、ページを停止しています。</p>
        <div class="back-link-wrap">
          <DashboardBackLink />
        </div>
      </div>

      <GptChatform v-else :username="username" />
    </main>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth();
const username = computed(() => user.value?.email || user.value?.username || 'guest');

type PageStatus = 'loading' | 'available' | 'maintenance';

const status = ref<PageStatus>('loading');

onMounted(async () => {
  try {
    const response = await $fetch<{ available?: boolean }>('/api/openai/status');
    status.value = response.available ? 'available' : 'maintenance';
  } catch (error) {
    console.error('openai page status check failed:', error);
    status.value = 'maintenance';
  }
});
</script>

<style scoped>
.gpt-status-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  padding: 20px 12px 28px;
  background:
    radial-gradient(circle at 10% 13%, rgba(31, 225, 255, 0.18), transparent 33%),
    radial-gradient(circle at 88% 80%, rgba(255, 169, 37, 0.18), transparent 38%),
    linear-gradient(140deg, #0a162c, #0f1623 56%, #171414 100%);
}

.ambient {
  position: absolute;
  border-radius: 999px;
  filter: blur(2px);
  animation: float 10s ease-in-out infinite;
}

.ambient-a {
  width: 320px;
  height: 320px;
  left: -90px;
  top: -80px;
  background: radial-gradient(circle at 35% 35%, rgba(31, 225, 255, 0.3), rgba(31, 225, 255, 0.03) 70%);
}

.ambient-b {
  width: 280px;
  height: 280px;
  right: -70px;
  bottom: -70px;
  animation-delay: -3s;
  background: radial-gradient(circle at 34% 30%, rgba(255, 182, 67, 0.3), rgba(255, 182, 67, 0.03) 72%);
}

.gpt-status-shell {
  position: relative;
  width: min(980px, 100%);
  margin: 0 auto;
  z-index: 1;
}

.status-card {
  margin-top: 16px;
  padding: 24px 20px;
  border-radius: 22px;
  border: 1px solid rgba(167, 214, 255, 0.22);
  background: linear-gradient(145deg, rgba(7, 26, 56, 0.72), rgba(14, 17, 23, 0.74));
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.3);
  color: #eef6ff;
}

.maintenance-card {
  background: linear-gradient(145deg, rgba(56, 28, 7, 0.72), rgba(25, 17, 14, 0.82));
}

.status-kicker {
  margin: 0 0 8px;
  font-size: 0.82rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(148, 218, 255, 0.96);
}

.status-card h1 {
  margin: 0 0 12px;
  font-size: clamp(1.5rem, 4vw, 2.3rem);
}

.status-card p {
  margin: 0;
  line-height: 1.8;
  color: rgba(226, 239, 255, 0.94);
}

.back-link-wrap {
  margin-top: 18px;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(9px, -10px) scale(1.04);
  }
}
</style>
