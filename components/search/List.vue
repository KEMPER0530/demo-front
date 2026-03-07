<template>
  <div class="search-results">
    <div v-if="isLoading" class="status-message">Loading...</div>
    <div v-else-if="lists.length === 0 && !hasData" class="status-message">
      No results found for your keyword.
    </div>
    <div v-else class="results-grid">
      <article
        v-for="(element, index) in lists"
        :key="`${element.url}-${index}`"
        class="box-card fade-up-item"
        role="link"
        tabindex="0"
        @click="openArticle(element.url)"
        @keydown.enter.prevent="openArticle(element.url)"
      >
        <h3 class="card-title">
          <a
            class="list-link"
            :href="normalizeUrl(element.url)"
            target="_blank"
            rel="noopener noreferrer"
            @click.stop
          >
            {{ element.title }}
          </a>
        </h3>
        <div class="content-style text">
          <div>{{ element.created_at }}</div>
          <span class="meta-row">
            <img v-if="element.user.profile_image_url" :src="element.user.profile_image_url" width="16" height="16" alt="avatar">
            <span :title="element.user.description || ''">&nbsp;{{ element.user.id }}</span>
            <span class="likes">★ {{ element.likes_count }}</span>
          </span>
          <div>{{ getDescription(element.body) }}</div>
          <div class="tag-wrap">
            <span v-for="(tag, tagIndex) in element.tags" :key="`${tag.name}-${tagIndex}`" class="tab-style">{{ tag.name }}</span>
          </div>
        </div>
      </article>
    </div>
    <div v-if="300 < scrollY" class="page-component-up">
      <button class="scroll-top" type="button" @click="scrollTop">↑</button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface QiitaTag {
  name: string;
}

interface QiitaUser {
  id: string;
  description?: string | null;
  profile_image_url?: string;
}

interface QiitaItem {
  title: string;
  url: string;
  created_at: string;
  likes_count: number;
  body: string;
  tags: QiitaTag[];
  user: QiitaUser;
}

withDefaults(
  defineProps<{
    lists: QiitaItem[];
    hasData: boolean;
    isLoading?: boolean;
  }>(),
  {
    isLoading: false,
  },
);

const scrollY = ref(0);

const getDescription = (body: string) => {
  const normalized = body.replace(/\s+/g, ' ').trim();
  if (normalized.length <= 100) {
    return normalized;
  }
  return `${normalized.slice(0, 100)}...`;
};

const handleScroll = () => {
  scrollY.value = window.scrollY;
};

const scrollTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const normalizeUrl = (url: string): string => {
  if (!url) {
    return '#';
  }
  return /^https?:\/\//.test(url) ? url : `https://${url}`;
};

const openArticle = (url: string) => {
  const targetUrl = normalizeUrl(url);
  if (targetUrl === '#') {
    return;
  }
  const opened = window.open(targetUrl, '_blank', 'noopener,noreferrer');
  if (!opened) {
    window.location.href = targetUrl;
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.search-results {
  margin-top: 12px;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}

.status-message {
  padding: 18px 12px;
  color: #ffd398;
}

.box-card {
  min-height: 330px;
  border-radius: 14px;
  border: 1px solid rgba(170, 214, 255, 0.2);
  background: linear-gradient(145deg, rgba(8, 28, 58, 0.78), rgba(14, 16, 21, 0.82));
  color: #edf6ff;
  padding: 15px;
  transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease;
  cursor: pointer;
}

.box-card:hover {
  transform: translateY(-4px);
  border-color: rgba(206, 234, 255, 0.55);
  box-shadow: 0 16px 28px rgba(0, 0, 0, 0.3);
}

.box-card:focus {
  outline: 2px solid rgba(144, 212, 255, 0.9);
  outline-offset: 2px;
}

.card-title {
  margin: 0 0 10px;
  font-size: 1.02rem;
  line-height: 1.5;
}

.content-style {
  line-height: 1.7;
  color: rgba(220, 236, 255, 0.95);
}

.text {
  font-size: 14px;
}

.meta-row {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin: 4px 0;
}

.likes {
  margin-left: 8px;
}

.tag-wrap {
  margin-top: 6px;
}

.tab-style {
  margin-right: 5px;
  display: inline-block;
  font-size: 0.78rem;
  border: 1px solid rgba(176, 214, 255, 0.26);
  border-radius: 999px;
  padding: 2px 8px;
  background: rgba(11, 25, 45, 0.64);
}

.list-link:link,
.list-link:visited {
  color: #ffca7d;
  text-decoration: none;
}

.list-link:hover {
  color: #fff1d3;
}

.page-component-up {
  position: fixed;
  right: 14px;
  bottom: 18px;
}

.scroll-top {
  width: 42px;
  height: 42px;
  border: 1px solid rgba(180, 214, 255, 0.4);
  border-radius: 999px;
  background: linear-gradient(145deg, rgba(10, 37, 75, 0.88), rgba(13, 20, 33, 0.92));
  color: #edf6ff;
  font-size: 1.2rem;
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
