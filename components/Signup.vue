<template>
  <div class="form-wrapper">
    <Activate v-if="isSignupped" :signname="email" />
    <div v-if="!isSignupped">
      <h1><b>Sign up</b></h1>
      <div>
        <div class="form-item">
          <label for="email"></label>
          <input type="email" name="email" required="required" placeholder="Email Address" v-model="email">
          <Error v-if="params.email.$dirty && params.email.$anyInvalid" :message="params.email.format.$message" />
        </div>
        <div class="form-item">
          <label for="password"></label>
          <input type="password" name="password" required="required" placeholder="Password" v-model="password">
          <Error v-if="params.password.$dirty && params.password.$anyInvalid" :message="params.password.format.$message" />
        </div>
        <div class="button-panel">
          <button class="signup-button" @click="signup" >Sign Up</button>
        </div>
      </div>
      <div class="form-footer">
        <nuxt-link to="/auth/signin">sign in</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext, ref } from '@nuxtjs/composition-api'
import { useValidation } from 'vue-composable'
import Error from '@/components/inquiry/Error.vue'
import Activate from '@/components/Activate.vue'
import { CognitoUserPool,CognitoUserAttribute } from 'amazon-cognito-identity-js'

export default defineComponent({
  name: 'Signup',
  components: {
    Activate,
    Error,
  },
  setup() {
    const email = ref('')
    const password = ref('')
    const isSignupped = ref(false)

    const required = (value: string | null | undefined): Boolean => !!value
    const mailAdressFormat = (value: string | null | undefined): Boolean =>
        value ? !!value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) : true
    const passwordFormat = (value: string | null | undefined): Boolean =>
        value ? !!value.match(/^(?=.*?[a-z])(?=.*?\d)(?=.*?[!-\/:-@[-`{-~])[!-~]{8,30}$/i) : true
    const params = useValidation({
      email: {
        $value: email,
        required,
        format: {
          $validator: mailAdressFormat,
          $message: 'メールアドレスの形式が不正です',
        },
      },
      password: {
        $value: password,
        required,
        format: {
          $validator: passwordFormat,
          $message: 'パスワードは半角英数字記号をそれぞれ1種類以上含む8文字以上30文字以下で登録してください',
        },
      },
    })

    const signup = async (): Promise<any> => {
      try{
        if (!params.$anyInvalid) {
          // // 初期化
          const userPool = new CognitoUserPool({
            UserPoolId: process.env.AWS_COGNITO_USERPOOLID || "",
            ClientId: process.env.AWS_COGNITO_USERPOOLWEBCLIENTID || ""
          })
          // // ニックネームを登録用パラメータに整形
          const attributeList: CognitoUserAttribute[] = [];
          const attributeUserNickName = new CognitoUserAttribute({
            Name: "email",
            Value: email.value,
          });
          attributeList.push(attributeUserNickName);

          // 入力したユーザー情報をもとに登録処理を実施
          await userPool.signUp(email.value,password.value,attributeList,[],function (err,result) {
              // エラー時
              if (err) {
                alert(err)
              }else{
                // アクティベーション画面に遷移
                console.log("success sign up.... ");
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
        console.log('error sign up:', error);
      }
    }

    return {
      email,
      password,
      params,
      signup,
      isSignupped,
    }
  },
})
</script>
