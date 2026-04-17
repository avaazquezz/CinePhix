/**
 * Watchlist Store - Manages user's watchlist synced with backend
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { watchlistApi } from '@/api/client'

export const useWatchlistStore = defineStore('watchlist', () => {
  // State
  const items = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const count = computed(() => items.value.length)
  const movieItems = computed(() => items.value.filter((i) => i.media_type === 'movie'))
  const tvItems = computed(() => items.value.filter((i) => i.media_type === 'tv'))
  const isEmpty = computed(() => items.value.length === 0)

  // Check if item is in watchlist
  function hasItem(tmdbId, mediaType) {
    return items.value.some((i) => i.tmdb_id === tmdbId && i.media_type === mediaType)
  }

  // Get item by tmdb id and type
  function getItem(tmdbId, mediaType) {
    return items.value.find((i) => i.tmdb_id === tmdbId && i.media_type === mediaType)
  }

  // Fetch watchlist from backend
  async function fetchWatchlist() {
    isLoading.value = true
    error.value = null

    try {
      const response = await watchlistApi.getAll()
      items.value = response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to load watchlist'
      items.value = []
    } finally {
      isLoading.value = false
    }
  }

  // Add item to watchlist
  async function addItem(tmdbId, mediaType, notes = null) {
    error.value = null

    try {
      const response = await watchlistApi.add({
        tmdb_id: tmdbId,
        media_type: mediaType,
        notes,
      })
      items.value.push(response.data)
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to add to watchlist'
      return { success: false, error: error.value }
    }
  }

  // Remove item from watchlist
  async function removeItem(itemId) {
    error.value = null

    try {
      await watchlistApi.remove(itemId)
      items.value = items.value.filter((i) => i.id !== itemId)
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to remove from watchlist'
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

  // Reorder item position
  async function reorderItem(itemId, newPosition) {
    error.value = null

    try {
      const response = await watchlistApi.reorder(itemId, newPosition)
      const index = items.value.findIndex((i) => i.id === itemId)
      if (index !== -1) {
        items.value[index] = response.data
      }
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to reorder'
      return { success: false, error: error.value }
    }
  }

  // Clear watchlist (local only)
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
    fetchWatchlist,
    addItem,
    removeItem,
    removeByTmdbId,
    reorderItem,
    clear,
    clearError,
  }
})