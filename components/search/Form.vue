<template>
  <div class="flex min-h-screen">
    <div class="md:container md:mx-auto">
      <div class="mx-auto my-10 bg-white p-5 rounded-md shadow-sm">
        <form>
          <SearchInput
            v-model="keyword"
            :type="'text'"
            :placeholder="'検索内容'" />
          <Button class="mb-6" @click="onSubmit">検索</Button>
          <Error
            v-if="params.keyword.$dirty && params.keyword.$anyInvalid"
            :message="params.keyword.$message"/>
        </form>
        <List :lists="state.list" :hasData="state.hasData" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext, ref, reactive } from '@nuxtjs/composition-api'
import axios from 'axios'
import List from '~/components/search/List.vue'
import { useValidation } from 'vue-composable'
import SearchInput from '@/components/search/SearchInput.vue'
import Button from '@/components/search/Button.vue'

const BASE_URL = process.env.QIITA_API

export default defineComponent({
  components: {
    List,
    SearchInput,
    Button,
    Error,
  },
  setup() {
    const required = (value: string | null | undefined): Boolean => !!value
    const keyword = ref('')
    const params = useValidation({
      keyword: {
        $value: keyword,
        required,
        $message: '検索条件を入力してください',
      },
    })
    const state = reactive({
      list: [],
      hasData: true,
    })

    const onSubmit = async (): Promise<any> => {
      axios.get(BASE_URL + 'items', {
        headers: {'Content-Type': 'application/json'},
        params: {
          page: 1,
          per_page: 20,
          query: keyword.value
        }
      })
      .then(response => {
        if (response.data.length === 0) {
          state.hasData = false
        }
          state.list = response.data
        })
      .catch(e => {
          //@ts-ignore
          console.error('error:', e)
      })
    }

    return {
      keyword,
      params,
      state,
      onSubmit,
    }
  },
})
</script>
