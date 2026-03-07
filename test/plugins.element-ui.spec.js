const mockUse = jest.fn()
const mockElementUi = { install: jest.fn() }
const mockLocale = { name: 'ja' }

jest.mock('vue', () => ({
  use: mockUse
}))
jest.mock('element-ui', () => mockElementUi)
jest.mock('element-ui/lib/locale/lang/ja', () => mockLocale)

describe('plugins/element-ui', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  test('registers element-ui plugin with japanese locale', () => {
    require('@/plugins/element-ui')
    expect(mockUse).toHaveBeenCalledTimes(1)
    expect(mockUse).toHaveBeenCalledWith(mockElementUi, { locale: mockLocale })
  })
})
