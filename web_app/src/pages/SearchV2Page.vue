<template>
  <div class="search-page">
    <div class="noise-overlay"></div>

    <main class="main-content">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">
          <span class="title-accent"></span>
          Search
        </h1>
      </div>

      <!-- Search Bar -->
      <div class="search-bar">
        <div class="search-input-wrapper">
          <v-icon class="search-icon" color="#555">mdi-magnify</v-icon>
          <input
            v-model="query"
            type="text"
            placeholder="Search movies, TV shows, people..."
            class="search-input"
            @keyup.enter="doSearch"
            autofocus
          />
          <v-btn
            v-if="query"
            icon="mdi-close"
            size="x-small"
            variant="text"
            class="clear-btn"
            @click="clearQuery"
          />
        </div>
        <v-btn color="primary" @click="doSearch" :loading="loading">
          Search
        </v-btn>
      </div>

      <!-- Filters row -->
      <div class="filter-bar">
        <div class="type-toggle">
          <button
            :class="['toggle-btn', { active: mediaType === 'movie' }]"
            @click="mediaType = 'movie'; doSearch()"
          >Movies</button>
          <button
            :class="['toggle-btn', { active: mediaType === 'tv' }]"
            @click="mediaType = 'tv'; doSearch()"
          >TV</button>
          <button
            :class="['toggle-btn', { active: mediaType === 'multi' }]"
            @click="mediaType = 'multi'; doSearch()"
          >All</button>
        </div>

        <select v-model="genre" class="filter-select" @change="doSearch">
          <option value="">All Genres</option>
          <option v-for="g in currentGenres" :key="g.id" :value="g.id">
            {{ g.name }}
          </option>
        </select>

        <input
          v-model.number="year"
          type="number"
          placeholder="Year"
          class="filter-input"
          min="1900"
          max="2030"
          @change="doSearch"
        />

        <div class="rating-filter">
          <span class="rating-label">Rating:</span>
          <input v-model.number="voteMin" type="number" placeholder="Min" class="filter-input rating-input"
            min="0" max="10" step="0.5" @change="doSearch" />
          <span class="rating-sep">–</span>
          <input v-model.number="voteMax" type="number" placeholder="Max" class="filter-input rating-input"
            min="0" max="10" step="0.5" @change="doSearch" />
        </div>

        <v-btn variant="text" size="small" @click="resetFilters">Reset</v-btn>
      </div>

      <!-- Active filter chips -->
      <div v-if="hasActiveFilters" class="filter-chips">
        <v-chip v-if="genre" size="small" closable @click:close="genre = ''; doSearch()">
          {{ getGenreName(genre) }}
        </v-chip>
        <v-chip v-if="year" size="small" closable @click:close="year = null; doSearch()">
          Year: {{ year }}
        </v-chip>
        <v-chip v-if="voteMin" size="small" closable @click:close="voteMin = null; doSearch()">
          Min {{ voteMin }}+
        </v-chip>
        <v-chip v-if="voteMax" size="small" closable @click:close="voteMax = null; doSearch()">
          Max {{ voteMax }}
        </v-chip>
      </div>

      <!-- Results info -->
      <div v-if="!loading && query" class="results-info">
        <span>{{ totalResults.toLocaleString() }} results for "{{ query }}"</span>
        <span v-if="searchType" class="type-indicator"> — {{ searchType }}</span>
      </div>

      <!-- Loading skeletons -->
      <div v-if="loading" class="items-grid">
        <SkeletonCard v-for="i in 20" :key="i" />
      </div>

      <!-- Empty state -->
      <div v-else-if="query && results.length === 0" class="empty-state">
        <v-icon size="64" color="#333">mdi-movie-search</v-icon>
        <p>No results for "{{ query }}". Try different keywords.</p>
      </div>

      <!-- Initial state (no query yet) -->
      <div v-else-if="!query" class="empty-state">
        <v-icon size="64" color="#333">mdi-magnify</v-icon>
        <p>Search for movies, TV shows, or actors.</p>
      </div>

      <!-- Results grid -->
      <div v-else class="items-grid">
        <div
          v-for="item in results"
          :key="`${item.id}-${item.media_type || mediaType}`"
          class="result-card"
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
              <v-icon v-if="(item.media_type || mediaType) === 'person'" size="40" color="#222">mdi-account</v-icon>
              <v-icon v-else size="40" color="#222">mdi-film</v-icon>
            </div>

            <div v-if="item.vote_average" class="rating-badge">
              <v-icon size="12" color="#04ff24">mdi-star</v-icon>
              {{ item.vote_average.toFixed(1) }}
            </div>

            <!-- Type badge for multi search -->
            <div v-if="searchType === 'multi' && item.media_type" class="type-badge">
              {{ item.media_type === 'movie' ? 'Movie' : item.media_type === 'tv' ? 'TV' : 'Person' }}
            </div>
          </div>

          <div class="item-info">
            <p class="item-title">{{ item.title || item.name }}</p>
            <p v-if="(item.release_date || item.first_air_date)" class="item-year">
              {{ (item.release_date || item.first_air_date).slice(0, 4) }}
            </p>
            <p v-if="item.known_for" class="item-known">
              Known for: {{ item.known_for?.slice(0, 2).map(m => m.title || m.name).join(', ') }}
            </p>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SkeletonCard from '@/components/SkeletonCard.vue'
import { useMetaTags } from '@/composables/useMetaTags'
import api from '@/api'

const GENRE_MAP = { movie: {}, tv: {} }

