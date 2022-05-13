<template>
  <div class="form-wrapper">
    <h1><b>Sign In</b></h1>
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
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    _email: {
      type: String,
      required: false,
      default: '',
    },
    _password: {
      type: String,
      required: false,
      default: '',
    },
  },
  data: (props: any) => ({
    email: props._email,
    password: props._password,
  }),
  head() {
    return {
    }
  },
  methods: {
    async signin() {
      // try {
        // @ts-ignore
        const username = this.email;
        // @ts-ignore
        const password  = this.password;
        await this.$auth.loginWith('cognito', {
          data: {
            username,
            password,
          }
        }).then((success) => {
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
