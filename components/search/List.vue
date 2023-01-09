<template>
<div>
  <div v-if="lists.length === 0 && !hasData">
    <i class="el-icon-warning">&nbsp;No results found for your keyword.</i>
  </div>
  <div v-else>
    <el-col :span="colSpan" v-for="(element, index) in lists" :key="index" class="col-style">
      <el-card :body-style="{ padding: '15px' }" class="box-card">
        <div slot="header" class="clearfix">
          <a class="list-link" :href="element.url" target="_blank">{{ element.title }}</a>
        </div>
        <div class="bottom clearfix content-style text">
          <div>{{ element.created_at }}</div>
          <span>
            <img :src="element.user.profile_image_url" width="15" height="15" />
            <template v-if="element.user.description">
              <el-popover slot="description" placement="top-start" width="300" trigger="hover" :content="element.user.description">
                <span slot="reference">&nbsp;{{ element.user.id }}</span>
              </el-popover>
            </template>
            <template v-else>
              <span>&nbsp;{{ element.user.id }}</span>
            </template>
          </span>
          &nbsp;
          <span>
            <i class="el-icon-star-off">{{ element.likes_count }}</i>
          </span>
          <div>{{ getDescription(element.body) }}</div>
          <el-tag size="mini" type="info" class="tab-style" v-for="(tag, index) in element.tags" :key="index">{{ tag.name }}</el-tag>
        </div>
      </el-card>
    </el-col>
    <div v-if="300 < scrollY" class="page-component-up">
      <transition name="fade">
        <i class="el-icon-caret-top" @click="scrollTop" />
      </transition>
    </div>
  </div>
</div>
</template>

<script lang="babel">
export default {
  props: ['lists', 'hasData'],
  data () {
    return {
      scrollY: 0,
      colSpan: 10
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  methods: {
    getDescription: function (body) {
      return body.slice(0, 100) + '...'
    },
    handleScroll: function () {
      this.scrollY = window.scrollY
    },
    scrollTop: function () {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    },
    handleResize () {
      if (window.innerWidth < 768) {
        this.colSpan = 26
      } else if (window.innerWidth < 1025) {
        this.colSpan = 12
      } else if (window.innerWidth < 1217) {
        this.colSpan = 8
      } else {
        this.colSpan = 6
      }
    },
  }
}
</script>
