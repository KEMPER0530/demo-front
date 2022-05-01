<template>
  <div>
    <!-- <ENavbar v-if="isMode"></ENavbar> -->
    <Navbar v-if="!isMode"></Navbar>
  </div>
</template>

<script lang="ts">
import { computed,defineComponent } from '@nuxtjs/composition-api'
import Navbar from '@/components/search/Navbar.vue'
// import ENavbar from '@/components/esearch/Navbar.vue'

export default defineComponent({
  components: {
    Navbar,
    // ENavbar
  },
  setup(){
    const isMode = computed(() => {
      return false
    })

    return{
      isMode
    }
  }
})
</script>
