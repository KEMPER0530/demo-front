<template>
  <Navbar/>
</template>

<script lang="ts">
import { computed,defineComponent } from '@nuxtjs/composition-api'
import Navbar from '@/components/search/Navbar.vue'

export default defineComponent({
  components: {
    Navbar,
  },
})
</script>
