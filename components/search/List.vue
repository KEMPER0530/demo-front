<template>
<div class="search-results">
  <div v-if="lists.length === 0 && !hasData" class="no-results">
    <i class="el-icon-warning">&nbsp;No results found for your keyword.</i>
  </div>
  <div v-else>
    <el-col :span="colSpan" v-for="(element, index) in lists" :key="index" class="col-style">
      <el-card :body-style="{ padding: '15px' }" class="box-card fade-up-item">
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

<style scoped>
.search-results {
  margin-top: 12px;
}

.no-results {
  padding: 18px 12px;
  color: #ffd398;
}

.col-style {
  padding: 10px;
}

.box-card {
  height: 380px;
  border-radius: 14px;
  border: 1px solid rgba(170, 214, 255, 0.2);
  background: linear-gradient(145deg, rgba(8, 28, 58, 0.78), rgba(14, 16, 21, 0.82));
  color: #edf6ff;
  transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease;
}

.box-card:hover {
  transform: translateY(-4px);
  border-color: rgba(206, 234, 255, 0.55);
  box-shadow: 0 16px 28px rgba(0, 0, 0, 0.3);
}

.content-style {
  line-height: 1.7;
  color: rgba(220, 236, 255, 0.95);
}

.text {
  font-size: 14px;
}

.tab-style {
  margin-right: 5px;
}

.list-link:link,
.list-link:visited {
  color: #ffca7d;
}

.list-link:hover {
  color: #fff1d3;
}

.fade-up-item {
  animation: fade-up 0.65s ease-out;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
