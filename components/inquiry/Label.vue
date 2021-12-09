<template>
  <label class="block mb-2 text-sm text-gray-600">
    <slot />
  </label>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Label',
})
</script>
