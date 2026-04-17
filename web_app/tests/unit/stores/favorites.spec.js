import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFavoritesStore } from '@/stores/favorites'

vi.mock('@/api/client', () => ({
  favoritesApi: {
    getAll: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
  },
}))

import { favoritesApi } from '@/api/client'

describe('useFavoritesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('starts with empty favorites', () => {
      const store = useFavoritesStore()
      expect(store.items).toEqual([])
      expect(store.isLoading).toBe(false)
      expect(store.error).toBe(null)
      expect(store.isEmpty).toBe(true)
      expect(store.count).toBe(0)
    })
  })

  describe('fetchFavorites', () => {
    it('fetches and sets favorite items', async () => {
      const store = useFavoritesStore()
      const mockItems = [
        { id: '1', tmdb_id: 27205, media_type: 'movie' },
        { id: '2', tmdb_id: 1396, media_type: 'tv' },
      ]

      favoritesApi.getAll.mockResolvedValue({ data: mockItems })

      await store.fetchFavorites()

      expect(store.items).toEqual(mockItems)
      expect(store.count).toBe(2)
    })

    it('sets error on failure', async () => {
      const store = useFavoritesStore()
      favoritesApi.getAll.mockRejectedValue({
        response: { data: { detail: 'Unauthorized' } },
      })

      await store.fetchFavorites()

      expect(store.items).toEqual([])
      expect(store.error).toBe('Unauthorized')
    })
  })

  describe('addItem', () => {
    it('adds item to favorites successfully', async () => {
      const store = useFavoritesStore()
      const newItem = { id: '1', tmdb_id: 27205, media_type: 'movie' }

      favoritesApi.add.mockResolvedValue({ data: newItem })

      const result = await store.addItem(27205, 'movie')

      expect(result.success).toBe(true)
      expect(store.items).toContainEqual(newItem)
    })
  })

  describe('removeItem', () => {
    it('removes item from favorites', async () => {
      const store = useFavoritesStore()
      store.items = [{ id: '1', tmdb_id: 27205, media_type: 'movie' }]

      favoritesApi.remove.mockResolvedValue({})

      const result = await store.removeItem('1')

      expect(result.success).toBe(true)
      expect(store.items).toEqual([])
    })
  })

  describe('toggleFavorite', () => {
    it('removes item if already favorited', async () => {
      const store = useFavoritesStore()
      store.items = [{ id: '1', tmdb_id: 27205, media_type: 'movie' }]
      favoritesApi.remove.mockResolvedValue({})

      const result = await store.toggleFavorite(27205, 'movie')

      expect(result.success).toBe(true)
      expect(favoritesApi.remove).toHaveBeenCalledWith('1')
    })

    it('adds item if not favorited', async () => {
      const store = useFavoritesStore()
      const newItem = { id: '1', tmdb_id: 27205, media_type: 'movie' }
      favoritesApi.add.mockResolvedValue({ data: newItem })

      const result = await store.toggleFavorite(27205, 'movie')

      expect(result.success).toBe(true)
      expect(favoritesApi.add).toHaveBeenCalledWith({ tmdb_id: 27205, media_type: 'movie' })
    })
  })

  describe('hasItem', () => {
    it('returns true if item is favorited', () => {
      const store = useFavoritesStore()
      store.items = [{ id: '1', tmdb_id: 27205, media_type: 'movie' }]

      expect(store.hasItem(27205, 'movie')).toBe(true)
      expect(store.hasItem(1396, 'tv')).toBe(false)
    })
  })

  describe('getItem', () => {
    it('returns item by tmdb_id and media_type', () => {
      const store = useFavoritesStore()
      store.items = [{ id: '1', tmdb_id: 27205, media_type: 'movie' }]

      const item = store.getItem(27205, 'movie')
      expect(item).toEqual({ id: '1', tmdb_id: 27205, media_type: 'movie' })
    })
  })

  describe('clear', () => {
    it('clears all items and errors', () => {
      const store = useFavoritesStore()
      store.items = [{ id: '1' }]
      store.error = 'Some error'

      store.clear()

      expect(store.items).toEqual([])
      expect(store.error).toBe(null)
    })
  })
})