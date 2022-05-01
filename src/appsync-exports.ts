require('dotenv').config();
const awsmobile = {
    aws_project_region: process.env.AWS_APPSYNC_REIGION,
    aws_appsync_graphqlEndpoint: process.env.AWS_APPSYNC_GRAPHQL_ENDPOINT,
    aws_appsync_region: process.env.AWS_APPSYNC_REIGION,
    aws_appsync_authenticationType: process.env.AWS_APPSYNC_AUTHENTICATION_TYPE,
    aws_appsync_apiKey: process.env.AWS_APPSYNC_APIKEY
}

export default awsmobile
