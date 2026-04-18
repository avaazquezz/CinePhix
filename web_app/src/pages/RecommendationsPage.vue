<template>
  <div class="recommendations-page">
    <div class="noise-overlay"></div>

    <main class="main-content">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">
          <span class="title-accent"></span>
          For You
        </h1>
        <p class="page-subtitle">Movies and shows picked based on your watch history and follows</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="items-grid">
        <SkeletonCard v-for="i in 20" :key="i" />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="empty-state">
        <v-icon size="64" color="#333">mdi-lightbulb-off</v-icon>
        <p>{{ error }}</p>
        <v-btn color="primary" @click="fetchRecommendations">
          Try again
        </v-btn>
      </div>

      <!-- Empty -->
      <div v-else-if="items.length === 0" class="empty-state">
        <v-icon size="64" color="#333">mdi-lightbulb</v-icon>
        <p>Not enough data yet. Watch some movies and follow people to get personalised recommendations!</p>
        <v-btn color="primary" @click="$router.push('/CinePhix/discover')">
          Discover movies
        </v-btn>
      </div>

      <!-- Recommendations Grid -->
      <div v-else class="items-grid">
        <div
          v-for="item in items"
          :key="`${item.id}-${item.media_type}`"
          class="rec-card"
          @click="openMedia(item)"
        >
          <div class="poster-container">
            <img
              v-if="item.poster_path"
              :src="`https://image.tmdb.org/t/p/w342${item.poster_path}`"
              :alt="item.title || item.name"
              class="poster"
            />
            <div v-else class="poster-placeholder">
              <v-icon size="40" color="#222">mdi-film</v-icon>
            </div>

            <!-- Rating -->
            <div v-if="item.vote_average" class="rating-badge">
              <v-icon size="12" color="#04ff24">mdi-star</v-icon>
              {{ item.vote_average.toFixed(1) }}
            </div>

            <!-- Media type badge -->
            <div class="type-badge">
              {{ item.media_type === 'movie' ? 'Movie' : 'TV' }}
            </div>
          </div>

          <div class="item-info">
            <p class="item-title">{{ item.title || item.name }}</p>
            <p v-if="item.reason" class="item-reason">{{ item.reason }}</p>
            <p class="item-year">{{ (item.release_date || item.first_air_date || '').slice(0, 4) }}</p>
          </div>
        </div>
      </div>

      <!-- Load more -->
      <div v-if="!loading && items.length > 0 && hasMore" class="load-more">
        <v-btn variant="outlined" @click="loadMore" :loading="loadingMore">
          Load more
        </v-btn>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import { useMetaTags } from '@/composables/useMetaTags'
import { useAuthStore } from '@/stores/auth'
import api from '@/api'

export default {
  name: 'RecommendationsPage',

  components: { SkeletonCard },

  setup() {
    const { setPageMeta } = useMetaTags()
    const authStore = useAuthStore()

    const items = ref([])
    const loading = ref(true)
    const loadingMore = ref(false)
    const error = ref(null)
    const page = ref(1)
    const hasMore = ref(false)

    async function fetchRecommendations(loadMore = false) {
      if (loadMore) {
        loadingMore.value = true
        page.value++
      } else {
        loading.value = true
      }

      try {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:8001'
        const res = await fetch(
          `${base}/recommendations/personalized?page=${page.value}&per_page=20`,
          authStore.isAuthenticated
            ? { headers: { Authorization: `Bearer ${authStore.token}` } }
            : {}
        )
        const data = await res.json()

        const newItems = (data.results || []).map(item => ({
          ...item,
          media_type: item.media_type || data.media_type || 'movie',
        }))

        if (loadMore) {
          items.value.push(...newItems)
        } else {
          items.value = newItems
        }

        hasMore.value = (data.total_results || 0) > items.value.length
        error.value = null
      } catch (e) {
        error.value = 'Failed to load recommendations'
        if (!loadMore) items.value = []
      } finally {
        loading.value = false
        loadingMore.value = false
      }
    }

    function openMedia(item) {
      if (item.media_type === 'movie') {
        window.location.href = `/CinePhix/movies?open=${item.id}`
      } else {
        window.location.href = `/CinePhix/series?open=${item.id}`
      }
    }

    function loadMore() {
      fetchRecommendations(true)
    }

    onMounted(() => {
      fetchRecommendations()
      setPageMeta({
        title: 'For You — Recommendations',
        description: 'Personalised movie and TV recommendations based on your taste.',
      })
    })

    return { items, loading, loadingMore, error, hasMore, fetchRecommendations, openMedia, loadMore }
  },
}
</script>

<style scoped>
.recommendations-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #050505, #0a0a0a);
}

.main-content {
  padding: 24px 40px 80px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.noise-overlay {
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
}

.page-header { margin-bottom: 32px; }

.page-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 2.4rem;
  font-weight: 800;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
}

.title-accent {
  width: 6px;
  height: 32px;
  background: #04ff24;
  border-radius: 3px;
}

.page-subtitle {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  color: #555;
  margin-top: 4px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
}

.rec-card {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  background: #111;
  transition: transform 0.2s;
}

.rec-card:hover { transform: translateY(-6px); }

.poster-container { position: relative; width: 100%; aspect-ratio: 2/3; background: #0a0a0a; }

.poster { width: 100%; height: 100%; object-fit: cover; }

.poster-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rating-badge {
  position: absolute;
  bottom: 6px;
  right: 6px;
  background: rgba(0,0,0,0.7);
  color: #04ff24;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  gap: 2px;
}

.type-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.62rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 3px;
  text-transform: uppercase;
}

.item-info { padding: 10px 12px; }

.item-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-reason {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.7rem;
  color: #04ff24;
  margin: 0 0 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-year {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.7rem;
  color: #444;
  margin: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 16px;
  text-align: center;
}

.empty-state p {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  color: #444;
  max-width: 400px;
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
</style>