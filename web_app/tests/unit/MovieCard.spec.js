import { mount } from '@vue/test-utils'
import MovieCard from '@/components/MovieCard.vue'

describe('MovieCard', () => {
  it('renders title and emits select', async () => {
    const wrapper = mount(MovieCard, { props: { title: 'Matrix', image: 'https://via.placeholder.com/150' } })
    expect(wrapper.text()).toContain('Matrix')
    await wrapper.trigger('click')
    expect(wrapper.emitted().select).toBeTruthy()
  })
})
