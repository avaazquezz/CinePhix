<template>
  <div class="watched-page">
    <div class="noise-overlay"></div>

    <main class="main-content">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">
          <span class="title-accent"></span>
          Watched
        </h1>
        <p class="page-subtitle">Your watch history and progress</p>
      </div>

      <!-- Filters -->
      <div class="filter-tabs">
        <button
          :class="['tab-btn', { active: filter === 'all' }]"
          @click="setFilter('all')"
        >All</button>
        <button
          :class="['tab-btn', { active: filter === 'movie' }]"
          @click="setFilter('movie')"
        >Movies</button>
        <button
          :class="['tab-btn', { active: filter === 'tv' }]"
          @click="setFilter('tv')"
        >TV Shows</button>
        <button
          :class="['tab-btn', { active: filter === 'in_progress' }]"
          @click="setFilter('in_progress')"
        >In Progress</button>
        <button
          :class="['tab-btn', { active: filter === 'completed' }]"
          @click="setFilter('completed')"
        >Completed</button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="items-grid">
        <SkeletonCard v-for="i in 12" :key="i" />
      </div>

      <!-- Empty -->
      <div v-else-if="items.length === 0" class="empty-state">
        <v-icon size="64" color="#333">mdi-play-circle-outline</v-icon>
        <p>Nothing here yet. Start watching some movies or series!</p>
        <v-btn color="primary" @click="$router.push('/CinePhix/discover')">Discover</v-btn>
      </div>

      <!-- Grid -->
      <div v-else class="items-grid">
        <div
          v-for="item in items"
          :key="item.id"
          class="watched-card"
          @click="openMedia(item)"
        >
          <div class="poster-container">
            <img
              v-if="item.poster_url"
              :src="item.poster_url"
              :alt="item.title"
              class="poster"
            />
            <div v-else class="poster-placeholder">
              <v-icon size="40" color="#333">mdi-film</v-icon>
            </div>

            <!-- Progress bar -->
            <div v-if="item.progress_percent > 0 && !item.completed" class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: item.progress_percent + '%' }"
              ></div>
            </div>

            <!-- Completed checkmark -->
            <div v-if="item.completed" class="completed-overlay">
              <v-icon color="#04ff24" size="28">mdi-check-circle</v-icon>
            </div>

            <!-- Type badge -->
            <div class="type-badge">
              {{ item.media_type === 'movie' ? 'Movie' : 'TV' }}
            </div>
          </div>

          <div class="item-info">
            <p class="item-title">{{ item.title }}</p>
            <p class="item-progress" v-if="item.progress_percent > 0 && !item.completed">
              {{ formatProgress(item) }}
            </p>
            <p class="item-date">{{ formatDate(item.watched_at) }}</p>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <v-btn variant="outlined" :disabled="page === 1" @click="goToPage(page - 1)">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <span class="page-info">Page {{ page }} of {{ totalPages }}</span>
        <v-btn variant="outlined" :disabled="page >= totalPages" @click="goToPage(page + 1)">
          <v-icon>mdi-chevron-right</v-icon>
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
import { getWatched } from '@/api/services/watchService'

export default {
  name: 'WatchedPage',

  components: { SkeletonCard },

  setup() {
    const { setPageMeta } = useMetaTags()
    const authStore = useAuthStore()

    const items = ref([])
    const loading = ref(false)
    const filter = ref('all')
    const page = ref(1)
    const perPage = 24
    const totalPages = ref(1)

    async function fetchWatched() {
      if (!authStore.isAuthenticated) return
      loading.value = true

      try {
        const params = { page: page.value, per_page: perPage }

        if (filter.value === 'movie') params.media_type = 'movie'
        else if (filter.value === 'tv') params.media_type = 'tv'
        else if (filter.value === 'completed') params.completed = true
        else if (filter.value === 'in_progress') params.completed = false

        const res = await getWatched(params)
        const data = res.data

        // Enrich with poster URLs (fetched separately)
        items.value = (data.items || []).map(item => ({
          ...item,
          poster_url: item.poster_path
            ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
            : null,
        }))
        totalPages.value = data.pages || 1
      } catch (e) {
        console.error('Failed to load watched list', e)
        items.value = []
      } finally {
        loading.value = false
      }
    }

    function setFilter(f) {
      filter.value = f
      page.value = 1
      fetchWatched()
    }

    function goToPage(p) {
      page.value = p
      fetchWatched()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    function openMedia(item) {
      if (item.media_type === 'movie') {
        window.location.href = `/CinePhix/movies?open=${item.tmdb_id}`
      } else {
        window.location.href = `/CinePhix/series?open=${item.tmdb_id}`
      }
    }

    function formatProgress(item) {
      const pct = item.progress_percent?.toFixed(0) || 0
      if (item.duration_seconds) {
        const watched = formatTime(item.progress_seconds)
        const total = formatTime(item.duration_seconds)
        return `${watched} / ${total} (${pct}%)`
      }
      return `${pct}% watched`
    }

    function formatTime(seconds) {
      const h = Math.floor(seconds / 3600)
      const m = Math.floor((seconds % 3600) / 60)
      return h > 0 ? `${h}h ${m}m` : `${m}m`
    }

    function formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }

    onMounted(() => {
      fetchWatched()
      setPageMeta({
        title: 'Watched',
        description: 'Your watch history and progress on CinePhix.',
      })
    })

    return {
      items,
      loading,
      filter,
      page,
      totalPages,
      setFilter,
      goToPage,
      openMedia,
      formatProgress,
      formatDate,
    }
  },
}
</script>

<style scoped>
.watched-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #050505, #0a0a0a);
}

.main-content {
  padding: 24px 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 28px;
}

.page-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 2.4rem;
  font-weight: 800;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-accent {
  width: 6px;
  height: 32px;
  background: #04ff24;
  border-radius: 3px;
}

.page-subtitle {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.95rem;
  color: #666;
  margin-top: 4px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.tab-btn {
  background: #111;
  border: 1px solid #333;
  border-radius: 20px;
  padding: 7px 18px;
  color: #888;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: #04ff24;
  color: #000;
  font-weight: 700;
  border-color: #04ff24;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.watched-card {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  background: #141414;
  transition: transform 0.2s;
}

.watched-card:hover {
  transform: translateY(-4px);
}

.poster-container {
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
  background: #111;
}

.poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.poster-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(0, 0, 0, 0.5);
}

.progress-fill {
  height: 100%;
  background: #04ff24;
  transition: width 0.3s;
}

.completed-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.6);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.type-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  text-transform: uppercase;
}

.item-info {
  padding: 10px;
}

.item-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-progress {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.72rem;
  color: #04ff24;
  margin: 0 0 2px;
}

.item-date {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.7rem;
  color: #555;
  margin: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 16px;
}

.empty-state p {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  color: #444;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
  padding-bottom: 40px;
}

.page-info {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.85rem;
  color: #888;
}
</style>