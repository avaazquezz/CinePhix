import { mount } from '@vue/test-utils'
import SearchBar from '@/components/SearchBar.vue'

describe('SearchBar', () => {
  it('emits update and search', async () => {
    const wrapper = mount(SearchBar, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('Matrix')
    expect(wrapper.emitted()['update:modelValue'][0][0]).toBe('Matrix')
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted().search).toBeTruthy()
  })
})
