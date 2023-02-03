<template>
    <Chatform></Chatform>
</template>

<script lang="ts">
import { computed,defineComponent } from '@nuxtjs/composition-api'
import Chatform from '@/components/gpt/Chatform.vue'

export default defineComponent({
  components: {
    Chatform,
  },
})
</script>
