<template>
  <div>
    <h1 class="my-3 text-center text-3xl font-semibold text-gray-700"><nuxt-link to="/">OpenAI デモ</nuxt-link></h1>
    <div class="bg-gray-200 p-4 rounded-lg max-w-screen-md mx-auto">
        <div class="mb-4">
          <textarea class="p-2 border rounded w-full text-black" v-model="inputText"></textarea>
        </div>
        <div class="text-center">
          <button class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600" @click="generateResponse">Generate Response</button>
        </div>
    </div>
    <div :class="result.role === 'user' ? 'bg-blue-50 p-4 rounded-lg max-w-screen-md mx-auto shadow mb-4' : 'bg-green-50 p-4 rounded-lg max-w-screen-md mx-auto shadow mb-4'" v-for="(result, index) in results" :key="index">
      <div class="text-left text-gray-700">
        <div class="text-sm text-gray-500 mb-2">{{ result.date }}</div>
        <div v-if="result.role === 'user'">
          <strong>You:</strong> {{ result.text }}
        </div>
        <div v-else>
          <strong>AI:</strong> {{ result.text }}
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
    const inputText = ref('');
    const results = ref<{ date: string; text: string; role: string }[]>([]);

    const generateResponse = async () => {
      try {
        const questionText = inputText.value;
        const questionDate = new Date().toLocaleString();
        results.value.unshift({ date: questionDate, text: questionText, role: 'user' });

        const { data } = await axios.post(
          `${process.env.CHAT_GPT_API_URL}`,
          {
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'user',
                content: inputText.value,
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
        results.value.unshift({ date, text, role: 'ai' });
      } catch (error) {
        alert(error);
      }
    };

    return { inputText, results, generateResponse };
  },
});
</script>
