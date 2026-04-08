<template>
  <div class="inquiry-page">
    <div class="inquiry-ambient ambient-a" />
    <div class="inquiry-ambient ambient-b" />
    <div class="inquiry-shell">
      <header class="inquiry-head">
        <div class="inquiry-head-main">
          <div>
            <h1 class="inquiry-title">
              <NuxtLink to="/">メール送信デモ</NuxtLink>
            </h1>
            <p class="inquiry-subtitle">Amazon SES 連携フォーム</p>
          </div>
          <DashboardBackLink />
        </div>
      </header>
      <Submitted v-if="isSubmited" />
      <div v-if="!isSubmited" class="inquiry-layout">
        <aside class="inquiry-side">
          <p class="side-kicker">Flow</p>
          <h2>3ステップで送信</h2>
          <ul class="steps">
            <li><span>1</span>宛先と差出人を入力</li>
            <li><span>2</span>件名と本文を記述</li>
            <li><span>3</span>送信して結果を確認</li>
          </ul>
          <div class="side-tip">
            宛先メールアドレスの形式は `example@domain.com` で入力してください。
          </div>
        </aside>
        <section class="inquiry-form-wrap">
          <form class="inquiry-form" @submit.prevent="onSubmit">
            <div class="form-row">
              <Label>
                From
                <span class="required">(必須)</span>
              </Label>
              <FromInput
                v-model="from"
                :type="'text'"
                :placeholder="'from@example.com'"
                @blur="touchedFrom = true"
              />
              <Error
                v-if="fromError"
                :message="fromError"
              />
            </div>
            <div class="form-row">
              <Label>
                To <span class="required">(必須)</span>
              </Label>
              <ToInput
                v-model="to"
                :type="'text'"
                :placeholder="'to@example.com'"
                @blur="touchedTo = true"
              />
              <Error
                v-if="toError"
                :message="toError"
              />
            </div>
            <div class="form-row">
              <Label>
                件名 <span class="required">(必須)</span>
              </Label>
              <SubjectInput
                v-model="subject"
                :type="'text'"
                :placeholder="'テストメールの件'"
                @blur="touchedSubject = true"
              />
              <Error
                v-if="subjectError"
                :message="subjectError"
              />
            </div>
            <div class="form-row">
              <Label>
                お問い合わせ内容 <span class="required">(必須)</span>
              </Label>
              <BodyInput
                v-model="body"
                :placeholder="'お問い合わせ内容です'"
                @blur="touchedBody = true"
              />
              <Error
                v-if="bodyError"
                :message="bodyError"
              />
            </div>
            <div class="submit-row">
              <Button type="submit" :disabled="isSubmitting">
                {{ isSubmitting ? '送信中...' : '送信' }}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { generateClient } from 'aws-amplify/api';
import Submitted from '@/components/inquiry/Submitted.vue';
import Label from '@/components/inquiry/Label.vue';
import FromInput from '@/components/inquiry/FromInput.vue';
import ToInput from '@/components/inquiry/ToInput.vue';
import SubjectInput from '@/components/inquiry/SubjectInput.vue';
import BodyInput from '@/components/inquiry/BodyInput.vue';
import Button from '@/components/inquiry/Button.vue';
import Error from '@/components/inquiry/Error.vue';
import { createNuxtMail } from '@/services/appsync/graphql/mutations';

const client = generateClient();

const from = ref('');
const to = ref('');
const subject = ref('');
const body = ref('');
const isSubmited = ref(false);
const isSubmitting = ref(false);

const touchedFrom = ref(false);
const touchedTo = ref(false);
const touchedSubject = ref(false);
const touchedBody = ref(false);

const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const fromError = computed(() => {
  if (!touchedFrom.value) {
    return '';
  }
  const value = from.value.trim();
  if (!value) {
    return 'メールアドレスを入力してください';
  }
  if (!emailPattern.test(value)) {
    return 'メールアドレスの形式が不正です';
  }
  return '';
});

const toError = computed(() => {
  if (!touchedTo.value) {
    return '';
  }
  const value = to.value.trim();
  if (!value) {
    return 'メールアドレスを入力してください';
  }
  if (!emailPattern.test(value)) {
    return 'メールアドレスの形式が不正です';
  }
  return '';
});

const subjectError = computed(() => {
  if (!touchedSubject.value) {
    return '';
  }
  if (!subject.value.trim()) {
    return '件名を入力してください';
  }
  return '';
});

const bodyError = computed(() => {
  if (!touchedBody.value) {
    return '';
  }
  if (!body.value.trim()) {
    return 'お問い合わせ内容を入力してください';
  }
  return '';
});

const hasInvalid = computed(() => {
  return Boolean(fromError.value || toError.value || subjectError.value || bodyError.value);
});

