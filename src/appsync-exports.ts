// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config();
const awsmobile = {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    aws_project_region: process.env.AWS_APPSYNC_REIGION,
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    aws_appsync_graphqlEndpoint: process.env.AWS_APPSYNC_GRAPHQL_ENDPOINT,
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    aws_appsync_region: process.env.AWS_APPSYNC_REIGION,
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    aws_appsync_authenticationType: process.env.AWS_APPSYNC_AUTHENTICATION_TYPE,
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    aws_appsync_apiKey: process.env.AWS_APPSYNC_APIKEY
}

export default awsmobile