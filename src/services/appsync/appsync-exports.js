export const createAppSyncConfig = (env = process.env) => ({
  aws_project_region: env.AWS_APPSYNC_REIGION,
  aws_appsync_graphqlEndpoint: env.AWS_APPSYNC_GRAPHQL_ENDPOINT,
  aws_appsync_region: env.AWS_APPSYNC_REIGION,
  aws_appsync_authenticationType: env.AWS_APPSYNC_AUTHENTICATION_TYPE,
  aws_appsync_apiKey: env.AWS_APPSYNC_APIKEY,
});

const appSyncConfig = createAppSyncConfig();

export default appSyncConfig;
