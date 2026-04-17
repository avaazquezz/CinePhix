import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

vi.mock('@/api/client', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    refresh: vi.fn(),
    me: vi.fn(),
    googleAuth: vi.fn(),
  },
  usersApi: {
    updateMe: vi.fn(),
  },
}))

import { authApi, usersApi } from '@/api/client'

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('starts with no user and not authenticated', () => {
      const store = useAuthStore()
      expect(store.user).toBe(null)
      expect(store.isAuthenticated).toBe(false)
      expect(store.isLoading).toBe(false)
      expect(store.error).toBe(null)
    })

    it('has correct default getters', () => {
      const store = useAuthStore()
      expect(store.isPro).toBe(false)
    })
  })

  describe('login', () => {
    it('calls API and sets tokens on success', async () => {
      const store = useAuthStore()
      const mockUser = { id: '123', email: 'test@test.com', username: 'testuser' }

      authApi.login.mockResolvedValue({
        data: { access_token: 'access', refresh_token: 'refresh' },
      })
      authApi.me.mockResolvedValue({ data: mockUser })

      const result = await store.login('test@test.com', 'password123')

      expect(result).toBe(true)
      expect(store.isAuthenticated).toBe(true)
      expect(store.user).toEqual(mockUser)
    })

    it('sets error on failed login', async () => {
      const store = useAuthStore()
      authApi.login.mockRejectedValue({
        response: { data: { detail: 'Invalid credentials' } },
      })

      const result = await store.login('test@test.com', 'wrongpassword')

      expect(result).toBe(false)
      expect(store.error).toBe('Invalid credentials')
    })

    it('clears error when clearError is called', async () => {
      const store = useAuthStore()
      authApi.login.mockRejectedValue({
        response: { data: { detail: 'Invalid credentials' } },
      })

      await store.login('test@test.com', 'wrongpassword')
      expect(store.error).toBe('Invalid credentials')

      store.clearError()
      expect(store.error).toBe(null)
    })
  })

  describe('register', () => {
    it('calls API and sets tokens on success', async () => {
      const store = useAuthStore()
      const mockUser = { id: '123', email: 'test@test.com', username: 'testuser' }

      authApi.register.mockResolvedValue({
        data: { access_token: 'access', refresh_token: 'refresh' },
      })
      authApi.me.mockResolvedValue({ data: mockUser })

      const result = await store.register('test@test.com', 'password123', 'testuser')

      expect(result.success).toBe(true)
      expect(store.isAuthenticated).toBe(true)
      expect(store.user).toEqual(mockUser)
    })

    it('returns error on failed registration', async () => {
      const store = useAuthStore()
      authApi.register.mockRejectedValue({
        response: { data: { detail: 'Email already registered' } },
      })

      const result = await store.register('test@test.com', 'password123', 'testuser')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Email already registered')
    })
  })

  describe('logout', () => {
    it('clears localStorage on logout', async () => {
      const store = useAuthStore()
      localStorage.setItem('refresh_token', 'refresh')
      authApi.logout.mockResolvedValue({})

      await store.logout()

      expect(authApi.logout).toHaveBeenCalled()
    })
  })

  describe('updateProfile', () => {
    it('calls API and updates user on success', async () => {
      const store = useAuthStore()
      store.user = { id: '123', email: 'test@test.com', username: 'oldname' }
      const updatedUser = { id: '123', email: 'test@test.com', username: 'newname' }

      usersApi.updateMe.mockResolvedValue({ data: updatedUser })

      const result = await store.updateProfile({ username: 'newname' })

      expect(result).toBe(true)
      expect(store.user.username).toBe('newname')
    })

    it('sets error on failed update', async () => {
      const store = useAuthStore()
      store.user = { id: '123' }
      usersApi.updateMe.mockRejectedValue({
        response: { data: { detail: 'Username taken' } },
      })

      const result = await store.updateProfile({ username: 'taken' })

      expect(result).toBe(false)
      expect(store.error).toBe('Username taken')
    })
  })

  describe('initialize', () => {
    it('does nothing if no token', async () => {
      const store = useAuthStore()
      await store.initialize()
      expect(store.isAuthenticated).toBe(false)
    })

    it('fetches user if token exists', async () => {
      const store = useAuthStore()
      localStorage.setItem('access_token', 'valid-token')
      const mockUser = { id: '123', email: 'test@test.com' }

      authApi.me.mockResolvedValue({ data: mockUser })

      await store.initialize()

      expect(store.isAuthenticated).toBe(true)
      expect(store.user).toEqual(mockUser)
    })

    it('refreshes token if initial call fails', async () => {
      const store = useAuthStore()
      localStorage.setItem('access_token', 'expired-token')
      localStorage.setItem('refresh_token', 'valid-refresh')

      authApi.me.mockRejectedValue({ response: { status: 401 } })
      authApi.refresh.mockResolvedValue({
        data: { access_token: 'new-access', refresh_token: 'new-refresh' },
      })
      authApi.me.mockResolvedValue({ data: { id: '123', email: 'test@test.com' } })

      await store.initialize()

      expect(store.isAuthenticated).toBe(true)
    })
  })
})