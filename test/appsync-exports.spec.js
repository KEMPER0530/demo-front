jest.mock('dotenv', () => ({
  config: jest.fn()
}))

describe('appsync-exports', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    delete process.env.AWS_APPSYNC_REIGION
    delete process.env.AWS_APPSYNC_GRAPHQL_ENDPOINT
    delete process.env.AWS_APPSYNC_AUTHENTICATION_TYPE
    delete process.env.AWS_APPSYNC_APIKEY
  })

  test('reads values from environment variables', () => {
    process.env.AWS_APPSYNC_REIGION = 'ap-northeast-1'
    process.env.AWS_APPSYNC_GRAPHQL_ENDPOINT = 'https://example/graphql'
    process.env.AWS_APPSYNC_AUTHENTICATION_TYPE = 'API_KEY'
    process.env.AWS_APPSYNC_APIKEY = 'dummy-key'

    const config = require('@/src/appsync-exports').default
    const dotenv = require('dotenv')

    expect(dotenv.config).toHaveBeenCalledTimes(1)
    expect(config).toEqual({
      aws_project_region: 'ap-northeast-1',
      aws_appsync_graphqlEndpoint: 'https://example/graphql',
      aws_appsync_region: 'ap-northeast-1',
      aws_appsync_authenticationType: 'API_KEY',
      aws_appsync_apiKey: 'dummy-key'
    })
  })

  test('keeps undefined when env vars are missing', () => {
    const config = require('@/src/appsync-exports').default
    expect(config.aws_project_region).toBeUndefined()
    expect(config.aws_appsync_graphqlEndpoint).toBeUndefined()
    expect(config.aws_appsync_authenticationType).toBeUndefined()
    expect(config.aws_appsync_apiKey).toBeUndefined()
  })
})

