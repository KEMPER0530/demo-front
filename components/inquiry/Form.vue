<template>
  <div class="flex items-center min-h-screen bg-black">
    <div class="container mx-auto">
      <div class="max-w-md mx-auto my-10 bg-white p-5 rounded-md shadow-sm">
        <div class="text-center">
          <h1
            class="my-3 text-3xl font-semibold text-gray-700"
          >
            <b>メール送信デモ</b>
          </h1>
          <h3 v-if="!isSubmited" class="my-2 text-1sm font-semibold text-gray-700">To宛にメール送信します</h3>
        </div>
        <Submitted v-if="isSubmited" />
        <div v-if="!isSubmited" class="m-7">
          <form>
            <div class="mb-3">
              <Label>
                From
                <span class="text-xs text-red-500">(必須)</span>
              </Label>
              <FromInput
                v-model="from"
                :type="'text'"
                :placeholder="'from@kemper0530.com'"
              />
              <Error
                v-if="params.from.$dirty && params.from.$anyInvalid"
                :message="params.from.format.$message"
              />
            </div>
            <div class="mb-3">
              <Label>
                To <span class="text-xs text-red-500">(必須)</span>
              </Label>
              <ToInput
                v-model="to"
                :type="'text'"
                :placeholder="'to@kemper0530.com'"
              />
              <Error
                v-if="params.to.$dirty && params.to.$anyInvalid"
                :message="params.to.format.$message"
              />
            </div>
            <div class="mb-3">
              <Label>
                件名 <span class="text-xs text-red-500">(必須)</span>
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
            <div class="mb-3">
              <Label>
                お問い合わせ内容 <span class="text-xs text-red-500">(必須)</span>
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
            <div class="mb-6">
              <Button @click="onSubmit">SEND</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, useContext, ref } from '@nuxtjs/composition-api'
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
    const { $axios } = useContext()
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
                  responce: 0,
                  result: ""
                })
              )
          // @ts-ignore
          console.log(result.data.createNuxtMailToLambda.responce)
          // @ts-ignore
          if(result.data.createNuxtMailToLambda.responce === 200 ){
            isSubmited.value = true
          }else{
            // @ts-ignore
            console.log(result.data.createNuxtMailToLambda.responce + " / " + result.data.createNuxtMailToLambda.result)
            alert("メール送信に失敗しました")
          }
        return result
        } else {
          alert("入力項目にエラーが存在します")
          return await params.$touch()
        }
      }catch(error){
        console.error(error)
        alert("メール送信に失敗しました: " + error.errors[0].message)
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
