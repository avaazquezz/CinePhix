<template>
  <div class="discover-page">
    <div class="noise-overlay"></div>

    <main class="main-content">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">
          <span class="title-accent"></span>
          {{ $t('discover.title') }}
        </h1>
        <p class="page-subtitle">{{ $t('discover.subtitle') }}</p>
      </div>

      <!-- Filter Bar -->
      <div class="filter-bar">
        <div class="filter-row">
          <!-- Sort -->
          <select v-model="filters.sort_by" class="filter-select" @change="fetchMedia">
            <option value="popularity.desc">{{ $t('discover.sortPopularity') }}</option>
            <option value="vote_average.desc">{{ $t('discover.sortTopRated') }}</option>
            <option value="release_date.desc">{{ $t('discover.sortNewest') }}</option>
          </select>

          <!-- Type toggle -->
          <div class="type-toggle">
            <button
              :class="['toggle-btn', { active: mediaType === 'movie' }]"
              @click="setMediaType('movie')"
            >{{ $t('discover.movies') }}</button>
            <button
              :class="['toggle-btn', { active: mediaType === 'tv' }]"
              @click="setMediaType('tv')"
            >{{ $t('discover.tvShows') }}</button>
          </div>
        </div>

        <div class="filter-row">
          <!-- Year -->
          <input
            v-model.number="filters.year"
            type="number"
            :placeholder="$t('discover.year')"
            class="filter-input"
            min="1900"
            max="2030"
            @change="fetchMedia"
          />

          <!-- Genre dropdown -->
          <select v-model="filters.genre" class="filter-select" @change="fetchMedia">
            <option value="">{{ $t('discover.allGenres') }}</option>
            <option v-for="g in currentGenres" :key="g.id" :value="g.id">
              {{ g.name }}
            </option>
          </select>

          <!-- Rating range -->
          <div class="rating-filter">
            <span class="rating-label">{{ $t('discover.rating') }}:</span>
            <input
              v-model.number="filters.vote_min"
              type="number"
              :placeholder="$t('discover.min')"
              class="filter-input rating-input"
              min="0"
              max="10"
              step="0.5"
              @change="fetchMedia"
            />
            <span class="rating-sep">–</span>
            <input
              v-model.number="filters.vote_max"
              type="number"
              :placeholder="$t('discover.max')"
              class="filter-input rating-input"
              min="0"
              max="10"
              step="0.5"
              @change="fetchMedia"
            />
          </div>

          <!-- Apply / Reset -->
          <v-btn color="primary" size="small" @click="fetchMedia">{{ $t('discover.apply') }}</v-btn>
          <v-btn variant="text" size="small" @click="resetFilters">{{ $t('discover.reset') }}</v-btn>
        </div>

        <!-- Active filter chips -->
        <div v-if="hasActiveFilters" class="filter-chips">
          <v-chip
            v-if="filters.year"
            size="small"
            closable
            @click:close="filters.year = null; fetchMedia()"
          >
            {{ $t('discover.chipYear', { year: filters.year }) }}
          </v-chip>
          <v-chip
            v-if="filters.genre"
            size="small"
            closable
            @click:close="filters.genre = ''; fetchMedia()"
          >
            {{ getGenreName(filters.genre) }}
          </v-chip>
          <v-chip
            v-if="filters.vote_min"
            size="small"
            closable
            @click:close="filters.vote_min = null; fetchMedia()"
          >
            {{ $t('discover.chipMin', { n: filters.vote_min }) }}
          </v-chip>
          <v-chip
            v-if="filters.vote_max"
            size="small"
            closable
            @click:close="filters.vote_max = null; fetchMedia()"
          >
            {{ $t('discover.chipMax', { n: filters.vote_max }) }}
          </v-chip>
        </div>
      </div>

      <!-- Results count -->
      <div class="results-info">
        <span v-if="!loading">{{ $t('discover.resultsCount', { count: totalResults.toLocaleString() }) }}</span>
        <span v-else>{{ $t('discover.loading') }}</span>
      </div>

      <!-- Media Grid -->
      <div v-if="loading" class="media-grid">
        <SkeletonCard v-for="i in 20" :key="i" />
      </div>

      <div v-else-if="results.length === 0" class="empty-state">
        <v-icon size="64" color="#333">mdi-movie-search</v-icon>
        <p>{{ $t('discover.emptyState') }}</p>
      </div>

      <div v-else class="media-grid">
        <MovieCard
          v-for="item in results"
          :key="`${item.id}-${item.media_type}`"
          :item="item"
          :media-type="item.media_type"
          @click="openMedia(item)"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <v-btn
          variant="outlined"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>

        <div class="page-info">
          {{ $t('discover.pageOf', { current: currentPage, total: totalPages }) }}
        </div>

        <v-btn
          variant="outlined"
          :disabled="currentPage >= totalPages"
          @click="goToPage(currentPage + 1)"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </main>

    <!-- Media Detail Dialog (reuses MoviesPage/SeriesPage logic) -->
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import MovieCard from '@/components/MovieCard.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import { useMetaTags } from '@/composables/useMetaTags'

const GENRE_MAP = {
  movie: {},
  tv: {},
}

