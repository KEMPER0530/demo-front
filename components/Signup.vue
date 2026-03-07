<template>
  <div class="form-wrapper">
    <Activate v-if="isSignupped" :signname="email" />
    <div v-else>
      <h1><b>Sign up</b></h1>
      <form @submit.prevent="signup">
        <div class="form-item">
          <label for="signup-email" />
          <input
            id="signup-email"
            v-model="email"
            type="email"
            name="email"
            required
            autocomplete="email"
            placeholder="Email Address"
            @blur="touchedEmail = true"
          >
          <Error v-if="emailError" :message="emailError" />
        </div>
        <div class="form-item">
          <label for="signup-password" />
          <input
            id="signup-password"
            v-model="password"
            type="password"
            name="password"
            required
            autocomplete="new-password"
            placeholder="Password"
            @blur="touchedPassword = true"
          >
          <Error v-if="passwordError" :message="passwordError" />
        </div>
        <div class="button-panel">
          <button class="signup-button" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Signing Up...' : 'Sign Up' }}
          </button>
        </div>
      </form>
      <div class="form-footer">
        <NuxtLink to="/signin">sign in</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Activate from '@/components/Activate.vue';
import Error from '@/components/inquiry/Error.vue';

const auth = useAuth();

const email = ref('');
const password = ref('');
const isSignupped = ref(false);
const isSubmitting = ref(false);
const touchedEmail = ref(false);
const touchedPassword = ref(false);

const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordPattern = /^(?=.*?[a-z])(?=.*?\d)(?=.*?[!-\/:-@[-`{-~])[!-~]{8,30}$/i;

const emailError = computed(() => {
  if (!touchedEmail.value) {
    return '';
  }
  const value = email.value.trim();
  if (!value) {
    return 'メールアドレスを入力してください';
  }
  if (!emailPattern.test(value)) {
    return 'メールアドレスの形式が不正です';
  }
  return '';
});

const passwordError = computed(() => {
  if (!touchedPassword.value) {
    return '';
  }
  if (!password.value) {
    return 'パスワードを入力してください';
  }
  if (!passwordPattern.test(password.value)) {
    return 'パスワードは半角英数字記号をそれぞれ1種類以上含む8文字以上30文字以下で登録してください';
  }
  return '';
});

const hasInvalid = computed(() => Boolean(emailError.value || passwordError.value));

const signup = async () => {
  touchedEmail.value = true;
  touchedPassword.value = true;

  if (hasInvalid.value) {
    alert('入力項目にエラーが存在します');
    return;
  }

  if (isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;
  try {
    await auth.register(email.value.trim(), password.value);
    isSignupped.value = true;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'サインアップに失敗しました';
    alert(message);
    console.error('error sign up:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
