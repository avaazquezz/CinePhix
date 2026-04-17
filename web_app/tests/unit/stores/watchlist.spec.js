import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useWatchlistStore } from '@/stores/watchlist'

vi.mock('@/api/client', () => ({
  watchlistApi: {
    getAll: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
    reorder: vi.fn(),
  },
}))

import { watchlistApi } from '@/api/client'

describe('useWatchlistStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('starts with empty watchlist', () => {
      const store = useWatchlistStore()
      expect(store.items).toEqual([])
      expect(store.isLoading).toBe(false)
      expect(store.error).toBe(null)
      expect(store.isEmpty).toBe(true)
      expect(store.count).toBe(0)
    })
  })

  describe('fetchWatchlist', () => {
    it('fetches and sets watchlist items', async () => {
      const store = useWatchlistStore()
      const mockItems = [
        { id: '1', tmdb_id: 27205, media_type: 'movie' },
        { id: '2', tmdb_id: 1396, media_type: 'tv' },
      ]

      watchlistApi.getAll.mockResolvedValue({ data: mockItems })

      await store.fetchWatchlist()

      expect(store.items).toEqual(mockItems)
      expect(store.isLoading).toBe(false)
      expect(store.count).toBe(2)
    })

    it('sets error on failure', async () => {
      const store = useWatchlistStore()
      watchlistApi.getAll.mockRejectedValue({
        response: { data: { detail: 'Unauthorized' } },
      })

      await store.fetchWatchlist()

      expect(store.items).toEqual([])
      expect(store.error).toBe('Unauthorized')
    })
  })

  describe('addItem', () => {
    it('adds item to watchlist successfully', async () => {
      const store = useWatchlistStore()
      const newItem = { id: '1', tmdb_id: 27205, media_type: 'movie' }

      watchlistApi.add.mockResolvedValue({ data: newItem })

      const result = await store.addItem(27205, 'movie')

      expect(result.success).toBe(true)
      expect(store.items).toContainEqual(newItem)
    })

    it('returns error when adding fails', async () => {
      const store = useWatchlistStore()
      watchlistApi.add.mockRejectedValue({
        response: { data: { detail: 'Already in watchlist' } },
      })

      const result = await store.addItem(27205, 'movie')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Already in watchlist')
    })
  })

  describe('removeItem', () => {
    it('removes item from watchlist', async () => {
      const store = useWatchlistStore()
      store.items = [{ id: '1', tmdb_id: 27205, media_type: 'movie' }]

      watchlistApi.remove.mockResolvedValue({})

      const result = await store.removeItem('1')

      expect(result.success).toBe(true)
      expect(store.items).toEqual([])
    })

    it('removes by tmdb_id and media_type', async () => {
      const store = useWatchlistStore()
      store.items = [
        { id: '1', tmdb_id: 27205, media_type: 'movie' },
        { id: '2', tmdb_id: 1396, media_type: 'tv' },
      ]

      watchlistApi.remove.mockResolvedValue({})

      const result = await store.removeByTmdbId(27205, 'movie')

      expect(result.success).toBe(true)
      expect(store.items).toHaveLength(1)
      expect(store.items[0].tmdb_id).toBe(1396)
    })
  })

  describe('hasItem', () => {
    it('returns true if item is in watchlist', () => {
      const store = useWatchlistStore()
      store.items = [{ id: '1', tmdb_id: 27205, media_type: 'movie' }]

      expect(store.hasItem(27205, 'movie')).toBe(true)
      expect(store.hasItem(1396, 'tv')).toBe(false)
    })
  })

  describe('getItem', () => {
    it('returns item by tmdb_id and media_type', () => {
      const store = useWatchlistStore()
      store.items = [
        { id: '1', tmdb_id: 27205, media_type: 'movie' },
        { id: '2', tmdb_id: 1396, media_type: 'tv' },
      ]

      const item = store.getItem(27205, 'movie')
      expect(item).toEqual({ id: '1', tmdb_id: 27205, media_type: 'movie' })
    })

    it('returns undefined if not found', () => {
      const store = useWatchlistStore()
      store.items = [{ id: '1', tmdb_id: 27205, media_type: 'movie' }]

      const item = store.getItem(99999, 'movie')
      expect(item).toBeUndefined()
    })
  })

  describe('reorderItem', () => {
    it('updates item position', async () => {
      const store = useWatchlistStore()
      const updatedItem = { id: '1', tmdb_id: 27205, media_type: 'movie', position: 5 }

      store.items = [{ id: '1', tmdb_id: 27205, media_type: 'movie', position: 0 }]
      watchlistApi.reorder.mockResolvedValue({ data: updatedItem })

      const result = await store.reorderItem('1', 5)

      expect(result.success).toBe(true)
      expect(store.items[0].position).toBe(5)
    })
  })

  describe('clear', () => {
    it('clears all items and errors', () => {
      const store = useWatchlistStore()
      store.items = [{ id: '1' }]
      store.error = 'Some error'

      store.clear()

      expect(store.items).toEqual([])
      expect(store.error).toBe(null)
    })
  })
})