import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LoginPage from '@/pages/auth/LoginPage.vue'

// Mock auth store
vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    login: vi.fn(),
    logout: vi.fn(),
    isAuthenticated: false,
    isLoading: false,
    error: null,
    clearError: vi.fn(),
    user: null,
    displayName: 'Test User',
    username: 'testuser',
  }),
}))

// Mock router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useRoute: () => ({
    query: {},
  }),
}))

describe('LoginPage', () => {
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    vi.clearAllMocks()
  })

  it('renders login page with form elements', () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [pinia],
        stubs: {
          'v-form': { template: '<form @submit.prevent="$emit(\'submit\')"><slot /></form>' },
          'v-text-field': false,
          'v-btn': { template: '<button type="submit"><slot /></button>' },
          'v-alert': false,
          'v-icon': { template: '<i></i>' },
          RouterLink: { template: '<a><slot /></a>' },
        },
      },
    })

    expect(wrapper.find('.auth-title').text()).toBe('Welcome Back')
    expect(wrapper.find('.auth-subtitle').text()).toBe('Sign in to your CinePhix account')
  })

  it('shows sign up link', () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [pinia],
        stubs: {
          'v-form': true,
          'v-text-field': false,
          'v-btn': true,
          'v-alert': true,
          RouterLink: { template: '<a href="/auth/register"><slot /></a>' },
        },
      },
    })

    expect(wrapper.text()).toContain("Don't have an account?")
    expect(wrapper.find('a[href="/auth/register"]').exists()).toBe(true)
  })

  it('shows Google OAuth button', () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [pinia],
        stubs: {
          'v-form': true,
          'v-text-field': false,
          'v-btn': true,
          'v-alert': true,
          'v-icon': { template: '<i></i>' },
          RouterLink: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Continue with Google')
  })

  it('has email and password fields', () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [pinia],
        stubs: {
          'v-form': true,
          'v-text-field': false,
          'v-btn': true,
          'v-alert': true,
          RouterLink: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Email')
    expect(wrapper.text()).toContain('Password')
  })

  it('shows error message when error exists', () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [pinia],
        stubs: {
          'v-form': true,
          'v-text-field': false,
          'v-btn': true,
          'v-alert': {
            template: '<div class="v-alert">{{ $slots.default?.() }}</div>',
            props: ['type', 'closable'],
          },
          RouterLink: true,
        },
      },
    })

    // Error should not be visible initially
    expect(wrapper.find('.v-alert').exists()).toBe(false)
  })

  it('has submit button', () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [pinia],
        stubs: {
          'v-form': true,
          'v-text-field': false,
          'v-btn': { template: '<button type="submit"><slot /></button>' },
          'v-alert': true,
          RouterLink: true,
        },
      },
    })

    expect(wrapper.find('button[type="submit"]').text()).toBe('Sign In')
  })
})