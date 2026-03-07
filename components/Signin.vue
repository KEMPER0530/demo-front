<template>
  <div class="form-wrapper">
    <h1 class="auth-title"><b>Sign In</b></h1>
    <p class="auth-subtitle">アカウントでログインして、各機能をご利用ください。</p>
    <form @submit.prevent="signin">
      <div class="form-item">
        <label for="email" />
        <input
          id="email"
          v-model="email"
          type="email"
          name="email"
          required
          autocomplete="email"
          placeholder="Email Address"
        >
      </div>
      <div class="form-item">
        <label for="password" />
        <input
          id="password"
          v-model="password"
          type="password"
          name="password"
          required
          autocomplete="current-password"
          placeholder="Password"
        >
      </div>
      <div class="button-panel">
        <button class="signin-button" type="submit" title="Sign In" :disabled="isSubmitting">
          {{ isSubmitting ? 'Signing In...' : 'Sign In' }}
        </button>
      </div>
    </form>
    <div class="form-footer">
      <NuxtLink to="/signup">Create an account</NuxtLink>
      <span class="footer-divider">|</span>
      <NuxtLink to="/terms">利用規約</NuxtLink>
      <span class="footer-divider">|</span>
      <NuxtLink to="/privacy">プライバシーポリシー</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuth();

const email = ref('');
const password = ref('');
const isSubmitting = ref(false);

const signin = async () => {
  if (isSubmitting.value) {
    return;
  }

  const username = email.value.trim();
  if (!username || !password.value) {
    alert('メールアドレスとパスワードを入力してください');
    return;
  }

  isSubmitting.value = true;
  try {
    await auth.login(username, password.value);
    await navigateTo('/');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'サインインに失敗しました';
    alert(message);
    console.error('error signing in:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
