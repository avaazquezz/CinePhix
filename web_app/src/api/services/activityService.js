import api from '@/api/client'
import { ref } from 'vue'

const BASE_URL = '/activity'

export const useActivityService = () => {
  const loading = ref(false)
  const error = ref(null)

  // Get my activity feed
  const getMyActivity = async ({ page = 1, per_page = 20 } = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`${BASE_URL}/me`, { params: { page, per_page } })
      return response.data
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get public activity feed
  const getPublicActivity = async ({ page = 1, per_page = 20 } = {}) => {
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

  // Get activity for a specific user
  const getUserActivity = async (username, { page = 1, per_page = 20 } = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`${BASE_URL}/user/${username}`, { params: { page, per_page } })
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
    getMyActivity,
    getPublicActivity,
    getUserActivity,
  }
}

export default { useActivityService }
