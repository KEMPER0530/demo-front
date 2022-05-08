const {
    AWS_APPSYNC_REIGION,
    AWS_APPSYNC_GRAPHQL_ENDPOINT,
    AWS_APPSYNC_AUTHENTICATION_TYPE,
    AWS_APPSYNC_APIKEY,
    AWS_COGNITO_REIGION,
    AWS_COGNITO_USERPOOLID,
    AWS_COGNITO_USERPOOLWEBCLIENTID,
    MODE,
    QIITA_API
} = process.env

export default {
    env: {
        AWS_APPSYNC_REIGION,
        AWS_APPSYNC_GRAPHQL_ENDPOINT,
        AWS_APPSYNC_AUTHENTICATION_TYPE,
        AWS_APPSYNC_APIKEY,
        AWS_COGNITO_REIGION,
        AWS_COGNITO_USERPOOLID,
        AWS_COGNITO_USERPOOLWEBCLIENTID,
        MODE,
        QIITA_API
    },
    // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
    ssr: false,

    // Target: https://go.nuxtjs.dev/config-target
    target: 'static',

    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        title: 'mail-form-demo-front',
        htmlAttrs: {
            lang: 'ja'
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' },
            { name: 'format-detection', content: 'telephone=no' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
        '@/assets/css/signin.scss',
        '@/assets/css/search.scss',
        'element-ui/lib/theme-chalk/index.css'
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [{ src: '@/plugins/amplify.ts', mode: 'client' },
        '~plugins/element-ui', { src: '~plugins/element-ui', ssr: false }
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // https://go.nuxtjs.dev/typescript
        '@nuxt/typescript-build',
        // https://go.nuxtjs.dev/tailwindcss
        '@nuxtjs/tailwindcss',
        '@nuxtjs/composition-api/module',
        '@nuxtjs/dotenv',
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios',
        '@nuxtjs/auth-next'
    ],
    router: {
        middleware: ['auth'],
    },
    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {},

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        extend(config: any, {
            isDev,
            isClient
        }: any) {
            config.node = {
                fs: "empty"
            };
        },
        vendor: ['axios', 'element-ui'],
    },
    auth: {
        redirect: {
            login: '/signin', // 未ログイン時に認証ルートへアクセスした際のリダイレクトURL
            logout: '/signin', // ログアウト時のリダイレクトURL
            callback: '/callback', // Oauth認証等で必要となる コールバックルート
            home: false, // ログイン後のリダイレクトURL
        },
        localStorage: false,
        strategies: {
            cognito: {
                scheme: '@a1ter/nuxt-auth-aws-cognito-scheme/scheme/scheme',
                credentials: {
                    userPoolId: process.env.AWS_COGNITO_USERPOOLID,
                    userPoolWebClientId: process.env.AWS_COGNITO_USERPOOLWEBCLIENTID,
                    region: process.env.AWS_COGNITO_REIGION
                },
                endpoints: {
                    user: false,
                },
            },
        },
    },
    storybook: {
      // 追加のアドオン
      // デフォルトではstorybook/addon-essentialsが含まれてます、含まれてるaddonは下記リンクを参照
      // https://storybook.js.org/docs/react/essentials/introduction
      addons: [],
      // storybookのポート指定
      port: 4000,
      // 背景色や表示位置、デバイスの設定など
      parameters: {
        // 背景色：デフォルトの色を使う場合
        backgrounds: {
          default: 'light', // light or dark
        },
        // Description, Default, Controlsカラムの表示
        controls: {
          expanded: true,
        },
        // 表示位置
        // centered:中央表示, padded:コンポーネントに余白付与, fullscreen:幅いっぱい
        layout: 'centered',
      },
      webpackFinal: async (config: any) => {
        // Fixes npm packages that depend on some modules
        // Important: return the modified config
        return config;
      },
    },
}
