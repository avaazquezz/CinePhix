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
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
}

.logo-link {
  display: flex;
  align-items: center;
}

.logo-img {
  height: 40px;
}

.navigation {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-links {
  display: flex;
  list-style-type: none;
  gap: 1.5rem;
  justify-content: center;
  padding: 0;
  margin: 0;
  flex-wrap: wrap;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
  padding: 0.5rem 0;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.3px;
}

.nav-link:hover {
  color: rgba(229, 9, 20, 0.8);
}

.nav-link.active {
  color: #e50914;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #e50914;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.auth-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.auth-btn-outline {
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.auth-btn-outline:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.4);
}

.auth-btn-primary {
  background: #04ff24;
  color: #000;
}

.auth-btn-primary:hover {
  background: #03e020;
}

.user-menu-btn {
  padding: 0;
}

.user-dropdown {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  min-width: 200px;
}

.user-name-dropdown {
  font-weight: 600;
  color: #fff;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.dropdown-item.logout:hover {
  background: rgba(229, 9, 20, 0.1);
}

.lang-switcher {
  margin-left: 8px;
}

.lang-toggle {
  display: flex;
  background-color: rgba(40, 40, 40, 0.7);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.lang-btn {
  color: #aaa;
  background: transparent;
  border: none;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
  position: relative;
  min-width: 40px;
  text-align: center;
}

.lang-btn.active {
  color: #ffffff;
  background: linear-gradient(135deg, #e50914, #b20710);
  box-shadow: 0 2px 10px rgba(229, 9, 20, 0.5);
}

.lang-btn:hover:not(.active) {
  color: #fff;
  background-color: rgba(229, 9, 20, 0.3);
}

/* Responsividad */
@media screen and (max-width: 768px) {
  .header {
    padding: 0.75rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid rgba(229, 9, 20, 0.15);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  }

  .logo {
    flex: 1;
  }

  .logo-img {
    height: 35px;
    filter: drop-shadow(0 0 10px rgba(229, 9, 20, 0.3));
    transition: transform 0.3s ease;
  }

  .logo-img:active {
    transform: scale(0.95);
  }

  .nav-links {
    display: none;
  }

  .nav-actions {
    gap: 8px;
  }

  .auth-btn {
    padding: 6px 12px;
    font-size: 12px;
  }

  .lang-switcher {
    margin-left: 0;
  }

  .lang-toggle {
    background-color: rgba(40, 40, 40, 0.8);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .lang-btn {
    padding: 0.35rem 0.7rem;
    font-size: 0.8rem;
    min-width: 36px;
  }
}

@media screen and (min-width: 769px) {
  .nav-links {
    gap: 1.5rem;
  }
}

@media screen and (max-width: 480px) {
  .header {
    padding: 0.6rem 0.75rem;
  }

  .logo-img {
    height: 30px;
  }

  .lang-btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.75rem;
    min-width: 32px;
  }
}
</style>