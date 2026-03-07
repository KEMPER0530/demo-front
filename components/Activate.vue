<template>
  <div class="form-wrapper">
    <Signupped v-if="isSignupped" />
    <div v-else>
      <h1><b>Activate</b></h1>
      <h2>ActivateCodeを入力してユーザ登録を完了してください</h2>
      <form @submit.prevent="activate">
        <div class="form-item">
          <label for="activate-email" />
          <input
            id="activate-email"
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
          <label for="activate-code" />
          <input
            id="activate-code"
            v-model="activatecode"
            type="text"
            name="activatecode"
            required
            autocomplete="one-time-code"
            placeholder="ActivateCode"
            @blur="touchedCode = true"
          >
          <Error v-if="activateCodeError" :message="activateCodeError" />
        </div>
        <div class="button-panel">
          <button class="activate-button" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Activating...' : 'Activate' }}
          </button>
        </div>
      </form>
      <div class="form-footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Error from '@/components/inquiry/Error.vue';
import Signupped from '@/components/inquiry/Signupped.vue';

const props = defineProps<{ signname?: string }>();

const auth = useAuth();

const email = ref(props.signname ?? '');
const activatecode = ref('');
const isSignupped = ref(false);
const isSubmitting = ref(false);
const touchedEmail = ref(false);
const touchedCode = ref(false);

watch(
  () => props.signname,
  (value) => {
    if (value) {
      email.value = value;
    }
  },
);

const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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

const activateCodeError = computed(() => {
  if (!touchedCode.value) {
    return '';
  }
  if (!activatecode.value.trim()) {
    return 'ActivateCodeを入力してください';
  }
  return '';
});

const hasInvalid = computed(() => Boolean(emailError.value || activateCodeError.value));

const activate = async () => {
  touchedEmail.value = true;
  touchedCode.value = true;

  if (hasInvalid.value) {
    alert('入力項目にエラーが存在します');
    return;
  }

  if (isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;
  try {
    await auth.activate(email.value.trim(), activatecode.value.trim());
    isSignupped.value = true;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'アクティベーションに失敗しました';
    alert(message);
    console.error('error activate:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
