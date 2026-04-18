import api from '@/api/client'
import { ref } from 'vue'

const BASE_URL = '/notifications'

export const useNotificationsService = () => {
  const loading = ref(false)
  const error = ref(null)

  const getNotifications = async ({ page = 1, per_page = 20, unread_only = false } = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(BASE_URL, { params: { page, per_page, unread_only } })
      return response.data
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const markRead = async (notificationId) => {
    try {
      const response = await api.put(`${BASE_URL}/${notificationId}/read`)
      return response.data
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    }
  }

  const markAllRead = async () => {
    try {
      const response = await api.put(`${BASE_URL}/read-all`)
      return response.data
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    }
  }

  const getUnreadCount = async () => {
    try {
      const response = await api.get(`${BASE_URL}/unread-count`)
      return response.data.unread_count
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    }
  }

  return { loading, error, getNotifications, markRead, markAllRead, getUnreadCount }
}

export default { useNotificationsService }
