<template>
  <p class="inquiry-error">{{ message }}</p>
</template>

<script setup lang="ts">
defineProps<{ message: string }>();
</script>

<style scoped>
.inquiry-error {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #ff99ae;
}
</style>
