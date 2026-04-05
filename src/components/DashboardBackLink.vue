<template>
  <NuxtLink to="/" class="dashboard-back-link">
    Dashboardへ戻る
  </NuxtLink>
</template>

<style scoped>
.dashboard-back-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid rgba(176, 216, 255, 0.28);
  color: #fff;
  text-decoration: none;
  background: rgba(10, 29, 56, 0.54);
  transition: transform 0.22s ease, border-color 0.22s ease, background 0.22s ease;
}

.dashboard-back-link:hover {
  transform: translateY(-1px);
  border-color: rgba(212, 236, 255, 0.44);
  background: rgba(12, 37, 69, 0.72);
}

.dashboard-back-link:focus-visible {
  outline: 2px solid rgba(146, 214, 255, 0.92);
  outline-offset: 3px;
}

@media (max-width: 640px) {
  .dashboard-back-link {
    width: 100%;
  }
}
</style>
