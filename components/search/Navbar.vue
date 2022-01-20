<template>
    <div>
        <Header />
        <Form />
        <!-- <Footer /> -->
    </div>
</template>

<script>
import Header from '~/components/search/Header.vue'
import Footer from '~/components/search/Footer.vue'
import Form from '~/components/search/Form.vue'
export default {
    components: {
        Header,
        Footer,
        Form
    }
}
</script>
