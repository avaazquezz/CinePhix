import api from '@/api/client'
import { ref } from 'vue'

const BASE_URL = '/activity'

export const useActivityService = () => {
  const loading = ref(false)
  const error = ref(null)

  // ─── Legacy feeds (Phase 1/2) ────────────────────────────────────────────────
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

  // ─── Activity Feed v2 (Phase 3.5 Step 5) ─────────────────────────────────
  const getFeedV2 = async ({ page = 1, per_page = 20, event_type = null, unread_only = false } = {}) => {
    loading.value = true
    error.value = null
    try {
      const params = { page, per_page }
      if (event_type) params.event_type = event_type
      if (unread_only) params.unread_only = true
      const response = await api.get(`${BASE_URL}/feed/v2`, { params })
      return response.data
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const markFeedRead = async () => {
    try {
      await api.post(`${BASE_URL}/feed/v2/read`)
    } catch (err) {
      console.error('Failed to mark feed read:', err)
    }
  }

  const clearFeed = async () => {
    try {
      await api.delete(`${BASE_URL}/feed/v2`)
    } catch (err) {
      console.error('Failed to clear feed:', err)
    }
  }

  return {
    loading,
    error,
    getMyActivity,
    getPublicActivity,
    getFeedV2,
    markFeedRead,
    clearFeed,
  }
}

export default { useActivityService }
