<template>
  <div class="submitted">
    <h1>メール送信完了</h1>
    <h2>AmazonSESでメールを送信しました。<br>送信内容をご確認ください。</h2>
    <nuxt-link
      to="/"
      class="submitted-link"
    >
      TOPへ戻る
    </nuxt-link>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Submitted',
})
</script>

<style scoped>
.submitted {
  margin: 1.8rem;
  text-align: center;
  animation: fade-up 0.6s ease-out;
}

.submitted h1 {
  margin: 0;
  font-size: 1.8rem;
  color: #ffffff;
}

.submitted h2 {
  margin: 0.8rem 0 1.2rem;
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(218, 234, 255, 0.94);
}

.submitted-link {
  display: inline-block;
  margin-top: 0.4rem;
  padding: 0.75rem 1.3rem;
  border-radius: 999px;
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  background: linear-gradient(110deg, #00bd9d, #1d7dff);
  box-shadow: 0 10px 20px rgba(29, 125, 255, 0.3);
}

.submitted-link:hover {
  filter: saturate(1.08);
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
