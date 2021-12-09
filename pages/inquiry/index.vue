<template>
  <InquiryForm></InquiryForm>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import InquiryForm from '@/components/inquiry/Form.vue'

export default defineComponent({
  components: {
    InquiryForm,
  },
})
</script>
