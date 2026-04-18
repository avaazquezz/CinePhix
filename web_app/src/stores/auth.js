/**
 * Auth Store - Manages authentication state and JWT tokens
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, usersApi } from '@/api/client'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const userId = computed(() => user.value?.id)
  const userEmail = computed(() => user.value?.email)
  const username = computed(() => user.value?.username)
  const isPro = computed(() => user.value?.is_pro || false)
  const displayName = computed(() => user.value?.display_name || username.value || email.value)

  // Token management
  function getAccessToken() {
    return localStorage.getItem('access_token')
  }

  function getRefreshToken() {
    return localStorage.getItem('refresh_token')
  }

  function setTokens(accessToken, refreshToken) {
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
    isAuthenticated.value = true
  }

  function clearTokens() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    user.value = null
    isAuthenticated.value = false
  }

  // Check if user is logged in on app start
  async function initialize() {
    const token = getAccessToken()
    if (!token) {
      isAuthenticated.value = false
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await authApi.me()
      user.value = response.data
      isAuthenticated.value = true
    } catch (err) {
      // Token might be expired - try refresh
      const refreshToken = getRefreshToken()
      if (refreshToken) {
        try {
          const refreshResponse = await authApi.refresh(refreshToken)
          const { access_token, refresh_token } = refreshResponse.data
          setTokens(access_token, refresh_token)

          // Retry getting user
          const userResponse = await authApi.me()
          user.value = userResponse.data
          isAuthenticated.value = true
        } catch (refreshErr) {
          clearTokens()
        }
      } else {
        clearTokens()
      }
    } finally {
      isLoading.value = false
    }
  }

  // Login with email + password
  async function login(email, password) {
    isLoading.value = true
    error.value = null

    try {
      const response = await authApi.login({ email, password })
      const { access_token, refresh_token } = response.data
      setTokens(access_token, refresh_token)

      // Fetch user profile
      const userResponse = await authApi.me()
      user.value = userResponse.data

      return true
    } catch (err) {
      error.value = err.response?.data?.detail || 'Login failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Register new user
  async function register(email, password, username) {
    isLoading.value = true
    error.value = null

    try {
      const response = await authApi.register({ email, password, username })
      const { access_token, refresh_token } = response.data
      setTokens(access_token, refresh_token)

      // Fetch user profile
      const userResponse = await authApi.me()
      user.value = userResponse.data

      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.detail || 'Registration failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Logout
  async function logout() {
    const refreshToken = getRefreshToken()

    try {
      if (refreshToken) {
        await authApi.logout(refreshToken)
      }
    } catch (err) {
      // Ignore logout errors - clear tokens anyway
    } finally {
      clearTokens()
    }
  }

  // Google OAuth
  async function loginWithGoogle(code, redirectUri) {
    isLoading.value = true
    error.value = null

    try {
      const response = await authApi.googleAuth(code, redirectUri)
      const { access_token, refresh_token } = response.data
      setTokens(access_token, refresh_token)

      const userResponse = await authApi.me()
      user.value = userResponse.data

      return true
    } catch (err) {
      error.value = err.response?.data?.detail || 'Google authentication failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Update user profile
  async function updateProfile(data) {
    isLoading.value = true
    error.value = null

    try {
      const response = await usersApi.updateMe(data)
      user.value = response.data
      return true
    } catch (err) {
      error.value = err.response?.data?.detail || 'Update failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Clear error
  function clearError() {
    error.value = null
  }

  /** Reload current user from `/auth/me` (e.g. after returning from Stripe checkout). */
  async function fetchUser() {
    const token = getAccessToken()
    if (!token) {
      user.value = null
      isAuthenticated.value = false
      return
    }
    try {
      const response = await authApi.me()
      user.value = response.data
      isAuthenticated.value = true
    } catch {
      const refreshToken = getRefreshToken()
      if (refreshToken) {
        try {
          const refreshResponse = await authApi.refresh(refreshToken)
          const { access_token, refresh_token } = refreshResponse.data
          setTokens(access_token, refresh_token)
          const userResponse = await authApi.me()
          user.value = userResponse.data
          isAuthenticated.value = true
        } catch {
          clearTokens()
        }
      } else {
        clearTokens()
      }
    }
  }

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    // Getters
    userId,
    userEmail,
    username,
    isPro,
    displayName,
    // Actions
    initialize,
    login,
    register,
    logout,
    loginWithGoogle,
    updateProfile,
    clearError,
    getAccessToken,
    getRefreshToken,
    fetchUser,
  }
})