<template>
  <div class="search-results">
    <div v-if="isLoading && lists.length === 0" class="status-message">Loading...</div>
    <div v-else-if="lists.length === 0 && !hasData" class="status-message">
      No results found for your keyword.
    </div>
    <div v-else class="results-grid">
      <article
        v-for="(element, index) in lists"
        :key="`${element.url}-${index}`"
        class="article-card fade-up-item"
        role="link"
        tabindex="0"
        @click="openArticle(element.url)"
        @keydown.enter.prevent="openArticle(element.url)"
      >
        <div class="article-topline">
          <span class="meta-pill">{{ formatDate(element.created_at) }}</span>
          <span class="meta-pill meta-pill-highlight">★ {{ element.likes_count }}</span>
        </div>

        <h3 class="card-title">
          <a
            class="article-link"
            :href="normalizeUrl(element.url)"
            target="_blank"
            rel="noopener noreferrer"
            @click.stop
          >
            {{ element.title }}
          </a>
        </h3>

        <p class="article-excerpt">{{ getExcerpt(element.body) }}</p>

        <footer class="article-footer">
          <div class="author-row">
            <img
              v-if="element.user.profile_image_url"
              :src="element.user.profile_image_url"
              width="40"
              height="40"
              alt="avatar"
              class="author-avatar"
            >
            <span v-else class="author-fallback">{{ getAuthorInitial(element.user.id) }}</span>
            <div class="author-meta">
              <span class="author-label">Author</span>
              <span class="author-name">{{ element.user.id }}</span>
            </div>
          </div>

          <div class="tag-row">
            <span
              v-for="(tag, tagIndex) in getVisibleTags(element.tags)"
              :key="`${tag.name}-${tagIndex}`"
              class="tag-pill"
            >
              {{ tag.name }}
            </span>
            <span v-if="getHiddenTagCount(element.tags) > 0" class="tag-pill tag-pill-muted">
              +{{ getHiddenTagCount(element.tags) }}
            </span>
          </div>
        </footer>
      </article>
    </div>
    <div v-if="lists.length > 0" class="load-more-wrap">
      <div
        v-if="hasMore"
        ref="loadMoreTrigger"
        class="load-more-trigger"
        aria-hidden="true"
      />
      <p v-if="isLoadingMore" class="load-more-message">Loading more...</p>
      <p v-else-if="!hasMore" class="load-more-message">No more results.</p>
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

const props = withDefaults(
  defineProps<{
    lists: QiitaItem[];
    hasData: boolean;
    isLoading?: boolean;
    isLoadingMore?: boolean;
    hasMore?: boolean;
  }>(),
  {
    isLoading: false,
    isLoadingMore: false,
    hasMore: false,
  },
);

const emit = defineEmits<{
  (event: 'load-more'): void;
}>();

const { lists, hasData, isLoading, isLoadingMore, hasMore } = toRefs(props);

const scrollY = ref(0);
const loadMoreTrigger = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;
const MAX_VISIBLE_TAGS = 4;
const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const getExcerpt = (body: string) => {
  const normalized = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/<\/?[^>]+>/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[#>*_~-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (normalized.length <= 150) {
    return normalized;
  }
  return `${normalized.slice(0, 150)}...`;
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

const formatDate = (createdAt: string) => {
  const parsedDate = new Date(createdAt);
  if (Number.isNaN(parsedDate.getTime())) {
    return createdAt.slice(0, 10);
  }
  return dateFormatter.format(parsedDate);
};

const getVisibleTags = (tags: QiitaTag[]) => tags.slice(0, MAX_VISIBLE_TAGS);

const getHiddenTagCount = (tags: QiitaTag[]) => Math.max(0, tags.length - MAX_VISIBLE_TAGS);

const getAuthorInitial = (userId: string) => userId.slice(0, 1).toUpperCase();

const stopObserver = () => {
  if (!observer) {
    return;
  }
  observer.disconnect();
  observer = null;
};

const setupObserver = () => {
  stopObserver();
  if (!loadMoreTrigger.value || !props.hasMore) {
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry?.isIntersecting) {
        return;
      }
      if (props.isLoading || props.isLoadingMore || !props.hasMore) {
        return;
      }
      emit('load-more');
    },
    {
      rootMargin: '0px 0px 240px 0px',
      threshold: 0,
    },
  );

  observer.observe(loadMoreTrigger.value);
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  nextTick(setupObserver);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  stopObserver();
});

watch(loadMoreTrigger, () => {
  nextTick(setupObserver);
});

watch(
  [hasMore, isLoading, isLoadingMore, () => lists.value.length],
  () => {
    nextTick(setupObserver);
  },
);
</script>

<style scoped>
.search-results {
  margin-top: 16px;
}

