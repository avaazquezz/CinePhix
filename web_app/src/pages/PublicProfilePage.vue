<template>
  <div class="public-profile-page">
    <div class="profile-container">
      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <v-progress-circular indeterminate color="primary" size="64" />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-state">
        <v-alert type="error" variant="tonal">{{ error }}</v-alert>
        <v-btn @click="$router.push('/CinePhix/home')" class="mt-4">Back to Home</v-btn>
      </div>

      <!-- Profile -->
      <template v-else-if="user">
        <!-- Header -->
        <div class="profile-header">
          <div class="avatar-section">
            <v-avatar size="120" color="primary">
              <v-img v-if="user.avatar_url" :src="user.avatar_url" />
              <span v-else class="avatar-initial">{{ initial }}</span>
            </v-avatar>
          </div>
          <div class="user-info">
            <div class="name-row">
              <h1 class="user-name">{{ user.display_name || user.username }}</h1>
              <v-chip v-if="user.is_pro" color="accent" size="small" class="ml-3">PRO</v-chip>
            </div>
            <p class="user-username">@{{ user.username }}</p>
            <p v-if="user.bio" class="user-bio">{{ user.bio }}</p>

            <!-- Stats row -->
            <div class="stats-row">
              <div class="stat-item">
                <span class="stat-value">{{ user.reviews_count }}</span>
                <span class="stat-label">Reviews</span>
              </div>
              <div class="stat-item clickable" @click="showFollowers = true">
                <span class="stat-value">{{ user.followers_count }}</span>
                <span class="stat-label">Followers</span>
              </div>
              <div class="stat-item clickable" @click="showFollowing = true">
                <span class="stat-value">{{ user.following_count }}</span>
                <span class="stat-label">Following</span>
              </div>
            </div>

            <!-- Follow button (if logged in and not own profile) -->
            <v-btn
              v-if="authStore.isAuthenticated && !isOwnProfile"
              :color="isFollowing ? 'default' : 'primary'"
              :variant="isFollowing ? 'outlined' : 'flat'"
              class="mt-3"
              @click="toggleFollow"
              :loading="followLoading"
            >
              {{ isFollowing ? 'Following' : 'Follow' }}
            </v-btn>
          </div>
        </div>

        <!-- Tabs: Reviews | Lists -->
        <div class="profile-tabs">
          <v-tabs v-model="activeTab" color="primary" align-tabs="start">
            <v-tab value="reviews">
              Reviews
              <v-badge :content="reviews.total" inline />
            </v-tab>
            <v-tab value="lists">
              Lists
              <v-badge :content="lists.total" inline />
            </v-tab>
          </v-tabs>

          <v-window v-model="activeTab" class="mt-4">
            <!-- Reviews Tab -->
            <v-window-item value="reviews">
              <div v-if="reviewsLoading" class="loading-state">
                <v-progress-circular indeterminate color="primary" />
              </div>
              <div v-else-if="reviews.items.length === 0" class="empty-state">
                <p>No reviews yet.</p>
              </div>
              <div v-else class="reviews-list">
                <ReviewCard
                  v-for="review in reviews.items"
                  :key="review.id"
                  :review="review"
                  :show-user="false"
                  class="review-item"
                />
              </div>
            </v-window-item>

            <!-- Lists Tab -->
            <v-window-item value="lists">
              <div v-if="listsLoading" class="loading-state">
                <v-progress-circular indeterminate color="primary" />
              </div>
              <div v-else-if="lists.length === 0" class="empty-state">
                <p>No public lists yet.</p>
              </div>
              <div v-else class="lists-grid">
                <div
                  v-for="list in lists"
                  :key="list.id"
                  class="list-card"
                  @click="$router.push(`/CinePhix/list/${list.id}`)"
                >
                  <div class="list-cover">
                    <img
                      v-if="list.cover_image"
                      :src="list.cover_image"
                      :alt="list.name"
                    />
                    <div v-else class="list-cover-placeholder">
                      <v-icon size="48" color="#333">mdi-format-list-bulleted</v-icon>
                    </div>
                  </div>
                  <div class="list-info">
                    <h3 class="list-name">{{ list.name }}</h3>
                    <p class="list-meta">{{ list.items_count }} items</p>
                  </div>
                </div>
              </div>
            </v-window-item>
          </v-window>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usersApi } from '@/api/client'
