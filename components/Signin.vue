<template>
  <div class="form-wrapper">
    <h1 class="auth-title"><b>Sign In</b></h1>
    <p class="auth-subtitle">アカウントでログインして、各機能をご利用ください。</p>
    <div>
      <div class="form-item">
        <label for="email"></label>
        <input type="email" name="email" required="required" placeholder="Email Address" v-model="email">
      </div>
      <div class="form-item">
        <label for="password"></label>
        <input type="password" name="password" required="required" placeholder="Password" v-model="password">
      </div>
      <div class="button-panel">
        <button class="signin-button" title="Sign In" @click="signin">Sign In</button>
      </div>
    </div>
    <div class="form-footer">
      <nuxt-link to="/signup">Create an account</nuxt-link>
      <span class="footer-divider">|</span>
      <nuxt-link to="/terms">利用規約</nuxt-link>
      <span class="footer-divider">|</span>
      <nuxt-link to="/privacy">プライバシーポリシー</nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data: () => ({
    email: '' as string,
    password: '' as string,
  }),
  head() {
    return {
    }
  },
  methods: {
    async signin() {
        const username = this.email;
        const password  = this.password;
        await this.$auth.loginWith('cognito', {
          data: {
            username,
            password,
          }
        }).then(() => {
           console.log("success sign in.... ");
           // @ts-ignore
           this.$router.push({ path: '/' });
        }).catch((error) => {
           alert(error.message);
           console.log('error signing in:', error.code + ":" + error.message + ":" + error.name);
           return;
        });
    },
  },
})
</script>
