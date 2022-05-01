<template>
  <button
    class="px-4 py-4 font-bold text-white bg-green-500 rounded-md focus:bg-green-600 focus:outline-none"
    @click.prevent="handleClick"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from '@vue/composition-api'
export default defineComponent({
  name: 'Button',
  setup(_, context: SetupContext) {
    const handleClick = () => {
      context.emit('click')
    }
    return {
      handleClick,
    }
  },
})
</script>