export default {
  name: 'DiscoverPage',

  components: { MovieCard, SkeletonCard },

  setup() {
    const { t } = useI18n()
    const { setPageMeta } = useMetaTags()

    const mediaType = ref('movie')
    const filters = ref({
      sort_by: 'popularity.desc',
      year: null,
      genre: '',
      vote_min: null,
      vote_max: null,
    })
    const results = ref([])
    const loading = ref(false)
    const currentPage = ref(1)
    const totalResults = ref(0)
    const perPage = 20
    const genres = ref({ movie: [], tv: [] })

    const currentGenres = computed(() => genres.value[mediaType.value] || [])
    const totalPages = computed(() => Math.ceil(totalResults.value / perPage))
    const hasActiveFilters = computed(
      () => filters.value.year || filters.value.genre || filters.value.vote_min || filters.value.vote_max
    )

    async function fetchGenres() {
      try {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:8001'
        const res = await fetch(`${base}/discover/genres`)
        const data = await res.json()
        genres.value.movie = data.movie_genres || []
        genres.value.tv = data.tv_genres || []

        // Build quick lookup
        GENRE_MAP.movie = Object.fromEntries(data.movie_genres.map(g => [g.id, g.name]))
        GENRE_MAP.tv = Object.fromEntries(data.tv_genres.map(g => [g.id, g.name]))
      } catch (e) {
        console.error('Failed to load genres', e)
      }
    }

    async function fetchMedia() {
      loading.value = true
      currentPage.value = 1
      try {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:8001'
        const params = new URLSearchParams({
          sort_by: filters.value.sort_by,
          page: currentPage.value,
          per_page: perPage,
        })
        if (filters.value.year) params.set('year', filters.value.year)
        if (filters.value.genre) params.set('genre', filters.value.genre)
        if (filters.value.vote_min) params.set('vote_min', filters.value.vote_min)
        if (filters.value.vote_max) params.set('vote_max', filters.value.vote_max)

        const endpoint = mediaType.value === 'movie' ? '/discover/movies' : '/discover/tv'
        const res = await fetch(`${base}${endpoint}?${params}`)
        const data = await res.json()

        results.value = (data.results || []).map(item => ({
          ...item,
          media_type: mediaType.value,
        }))
        totalResults.value = data.total_results || 0
      } catch (e) {
        console.error('Failed to fetch media', e)
        results.value = []
      } finally {
        loading.value = false
      }
    }

    function goToPage(page) {
      currentPage.value = page
      fetchMediaWithPage()
    }

    async function fetchMediaWithPage() {
      loading.value = true
      try {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:8001'
        const params = new URLSearchParams({
          sort_by: filters.value.sort_by,
          page: currentPage.value,
          per_page: perPage,
        })
        if (filters.value.year) params.set('year', filters.value.year)
        if (filters.value.genre) params.set('genre', filters.value.genre)
        if (filters.value.vote_min) params.set('vote_min', filters.value.vote_min)
        if (filters.value.vote_max) params.set('vote_max', filters.value.vote_max)

        const endpoint = mediaType.value === 'movie' ? '/discover/movies' : '/discover/tv'
        const res = await fetch(`${base}${endpoint}?${params}`)
        const data = await res.json()

        results.value = (data.results || []).map(item => ({
          ...item,
          media_type: mediaType.value,
        }))
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } finally {
        loading.value = false
      }
    }

    function setMediaType(type) {
      mediaType.value = type
      filters.value.genre = ''
      fetchMedia()
    }

    function resetFilters() {
      filters.value = { sort_by: 'popularity.desc', year: null, genre: '', vote_min: null, vote_max: null }
      fetchMedia()
    }

    function getGenreName(id) {
      return GENRE_MAP[mediaType.value][id] || id
    }

    function openMedia(item) {
      if (item.media_type === 'movie') {
        window.location.href = `/CinePhix/movies?open=${item.id}`
      } else {
        window.location.href = `/CinePhix/series?open=${item.id}`
      }
    }

    onMounted(() => {
      fetchGenres()
      fetchMedia()
      setPageMeta({
        title: t('meta.discover.title'),
        description: t('meta.discover.description'),
      })
    })

    return {
      mediaType,
      filters,
      results,
      loading,
      currentPage,
      totalResults,
      perPage,
      currentGenres,
      totalPages,
      hasActiveFilters,
      fetchMedia,
      goToPage,
      setMediaType,
      resetFilters,
      getGenreName,
      openMedia,
    }
  },
}
</script>

<style scoped>
.discover-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #050505, #0a0a0a);
}

.main-content {
  padding: 24px 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
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

.filter-bar {
  background: #111;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
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

.filter-select {
  min-width: 140px;
  cursor: pointer;
}

.filter-input {
  width: 100px;
}

.type-toggle {
  display: flex;
  background: #1a1a1a;
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

.rating-filter {
  display: flex;
  align-items: center;
  gap: 6px;
}

.rating-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  color: #666;
}

.rating-input {
  width: 70px;
}

.rating-sep {
  color: #444;
}

.filter-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.results-info {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 16px;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 16px;
  color: #444;
}

.empty-state p {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
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