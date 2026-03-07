const mockComponent = jest.fn()
const mockAdd = jest.fn()
const mockIconComponent = { name: 'FontAwesomeIcon' }
const mockFaEye = { iconName: 'eye' }
const mockFaEyeSlash = { iconName: 'eye-slash' }

jest.mock('vue', () => ({
  component: mockComponent
}))
jest.mock(
  '@fortawesome/vue-fontawesome',
  () => ({
    FontAwesomeIcon: mockIconComponent
  }),
  { virtual: true }
)
jest.mock(
  '@fortawesome/fontawesome-svg-core',
  () => ({
    library: { add: mockAdd }
  }),
  { virtual: true }
)
jest.mock(
  '@fortawesome/free-solid-svg-icons',
  () => ({
    faEye: mockFaEye,
    faEyeSlash: mockFaEyeSlash
  }),
  { virtual: true }
)

describe('plugins/fontawesome', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  test('registers eye icons and font-awesome component', () => {
    require('@/plugins/fontawesome')
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledWith(mockFaEye, mockFaEyeSlash)
    expect(mockComponent).toHaveBeenCalledTimes(1)
    expect(mockComponent).toHaveBeenCalledWith('font-awesome-icon', mockIconComponent)
  })
})
