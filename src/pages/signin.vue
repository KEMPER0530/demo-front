<template>
  <div class="signin-page">
    <div class="signin-halo halo-a" />
    <div class="signin-halo halo-b" />
    <div class="signin-grid" />
    <div class="signin-content">
      <Signin />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
});
</script>

<style scoped>
.signin-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background:
    radial-gradient(circle at 12% 20%, rgba(0, 224, 255, 0.28), transparent 36%),
    radial-gradient(circle at 85% 74%, rgba(255, 174, 0, 0.2), transparent 40%),
    linear-gradient(145deg, #04122b, #0a1d3f 42%, #111315 100%);
}

.signin-halo {
  position: absolute;
  border-radius: 9999px;
  filter: blur(2px);
  animation: halo-float 10s ease-in-out infinite;
}

.halo-a {
  width: 420px;
  height: 420px;
  left: -120px;
  top: -100px;
  background: radial-gradient(circle at 30% 30%, rgba(0, 255, 245, 0.48), rgba(0, 92, 179, 0.1) 70%);
}

.halo-b {
  width: 360px;
  height: 360px;
  right: -70px;
  bottom: -90px;
  animation-delay: -4s;
  background: radial-gradient(circle at 35% 35%, rgba(255, 184, 0, 0.45), rgba(255, 115, 0, 0.08) 72%);
}

.signin-grid {
  position: absolute;
  inset: 0;
  opacity: 0.2;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(circle at center, black 30%, transparent 82%);
  pointer-events: none;
}

.signin-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 780px;
  padding: 24px;
  animation: fade-in-up 0.85s ease-out;
}

@keyframes halo-float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(12px, -14px) scale(1.05);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(26px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
