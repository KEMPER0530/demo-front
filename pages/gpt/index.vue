<template>
  <Chatform :username="username"/>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import Chatform from '@/components/gpt/Chatform.vue'

export default defineComponent({
  components: {
    Chatform,
  },
  computed: {
    username() {
      return (this.$auth.user as any).cognito.username;
    }
  },
})
</script>
