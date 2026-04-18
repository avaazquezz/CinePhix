import api from '@/api/client'
import { ref } from 'vue'

const BASE_URL = '/ai'

export const useAIService = () => {
  const loading = ref(false)
  const error = ref(null)

  // AI Concierge chat
  const sendChat = async ({ message, history = [], language = 'es' }) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`${BASE_URL}/chat`, { message, history, language })
      return response.data.reply
    } catch (err) {
      error.value = err.response?.data?.detail || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Semantic search
  const semanticSearch = async ({ query, movies, top_k = 10 }) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`${BASE_URL}/search`, { query, movies, top_k })
      return response.data.results
    } catch (err) {
      error.value = err.response?.data?.detail || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get available themes
  const getThemes = async () => {
    try {
      const response = await api.get(`${BASE_URL}/collections/themes`)
      return response.data.themes
    } catch (err) {
      error.value = err.response?.data?.detail || err.message
      throw err
    }
  }

  // Generate smart collection
  const generateCollection = async ({ theme, movies = [], limit = 15 }) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`${BASE_URL}/collections/generate`, { theme, movies, limit })
      return response.data.movie_ids
    } catch (err) {
      error.value = err.response?.data?.detail || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Review assistant feedback
  const reviewFeedback = async ({ review_text, media_title }) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`${BASE_URL}/review/feedback`, { review_text, media_title })
      return response.data
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
    sendChat,
    semanticSearch,
    getThemes,
    generateCollection,
    reviewFeedback,
  }
}

export default { useAIService }
