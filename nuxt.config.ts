export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: false,
  devtools: { enabled: true },
  css: ['@/assets/css/signin.scss', '@/assets/css/search.scss'],
  app: {
    head: {
      title: 'demo-front',
      htmlAttrs: {
        lang: 'ja',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  runtimeConfig: {
    public: {
      mode: process.env.MODE || 'development',
      qiitaApi: process.env.QIITA_API || '',
      awsAppSyncRegion: process.env.AWS_APPSYNC_REIGION || '',
      awsAppSyncGraphqlEndpoint: process.env.AWS_APPSYNC_GRAPHQL_ENDPOINT || '',
      awsAppSyncAuthenticationType: process.env.AWS_APPSYNC_AUTHENTICATION_TYPE || 'API_KEY',
      awsAppSyncApiKey: process.env.AWS_APPSYNC_APIKEY || '',
      awsCognitoRegion: process.env.AWS_COGNITO_REIGION || '',
      awsCognitoUserPoolId: process.env.AWS_COGNITO_USERPOOLID || '',
      awsCognitoUserPoolWebClientId: process.env.AWS_COGNITO_USERPOOLWEBCLIENTID || '',
      chatGptApiUrl: process.env.CHAT_GPT_API_URL || '',
      chatGptApiKey: process.env.CHATGPT_API_KEY || '',
      chatGptModel: process.env.CHAT_GPT_MODEL || '',
      allowedUsername: process.env.ALLOWED_USERNAME || '',
    },
  },
  modules: [],
});
