<template>
  <div>
    <h1 class="my-3 text-center text-3xl font-semibold text-gray-700"><nuxt-link to="/">OpenAI デモ</nuxt-link></h1>
    <div class="bg-gray-200 p-4 rounded-lg max-w-screen-md mx-auto">
        <p class="text-left text-gray-500">model: {{ modelName }}</p>
        <div class="mb-4">
          <textarea class="p-2 border rounded w-full text-black" v-model="inputText" placeholder="Send a message..."></textarea>
        </div>
        <div class="text-center">
          <button v-if="!isLoading" :disabled="!isInputValid()" :class="!isInputValid() ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'" class="text-white py-2 px-4 rounded-lg" @click="generateResponse">Generate Response</button>
          <div v-if="isLoading" class="loading inline-block">
            <div class="flex items-center justify-center">
              <div class="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-1"></div>
              <div class="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-1"></div>
              <div class="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-1"></div>
            </div>
          </div>
        </div>
    </div>
    <div :class="result.role === 'user' ? 'bg-blue-50 p-4 rounded-lg max-w-screen-md mx-auto shadow mb-4' : 'bg-green-50 p-4 rounded-lg max-w-screen-md mx-auto shadow mb-4'" v-for="(result, index) in results" :key="index">
      <div class="text-left text-gray-700">
        <div class="text-sm text-gray-500 mb-2">{{ result.date }}</div>
        <div v-if="result.role === 'user'">
          <span v-html="formatText(result.text)" />
        </div>
        <div v-else>
          <span v-html="result.text" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent, ref } from '@nuxtjs/composition-api';
export default defineComponent({
  name: 'ChatGptComponent',
  setup() {
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
      } catch (error) {
        alert(error);
      } finally {
        isLoading.value = false;
      }
    };

    return { modelName, inputText, results, isInputValid, formatText, generateResponse, isLoading };
  },
});
</script>
