import Vue from 'vue'
import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin, components } from 'aws-amplify-vue'
import awsconfig from '@/src/appsync-exports'
import Auth from '@aws-amplify/auth';

export default () => {
    Auth.configure({
        Auth: {
            region: process.env.AWS_COGNITO_REIGION,
            userPoolId: process.env.AWS_COGNITO_USERPOOLID,
            userPoolWebClientId: process.env.AWS_COGNITO_USERPOOLWEBCLIENTID,
        },
    })
}

Amplify.configure(awsconfig)

Vue.use(AmplifyPlugin, AmplifyModules)
Vue.component(components)