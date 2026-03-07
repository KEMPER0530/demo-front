const mockUse = jest.fn()
const mockComponent = jest.fn()
const mockAmplifyConfigure = jest.fn()
const mockAuthConfigure = jest.fn()

const mockAmplifyPlugin = { name: 'AmplifyPlugin' }
const mockAmplifyComponents = { name: 'AmplifyComponents' }
const mockAwsConfig = { aws_project_region: 'ap-northeast-1' }

jest.mock('vue', () => ({
  use: mockUse,
  component: mockComponent
}))
jest.mock('aws-amplify', () => ({
  __esModule: true,
  default: {
    configure: mockAmplifyConfigure
  },
  API: {
    graphql: jest.fn()
  }
}))
jest.mock('aws-amplify-vue', () => ({
  AmplifyPlugin: mockAmplifyPlugin,
  components: mockAmplifyComponents
}))
jest.mock('@/src/appsync-exports', () => ({
  __esModule: true,
  default: mockAwsConfig
}))
jest.mock('@aws-amplify/auth', () => ({
  __esModule: true,
  default: {
    configure: mockAuthConfigure
  }
}))

describe('plugins/amplify', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    process.env.AWS_COGNITO_REIGION = 'ap-northeast-1'
    process.env.AWS_COGNITO_USERPOOLID = 'pool-id'
    process.env.AWS_COGNITO_USERPOOLWEBCLIENTID = 'client-id'
  })

  test('configures amplify plugin and auth settings', () => {
    const setup = require('@/plugins/amplify').default

    expect(mockAmplifyConfigure).toHaveBeenCalledTimes(1)
    expect(mockAmplifyConfigure).toHaveBeenCalledWith(mockAwsConfig)
    expect(mockUse).toHaveBeenCalledTimes(1)
    expect(mockUse).toHaveBeenCalledWith(mockAmplifyPlugin, expect.objectContaining({ API: expect.any(Object) }))
    expect(mockComponent).toHaveBeenCalledTimes(1)
    expect(mockComponent).toHaveBeenCalledWith(mockAmplifyComponents)

    setup()

    expect(mockAuthConfigure).toHaveBeenCalledTimes(1)
    expect(mockAuthConfigure).toHaveBeenCalledWith({
      Auth: {
        region: 'ap-northeast-1',
        userPoolId: 'pool-id',
        userPoolWebClientId: 'client-id'
      }
    })
  })
})
