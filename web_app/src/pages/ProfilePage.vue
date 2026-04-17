<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="avatar-section">
          <v-avatar size="100" color="primary">
            <v-img v-if="user?.avatar_url" :src="user.avatar_url" />
            <span v-else class="avatar-initial">{{ initial }}</span>
          </v-avatar>
        </div>
        <div class="user-info">
          <h1 class="user-name">{{ user?.display_name || user?.username }}</h1>
          <p class="user-username">@{{ user?.username }}</p>
          <v-chip v-if="user?.is_pro" color="accent" size="small" class="mt-2">
            PRO
          </v-chip>
        </div>
      </div>

      <!-- Profile Form -->
      <div class="profile-card">
        <h2 class="section-title">Profile Settings</h2>

        <v-alert v-if="profileError" type="error" variant="tonal" class="mb-4" closable @click:close="profileError = null">
          {{ profileError }}
        </v-alert>

        <v-form @submit.prevent="handleUpdateProfile">
          <v-text-field
            v-model="displayName"
            label="Display Name"
            variant="outlined"
            class="mb-3"
          />

          <v-text-field
            v-model="username"
            label="Username"
            variant="outlined"
            :rules="[rules.username]"
            hint="3-50 characters, letters, numbers and underscores only"
            persistent-hint
            class="mb-3"
          />

          <v-text-field
            v-model="avatarUrl"
            label="Avatar URL"
            variant="outlined"
            prepend-inner-icon="mdi-link"
            class="mb-4"
          />

          <v-btn type="submit" color="primary" :loading="isUpdatingProfile">
            Save Changes
          </v-btn>
        </v-form>
      </div>

      <!-- Preferences Section -->
      <div class="profile-card">
        <h2 class="section-title">Preferences</h2>

        <v-alert v-if="prefsError" type="error" variant="tonal" class="mb-4" closable @click:close="prefsError = null">
          {{ prefsError }}
        </v-alert>

        <!-- Favorite Genres -->
        <div class="preference-section">
          <h3 class="preference-label">Favorite Genres</h3>
          <div class="genre-chips">
            <v-chip
              v-for="genre in availableGenres"
              :key="genre.id"
              :color="userStore.favoriteGenres.includes(genre.name) ? 'primary' : 'default'"
              :variant="userStore.favoriteGenres.includes(genre.name) ? 'flat' : 'outlined'"
              class="genre-chip"
              @click="toggleGenre(genre.name)"
            >
              {{ genre.name }}
            </v-chip>
          </div>
        </div>

        <!-- Language -->
        <div class="preference-section">
          <h3 class="preference-label">Preferred Language</h3>
          <v-select
            v-model="selectedLanguage"
            :items="languages"
            variant="outlined"
            class="mt-2"
            @update:model-value="updateLanguage"
          />
        </div>

        <!-- Min Rating -->
        <div class="preference-section">
          <h3 class="preference-label">Minimum Rating</h3>
          <v-slider
            v-model="minRating"
            :min="0"
            :max="10"
            :step="0.5"
            thumb-label
            color="primary"
            class="mt-4"
            @end="updateMinRating"
          />
          <span class="rating-display">{{ minRating }}/10</span>
        </div>

        <!-- Preferred Decade -->
        <div class="preference-section">
          <h3 class="preference-label">Preferred Decade</h3>
          <v-select
            v-model="preferredDecade"
            :items="decades"
            variant="outlined"
            class="mt-2"
            @update:model-value="updatePreferredDecade"
          />
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="profile-card danger-card">
        <h2 class="section-title">Account</h2>
        <v-btn color="error" variant="outlined" @click="handleLogout">
          <v-icon start>mdi-logout</v-icon>
          Sign Out
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()

// User state
const user = computed(() => authStore.user)

// Form fields
const displayName = ref('')
const username = ref('')
const avatarUrl = ref('')
const selectedLanguage = ref('en')
const minRating = ref(0)
const preferredDecade = ref(null)

// Loading states
const isUpdatingProfile = ref(false)
const profileError = ref(null)
const prefsError = ref(null)

