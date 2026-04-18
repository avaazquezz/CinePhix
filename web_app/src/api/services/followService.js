import api from '@/api/client'
import { ref } from 'vue'

const BASE_URL = '/users'

export const useFollowService = () => {
  const loading = ref(false)
  const error = ref(null)

  // Send follow request (auto-follows public accounts)
  const sendFollowRequest = async (userId) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`${BASE_URL}/${userId}/follow-request`)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Unfollow or cancel pending request
  const unfollowUser = async (userId) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.delete(`${BASE_URL}/${userId}/follow`)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get follow status for a user
  const getFollowStatus = async (userId) => {
    try {
      const response = await api.get(`${BASE_URL}/${userId}/follow-status`)
      return response.data
    } catch (err) {
      return { is_following: false, is_pending: false }
    }
  }

  // Get followers of a user
  const getFollowers = async (userId, { page = 1, per_page = 20 } = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`${BASE_URL}/${userId}/followers`, { params: { page, per_page } })
      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get following of a user
  const getFollowing = async (userId, { page = 1, per_page = 20 } = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`${BASE_URL}/${userId}/following`, { params: { page, per_page } })
      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get my pending follow requests (received)
  const getFollowRequests = async ({ page = 1, per_page = 20 } = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`${BASE_URL}/me/follow-requests`, { params: { page, per_page } })
      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Accept a follow request
  const acceptFollowRequest = async (userId, requestId) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`${BASE_URL}/${userId}/follow-request/${requestId}/accept`)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Reject a follow request
  const rejectFollowRequest = async (userId, requestId) => {
    loading.value = true
    error.value = null
    try {
      await api.post(`${BASE_URL}/${userId}/follow-request/${requestId}/reject`)
      return { status: 'rejected' }
    } catch (err) {
      error.value = err.response?.data?.detail || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Cancel a sent follow request
  const cancelFollowRequest = async (userId, requestId) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`${BASE_URL}/${userId}/follow-request/${requestId}`)
      return { status: 'cancelled' }
    } catch (err) {
      error.value = err.response?.data?.detail || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    sendFollowRequest,
    unfollowUser,
    getFollowStatus,
    getFollowers,
    getFollowing,
    getFollowRequests,
    acceptFollowRequest,
    rejectFollowRequest,
    cancelFollowRequest,
  }
}

export default { useFollowService }