import { listsApi } from '@/api/services/listService'
import { useAuthStore } from '@/stores/auth'
import ReviewCard from '@/components/ReviewCard.vue'
import { useMetaTags } from '@/composables/useMetaTags'

export default {
  name: 'PublicProfilePage',

  components: { ReviewCard },

  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()
    const { setUserMeta } = useMetaTags()

    const user = ref(null)
    const loading = ref(true)
    const error = ref(null)
    const activeTab = ref('reviews')
    const reviews = ref({ items: [], total: 0 })
    const lists = ref([])
    const reviewsLoading = ref(true)
    const listsLoading = ref(true)
    const isFollowing = ref(false)
    const followLoading = ref(false)

    const initial = computed(() => {
      const name = user.value?.username || user.value?.email || 'U'
      return name.charAt(0).toUpperCase()
    })

    const isOwnProfile = computed(() => {
      return authStore.user?.username === user.value?.username
    })

    async function fetchProfile() {
      loading.value = true
      error.value = null
      try {
        const username = route.params.username
        const response = await usersApi.getPublicProfile(username)
        user.value = response.data
        setUserMeta({
          username: user.value.username,
          displayName: user.value.display_name,
          bio: user.value.bio,
          avatarUrl: user.value.avatar_url,
        })
      } catch (e) {
        error.value = e.response?.status === 404
          ? 'User not found.'
          : 'Failed to load profile.'
        loading.value = false
      }
    }

    async function fetchReviews() {
      reviewsLoading.value = true
      try {
        const username = route.params.username
        const response = await usersApi.getPublicUserReviews(username)
        reviews.value = response.data
      } catch {
        reviews.value = { items: [], total: 0 }
      } finally {
        reviewsLoading.value = false
      }
    }

    async function fetchLists() {
      listsLoading.value = true
      try {
        const username = route.params.username
        const response = await usersApi.getPublicUserLists(username)
        lists.value = response.data.lists || []
      } catch {
        lists.value = []
      } finally {
        listsLoading.value = false
      }
    }

    async function toggleFollow() {
      if (!authStore.isAuthenticated) {
        router.push('/CinePhix/auth/login')
        return
      }
      followLoading.value = true
      try {
        await usersApi.toggleFollow(user.value.id)
        isFollowing.value = !isFollowing.value
        user.value.followers_count += isFollowing.value ? 1 : -1
      } catch {
        // ignore
      } finally {
        followLoading.value = false
      }
    }

    onMounted(async () => {
      await fetchProfile()
      loading.value = false
      await Promise.all([fetchReviews(), fetchLists()])
    })

    return {
      user,
      loading,
      error,
      activeTab,
      reviews,
      lists,
      reviewsLoading,
      listsLoading,
      isFollowing,
      followLoading,
      authStore,
      initial,
      isOwnProfile,
      toggleFollow,
    }
  },
}
</script>

<style scoped>
.public-profile-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #050505, #0a0a0a);
  padding: 40px 20px;
}

.profile-container {
  max-width: 900px;
  margin: 0 auto;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 16px;
}

.empty-state p {
  color: #666;
  font-family: 'Montserrat', sans-serif;
}

.profile-header {
  display: flex;
  gap: 32px;
  align-items: flex-start;
  margin-bottom: 48px;
  flex-wrap: wrap;
}

.avatar-initial {
  font-size: 3rem;
  font-weight: 700;
  color: #fff;
}

.user-info {
  flex: 1;
  min-width: 200px;
}

.name-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.user-name {
  font-family: 'Montserrat', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
}

.user-username {
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  color: #666;
  margin: 4px 0 12px;
}

.user-bio {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  color: #aaa;
  margin: 0 0 16px;
  max-width: 500px;
}

.stats-row {
  display: flex;
  gap: 24px;
  margin-top: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-item.clickable {
  cursor: pointer;
}

.stat-value {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
}

.stat-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.profile-tabs {
  border-top: 1px solid #1a1a1a;
  padding-top: 24px;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.lists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.list-card {
  background: #141414;
  border: 1px solid #222;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s;
}

.list-card:hover {
  border-color: #04ff24;
}

.list-cover {
  height: 120px;
  background: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.list-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.list-cover-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #111;
}

.list-info {
  padding: 12px 16px;
}

.list-name {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list-meta {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.75rem;
  color: #666;
  margin: 0;
}

@media (max-width: 600px) {
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .user-name {
    font-size: 1.5rem;
  }

  .stats-row {
    justify-content: center;
  }
}
</style>
