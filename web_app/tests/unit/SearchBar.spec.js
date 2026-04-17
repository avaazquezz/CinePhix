import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBar from '@/components/SearchBar.vue'

describe('SearchBar', () => {
  it('renders with default props', () => {
    const wrapper = mount(SearchBar, { props: { modelValue: '' } })
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('input').attributes('placeholder')).toBe('Search movies...')
    expect(wrapper.find('button').text()).toBe('Search')
  })

  it('renders with custom props', () => {
    const wrapper = mount(SearchBar, {
      props: {
        modelValue: 'test query',
        placeholder: 'Find a movie...',
        buttonLabel: 'Go',
      },
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Find a movie...')
    expect(wrapper.find('button').text()).toBe('Go')
    expect(wrapper.find('input').element.value).toBe('test query')
  })

  it('renders empty placeholder correctly', () => {
    const wrapper = mount(SearchBar, {
      props: { modelValue: '', placeholder: '' },
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('')
  })

  it('renders different button labels', () => {
    const wrapper = mount(SearchBar, {
      props: { modelValue: '', buttonLabel: 'Buscar' },
    })
    expect(wrapper.find('button').text()).toBe('Buscar')
  })

  it('renders with pre-filled value', () => {
    const wrapper = mount(SearchBar, {
      props: { modelValue: 'Matrix' },
    })
    expect(wrapper.find('input').element.value).toBe('Matrix')
  })
})