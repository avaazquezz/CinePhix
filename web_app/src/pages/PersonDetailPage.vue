<template>
  <div class="person-page">
    <div class="noise-overlay"></div>

    <main class="main-content" v-if="person">
      <!-- Back -->
      <div class="nav-row">
        <v-btn icon variant="text" @click="$router.back()" class="back-btn">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </div>

      <!-- Person Header -->
      <div class="person-header">
        <div class="poster-column">
          <img
            v-if="person.profile_path"
            :src="`https://image.tmdb.org/t/p/w342${person.profile_path}`"
            :alt="person.name"
            class="profile-poster"
          />
          <div v-else class="poster-placeholder">
            <v-icon size="64" color="#333">mdi-account</v-icon>
          </div>
        </div>

        <div class="person-info">
          <h1 class="person-name">{{ person.name }}</h1>

          <div v-if="person.birthday" class="info-row">
            <span class="info-label">{{ $t('personPage.born') }}</span>
            <span class="info-value">{{ formatDate(person.birthday) }}</span>
            <span v-if="person.deathday" class="info-value"> — {{ $t('personPage.died') }} {{ formatDate(person.deathday) }}</span>
          </div>

          <div v-if="person.place_of_birth" class="info-row">
            <span class="info-label">{{ $t('personPage.place') }}</span>
            <span class="info-value">{{ person.place_of_birth }}</span>
          </div>

          <div v-if="person.known_for_department" class="info-row">
            <span class="info-label">{{ $t('personPage.knownFor') }}</span>
            <v-chip size="small" class="dept-chip">{{ person.known_for_department }}</v-chip>
          </div>

          <div v-if="person.popularity" class="info-row">
            <span class="info-label">{{ $t('personPage.popularity') }}</span>
            <span class="info-value">{{ person.popularity.toFixed(1) }}</span>
          </div>

          <div v-if="person.biography" class="bio-section">
            <h3 class="section-label">{{ $t('personPage.biography') }}</h3>
            <p class="bio-text" :class="{ truncated: !showFullBio }">
              {{ person.biography }}
            </p>
            <v-btn
              v-if="person.biography && person.biography.length > 400"
              variant="text"
              size="small"
              @click="showFullBio = !showFullBio"
            >
              {{ showFullBio ? $t('personPage.showLess') : $t('personPage.readMore') }}
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Known For / Filmography -->
      <div v-if="combinedCredits.length > 0" class="filmography-section">
        <div class="section-header">
          <h2 class="section-title">{{ $t('personPage.filmography') }}</h2>
          <div class="type-tabs">
            <button
              :class="['tab-btn', { active: typeFilter === 'movie' }]"
              @click="typeFilter = 'movie'"
            >{{ $t('personPage.moviesTab', { count: movieCredits.length }) }}</button>
            <button
              :class="['tab-btn', { active: typeFilter === 'tv' }]"
              @click="typeFilter = 'tv'"
            >{{ $t('personPage.tvTab', { count: tvCredits.length }) }}</button>
          </div>
        </div>

        <div class="credits-grid">
          <div
            v-for="item in filteredCredits"
            :key="`${item.id}-${item.media_type}`"
            class="credit-card"
            @click="openMedia(item)"
          >
            <div class="credit-poster">
              <img
                v-if="item.poster_path"
                :src="`https://image.tmdb.org/t/p/w185${item.poster_path}`"
                :alt="item.title || item.name"
                class="credit-img"
              />
              <div v-else class="credit-placeholder">
                <v-icon size="32" color="#222">mdi-film</v-icon>
              </div>
              <div v-if="item.vote_average" class="rating-badge">
                <v-icon size="12" color="#04ff24">mdi-star</v-icon>
                {{ item.vote_average.toFixed(1) }}
              </div>
            </div>
            <div class="credit-info">
              <p class="credit-title">{{ item.title || item.name }}</p>
              <p class="credit-year">{{ (item.release_date || item.first_air_date || '').slice(0, 4) }}</p>
              <p v-if="item.character" class="credit-character">{{ $t('personPage.asCharacter', { name: item.character }) }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Loading -->
    <div v-else-if="loading" class="loading-state">
      <v-progress-circular indeterminate color="primary" size="64" />
    </div>

    <!-- Error -->
    <div v-else class="error-state">
      <v-alert type="error" variant="tonal">{{ $t('personPage.notFound') }}</v-alert>
      <v-btn @click="$router.push('/CinePhix')" class="mt-4">{{ $t('personPage.goHome') }}</v-btn>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMetaTags } from '@/composables/useMetaTags'
import { useI18n } from 'vue-i18n'
import { getLocale } from '@/i18n'

