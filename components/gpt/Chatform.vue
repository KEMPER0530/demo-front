<template>
  <div class="chat-page">
    <div class="chat-ambient ambient-a" />
    <div class="chat-ambient ambient-b" />
    <div class="chat-shell">
      <h1 class="chat-title"><nuxt-link to="/">OpenAI デモ</nuxt-link></h1>
      <div class="chat-panel">
        <p class="model-label">model: {{ modelName }}</p>
        <div class="mb-4">
          <textarea class="chat-textarea" v-model="inputText" placeholder="Send a message..."></textarea>
        </div>
        <div class="text-center">
          <button v-if="!isLoading" :disabled="!isInputValid()" :class="!isInputValid() ? 'chat-button disabled' : 'chat-button'" @click="generateResponse">Generate Response</button>
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

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import { defineComponent, ref } from '@nuxtjs/composition-api';
import {API, graphqlOperation} from 'aws-amplify'
import { createChatGptResult } from '@/src/graphql/mutations';

export default defineComponent({
  name: 'ChatGptComponent',
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const modelName = ref(process.env.CHAT_GPT_MODEL)
    const inputText = ref('');
    const results = ref<{ date: string; text: string; role: string }[]>([]);
    const isLoading = ref(false);

    const isInputValid = () => {
      return inputText.value.trim().length > 0;
    };

    const formatText = (text: string) => {
      return text.replace(/\n/g, '<br>');
    };

    const renderText = async (text: string) => {
      const typeContent = text.replace(/\n/g, '<br>');
      const typeSprit = typeContent.split('');
      const typeSpeed = 50;
      let typeLength = 0;

      return new Promise((resolve) => {
        const typeInterval = setInterval(() => {
          if (typeSprit[typeLength] == undefined) {
            clearInterval(typeInterval);
            resolve('');
          } else {
            results.value[0].text += typeSprit[typeLength];
            typeLength++;
          }
        }, typeSpeed);
      });
    };

    const generateResponse = async () => {
      isLoading.value = true;
      try {
        const questionText = inputText.value;
        const questionDate = new Date().toLocaleString();
        const userName = props.username;
        results.value.unshift({ date: questionDate, text: questionText, role: 'user' });
        inputText.value = ''

        const { data } = await axios.post(
          `${process.env.CHAT_GPT_API_URL}`,
          {
            model: modelName.value,
            messages: [
              {
                role: 'user',
                content: questionText,
              },
            ],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`,
            },
          }
        );

        const text = data.choices[0].message.content;
        const date = new Date().toLocaleString();
        results.value.unshift({ date, text: '', role: 'ai' });
        await renderText(text);

        // GraphQLへ送信
        const result = await API.graphql(graphqlOperation(createChatGptResult, {
          user: userName,
          input: questionText,
          output: text,
          createdat: date
        }));

        // @ts-ignore
        console.log(result.data.createChatGptResult.response)

      } catch (error) {
        console.error(error);
        alert('エラーが発生しました.consoleを確認ください.');
      } finally {
        isLoading.value = false;
      }
    };

    return { modelName, inputText, results, isInputValid, formatText, generateResponse, isLoading };
  },
});
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
