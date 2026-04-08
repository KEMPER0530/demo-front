<template>
  <div class="auth-page">
    <Signup />
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
    radial-gradient(circle at 14% 18%, rgba(0, 218, 255, 0.2), transparent 36%),
    radial-gradient(circle at 85% 80%, rgba(255, 169, 42, 0.2), transparent 40%),
    linear-gradient(140deg, #09162d, #101728 52%, #1a1715 100%);
}
</style>
