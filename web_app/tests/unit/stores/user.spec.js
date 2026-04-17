import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'

vi.mock('@/api/client', () => ({
  usersApi: {
    getPreferences: vi.fn(),
    updatePreferences: vi.fn(),
  },
}))

import { usersApi } from '@/api/client'

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('starts with null preferences', () => {
      const store = useUserStore()
      expect(store.preferences).toBe(null)
      expect(store.isLoading).toBe(false)
      expect(store.error).toBe(null)
    })

    it('has correct default getters', () => {
      const store = useUserStore()
      expect(store.favoriteGenres).toEqual([])
      expect(store.preferredDecade).toBe(null)
      expect(store.excludedGenres).toEqual([])
      expect(store.minRating).toBe(null)
      expect(store.language).toBe('en')
      expect(store.hasPreferences).toBe(false)
    })
  })

  describe('fetchPreferences', () => {
    it('fetches and sets preferences', async () => {
      const store = useUserStore()
      const mockPrefs = {
        favorite_genres: ['Action', 'Sci-Fi'],
        preferred_decade: '2010s',
        min_rating: 7.0,
        language: 'es',
      }

      usersApi.getPreferences.mockResolvedValue({ data: mockPrefs })

      await store.fetchPreferences()

      expect(store.preferences).toEqual(mockPrefs)
      expect(store.favoriteGenres).toEqual(['Action', 'Sci-Fi'])
      expect(store.preferredDecade).toBe('2010s')
      expect(store.minRating).toBe(7.0)
      expect(store.language).toBe('es')
    })

    it('sets default preferences on error', async () => {
      const store = useUserStore()
      usersApi.getPreferences.mockRejectedValue({
        response: { data: { detail: 'Unauthorized' } },
      })

      await store.fetchPreferences()

      expect(store.preferences).toEqual({
        favorite_genres: [],
        preferred_decade: null,
        exclude_genres: [],
        min_rating: null,
        language: 'en',
        extra: {},
      })
      expect(store.error).toBe('Unauthorized')
    })
  })

  describe('updatePreferences', () => {
    it('updates preferences successfully', async () => {
      const store = useUserStore()
      store.preferences = { favorite_genres: [], language: 'en' }

      const updatedPrefs = { favorite_genres: ['Drama'], language: 'es' }
      usersApi.updatePreferences.mockResolvedValue({ data: updatedPrefs })

      const result = await store.updatePreferences({ favorite_genres: ['Drama'] })

      expect(result.success).toBe(true)
      expect(store.preferences.favorite_genres).toEqual(['Drama'])
    })

    it('returns error on failure', async () => {
      const store = useUserStore()
      usersApi.updatePreferences.mockRejectedValue({
        response: { data: { detail: 'Update failed' } },
      })

      const result = await store.updatePreferences({ language: 'fr' })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Update failed')
    })
  })

  describe('addFavoriteGenre', () => {
    it('adds genre to favorites', async () => {
      const store = useUserStore()
      store.preferences = { favorite_genres: ['Action'], language: 'en', extra: {} }
      usersApi.updatePreferences.mockResolvedValue({
        data: { favorite_genres: ['Action', 'Comedy'], language: 'en', extra: {} },
      })

      const result = await store.addFavoriteGenre('Comedy')

      expect(result.success).toBe(true)
      expect(store.favoriteGenres).toContain('Comedy')
    })

    it('does not add duplicate genre', async () => {
      const store = useUserStore()
      store.preferences = { favorite_genres: ['Action'], language: 'en', extra: {} }

      const result = await store.addFavoriteGenre('Action')

      expect(result.success).toBe(true)
      expect(usersApi.updatePreferences).not.toHaveBeenCalled()
    })
  })

  describe('removeFavoriteGenre', () => {
    it('removes genre from favorites', async () => {
      const store = useUserStore()
      store.preferences = { favorite_genres: ['Action', 'Comedy'], language: 'en', extra: {} }
      usersApi.updatePreferences.mockResolvedValue({
        data: { favorite_genres: ['Action'], language: 'en', extra: {} },
      })

      const result = await store.removeFavoriteGenre('Comedy')

      expect(result.success).toBe(true)
      expect(store.favoriteGenres).not.toContain('Comedy')
    })
  })

  describe('clear', () => {
    it('clears preferences and error', () => {
      const store = useUserStore()
      store.preferences = { some: 'data' }
      store.error = 'Some error'

      store.clear()

      expect(store.preferences).toBe(null)
      expect(store.error).toBe(null)
    })
  })
})