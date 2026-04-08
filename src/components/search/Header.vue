<template>
  <header class="search-hero">
    <div class="search-hero-inner">
      <div class="search-hero-main">
        <div>
          <p class="hero-kicker">Discover</p>
          <h1><NuxtLink to="/">Qiita記事</NuxtLink></h1>
          <p class="hero-sub">キーワードから記事を検索し、気になる技術トピックをすぐに発見できます。</p>
        </div>
        <DashboardBackLink />
      </div>
    </div>
  </header>
</template>

<style scoped>
.search-hero {
  position: relative;
  overflow: hidden;
  padding: 20px 18px 10px;
  background:
    radial-gradient(circle at 10% 20%, rgba(255, 169, 32, 0.35), transparent 30%),
    radial-gradient(circle at 85% 76%, rgba(0, 212, 255, 0.26), transparent 32%),
    linear-gradient(130deg, #201706, #121a2e 58%, #111318 100%);
  border-bottom: 1px solid rgba(199, 226, 255, 0.22);
}

.search-hero-inner {
  width: min(1140px, 100%);
  margin: 0 auto;
  animation: fade-up 0.7s ease-out;
}

.search-hero-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.hero-kicker {
  margin: 0;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: rgba(139, 214, 255, 0.96);
}

h1 {
  margin: 0.24rem 0 0.3rem;
}

h1 a {
  font-size: clamp(1.4rem, 4vw, 2.3rem);
  color: #fff;
  text-decoration: none;
}

.hero-sub {
  margin: 0;
  color: rgba(220, 235, 255, 0.94);
}

@media (max-width: 640px) {
  .search-hero-main {
    flex-direction: column;
  }
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
