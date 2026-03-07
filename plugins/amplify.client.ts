import { Amplify } from 'aws-amplify';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: config.public.awsCognitoUserPoolId,
        userPoolClientId: config.public.awsCognitoUserPoolWebClientId,
        loginWith: {
          email: true,
          username: true,
        },
      },
    },
    API: {
      GraphQL: {
        endpoint: config.public.awsAppSyncGraphqlEndpoint,
        region: config.public.awsAppSyncRegion,
        defaultAuthMode: 'apiKey',
        apiKey: config.public.awsAppSyncApiKey,
      },
    },
  });
});
