import api from '@/api/client'
import { ref } from 'vue'

const BASE_URL = '/lists'

export const useListsService = () => {
  const loading = ref(false)
  const error = ref(null)

  // Create a new list
  const createList = async ({ name, description, is_public }) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(BASE_URL, { name, description, is_public })
      return response.data
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get my lists
  const getMyLists = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(BASE_URL)
      return response.data
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get a single list by ID
  const getList = async (listId) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`${BASE_URL}/${listId}`)
      return response.data
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update a list
  const updateList = async (listId, { name, description, is_public, cover_image }) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.put(`${BASE_URL}/${listId}`, { name, description, is_public, cover_image })
      return response.data
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete a list
  const deleteList = async (listId) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.delete(`${BASE_URL}/${listId}`)
      return response.data
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Add item to a list
  const addItemToList = async (listId, { tmdb_id, media_type }) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`${BASE_URL}/${listId}/items`, { tmdb_id, media_type })
      return response.data
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Remove item from a list
  const removeItemFromList = async (listId, tmdbId, mediaType) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.delete(`${BASE_URL}/${listId}/items/${tmdbId}/${mediaType}`)
      return response.data
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get public lists
  const getPublicLists = async ({ page = 1, per_page = 20 } = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`${BASE_URL}/public`, { params: { page, per_page } })
      return response.data
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get featured lists
  const getFeaturedLists = async ({ page = 1, per_page = 10 } = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`${BASE_URL}/featured`, { params: { page, per_page } })
      return response.data
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get lists by username
  const getUserLists = async (username) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`${BASE_URL}/user/${username}`)
      return response.data
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    createList,
    getMyLists,
    getList,
    updateList,
    deleteList,
    addItemToList,
    removeItemFromList,
    getPublicLists,
    getFeaturedLists,
    getUserLists,
  }
}

export default { useListsService }
