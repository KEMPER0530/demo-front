<template>
  <div class="signupped">
    <h1>ユーザ登録完了</h1>
    <NuxtLink to="/signin" class="signupped-link">
      Sign Inへ進む
    </NuxtLink>
  </div>
</template>

<style scoped>
.signupped {
  margin: 1.8rem;
  text-align: center;
  animation: fade-up 0.6s ease-out;
}

.signupped h1 {
  margin: 0;
  font-size: 1.8rem;
  color: #ffffff;
}

.signupped-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.3rem;
  border-radius: 999px;
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  background: linear-gradient(110deg, #00b496, #2d67ff);
  box-shadow: 0 10px 20px rgba(45, 103, 255, 0.3);
}

.signupped-link:hover {
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
