<template>
  <div class="form-wrapper">
    <Signupped v-if="isSignupped" />
    <div v-if="!isSignupped">
      <h1><b>Activate</b></h1>
      <h2>ActivateCodeを入力してユーザ登録を完了してください</h2>
      <div class="form-item">
        <label for="email"></label>
        <input type="email" name="email" required="required" placeholder="Email Address" v-model="email" >
        <Error v-if="params.email.$dirty && params.email.$anyInvalid" :message="params.email.format.$message" />
      </div>
      <div class="form-item">
        <label for="password"></label>
        <input type="password" name="password" required="required" placeholder="ActivateCode" v-model="activatecode">
        <Error v-if="params.activatecode.$dirty && params.activatecode.$anyInvalid" :message="params.activatecode.$message" />
      </div>
      <div class="button-panel">
        <button class="activate-button" @click="activate" >Activate</button>
      </div>
      <div class="form-footer">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext, ref } from '@nuxtjs/composition-api'
import { useValidation } from 'vue-composable'
import Signupped from '@/components/inquiry/Signupped.vue'
import Error from '@/components/inquiry/Error.vue'
import { CognitoUserPool,CognitoUser } from 'amazon-cognito-identity-js'

export default defineComponent({
  name: 'Signup',
  props: {
    signname: String,
  },
  components: {
    Signupped,
    Error,
  },
  setup(props) {
    let _email = props.signname
    const email = ref(_email)
    const activatecode = ref('')
    const isSignupped = ref(false)

    const required = (value: string | null | undefined): Boolean => !!value
    const mailAdressFormat = (value: string | null | undefined): Boolean =>
        value ? !!value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) : true
    const params = useValidation({
      email: {
        $value: email,
        required,
        format: {
          $validator: mailAdressFormat,
          $message: 'メールアドレスの形式が不正です',
        },
      },
      activatecode: {
        $value: activatecode,
        required,
        $message: 'ActivateCodeを入力してください',
      },
    })

    const activate = async (): Promise<any> => {
      try{
        if (!params.$anyInvalid) {
          // // 初期化
          const userPool = new CognitoUserPool({
            UserPoolId: process.env.AWS_COGNITO_USERPOOLID || "",
            ClientId: process.env.AWS_COGNITO_USERPOOLWEBCLIENTID || ""
          })

          const cognitoUser = new CognitoUser({
            Username : email.value || "",
            Pool : userPool || ""
          })

          // アクティベーション処理
          cognitoUser.confirmRegistration(activatecode.value, true, function(err, result){
            if (err) {
              // アクティベーション失敗の場合、エラーメッセージを画面に表示
              if (err.message != null) {
                alert(err.message)
              }
            } else {
              console.log("success activate.... ");
              isSignupped.value = true
            }
          })
          return
        } else {
          alert("入力項目にエラーが存在します")
          return await params.$touch()
        }
      }catch(error){
        alert(error)
        console.log('error activate:', error);
      }
    }

    return {
      email,
      activatecode,
      params,
      activate,
      isSignupped,
      props
    }
  },
})
</script>