export default {
  name: 'SearchV2Page',

  components: { SkeletonCard },

  setup() {
    const route = useRoute()
    const { setPageMeta } = useMetaTags()

    const query = ref('')
    const mediaType = ref('multi')
    const genre = ref('')
    const year = ref(null)
    const voteMin = ref(null)
    const voteMax = ref(null)
    const results = ref([])
    const loading = ref(false)
    const page = ref(1)
    const totalResults = ref(0)
    const totalPages = ref(1)
    const genres = ref({ movie: [], tv: [] })
    const searchType = ref('')

    const currentGenres = computed(() => genres.value[mediaType.value === 'multi' ? 'movie' : mediaType.value] || [])
    const hasActiveFilters = computed(() => genre.value || year.value || voteMin.value || voteMax.value)

    async function fetchGenres() {
      try {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:8001'
        const res = await fetch(`${base}/discover/genres`)
        const data = await res.json()
        genres.value.movie = data.movie_genres || []
        genres.value.tv = data.tv_genres || []
        GENRE_MAP.movie = Object.fromEntries(data.movie_genres.map(g => [g.id, g.name]))
        GENRE_MAP.tv = Object.fromEntries(data.tv_genres.map(g => [g.id, g.name]))
      } catch (e) {
        console.error('Failed to load genres', e)
      }
    }

    async function doSearch(resetPage = true) {
      if (resetPage) page.value = 1
      if (!query.value.trim()) return

      loading.value = true
      try {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:8001'
        const params = new URLSearchParams({ query: query.value, page: page.value, per_page: 20 })
        if (mediaType.value !== 'multi') params.set('media_type', mediaType.value)
        if (genre.value) params.set('genre', genre.value)
        if (year.value) params.set('year', year.value)
        if (voteMin.value) params.set('vote_min', voteMin.value)
        if (voteMax.value) params.set('vote_max', voteMax.value)

        const res = await fetch(`${base}/search/v2?${params}`)
        const data = await res.json()

        searchType.value = data.media_type || mediaType.value
        results.value = (data.results || []).map(item => ({
          ...item,
          media_type: item.media_type || searchType.value,
        }))
        totalResults.value = data.total_results || 0
        totalPages.value = data.pages || 1

        setPageMeta({
          title: `Search: ${query.value}`,
          description: `${totalResults.value} results for "${query.value}" on CinePhix`,
        })
      } catch (e) {
        results.value = []
      } finally {
        loading.value = false
      }
    }

    function goToPage(p) {
      page.value = p
      doSearch(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    function clearQuery() {
      query.value = ''
      results.value = []
      totalResults.value = 0
    }

    function resetFilters() {
      genre.value = ''
      year.value = null
      voteMin.value = null
      voteMax.value = null
      doSearch()
    }

    function getGenreName(id) {
      return GENRE_MAP[mediaType.value === 'multi' ? 'movie' : mediaType.value][id] || id
    }

    function openMedia(item) {
      const mt = item.media_type || mediaType.value
      if (mt === 'movie') {
        window.location.href = `/CinePhix/movies?open=${item.id}`
      } else if (mt === 'tv') {
        window.location.href = `/CinePhix/series?open=${item.id}`
      } else if (mt === 'person') {
        window.location.href = `/CinePhix/person/${item.id}`
      }
    }

    onMounted(() => {
      fetchGenres()
      if (route.query.q) {
        query.value = route.query.q
        doSearch()
      }
      setPageMeta({ title: 'Search', description: 'Search movies, TV shows, and actors on CinePhix.' })
    })

    return {
      query,
      mediaType,
      genre,
      year,
      voteMin,
      voteMax,
      results,
      loading,
      page,
      totalResults,
      totalPages,
      currentGenres,
      hasActiveFilters,
      searchType,
      doSearch,
      goToPage,
      clearQuery,
      resetFilters,
      getGenreName,
      openMedia,
    }
  },
}
</script>

<style scoped>
.search-page {
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

.page-header { margin-bottom: 28px; }

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

.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  min-width: 280px;
}

.search-icon {
  position: absolute;
  left: 14px;
  pointer-events: none;
}

.search-input {
  width: 100%;
  background: #111;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 12px 40px 12px 42px;
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.95rem;
  outline: none;
}

.search-input:focus { border-color: #04ff24; }

.clear-btn {
  position: absolute;
  right: 8px;
  color: #555;
}

.filter-bar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 12px;
}

.type-toggle {
  display: flex;
  background: #111;
  border-radius: 6px;
  padding: 2px;
}

.toggle-btn {
  background: transparent;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  color: #666;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn.active {
  background: #04ff24;
  color: #000;
  font-weight: 700;
}

.filter-select,
.filter-input {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 8px 12px;
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.85rem;
  outline: none;
}

.filter-select { min-width: 120px; cursor: pointer; }
.filter-input { width: 90px; }

.rating-filter {
  display: flex;
  align-items: center;
  gap: 6px;
}

.rating-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  color: #555;
}

.rating-input { width: 65px; }
.rating-sep { color: #333; }

.filter-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.results-info {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 16px;
}

.type-indicator { color: #04ff24; }

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
}

.result-card {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  background: #111;
  transition: transform 0.2s;
}

.result-card:hover { transform: translateY(-4px); }

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
  margin: 0 0 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-year {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.7rem;
  color: #555;
  margin: 0 0 2px;
}

.item-known {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.68rem;
  color: #444;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
}

.page-info {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.85rem;
  color: #555;
}
</style>