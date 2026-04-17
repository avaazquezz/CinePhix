/**
 * User Store - Manages user profile and preferences
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usersApi } from '@/api/client'

export const useUserStore = defineStore('user', () => {
  // State
  const preferences = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Default preferences
  const defaultPreferences = {
    favorite_genres: [],
    preferred_decade: null,
    exclude_genres: [],
    min_rating: null,
    language: 'en',
    extra: {},
  }

  // Getters
  const favoriteGenres = computed(() => preferences.value?.favorite_genres || [])
  const preferredDecade = computed(() => preferences.value?.preferred_decade || null)
  const excludedGenres = computed(() => preferences.value?.exclude_genres || [])
  const minRating = computed(() => preferences.value?.min_rating || null)
  const language = computed(() => preferences.value?.language || 'en')
  const hasPreferences = computed(() => preferences.value !== null)

  // Fetch user preferences
  async function fetchPreferences() {
    isLoading.value = true
    error.value = null

    try {
      const response = await usersApi.getPreferences()
      preferences.value = response.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to load preferences'
      preferences.value = { ...defaultPreferences }
    } finally {
      isLoading.value = false
    }
  }

  // Update preferences
  async function updatePreferences(data) {
    isLoading.value = true
    error.value = null

    try {
      const response = await usersApi.updatePreferences(data)
      preferences.value = response.data
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to update preferences'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Update single preference
  async function setPreference(key, value) {
    return updatePreferences({ [key]: value })
  }

  // Add genre to favorites
  async function addFavoriteGenre(genre) {
    const current = [...favoriteGenres.value]
    if (!current.includes(genre)) {
      current.push(genre)
      return updatePreferences({ favorite_genres: current })
    }
    return { success: true }
  }

  // Remove genre from favorites
  async function removeFavoriteGenre(genre) {
    const current = [...favoriteGenres.value]
    const index = current.indexOf(genre)
    if (index > -1) {
      current.splice(index, 1)
      return updatePreferences({ favorite_genres: current })
    }
    return { success: true }
  }

  // Clear preferences
  function clear() {
    preferences.value = null
    error.value = null
  }

  // Clear error
  function clearError() {
    error.value = null
  }

  return {
    // State
    preferences,
    isLoading,
    error,
    // Getters
    favoriteGenres,
    preferredDecade,
    excludedGenres,
    minRating,
    language,
    hasPreferences,
    // Actions
    fetchPreferences,
    updatePreferences,
    setPreference,
    addFavoriteGenre,
    removeFavoriteGenre,
    clear,
    clearError,
  }
})