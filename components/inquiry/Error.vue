<template>
  <p class="text-xs text-red-500 mt-3">{{ message }}</p>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Error',
  props: { message: { type: String, required: true } },
})
</script>
