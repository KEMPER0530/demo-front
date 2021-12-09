<template>
  <textarea
    rows="5"
    :placeholder="placeholder"
    class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
    @input="handleInput"
  />
</template>

<script lang="ts">
import { defineComponent, SetupContext } from '@vue/composition-api'

export default defineComponent({
  name: 'BodyInput',
  props: {
    placeholder: { type: String, required: false, default: '' },
  },
  setup(_, context: SetupContext) {
    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      context.emit('input', target.value)
    }
    return {
      handleInput,
    }
  },
})
</script>
