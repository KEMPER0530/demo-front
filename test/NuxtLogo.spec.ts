import { mount } from '@vue/test-utils'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '@/components/NuxtLogo.vue' or ... Remove this comment to see the full error message
import NuxtLogo from '@/components/NuxtLogo.vue'

// @ts-expect-error ts-migrate(2593) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('NuxtLogo', () => {
  // @ts-expect-error ts-migrate(2593) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('is a Vue instance', () => {
    const wrapper = mount(NuxtLogo)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(wrapper.vm).toBeTruthy()
  })
})
