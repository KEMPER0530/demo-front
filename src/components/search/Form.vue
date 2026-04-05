<template>
  <div class="search-page">
    <main class="search-main">
      <div class="search-panel fade-up">
        <form class="search-form" @submit.prevent="search">
          <label class="sr-only" for="search-keyword">search by keyword</label>
          <input
            id="search-keyword"
            v-model="searchKeyword"
            type="text"
            class="search-input"
            placeholder="search by keyword"
          >
          <button type="submit" class="search-button">search</button>
        </form>
        <p v-if="errorMessage" class="search-error">{{ errorMessage }}</p>
      </div>
      <SearchList
        :lists="list"
        :has-data="hasData"
        :is-loading="isLoading"
        :is-loading-more="isLoadingMore"
        :has-more="hasNextPage"
        @load-more="loadMore"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import SearchList from '@/components/search/List.vue';

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

const config = useRuntimeConfig();
const PER_PAGE = 20;

const searchKeyword = ref('');
const list = ref<QiitaItem[]>([]);
const hasData = ref(true);
const isLoading = ref(false);
const isLoadingMore = ref(false);
const errorMessage = ref('');
const activeKeyword = ref('');
const currentPage = ref(0);
const hasNextPage = ref(false);

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const buildQiitaEndpoint = (): string => {
  const base = (config.public.qiitaApi || '').trim();
  if (!base) {
    throw new Error('QIITA_API が設定されていません');
  }
  return `${base.replace(/\/?$/, '/')}items`;
};

const resetSearchState = (keyword: string) => {
  list.value = [];
  hasData.value = true;
  hasNextPage.value = false;
  currentPage.value = 0;
  activeKeyword.value = keyword.trim();
};

const sendRequest = async (page: number, keyword: string, options?: { append?: boolean }) => {
  const append = options?.append ?? false;
  const normalizedKeyword = keyword.trim();
  if (append) {
    isLoadingMore.value = true;
  } else {
    isLoading.value = true;
  }
  errorMessage.value = '';
  try {
    const endpoint = buildQiitaEndpoint();
    const response = await $fetch<QiitaItem[]>(endpoint, {
      params: {
        page,
        per_page: PER_PAGE,
        query: normalizedKeyword,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const items = Array.isArray(response) ? response : [];
    if (append && items.length === 0) {
      hasNextPage.value = false;
      return false;
    }

    list.value = append ? [...list.value, ...items] : items;
    hasData.value = list.value.length > 0;
    currentPage.value = page;
    activeKeyword.value = normalizedKeyword;
    hasNextPage.value = items.length === PER_PAGE;
    return true;
  } catch (error) {
    console.error('search error:', error);
    if (append) {
      hasNextPage.value = false;
    } else {
      list.value = [];
      hasData.value = false;
      hasNextPage.value = false;
      currentPage.value = 0;
    }
    errorMessage.value = '検索に失敗しました。環境変数とAPI設定を確認してください。';
    return false;
  } finally {
    if (append) {
      isLoadingMore.value = false;
    } else {
      isLoading.value = false;
    }
  }
};

const search = async () => {
  if (isLoading.value || isLoadingMore.value) {
    return;
  }

  const keyword = searchKeyword.value.trim();
  if (!keyword) {
    errorMessage.value = 'Please input the keyword';
    return;
  }
  resetSearchState(keyword);
  scrollToTop();
  await sendRequest(1, keyword);
};

const loadMore = async () => {
  if (isLoading.value || isLoadingMore.value || !hasNextPage.value || !activeKeyword.value) {
    return;
  }

  await sendRequest(currentPage.value + 1, activeKeyword.value, { append: true });
};

onMounted(async () => {
  const initialKeyword = 'AWS';
  resetSearchState(initialKeyword);
  await sendRequest(1, initialKeyword);
  searchKeyword.value = '';
});
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

.search-form {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.search-input {
  width: 100%;
  min-height: 42px;
  background: rgba(9, 18, 34, 0.76);
  color: #eff8ff;
  border: 1px solid rgba(143, 205, 255, 0.34);
  border-radius: 12px;
  padding: 0 12px;
}

.search-input:focus {
  outline: none;
  border-color: rgba(126, 226, 255, 0.95);
  box-shadow: 0 0 0 3px rgba(75, 152, 255, 0.2);
}

.search-button {
  min-width: 92px;
  min-height: 42px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(110deg, #ffad3a, #ff7048);
  color: #fff;
  font-weight: 700;
  box-shadow: 0 8px 18px rgba(255, 125, 61, 0.3);
}

.search-error {
  margin: 8px 0 0;
  color: #ffc28a;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
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

@media (max-width: 640px) {
  .search-form {
    grid-template-columns: 1fr;
  }

  .search-button {
    width: 100%;
  }
}
</style>