.results-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.status-message {
  padding: 22px 16px;
  border-radius: 18px;
  border: 1px solid rgba(156, 205, 255, 0.18);
  background: rgba(10, 25, 46, 0.7);
  color: #ffe0b1;
}

.article-card {
  position: relative;
  display: grid;
  gap: 14px;
  height: auto;
  min-height: 0;
  padding: 18px;
  border-radius: 22px;
  border: 1px solid rgba(170, 214, 255, 0.18);
  background:
    linear-gradient(180deg, rgba(255, 184, 77, 0.06), transparent 34%),
    linear-gradient(145deg, rgba(8, 28, 58, 0.82), rgba(13, 16, 24, 0.9));
  color: #edf6ff;
  transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease;
  cursor: pointer;
  overflow: hidden;
}

.article-card::before {
  content: '';
  position: absolute;
  inset: 0 auto auto 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, rgba(255, 180, 74, 0.95), rgba(104, 216, 255, 0.9));
}

.article-card:hover {
  transform: translateY(-3px);
  border-color: rgba(212, 236, 255, 0.4);
  box-shadow: 0 18px 32px rgba(0, 0, 0, 0.34);
}

.article-card:focus {
  outline: 2px solid rgba(144, 212, 255, 0.92);
  outline-offset: 3px;
}

.article-topline {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}

.meta-pill {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(13, 33, 61, 0.8);
  border: 1px solid rgba(171, 214, 255, 0.18);
  color: rgba(218, 234, 252, 0.94);
  font-size: 0.82rem;
  font-weight: 700;
}

.meta-pill-highlight {
  background: rgba(255, 173, 58, 0.14);
  border-color: rgba(255, 193, 98, 0.3);
  color: #ffd48f;
}

.card-title {
  margin: 0;
  font-size: clamp(1.08rem, 1rem + 0.4vw, 1.28rem);
  line-height: 1.5;
  letter-spacing: 0.01em;
}

.article-link:link,
.article-link:visited {
  color: #fff7e9;
  text-decoration: none;
}

.article-link:hover {
  color: #ffd79a;
}

.article-excerpt {
  margin: 0;
  color: rgba(216, 231, 248, 0.9);
  font-size: 0.96rem;
  line-height: 1.85;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
}

.article-footer {
  display: grid;
  gap: 12px;
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid rgba(171, 214, 255, 0.14);
}

.author-row {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.author-avatar,
.author-fallback {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  flex-shrink: 0;
}

.author-avatar {
  object-fit: cover;
  border: 1px solid rgba(180, 219, 255, 0.24);
  background: rgba(15, 34, 58, 0.85);
}

.author-fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, rgba(255, 176, 46, 0.24), rgba(87, 197, 255, 0.24));
  border: 1px solid rgba(182, 222, 255, 0.24);
  color: #fff8e3;
  font-weight: 800;
}

.author-meta {
  min-width: 0;
  display: grid;
  gap: 2px;
}

.author-label {
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(146, 213, 255, 0.88);
}

.author-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #f5fbff;
  font-weight: 700;
  font-size: 0.95rem;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-pill {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid rgba(171, 214, 255, 0.2);
  background: rgba(8, 24, 44, 0.78);
  color: rgba(232, 242, 255, 0.92);
  font-size: 0.8rem;
  line-height: 1;
}

.tag-pill-muted {
  color: #ffd398;
  border-color: rgba(255, 197, 109, 0.24);
  background: rgba(255, 173, 58, 0.08);
}

.page-component-up {
  position: fixed;
  right: 16px;
  bottom: 20px;
}

.scroll-top {
  width: 46px;
  height: 46px;
  border: 1px solid rgba(180, 214, 255, 0.4);
  border-radius: 999px;
  background: linear-gradient(145deg, rgba(10, 37, 75, 0.88), rgba(13, 20, 33, 0.92));
  color: #edf6ff;
  font-size: 1.2rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.load-more-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 18px;
}

.load-more-trigger {
  width: 100%;
  height: 1px;
}

.load-more-message {
  margin: 0;
  color: #ffd398;
  font-weight: 700;
}

@media (min-width: 880px) {
  .results-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .article-card {
    padding: 20px;
  }
}

@media (max-width: 639px) {
  .search-results {
    margin-top: 14px;
  }

  .article-card {
    gap: 12px;
    padding: 16px;
    border-radius: 18px;
  }

  .article-excerpt {
    font-size: 0.92rem;
    line-height: 1.75;
    -webkit-line-clamp: 5;
  }

  .tag-row {
    gap: 6px;
  }

  .tag-pill {
    min-height: 28px;
    padding: 0 9px;
    font-size: 0.76rem;
  }
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
