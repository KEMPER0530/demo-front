<template>
  <div bg-black>
    <el-container>
      <el-main>
        <el-form :inline="true" :model="searchForm" ref="searchForm" :rules="rules" @submit.native.prevent>
          <el-form-item prop="keyword">
            <el-input placeholder="search by keyword" prefix-icon="el-icon-search" v-model="searchForm.keyword"  @keyup.enter.native="search('searchForm')" />
          </el-form-item>
          <el-form-item>
            <el-button @click="search('searchForm')">search</el-button>
          </el-form-item>
        </el-form>
        <List :lists="list" :hasData="hasData" />
      </el-main>
    </el-container>
  </div>
</template>

<script lang="babel">
import axios from 'axios'
import List from '~/components/search/List.vue'

export default {
  components: {
    List
  },
  data () {
    return {
      searchForm: {
        keyword: ''
      },
      rules: {
        keyword: [
          { required: true, message: 'Please input the keyword', trigger: 'blur' }
        ]
      },
      list: [],
      hasData: true
    }
  },
  created () {
    this.searchForm.keyword = 'AWS'
    this.sendRequest()
    this.searchForm.keyword = ''
  },
  methods: {
    search (form) {
      this.$refs[form].validate((valid) => {
        if (!valid) {
          return false
        }
        this.sendRequest()
      })
    },
    sendRequest () {
      axios.get(`${process.env.QIITA_API}` + 'items', {
        headers: {'Content-Type': 'application/json'},
        params: {
          page: 1,
          per_page: 20,
          query: this.searchForm.keyword
        }
      })
        .then(response => {
          if (response.data.length === 0) {
            this.hasData = false
          }
          this.list = response.data
        })
        .catch(e => {
          console.error('error:', e)
        })
    }
  }
}
</script>
