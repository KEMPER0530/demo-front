<template>
  <label class="inquiry-label">
    <slot />
  </label>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Label',
})
</script>

<style scoped>
.inquiry-label {
  display: block;
  margin-bottom: 0.45rem;
  font-size: 0.9rem;
  color: rgba(220, 235, 255, 0.94);
}
</style>
