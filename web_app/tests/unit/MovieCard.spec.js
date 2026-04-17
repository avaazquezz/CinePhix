import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MovieCard from '@/components/MovieCard.vue'

// Mock stores for component
vi.mock('@/stores/watchlist', () => ({
  useWatchlistStore: () => ({
    hasItem: vi.fn(() => false),
    addItem: vi.fn(() => Promise.resolve({ success: true })),
    removeByTmdbId: vi.fn(() => Promise.resolve({ success: true })),
  }),
}))

vi.mock('@/stores/favorites', () => ({
  useFavoritesStore: () => ({
    hasItem: vi.fn(() => false),
    toggleFavorite: vi.fn(() => Promise.resolve({ success: true })),
  }),
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    isAuthenticated: false,
    user: null,
    logout: vi.fn(),
  }),
}))

describe('MovieCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders title correctly', () => {
    const wrapper = mount(MovieCard, {
      props: {
        id: 27205,
        title: 'Inception',
        image: 'https://example.com/poster.jpg',
        mediaType: 'movie',
        rating: 8.5,
      },
    })

    expect(wrapper.find('.title').text()).toBe('Inception')
  })

  it('renders movie media type', () => {
    const wrapper = mount(MovieCard, {
      props: {
        id: 27205,
        title: 'Inception',
        image: 'https://example.com/poster.jpg',
        mediaType: 'movie',
      },
    })

    expect(wrapper.find('.media-type').text()).toBe('movie')
  })

  it('renders TV media type', () => {
    const wrapper = mount(MovieCard, {
      props: {
        id: 1396,
        title: 'Breaking Bad',
        image: 'https://example.com/poster.jpg',
        mediaType: 'tv',
      },
    })

    expect(wrapper.find('.media-type').text()).toBe('tv')
  })

  it('shows rating when provided', () => {
    const wrapper = mount(MovieCard, {
      props: {
        id: 27205,
        title: 'Inception',
        image: 'https://example.com/poster.jpg',
        mediaType: 'movie',
        rating: 8.5,
      },
    })

    const ratingEl = wrapper.find('.rating')
    expect(ratingEl.text()).toContain('8.5')
  })

  it('shows N/A when no rating', () => {
    const wrapper = mount(MovieCard, {
      props: {
        id: 27205,
        title: 'Inception',
        image: 'https://example.com/poster.jpg',
        mediaType: 'movie',
      },
    })

    expect(wrapper.find('.rating').text()).toContain('N/A')
  })

  it('has poster wrapper element', () => {
    const wrapper = mount(MovieCard, {
      props: {
        id: 27205,
        title: 'Inception',
        image: 'https://example.com/poster.jpg',
        mediaType: 'movie',
      },
    })

    expect(wrapper.find('.poster-wrapper').exists()).toBe(true)
  })

  it('has watchlist button', () => {
    const wrapper = mount(MovieCard, {
      props: {
        id: 27205,
        title: 'Inception',
        image: 'https://example.com/poster.jpg',
        mediaType: 'movie',
      },
    })

    expect(wrapper.find('.watchlist-btn').exists()).toBe(true)
  })

  it('has favorite button', () => {
    const wrapper = mount(MovieCard, {
      props: {
        id: 27205,
        title: 'Inception',
        image: 'https://example.com/poster.jpg',
        mediaType: 'movie',
      },
    })

    expect(wrapper.find('.favorite-btn').exists()).toBe(true)
  })
})