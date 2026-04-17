/**
 * Favorites Store - Manages user's favorite movies/TV shows synced with backend
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { favoritesApi } from '@/api/client'

export const useFavoritesStore = defineStore('favorites', () => {
  // State
  const items = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const count = computed(() => items.value.length)
  const movieItems = computed(() => items.value.filter((i) => i.media_type === 'movie'))
  const tvItems = computed(() => items.value.filter((i) => i.media_type === 'tv'))
  const isEmpty = computed(() => items.value.length === 0)

  // Check if item is favorited
  function hasItem(tmdbId, mediaType) {
    return items.value.some((i) => i.tmdb_id === tmdbId && i.media_type === mediaType)
  }

  // Get item by tmdb id and type
  function getItem(tmdbId, mediaType) {
    return items.value.find((i) => i.tmdb_id === tmdbId && i.media_type === mediaType)
  }

  // Fetch favorites from backend
  async function fetchFavorites() {
    isLoading.value = true
    error.value = null

    try {
      const response = await favoritesApi.getAll()
      items.value = response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to load favorites'
      items.value = []
    } finally {
      isLoading.value = false
    }
  }

  // Add item to favorites
  async function addItem(tmdbId, mediaType) {
    error.value = null

    try {
      const response = await favoritesApi.add({
        tmdb_id: tmdbId,
        media_type: mediaType,
      })
      items.value.push(response.data)
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to add to favorites'
      return { success: false, error: error.value }
    }
  }

  // Remove item from favorites
  async function removeItem(favoriteId) {
    error.value = null

    try {
      await favoritesApi.remove(favoriteId)
      items.value = items.value.filter((i) => i.id !== favoriteId)
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to remove from favorites'
      return { success: false, error: error.value }
    }
  }

  // Remove by tmdb id and type
  async function removeByTmdbId(tmdbId, mediaType) {
    const item = getItem(tmdbId, mediaType)
    if (item) {
      return removeItem(item.id)
    }
    return { success: false, error: 'Item not found' }
  }

  // Toggle favorite (add if not exists, remove if exists)
  async function toggleFavorite(tmdbId, mediaType) {
    const existing = getItem(tmdbId, mediaType)
    if (existing) {
      return removeItem(existing.id)
    } else {
      return addItem(tmdbId, mediaType)
    }
  }

  // Clear favorites (local only)
  function clear() {
    items.value = []
    error.value = null
  }

  // Clear error
  function clearError() {
    error.value = null
  }

  return {
    // State
    items,
    isLoading,
    error,
    // Getters
    count,
    movieItems,
    tvItems,
    isEmpty,
    // Helpers
    hasItem,
    getItem,
    // Actions
    fetchFavorites,
    addItem,
    removeItem,
    removeByTmdbId,
    toggleFavorite,
    clear,
    clearError,
  }
})