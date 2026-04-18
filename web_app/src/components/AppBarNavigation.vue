<template>
  <header class="header">
    <div class="logo">
      <router-link to="/CinePhix/" class="logo-link">
        <img src="@/assets/logo.png" alt="CinePhix Logo" class="logo-img" />
      </router-link>
    </div>

    <nav class="navigation">
      <ul class="nav-links">
        <li>
          <router-link to="/CinePhix/home" class="nav-link" :class="{ active: isActive('/CinePhix/home') }">
            {{ $t('nav.home') }}
          </router-link>
        </li>
        <li>
          <router-link to="/CinePhix/movies" class="nav-link" :class="{ active: isActive('/CinePhix/movies') }">
            {{ $t('nav.movies') }}
          </router-link>
        </li>
        <li>
          <router-link to="/CinePhix/series" class="nav-link" :class="{ active: isActive('/CinePhix/series') }">
            {{ $t('nav.series') }}
          </router-link>
        </li>
        <li>
          <router-link to="/CinePhix/actores" class="nav-link" :class="{ active: isActive('/CinePhix/actores') }">
            {{ $t('nav.actors') }}
          </router-link>
        </li>
      </ul>

      <div class="nav-actions">
        <!-- Auth buttons or user menu -->
        <template v-if="authStore.isAuthenticated">
          <!-- Notification Bell -->
          <v-btn icon variant="text" @click="showNotifications = true" class="notif-btn">
            <v-badge :content="notifUnread" :model-value="notifUnread > 0" color="error">
              <v-icon>mdi-bell-outline</v-icon>
            </v-badge>
          </v-btn>

          <v-menu>
            <template #activator="{ props }">
              <v-btn icon v-bind="props" variant="text" class="user-menu-btn">
                <v-avatar size="32" color="primary">
                  <v-img v-if="authStore.user?.avatar_url" :src="authStore.user.avatar_url" />
                  <span v-else>{{ userInitial }}</span>
                </v-avatar>
              </v-btn>
            </template>
            <v-list class="user-dropdown" bg-color="#141414">
              <v-list-item>
                <v-list-item-title class="user-name-dropdown">
                  {{ authStore.displayName }}
                  <v-chip v-if="authStore.isPro" color="accent" size="x-small" class="ml-2">PRO</v-chip>
                </v-list-item-title>
                <v-list-item-subtitle>@{{ authStore.username }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item @click="goToProfile" class="dropdown-item">
                <template #prepend>
                  <v-icon>mdi-account</v-icon>
                </template>
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item>
              <v-list-item @click="$router.push('/CinePhix/lists')" class="dropdown-item">
                <template #prepend>
                  <v-icon>mdi-format-list-bulleted</v-icon>
                </template>
                <v-list-item-title>My Lists</v-list-item-title>
              </v-list-item>
              <v-list-item @click="$router.push('/CinePhix/activity')" class="dropdown-item">
                <template #prepend>
                  <v-icon>mdi-bulletin-board</v-icon>
                </template>
                <v-list-item-title>Activity</v-list-item-title>
              </v-list-item>
              <v-list-item v-if="!authStore.isPro" @click="$router.push('/CinePhix/pricing')" class="dropdown-item pro-item">
                <template #prepend>
                  <v-icon color="#e50914">mdi-rocket-launch</v-icon>
                </template>
                <v-list-item-title class="pro-text">Go Pro</v-list-item-title>
              </v-list-item>
              <v-divider class="my-2" />
              <v-list-item @click="handleLogout" class="dropdown-item logout">
                <template #prepend>
                  <v-icon>mdi-logout</v-icon>
                </template>
                <v-list-item-title>Sign Out</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <template v-else>
          <router-link to="/CinePhix/auth/login" class="auth-btn auth-btn-outline">
            Sign In
          </router-link>
          <router-link to="/CinePhix/auth/register" class="auth-btn auth-btn-primary">
            Sign Up
          </router-link>
          <router-link to="/CinePhix/pricing" class="auth-btn pro-nav-btn">
            Go Pro
          </router-link>
        </template>

        <!-- Language Switcher -->
        <div class="lang-switcher">
          <div class="lang-toggle">
            <button
              class="lang-btn"
              :class="{ active: currentLang === 'es' }"
              @click="setLanguage('es')"
              aria-label="Español"
            >
              ES
            </button>
            <button
              class="lang-btn"
              :class="{ active: currentLang === 'en' }"
              @click="setLanguage('en')"
              aria-label="English"
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<NotificationPanel v-model="showNotifications" />

<script>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, onUnmounted } from 'vue'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { setLocale, getLocale } from '@/i18n'
import { useNotificationsSocket } from '@/composables/useNotificationsSocket'
import NotificationPanel from './NotificationPanel.vue'

