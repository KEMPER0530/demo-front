<template>
  <div class="pacman-page">
    <div class="ambient ambient-left" />
    <div class="ambient ambient-right" />
    <main class="pacman-shell">
      <section class="hero-panel">
        <div>
          <p class="eyebrow">Arcade</p>
          <h1>Pac Dot Rush</h1>
          <p class="hero-copy">
            ダッシュボードから独立した専用ページです。キーボードでもタッチでも遊べます。
          </p>
        </div>
        <DashboardBackLink />
      </section>

      <section class="content-grid">
        <aside class="info-panel">
          <div class="info-card">
            <span class="info-label">Controls</span>
            <p>Arrow / WASD で移動、SPACE で開始、P で一時停止。</p>
          </div>
          <div class="info-card">
            <span class="info-label">Play</span>
            <p>レベル、残機、スピードはゲーム内のパネルから調整できます。</p>
          </div>
        </aside>

        <section class="game-area">
          <PacmanGame />
        </section>
      </section>
    </main>
  </div>
</template>

<style scoped>
.pacman-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  color: #f7fbff;
  background:
    radial-gradient(circle at 12% 16%, rgba(0, 228, 255, 0.18), transparent 34%),
    radial-gradient(circle at 88% 20%, rgba(255, 176, 46, 0.18), transparent 28%),
    linear-gradient(135deg, #071427, #101728 44%, #16110f 100%);
}

.ambient {
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  filter: blur(8px);
  animation: float 11s ease-in-out infinite;
}

.ambient-left {
  width: 320px;
  height: 320px;
  top: -90px;
  left: -60px;
  background: radial-gradient(circle at 40% 35%, rgba(29, 232, 255, 0.28), rgba(17, 112, 255, 0.02) 70%);
}

.ambient-right {
  width: 280px;
  height: 280px;
  right: -70px;
  bottom: -50px;
  background: radial-gradient(circle at 35% 35%, rgba(255, 182, 52, 0.32), rgba(255, 80, 0, 0.03) 72%);
  animation-delay: -3s;
}

.pacman-shell {
  width: min(1180px, 100%);
  margin: 0 auto;
  padding: clamp(1.1rem, 2.8vw, 2.2rem);
  position: relative;
  z-index: 1;
}

.hero-panel {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
  padding: clamp(1.2rem, 2.2vw, 1.9rem);
  border-radius: 22px;
  border: 1px solid rgba(159, 210, 255, 0.22);
  background: linear-gradient(145deg, rgba(8, 27, 56, 0.74), rgba(17, 19, 27, 0.68));
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.3);
}

.eyebrow {
  margin: 0;
  font-size: 0.82rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(120, 221, 255, 0.96);
}

.hero-panel h1 {
  margin: 0.22rem 0 0.55rem;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
}

.hero-copy {
  margin: 0;
  max-width: 42rem;
  color: rgba(225, 237, 251, 0.92);
  line-height: 1.75;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.info-panel {
  display: grid;
  gap: 12px;
}

.info-card {
  padding: 1rem;
  border-radius: 18px;
  border: 1px solid rgba(163, 209, 255, 0.2);
  background: linear-gradient(145deg, rgba(8, 22, 47, 0.78), rgba(17, 15, 21, 0.82));
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
}

.info-label {
  display: inline-block;
  margin-bottom: 0.45rem;
  font-size: 0.78rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #ffc870;
}

.info-card p {
  margin: 0;
  color: rgba(224, 236, 250, 0.92);
  line-height: 1.7;
}

.game-area {
  min-width: 0;
}

@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .hero-panel {
    flex-direction: column;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(12px, -12px) scale(1.04);
  }
}
</style>
