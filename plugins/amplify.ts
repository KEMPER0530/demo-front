import Vue from 'vue'
import Amplify, * as AmplifyModules from 'aws-amplify'
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'aws-... Remove this comment to see the full error message
import { AmplifyPlugin, components } from 'aws-amplify-vue'
import Auth from '@aws-amplify/auth';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '@/src/appsync-exports' or its ... Remove this comment to see the full error message
import awsconfig from '@/src/appsync-exports'

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