const resolveGraphQlError = (error: unknown): string => {
  if (typeof error === 'object' && error && 'errors' in error) {
    const errors = (error as { errors?: Array<{ message?: string }> }).errors;
    if (errors?.length && errors[0].message) {
      return errors[0].message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return '不明なエラー';
};

const onSubmit = async () => {
  touchedFrom.value = true;
  touchedTo.value = true;
  touchedSubject.value = true;
  touchedBody.value = true;

  if (hasInvalid.value) {
    alert('入力項目にエラーが存在します');
    return;
  }
  if (isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;
  try {
    const date = new Date().toLocaleString();
    const result = await client.graphql({
      query: createNuxtMail,
      variables: {
        from: from.value.trim(),
        to: to.value.trim(),
        subject: subject.value.trim(),
        body: body.value.trim(),
        createdat: date,
        updatedat: date,
      },
      authMode: 'apiKey',
    });

    const responseCode = (result as { data?: { createNuxtMail?: { response?: number; result?: string } } })
      .data?.createNuxtMail?.response;
    if (responseCode === 200) {
      isSubmited.value = true;
      return;
    }

    const responseText = (result as { data?: { createNuxtMail?: { response?: number; result?: string } } })
      .data?.createNuxtMail?.result;
    console.error('mail response error:', responseCode, responseText);
    alert('メール送信に失敗しました');
  } catch (error) {
    console.error(error);
    alert(`メール送信に失敗しました: ${resolveGraphQlError(error)}`);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.inquiry-page {
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  justify-content: center;
  padding: 24px 18px;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 12% 14%, rgba(28, 214, 255, 0.26), transparent 36%),
    radial-gradient(circle at 85% 82%, rgba(255, 153, 24, 0.26), transparent 42%),
    linear-gradient(138deg, #081224, #101626 54%, #17120f 100%);
}

.inquiry-ambient {
  position: absolute;
  border-radius: 999px;
  filter: blur(2px);
  animation: float 10s ease-in-out infinite;
}

.ambient-a {
  width: 320px;
  height: 320px;
  left: -80px;
  top: -90px;
  background: radial-gradient(circle at 38% 35%, rgba(46, 224, 255, 0.35), rgba(46, 224, 255, 0.02) 72%);
}

.ambient-b {
  width: 280px;
  height: 280px;
  right: -70px;
  bottom: -80px;
  animation-delay: -3s;
  background: radial-gradient(circle at 34% 32%, rgba(255, 178, 45, 0.35), rgba(255, 178, 45, 0.02) 72%);
}

.inquiry-shell {
  width: min(1080px, 100%);
  border-radius: 26px;
  border: 1px solid rgba(172, 218, 255, 0.23);
  background: linear-gradient(145deg, rgba(6, 22, 47, 0.78), rgba(15, 18, 24, 0.84));
  box-shadow: 0 22px 44px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  color: #eef6ff;
  position: relative;
  z-index: 1;
  animation: fade-up 0.75s ease-out;
  overflow: hidden;
}

.inquiry-head {
  padding: 22px 28px 14px;
  border-bottom: 1px solid rgba(160, 214, 255, 0.16);
  background: linear-gradient(98deg, rgba(6, 39, 83, 0.46), rgba(16, 16, 16, 0.08));
}

.inquiry-head-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.inquiry-title a {
  font-size: clamp(1.5rem, 4vw, 2.35rem);
  color: #ffffff;
  text-decoration: none;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.inquiry-subtitle {
  margin: 6px 0 0;
  color: rgba(205, 226, 252, 0.9);
  font-size: 1.04rem;
}

.inquiry-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  min-height: 560px;
}

.inquiry-side {
  padding: 24px;
  border-right: 1px solid rgba(161, 216, 255, 0.16);
  background: linear-gradient(176deg, rgba(9, 35, 72, 0.56), rgba(11, 18, 33, 0.32));
}

.side-kicker {
  margin: 0;
  color: #85d7ff;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.76rem;
}

.inquiry-side h2 {
  margin: 8px 0 18px;
  font-size: 1.36rem;
  line-height: 1.4;
}

.steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

.steps li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(214, 231, 253, 0.94);
}

.steps li span {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.84rem;
  color: #fff;
  background: linear-gradient(135deg, #12b8f8, #1a75ff);
}

.side-tip {
  margin-top: 18px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(151, 209, 255, 0.24);
  background: rgba(10, 19, 37, 0.6);
  color: rgba(210, 229, 252, 0.88);
  line-height: 1.6;
  font-size: 0.9rem;
}

.inquiry-form-wrap {
  padding: 24px 26px;
}

.inquiry-form {
  max-width: 620px;
}

.form-row {
  margin-bottom: 14px;
}

.required {
  color: #ff8996;
  font-size: 0.78rem;
  margin-left: 4px;
}

.submit-row {
  margin-top: 22px;
}

@media (max-width: 960px) {
  .inquiry-head-main {
    flex-direction: column;
  }

  .inquiry-layout {
    grid-template-columns: 1fr;
  }

  .inquiry-side {
    border-right: none;
    border-bottom: 1px solid rgba(161, 216, 255, 0.16);
  }
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
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
    transform: translate(10px, -10px) scale(1.04);
  }
}
</style>