export default {
  name: 'PersonDetailPage',

  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const { setPageMeta } = useMetaTags()

    const person = ref(null)
    const combinedCredits = ref([])
    const loading = ref(true)
    const showFullBio = ref(false)
    const typeFilter = ref('movie')

    const movieCredits = computed(() =>
      combinedCredits.value.filter(c => c.media_type === 'movie')
    )
    const tvCredits = computed(() =>
      combinedCredits.value.filter(c => c.media_type === 'tv')
    )
    const filteredCredits = computed(() =>
      (typeFilter.value === 'movie' ? movieCredits : tvCredits).value.slice(0, 24)
    )

    async function fetchPerson() {
      loading.value = true
      try {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:8001'
        const [personRes, movieRes, tvRes] = await Promise.all([
          fetch(`${base}/tmdb/person/${route.params.id}`),
          fetch(`${base}/tmdb/person/${route.params.id}/movie_credits`),
          fetch(`${base}/tmdb/person/${route.params.id}/tv_credits`),
        ])
        const [p, mc, tc] = await Promise.all([personRes.json(), movieRes.json(), tvRes.json()])

        person.value = p

        const movieItems = (mc.cast || []).map(m => ({ ...m, media_type: 'movie' }))
        const tvItems = (tc.cast || []).map(t => ({ ...t, media_type: 'tv' }))

        combinedCredits.value = [...movieItems, ...tvItems]
          .sort((a, b) => {
            const dateA = a.release_date || a.first_air_date || '1900'
            const dateB = b.release_date || b.first_air_date || '1900'
            return dateB.localeCompare(dateA)
          })

        setPageMeta({
          title: t('meta.person.title', { name: p.name }),
          description: p.biography?.slice(0, 160) || t('meta.person.descriptionFallback', { name: p.name }),
        })
      } catch (e) {
        person.value = null
      } finally {
        loading.value = false
      }
    }

    function formatDate(dateStr) {
      if (!dateStr) return ''
      const loc = getLocale() === 'es' ? 'es-ES' : 'en-US'
      return new Date(dateStr).toLocaleDateString(loc, { year: 'numeric', month: 'long', day: 'numeric' })
    }

    function openMedia(item) {
      if (item.media_type === 'movie') {
        window.location.href = `/CinePhix/movies?open=${item.id}`
      } else {
        window.location.href = `/CinePhix/series?open=${item.id}`
      }
    }

    onMounted(fetchPerson)

    return {
      person,
      combinedCredits,
      loading,
      showFullBio,
      typeFilter,
      movieCredits,
      tvCredits,
      filteredCredits,
      formatDate,
      openMedia,
    }
  },
}
</script>

<style scoped>
.person-page {
  min-height: 100vh;
  background: #050505;
  position: relative;
}

.main-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 40px 80px;
}

.noise-overlay {
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
}

.nav-row { margin-bottom: 20px; }
.back-btn { color: #666; }

.person-header {
  display: flex;
  gap: 32px;
  margin-bottom: 48px;
  position: relative;
  z-index: 1;
}

.poster-column { flex-shrink: 0; }

.profile-poster {
  width: 200px;
  border-radius: 12px;
  display: block;
}

.poster-placeholder {
  width: 200px;
  aspect-ratio: 2/3;
  background: #111;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.person-info { flex: 1; min-width: 0; }

.person-name {
  font-family: 'Montserrat', sans-serif;
  font-size: 2.2rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 16px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.85rem;
}

.info-label { color: #555; }
.info-value { color: #aaa; }

.dept-chip {
  background: #1a1a1a;
  color: #04ff24;
  font-size: 0.72rem;
}

.bio-section { margin-top: 20px; }

.section-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 8px;
}

.bio-text {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.88rem;
  line-height: 1.7;
  color: #888;
  white-space: pre-wrap;
}

.bio-text.truncated {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.filmography-section { position: relative; z-index: 1; }

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.section-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.4rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
}

.type-tabs {
  display: flex;
  gap: 4px;
  background: #111;
  padding: 3px;
  border-radius: 6px;
}

.tab-btn {
  background: transparent;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  color: #666;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: #04ff24;
  color: #000;
  font-weight: 700;
}

.credits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 16px;
}

.credit-card {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  background: #111;
  transition: transform 0.2s;
}

.credit-card:hover { transform: translateY(-4px); }

.credit-poster {
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
  background: #0a0a0a;
}

.credit-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.credit-placeholder {
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

.credit-info { padding: 8px 10px; }

.credit-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.credit-year {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.7rem;
  color: #555;
  margin: 0 0 2px;
}

.credit-character {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.68rem;
  color: #04ff24;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}
</style>