// Options
const availableGenres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Adventure' },
  { id: 3, name: 'Animation' },
  { id: 4, name: 'Comedy' },
  { id: 5, name: 'Crime' },
  { id: 6, name: 'Documentary' },
  { id: 7, name: 'Drama' },
  { id: 8, name: 'Family' },
  { id: 9, name: 'Fantasy' },
  { id: 10, name: 'History' },
  { id: 11, name: 'Horror' },
  { id: 12, name: 'Music' },
  { id: 13, name: 'Mystery' },
  { id: 14, name: 'Romance' },
  { id: 15, name: 'Science Fiction' },
  { id: 16, name: 'TV Movie' },
  { id: 17, name: 'Thriller' },
  { id: 18, name: 'War' },
  { id: 19, name: 'Western' },
]

const languages = [
  { title: 'English', value: 'en' },
  { title: 'Español', value: 'es' },
  { title: 'Français', value: 'fr' },
  { title: 'Deutsch', value: 'de' },
  { title: 'Italiano', value: 'it' },
  { title: 'Português', value: 'pt' },
]

const decades = [
  { title: '2020s', value: '2020s' },
  { title: '2010s', value: '2010s' },
  { title: '2000s', value: '2000s' },
  { title: '1990s', value: '1990s' },
  { title: '1980s', value: '1980s' },
  { title: '1970s', value: '1970s' },
  { title: '1960s', value: '1960s' },
  { title: 'Any decade', value: null },
]

const rules = {
  username: (v) => /^[a-zA-Z0-9_]+$/.test(v) || 'Only letters, numbers and underscores',
}

// Computed
const initial = computed(() => {
  const name = user.value?.username || user.value?.email || 'U'
  return name.charAt(0).toUpperCase()
})

// Methods
function toggleGenre(genre) {
  if (userStore.favoriteGenres.includes(genre)) {
    userStore.removeFavoriteGenre(genre)
  } else {
    userStore.addFavoriteGenre(genre)
  }
}

async function updateLanguage(lang) {
  const result = await userStore.setPreference('language', lang)
  if (!result.success) {
    prefsError.value = result.error
  }
}

async function updateMinRating(rating) {
  const result = await userStore.setPreference('min_rating', rating)
  if (!result.success) {
    prefsError.value = result.error
  }
}

async function updatePreferredDecade(decade) {
  const result = await userStore.setPreference('preferred_decade', decade)
  if (!result.success) {
    prefsError.value = result.error
  }
}

async function handleUpdateProfile() {
  isUpdatingProfile.value = true
  profileError.value = null

  const data = {}
  if (displayName.value) data.display_name = displayName.value
  if (username.value) data.username = username.value
  if (avatarUrl.value) data.avatar_url = avatarUrl.value

  if (Object.keys(data).length === 0) {
    isUpdatingProfile.value = false
    return
  }

  const success = await authStore.updateProfile(data)
  if (!success) {
    profileError.value = authStore.error
  }

  isUpdatingProfile.value = false
}

async function handleLogout() {
  await authStore.logout()
  router.push('/CinePhix/home')
}

// Load user data on mount
onMounted(async () => {
  if (user.value) {
    displayName.value = user.value.display_name || ''
    username.value = user.value.username || ''
    avatarUrl.value = user.value.avatar_url || ''
  }

  await userStore.fetchPreferences()

  if (userStore.preferences) {
    selectedLanguage.value = userStore.language || 'en'
    minRating.value = userStore.minRating || 0
    preferredDecade.value = userStore.preferredDecade
  }
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #050505, #0a0a0a);
  padding: 40px 20px;
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 40px;
}

.avatar-section {
  flex-shrink: 0;
}

.avatar-initial {
  font-size: 40px;
  font-weight: 700;
  color: #fff;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}

.user-username {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}

.profile-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 20px;
}

.preference-section {
  margin-bottom: 24px;
}

.preference-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 12px;
}

.genre-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.genre-chip {
  cursor: pointer;
}

.rating-display {
  display: block;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  margin-top: 8px;
}

.danger-card {
  border-color: rgba(255, 59, 48, 0.3);
}

@media (max-width: 600px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
}
</style>