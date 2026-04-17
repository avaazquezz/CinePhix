/**
 * CinePhix API Client
 * Axios instance configured for backend communication
 */

import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If 401 and haven't tried refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          })

          const { access_token, refresh_token } = response.data
          localStorage.setItem('access_token', access_token)
          localStorage.setItem('refresh_token', refresh_token)

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return api(originalRequest)
        } catch (refreshError) {
          // Refresh failed - clear tokens and redirect to login
          const authStore = useAuthStore()
          authStore.logout()
          window.location.href = '/auth/login'
          return Promise.reject(refreshError)
        }
      }
    }

    return Promise.reject(error)
  }
)

export default api

// Typed API methods
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: (refreshToken) => api.post('/auth/logout', { refresh_token: refreshToken }),
  refresh: (refreshToken) => api.post('/auth/refresh', { refresh_token: refreshToken }),
  me: () => api.get('/auth/me'),
  googleAuth: (code, redirectUri) =>
    api.post('/auth/google', { code, redirect_uri: redirectUri }),
}

export const usersApi = {
  getMe: () => api.get('/users/me'),
  updateMe: (data) => api.patch('/users/me', data),
  getPreferences: () => api.get('/users/me/preferences'),
  updatePreferences: (data) => api.put('/users/me/preferences', data),
  getPublicProfile: (username) => api.get(`/users/${username}`),
}

export const watchlistApi = {
  getAll: () => api.get('/watchlist'),
  add: (data) => api.post('/watchlist', data),
  remove: (id) => api.delete(`/watchlist/${id}`),
  reorder: (id, position) => api.patch(`/watchlist/${id}`, { position }),
}

export const favoritesApi = {
  getAll: () => api.get('/favorites'),
  add: (data) => api.post('/favorites', data),
  remove: (id) => api.delete(`/favorites/${id}`),
  check: (tmdbId, mediaType) => api.get(`/favorites/check/${tmdbId}?media_type=${mediaType}`),
}

export const tmdbApi = {
  getMovie: (id) => api.get(`/tmdb/movie/${id}`),
  getTv: (id) => api.get(`/tmdb/tv/${id}`),
  getTrending: (type, timeWindow) => api.get(`/tmdb/trending/${type}`, { params: { time_window: timeWindow } }),
  search: (query, page) => api.get('/tmdb/search', { params: { q: query, page } }),
  getMovieGenres: () => api.get('/tmdb/genres/movies'),
  getTvGenres: () => api.get('/tmdb/genres/tv'),
}