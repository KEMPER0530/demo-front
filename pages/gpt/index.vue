<template>
  <GptChatform :username="username" />
</template>

<script setup lang="ts">
const { user } = useAuth();
const username = computed(() => user.value?.email || user.value?.username || 'guest');
</script>