export default {
  name: 'AppBarNavigation',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()
    const currentLang = ref(getLocale())
    const showNotifications = ref(false)
    const { unreadCount: notifUnread, connect: connectSocket, disconnect: disconnectSocket, decrementUnread } = useNotificationsSocket()
    const onNotification = () => { decrementUnread() }
    onMounted(() => { if (authStore.isAuthenticated) connectSocket() })
    onUnmounted(() => disconnectSocket())

    const isActive = (path) => {
      return route.path === path || route.path.startsWith(path + '/')
    }

    const setLanguage = (lang) => {
      currentLang.value = lang
      setLocale(lang)
    }

    const userInitial = computed(() => {
      const name = authStore.user?.username || authStore.user?.email || 'U'
      return name.charAt(0).toUpperCase()
    })

    const goToProfile = () => {
      router.push('/CinePhix/profile')
    }

    const handleLogout = async () => {
      await authStore.logout()
      router.push('/CinePhix/home')
    }

    return {
      isActive,
      currentLang,
      setLanguage,
      authStore,
      userInitial,
      goToProfile,
      handleLogout,
      showNotifications,
      notifUnread,
      onNotification,
      NotificationPanel,
    }
  },
}
</script>

<style scoped>
/* ── Base ── */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2.5rem;
  height: 62px;
  background: rgba(6, 6, 6, 0.88);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(229, 9, 20, 0.12);
  box-shadow: 0 1px 0 rgba(255,255,255,0.03), 0 4px 24px rgba(0,0,0,0.5);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

/* ── Logo ── */
.logo-link {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.logo-img {
  height: 38px;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.logo-img:hover {
  opacity: 0.85;
  transform: scale(0.97);
}

/* ── Navigation ── */
.navigation {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 0.25rem;
  padding: 0;
  margin: 0;
}

.nav-link {
  color: rgba(255,255,255,0.65);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.2px;
  padding: 0.45rem 0.9rem;
  border-radius: 6px;
  transition: color 0.2s ease, background 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: #fff;
  background: rgba(255,255,255,0.06);
}

.nav-link.active {
  color: #fff;
  font-weight: 600;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 22px;
  height: 2px;
  background: #e50914;
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(229,9,20,0.7);
}

/* ── Actions ── */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* notification bell */
.notif-btn { opacity: 0.8; transition: opacity 0.2s; }
.notif-btn:hover { opacity: 1; }

/* Auth buttons */
.auth-btn {
  padding: 7px 15px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  font-family: 'Inter', sans-serif;
  text-decoration: none;
  letter-spacing: 0.2px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.auth-btn-outline {
  color: rgba(255,255,255,0.75);
  border: 1px solid rgba(255,255,255,0.14);
}
.auth-btn-outline:hover {
  color: #fff;
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.28);
}

.auth-btn-primary {
  background: var(--cp-red, #e50914);
  color: #fff;
  font-weight: 700;
}
.auth-btn-primary:hover {
  background: #c4060f;
  box-shadow: 0 0 16px rgba(229,9,20,0.35);
}

/* User menu */
.user-menu-btn { padding: 0 !important; }

.user-dropdown {
  border: 1px solid rgba(255,255,255,0.09) !important;
  border-radius: 10px !important;
  min-width: 210px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.7) !important;
}

.user-name-dropdown { font-weight: 700; color: #fff; font-size: 0.95rem; }

.dropdown-item { border-radius: 6px; margin: 1px 6px; transition: background 0.15s; }
.dropdown-item:hover { background: rgba(255,255,255,0.06) !important; }
.dropdown-item.logout:hover { background: rgba(229,9,20,0.1) !important; }

.pro-item  { border-radius: 8px; margin: 3px 8px; }
.pro-text  { color: var(--cp-red, #e50914) !important; font-weight: 700; }

/* Go Pro nav button */
.pro-nav-btn {
  background: transparent;
  color: rgba(255,255,255,0.8);
  border: 1px solid rgba(255,255,255,0.2);
  font-weight: 600;
  padding: 7px 15px;
  border-radius: 6px;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  transition: all 0.2s ease;
  letter-spacing: 0.2px;
}
.pro-nav-btn:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.35);
  color: #fff;
}

/* ── Language switcher ── */
.lang-switcher { margin-left: 4px; }

.lang-toggle {
  display: flex;
  background: rgba(255,255,255,0.05);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
}

.lang-btn {
  color: rgba(255,255,255,0.45);
  background: transparent;
  border: none;
  padding: 0.35rem 0.75rem;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  letter-spacing: 0.6px;
  min-width: 38px;
  text-align: center;
  font-family: 'Inter', sans-serif;
}

.lang-btn.active {
  color: #fff;
  background: linear-gradient(135deg, #e50914, #b20710);
  box-shadow: 0 2px 8px rgba(229,9,20,0.45);
}

.lang-btn:hover:not(.active) {
  color: #fff;
  background: rgba(229,9,20,0.2);
}

/* ── Responsive ── */
@media screen and (max-width: 768px) {
  .header { padding: 0 1.1rem; height: 56px; }
  .logo { flex: 1; }
  .logo-img { height: 33px; }
  .nav-links { display: none; }
  .nav-actions { gap: 6px; }
  .auth-btn { padding: 6px 12px; font-size: 12px; }
  .lang-btn { padding: 0.3rem 0.65rem; font-size: 0.75rem; min-width: 34px; }
}

@media screen and (max-width: 480px) {
  .header { padding: 0 0.85rem; height: 52px; }
  .logo-img { height: 30px; }
}
</style>