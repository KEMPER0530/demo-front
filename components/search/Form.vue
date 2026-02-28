<template>
  <div class="search-page">
    <el-container>
      <el-main class="search-main">
        <div class="search-panel fade-up">
          <el-form :inline="true" :model="searchForm" ref="searchForm" :rules="rules" @submit.native.prevent>
            <el-form-item prop="keyword">
              <el-input placeholder="search by keyword" prefix-icon="el-icon-search" v-model="searchForm.keyword"  @keyup.enter.native="search('searchForm')" />
            </el-form-item>
            <el-form-item>
              <el-button type="warning" @click="search('searchForm')">search</el-button>
            </el-form-item>
          </el-form>
        </div>
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

<style scoped>
.search-page {
  min-height: calc(100vh - 130px);
  background:
    radial-gradient(circle at 92% 16%, rgba(255, 177, 56, 0.18), transparent 30%),
    linear-gradient(140deg, #0a1222, #0f1727 52%, #191919 100%);
}

.search-main {
  width: min(1180px, 100%);
  margin: 0 auto;
  background: transparent;
}

.search-panel {
  margin: 12px auto 10px;
  padding: 14px;
  border-radius: 16px;
  border: 1px solid rgba(163, 210, 255, 0.22);
  background: linear-gradient(145deg, rgba(9, 25, 53, 0.72), rgba(12, 14, 21, 0.74));
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.3);
}

.search-panel :deep(.el-form-item) {
  margin-bottom: 0;
}

.search-panel :deep(.el-input__inner) {
  background: rgba(9, 18, 34, 0.76);
  color: #eff8ff;
  border: 1px solid rgba(143, 205, 255, 0.34);
  border-radius: 12px;
}

.search-panel :deep(.el-input__inner:focus) {
  border-color: rgba(126, 226, 255, 0.95);
}

.search-panel :deep(.el-button) {
  border: none;
  border-radius: 12px;
  background: linear-gradient(110deg, #ffad3a, #ff7048);
  color: #fff;
  font-weight: 700;
  box-shadow: 0 8px 18px rgba(255, 125, 61, 0.3);
}

.fade-up {
  opacity: 0;
  transform: translateY(14px);
  animation: fade-up 0.65s ease forwards;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
