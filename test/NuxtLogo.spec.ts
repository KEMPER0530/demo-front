import { mount } from '@vue/test-utils'
// @ts-ignore
import NuxtLogo from '@/components/NuxtLogo.vue'

// @ts-ignore
describe('NuxtLogo', () => {
  // @ts-ignore
  test('is a Vue instance', () => {
    const wrapper = mount(NuxtLogo)
    // @ts-ignore
    expect(wrapper.vm).toBeTruthy()
  })
})
