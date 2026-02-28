<template>
  <p class="inquiry-error">{{ message }}</p>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Error',
  props: { message: { type: String, required: true } },
})
</script>

<style scoped>
.inquiry-error {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #ff99ae;
}
</style>
