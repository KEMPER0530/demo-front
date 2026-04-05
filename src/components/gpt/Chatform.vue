<template>
  <div class="chat-page">
    <div class="chat-ambient ambient-a" />
    <div class="chat-ambient ambient-b" />
    <div class="chat-shell">
      <h1 class="chat-title"><NuxtLink to="/">OpenAI デモ</NuxtLink></h1>
      <div class="chat-panel">
        <p class="model-label">model: {{ modelName }}</p>
        <div class="mb-4">
          <textarea class="chat-textarea" v-model="inputText" placeholder="Send a message..."></textarea>
        </div>
        <div class="text-center">
          <button v-if="!isLoading" :disabled="!isInputValid" :class="!isInputValid ? 'chat-button disabled' : 'chat-button'" @click="generateResponse">Generate Response</button>
          <div v-if="isLoading" class="loading inline-block">
            <div class="flex items-center justify-center">
              <div class="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-1"></div>
              <div class="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-1"></div>
              <div class="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-1"></div>
            </div>
          </div>
        </div>
      </div>
      <div :class="result.role === 'user' ? 'chat-result user' : 'chat-result ai'" v-for="(result, index) in results" :key="index">
        <div class="chat-result-body">
          <div class="chat-date">{{ result.date }}</div>
          <div v-if="result.role === 'user'">
            <span v-html="formatText(result.text)" />
          </div>
          <div v-else>
            <span v-html="result.text" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { generateClient } from 'aws-amplify/api';
import { createChatGptResult } from '@/services/appsync/graphql/mutations';

interface ChatResult {
  date: string;
  text: string;
  role: 'user' | 'ai';
}

interface ChatApiResponse {
  choices?: Array<{ message?: { content?: string } }>;
}

const props = defineProps<{ username: string }>();
const config = useRuntimeConfig();
const client = generateClient();

const modelName = computed(() => config.public.chatGptModel || 'gpt-4o-mini');
const inputText = ref('');
const results = ref<ChatResult[]>([]);
const isLoading = ref(false);

const isInputValid = computed(() => inputText.value.trim().length > 0);

const formatText = (text: string) => {
  return text.replace(/\n/g, '<br>');
};

const renderText = async (text: string) => {
  const rendered = formatText(text);
  const chars = rendered.split('');
  const typeSpeed = 35;
  let index = 0;

  await new Promise<void>((resolve) => {
    const timer = window.setInterval(() => {
      const target = results.value[0];
      if (!target || chars[index] === undefined) {
        window.clearInterval(timer);
        resolve();
        return;
      }

      target.text += chars[index];
      index += 1;
    }, typeSpeed);
  });
};

const extractResponseText = (data: ChatApiResponse): string => {
  return data.choices?.[0]?.message?.content ?? '';
};

const generateResponse = async () => {
  if (!isInputValid.value || isLoading.value) {
    return;
  }

  isLoading.value = true;
  try {
    const apiUrl = config.public.chatGptApiUrl;
    const apiKey = config.public.chatGptApiKey;
    if (!apiUrl || !apiKey) {
      throw new Error('CHAT_GPT_API_URL または CHATGPT_API_KEY が未設定です');
    }

    const questionText = inputText.value.trim();
    const questionDate = new Date().toLocaleString();
    results.value.unshift({ date: questionDate, text: questionText, role: 'user' });
    inputText.value = '';

    const data = await $fetch<ChatApiResponse>(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: {
        model: modelName.value,
        messages: [
          {
            role: 'user',
            content: questionText,
          },
        ],
      },
    });

    const aiText = extractResponseText(data);
    const responseDate = new Date().toLocaleString();
    results.value.unshift({ date: responseDate, text: '', role: 'ai' });
    await renderText(aiText);

    await client.graphql({
      query: createChatGptResult,
      variables: {
        user: props.username,
        input: questionText,
        output: aiText,
        createdat: responseDate,
      },
      authMode: 'apiKey',
    });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'エラーが発生しました';
    alert(message);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.chat-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  padding: 20px 12px 28px;
  background:
    radial-gradient(circle at 10% 13%, rgba(31, 225, 255, 0.18), transparent 33%),
    radial-gradient(circle at 88% 80%, rgba(255, 169, 37, 0.18), transparent 38%),
    linear-gradient(140deg, #0a162c, #0f1623 56%, #171414 100%);
}

.chat-ambient {
  position: absolute;
  border-radius: 999px;
  filter: blur(2px);
  animation: float 10s ease-in-out infinite;
}

.ambient-a {
  width: 320px;
  height: 320px;
  left: -90px;
  top: -80px;
  background: radial-gradient(circle at 35% 35%, rgba(31, 225, 255, 0.3), rgba(31, 225, 255, 0.03) 70%);
}

.ambient-b {
  width: 280px;
  height: 280px;
  right: -70px;
  bottom: -70px;
  animation-delay: -3s;
  background: radial-gradient(circle at 34% 30%, rgba(255, 182, 67, 0.3), rgba(255, 182, 67, 0.03) 72%);
}

.chat-shell {
  position: relative;
  width: min(980px, 100%);
  margin: 0 auto;
  z-index: 1;
}

.chat-title {
  margin: 0 0 12px;
  text-align: center;
}

.chat-title a {
  color: #fff;
  text-decoration: none;
  font-size: clamp(1.5rem, 4vw, 2.4rem);
}

.chat-panel {
  border-radius: 18px;
  border: 1px solid rgba(167, 214, 255, 0.22);
  background: linear-gradient(145deg, rgba(7, 26, 56, 0.72), rgba(14, 17, 23, 0.74));
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.3);
  padding: 16px;
  margin-bottom: 16px;
  animation: fade-up 0.7s ease-out;
}

.model-label {
  text-align: left;
  color: rgba(216, 233, 255, 0.92);
  margin: 0 0 8px;
}

.chat-textarea {
  width: 100%;
  min-height: 95px;
  border-radius: 12px;
  border: 1px solid rgba(151, 209, 255, 0.36);
  background: rgba(8, 19, 37, 0.74);
  color: #eef6ff;
  padding: 10px 12px;
}

.chat-textarea:focus {
  outline: none;
  border-color: rgba(123, 222, 255, 0.95);
  box-shadow: 0 0 0 3px rgba(78, 154, 255, 0.24);
}

.chat-button {
  border: none;
  border-radius: 12px;
  color: #fff;
  font-weight: 700;
  padding: 0.6rem 1rem;
  background: linear-gradient(112deg, #00b8f5, #3a67ff);
  box-shadow: 0 10px 20px rgba(49, 113, 255, 0.28);
  transition: transform 0.25s ease, filter 0.25s ease;
}

.chat-button:hover {
  transform: translateY(-2px);
  filter: saturate(1.08);
}

.chat-button.disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.chat-result {
  border-radius: 14px;
  max-width: 980px;
  margin: 0 auto 12px;
  padding: 14px;
  border: 1px solid rgba(171, 216, 255, 0.22);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.24);
  animation: fade-up 0.52s ease-out;
}

.chat-result.user {
  background: linear-gradient(145deg, rgba(22, 71, 128, 0.64), rgba(17, 29, 45, 0.7));
  color: #edf7ff;
}

.chat-result.ai {
  background: linear-gradient(145deg, rgba(30, 98, 88, 0.62), rgba(16, 29, 27, 0.72));
  color: #ecfff8;
}

.chat-result-body {
  text-align: left;
}

.chat-date {
  font-size: 0.82rem;
  opacity: 0.85;
  margin-bottom: 7px;
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

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(9px, -10px) scale(1.04);
  }
}
</style>
