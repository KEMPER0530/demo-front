<template>
  <input
    :type="type"
    :placeholder="placeholder"
    class="px-3 py-4 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
    @input="handleInput"
  />
</template>

<script lang="ts">
import { defineComponent, SetupContext } from '@vue/composition-api'

export default defineComponent({
  name: 'SearchInput',
  props: {
    type: { type: String, required: true },
    placeholder: { type: String, required: false, default: '00000000000' },
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
