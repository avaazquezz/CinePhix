/**
 * Router Configuration with Navigation Guards
 * Protects routes that require authentication
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Pages - lazy loaded for code splitting
const MainPage = () => import('@/pages/MainPage.vue')
const HomePage = () => import('@/pages/HomePage.vue')
const MoviesPage = () => import('@/pages/MoviesPage.vue')
const SeriesPage = () => import('@/pages/SeriesPage.vue')
const ActorsPage = () => import('@/pages/ActorsPage.vue')

// Auth pages
const LoginPage = () => import('@/pages/auth/LoginPage.vue')
const RegisterPage = () => import('@/pages/auth/RegisterPage.vue')

// Profile page
const ProfilePage = () => import('@/pages/ProfilePage.vue')
const PublicProfilePage = () => import('@/pages/PublicProfilePage.vue')
const ListsPage = () => import('@/pages/ListsPage.vue')
const ListDetailPage = () => import('@/pages/ListDetailPage.vue')
const DiscoverPage = () => import('@/pages/DiscoverPage.vue')
const ActivityPage = () => import('@/pages/ActivityPage.vue')
const AIConciergePage = () => import('@/pages/AIConciergePage.vue')
const PricingPage = () => import('@/pages/PricingPage.vue')

const routes = [
  // Public routes
  {
    path: '/CinePhix/',
    name: 'Main',
    component: MainPage,
    meta: { public: true },
  },
  {
    path: '/CinePhix/home',
    name: 'Home',
    component: HomePage,
    meta: { public: true },
  },
  {
    path: '/CinePhix/movies',
    name: 'Movies',
    component: MoviesPage,
    meta: { public: true },
  },
  {
    path: '/CinePhix/series',
    name: 'Series',
    component: SeriesPage,
    meta: { public: true },
  },
  {
    path: '/CinePhix/actores',
    name: 'Actors',
    component: ActorsPage,
    meta: { public: true },
  },

  // Auth routes (public only when not logged in)
  {
    path: '/CinePhix/auth/login',
    name: 'Login',
    component: LoginPage,
    meta: { public: true, guestOnly: true },
  },
  {
    path: '/CinePhix/auth/register',
    name: 'Register',
    component: RegisterPage,
    meta: { public: true, guestOnly: true },
  },

  // Protected routes
  {
    path: '/CinePhix/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/CinePhix/user/:username',
    name: 'PublicProfile',
    component: PublicProfilePage,
    meta: { public: true },
  },
  {
    path: '/CinePhix/lists',
    name: 'Lists',
    component: ListsPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/CinePhix/list/:id',
    name: 'ListDetail',
    component: ListDetailPage,
    meta: { public: true },
  },
  {
    path: '/CinePhix/discover',
    name: 'Discover',
    component: DiscoverPage,
    meta: { public: true },
  },
  {
    path: '/CinePhix/activity',
    name: 'Activity',
    component: ActivityPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/CinePhix/ai',
    name: 'AIConcierge',
    component: AIConciergePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/CinePhix/pricing',
    name: 'Pricing',
    component: PricingPage,
    meta: { public: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Check if auth is initialized
  if (!authStore.isAuthenticated && localStorage.getItem('access_token')) {
    await authStore.initialize()
  }

  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.meta.requiresAuth
  const guestOnly = to.meta.guestOnly

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login if not authenticated
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (guestOnly && isAuthenticated) {
    // Redirect to home if already authenticated
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router