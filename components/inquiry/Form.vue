<template>
  <div class="inquiry-page">
    <div class="inquiry-ambient ambient-a" />
    <div class="inquiry-ambient ambient-b" />
    <div class="inquiry-shell">
      <header class="inquiry-head">
        <h1 class="inquiry-title">
          <nuxt-link to="/" type="String">メール送信デモ</nuxt-link>
        </h1>
        <p class="inquiry-subtitle">Amazon SES 連携フォーム</p>
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
          <form class="inquiry-form">
            <div class="form-row">
              <Label>
                From
                <span class="required">(必須)</span>
              </Label>
              <FromInput
                v-model="from"
                :type="'text'"
                :placeholder="'from@example.com'"
              />
              <Error
                v-if="params.from.$dirty && params.from.$anyInvalid"
                :message="params.from.format.$message"
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
              />
              <Error
                v-if="params.to.$dirty && params.to.$anyInvalid"
                :message="params.to.format.$message"
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
              />
              <Error
                v-if="params.subject.$dirty && params.subject.$anyInvalid"
                :message="params.subject.$message"
              />
            </div>
            <div class="form-row">
              <Label>
                お問い合わせ内容 <span class="required">(必須)</span>
              </Label>
              <BodyInput
                v-model="body"
                :type="'text'"
                :placeholder="'お問い合わせ内容です'"
              />
              <Error
                v-if="params.body.$dirty && params.body.$anyInvalid"
                :message="params.body.$message"
              />
            </div>
            <div class="submit-row">
              <Button @click="onSubmit">送信</Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { useValidation } from 'vue-composable'
import Submitted from '@/components/inquiry/Submitted.vue'
import Label from '@/components/inquiry/Label.vue'
import FromInput from '@/components/inquiry/FromInput.vue'
import ToInput from '@/components/inquiry/ToInput.vue'
import SubjectInput from '@/components/inquiry/SubjectInput.vue'
import BodyInput from '@/components/inquiry/BodyInput.vue'
import Button from '@/components/inquiry/Button.vue'
import Error from '@/components/inquiry/Error.vue'
import {API, graphqlOperation} from 'aws-amplify'
import {createNuxtMail} from '@/src/graphql/mutations'

export default defineComponent({
  name: 'Form',
  components: {
    Submitted,
    Label,
    FromInput,
    ToInput,
    SubjectInput,
    BodyInput,
    Button,
    Error,
  },
  setup() {
    const from = ref('')
    const to = ref('')
    const subject = ref('')
    const body = ref('')
    const isSubmited = ref(false)

    const required = (value: string | null | undefined): Boolean => !!value
    const mailAdressFormat = (value: string | null | undefined): Boolean =>
        value ? !!value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) : true
    const params = useValidation({
      from: {
        $value: from,
        required,
        format: {
          $validator: mailAdressFormat,
          $message: 'メールアドレスの形式が不正です',
        },
      },
      to: {
        $value: to,
        required,
        format: {
          $validator: mailAdressFormat,
          $message: 'メールアドレスの形式が不正です',
        },
      },
      subject: {
        $value: subject,
        required,
        $message: '件名を入力してください',
      },
      body: {
        $value: body,
        required,
        $message: 'お問い合わせ内容を入力してください',
      },
    })

    const onSubmit = async (): Promise<any> => {
      try{
        // graphqlへ送信
        if (!params.$anyInvalid) {
          const date = new Date().toLocaleString();
          const result = await API.graphql(
                graphqlOperation(createNuxtMail,{
                  from: from.value,
                  to: to.value,
                  subject: subject.value,
                  body: body.value,
                  createdat: date,
                  updatedat: date,
                })
              )
          // @ts-ignore
          console.log(result.data.createNuxtMail.response)
          // @ts-ignore
          if(result.data.createNuxtMail.response === 200 ){
            isSubmited.value = true
          }else{
            // @ts-ignore
            console.log(result.data.createNuxtMail.response + " : " + result.data.createNuxtMail.result)
            alert("メール送信に失敗しました")
          }
        return result
        } else {
          alert("入力項目にエラーが存在します")
          return await params.$touch()
        }
      }catch(error){
        console.error(error)
        alert("メール送信に失敗しました: " + (error as any).errors[0].message)
      }
    }

    return {
      from,
      to,
      subject,
      body,
      isSubmited,
      params,
      onSubmit,
    }
  },
})
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
