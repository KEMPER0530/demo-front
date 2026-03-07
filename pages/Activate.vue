<template>
  <div class="auth-page">
    <Activate />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
});
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background:
    radial-gradient(circle at 12% 20%, rgba(0, 219, 255, 0.2), transparent 36%),
    radial-gradient(circle at 86% 80%, rgba(255, 177, 44, 0.2), transparent 40%),
    linear-gradient(140deg, #0a172e, #101627 52%, #1b1714 100%);
}
</style>
