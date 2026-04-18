<template>
  <div class="page-container">
    <div class="noise-overlay"></div>

    <main class="main-content">

      <!-- Popular -->
      <section class="content-section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="title-accent"></span>
            {{ $t('series.popular') }}
          </h2>
          <div class="title-underline"></div>
        </div>
        <div class="row-container">
          <button class="nav-btn prev" @click="scrollCategory('popular', 'prev')" v-if="!isLoading">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="content-row" ref="popularRow">
            <template v-if="isLoading">
              <div v-for="n in 8" :key="`sk-pop-${n}`" class="card-slot">
                <SkeletonCard />
              </div>
            </template>
            <template v-else>
              <MovieCard
                v-for="item in popularSeries"
                :key="item.id"
                :id="item.id"
                :title="item.name"
                :image="getImageUrl(item.poster_path)"
                media-type="tv"
                :rating="item.vote_average ? item.vote_average / 2 : null"
                @select="openDialog(item.id)"
              />
            </template>
          </div>
          <button class="nav-btn next" @click="scrollCategory('popular', 'next')" v-if="!isLoading">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </section>

      <!-- Top Rated -->
      <section class="content-section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="title-accent"></span>
            {{ $t('series.topRated') }}
          </h2>
          <div class="title-underline"></div>
        </div>
        <div class="row-container">
          <button class="nav-btn prev" @click="scrollCategory('topRated', 'prev')" v-if="!isLoading">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="content-row" ref="topRatedRow">
            <template v-if="isLoading">
              <div v-for="n in 8" :key="`sk-top-${n}`" class="card-slot">
                <SkeletonCard />
              </div>
            </template>
            <template v-else>
              <MovieCard
                v-for="item in topRatedSeries"
                :key="item.id"
                :id="item.id"
                :title="item.name"
                :image="getImageUrl(item.poster_path)"
                media-type="tv"
                :rating="item.vote_average ? item.vote_average / 2 : null"
                @select="openDialog(item.id)"
              />
            </template>
          </div>
          <button class="nav-btn next" @click="scrollCategory('topRated', 'next')" v-if="!isLoading">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </section>

      <!-- Trending -->
      <section class="content-section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="title-accent"></span>
            {{ $t('series.weeklyTrending') }}
          </h2>
          <div class="title-underline"></div>
        </div>
        <div class="row-container">
          <button class="nav-btn prev" @click="scrollCategory('trending', 'prev')" v-if="!isLoading">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="content-row" ref="trendingRow">
            <template v-if="isLoading">
              <div v-for="n in 8" :key="`sk-tre-${n}`" class="card-slot">
                <SkeletonCard />
              </div>
            </template>
            <template v-else>
              <MovieCard
                v-for="item in trendingSeries"
                :key="item.id"
                :id="item.id"
                :title="item.name"
                :image="getImageUrl(item.poster_path)"
                media-type="tv"
                :rating="item.vote_average ? item.vote_average / 2 : null"
                @select="openDialog(item.id)"
              />
            </template>
          </div>
          <button class="nav-btn next" @click="scrollCategory('trending', 'next')" v-if="!isLoading">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </section>

    </main>

    <!-- ── Detail Dialog ── -->
    <transition name="dialog-fade">
      <div v-if="isDialogOpen" class="cp-dialog-overlay" @click.self="closeDialog">
        <div class="cp-dialog-box">
          <button class="cp-dialog-close" @click="closeDialog" aria-label="Close">
            <i class="fas fa-times"></i>
          </button>

          <div class="cp-dialog-layout">
            <!-- Poster -->
            <div class="cp-dialog-poster-wrap">
              <img
                :src="getImageUrl(seriesDetail.poster_path, true)"
                :alt="seriesDetail.name"
                class="cp-dialog-poster"
              />
            </div>

            <!-- Details -->
            <div class="cp-dialog-details">
              <h2 class="cp-dialog-title">{{ seriesDetail.name }}</h2>

              <div class="cp-dialog-meta">
                <span class="cp-meta-chip">
                  <i class="fas fa-calendar"></i>
                  {{ seriesDetail.first_air_date || '—' }}
                </span>
                <span class="cp-meta-chip rating">
                  <i class="fas fa-star"></i>
                  {{ seriesDetail.vote_average?.toFixed(1) || '?' }}/10
                </span>
                <span class="cp-meta-chip share-row">
                  <ShareButtons
                    :url="seriesShareUrl"
                    :title="`${seriesDetail.name} on CinePhix`"
                    description=""
                  />
                </span>
              </div>

              <!-- Action Buttons -->
              <div class="cp-dialog-actions">
                <button
                  class="cp-action-btn"
                  :class="{ active: isInWatchlist }"
                  @click="toggleWatchlist"
                >
                  <i :class="isInWatchlist ? 'fas fa-bookmark' : 'far fa-bookmark'"></i>
                  {{ isInWatchlist ? 'In Watchlist' : 'Watchlist' }}
                </button>
                <button
                  class="cp-action-btn"
                  :class="{ active: isFavorite }"
                  @click="toggleFavorite"
                >
                  <i :class="isFavorite ? 'fas fa-heart' : 'far fa-heart'"></i>
                  {{ isFavorite ? 'Favorited' : 'Favorite' }}
                </button>
              </div>

              <!-- Synopsis -->
              <div>
                <p class="cp-section-label">{{ $t('series.detail.overview') || 'Synopsis' }}</p>
                <p class="cp-overview">{{ seriesDetail.overview || '—' }}</p>
              </div>

              <!-- Credits -->
              <div>
                <p class="cp-section-label">{{ $t('series.detail.credits') || 'Cast' }}</p>
                <div class="cp-credits-grid">
                  <div v-for="actor in seriesCredits.slice(0, 8)" :key="actor.id" class="cp-credit-item">
                    <span class="cp-credit-name">{{ actor.name }}</span>
                    <span class="cp-credit-char">{{ actor.character }}</span>
                  </div>
                </div>
              </div>

              <!-- Reviews -->
              <div class="reviews-section">
                <div class="cp-reviews-header">
                  <p class="cp-reviews-title">Reviews</p>
                  <v-btn
                    size="small"
                    color="primary"
                    variant="outlined"
                    @click="showReviewForm = !showReviewForm"
                  >
                    {{ showReviewForm ? 'Cancel' : 'Write a Review' }}
                  </v-btn>
                </div>

                <ReviewForm
                  v-if="showReviewForm"
                  :is-submitting="isSubmittingReview"
                  :error="reviewError"
                  @submit="handleCreateReview"
                  @cancel="handleCancelReview"
                />

                <ReviewList
                  :reviews="seriesReviews"
                  :is-loading="isLoadingReviews"
                  :current-sort="reviewsSort"
                  :current-user-id="authStore.user?.id"
                  @update:sort="handleSortChange"
                  @vote="handleVoteReview"
                  @edit="handleEditReview"
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import MovieCard from '@/components/MovieCard.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import ShareButtons from '@/components/ShareButtons.vue'
import ReviewForm from '@/components/ReviewForm.vue'
import ReviewList from '@/components/ReviewList.vue'
import { useMetaTags } from '@/composables/useMetaTags'
import { useWatchlistStore } from '@/stores/watchlist'
import { useFavoritesStore } from '@/stores/favorites'
import { useAuthStore } from '@/stores/auth'
import { getReviewsForMedia, createReview, voteReview } from '@/api/services/reviewService'
import {
  getPopularSeries,
  getTopRatedSeries,
  getTrendingSeries,
  getSeriesDetail,
  getSeriesCredits,
} from '@/ApiController/services/seriesService'

export default {
  name: 'SeriesPage',
  components: { MovieCard, SkeletonCard, ShareButtons, ReviewForm, ReviewList },
  setup() {
    const popularSeries  = ref([])
    const topRatedSeries = ref([])
    const trendingSeries = ref([])
    const isLoading      = ref(true)
    const isDialogOpen   = ref(false)
    const seriesDetail   = ref({})
    const seriesCredits  = ref([])

    const seriesReviews       = ref([])
    const reviewsSort         = ref('recent')
    const isLoadingReviews    = ref(false)
    const isSubmittingReview  = ref(false)
    const reviewError         = ref(null)
    const showReviewForm      = ref(false)
    const editingReview       = ref(null)

    const popularRow  = ref(null)
    const topRatedRow = ref(null)
    const trendingRow = ref(null)

    const watchlistStore = useWatchlistStore()
    const favoritesStore = useFavoritesStore()
    const authStore      = useAuthStore()
    const { setSeriesMeta, setPageMeta } = useMetaTags()

    const isInWatchlist = computed(() =>
      watchlistStore.hasItem(seriesDetail.value.id, 'tv')
    )
    const isFavorite = computed(() =>
      favoritesStore.hasItem(seriesDetail.value.id, 'tv')
    )

    const seriesShareUrl = computed(() => {
      if (!seriesDetail.value.id) return window.location.href
      return `${window.location.origin}/CinePhix/series?open=${seriesDetail.value.id}`
    })

    const getImageUrl = (path, isDetail = false) => {
      if (!path) return ''
      const isMobile = window.innerWidth <= 480
      const size = isDetail ? (isMobile ? 'w342' : 'w500') : (isMobile ? 'w185' : 'w342')
      return `https://image.tmdb.org/t/p/${size}${path}`
    }

    const fetchSeries = async () => {
      try {
        isLoading.value = true
        popularSeries.value  = await getPopularSeries()
        topRatedSeries.value = await getTopRatedSeries()
        trendingSeries.value = await getTrendingSeries()
      } catch (e) {
        console.error('Error loading series:', e)
      } finally {
        isLoading.value = false
      }
    }

    const openDialog = async (id) => {
      try {
        seriesDetail.value  = await getSeriesDetail(id)
        seriesCredits.value = await getSeriesCredits(id)
        seriesReviews.value = []
        reviewsSort.value   = 'recent'
        showReviewForm.value = false
        editingReview.value  = null
        await fetchSeriesReviews()
        isDialogOpen.value = true
        document.body.style.overflow = 'hidden'
        window.dispatchEvent(new CustomEvent('dialog-opened'))

        const s = seriesDetail.value
        setSeriesMeta({
          title:  s.name || s.title,
          year:   s.first_air_date ? s.first_air_date.slice(0, 4) : null,
          rating: s.vote_average ? (s.vote_average / 2).toFixed(1) : null,
          poster: s.poster_path ? `https://image.tmdb.org/t/p/w780${s.poster_path}` : null,
          overview: s.overview,
          genres: s.genres ? s.genres.map(g => g.name).join(', ') : null,
          tmdbId: s.id,
        })
      } catch (e) {
        console.error('Error loading series details:', e)
      }
    }

    const closeDialog = () => {
      isDialogOpen.value   = false
      seriesDetail.value   = {}
      seriesCredits.value  = []
      seriesReviews.value  = []
      showReviewForm.value = false
      editingReview.value  = null
      document.body.style.overflow = ''
      window.dispatchEvent(new CustomEvent('dialog-closed'))
      setPageMeta({ title: 'TV Series', description: 'Browse popular, top-rated and trending TV series on CinePhix.' })
    }

    const scrollCategory = (category, direction) => {
      const rowRef = { popular: popularRow, topRated: topRatedRow, trending: trendingRow }[category]
      if (!rowRef.value) return
      const amount = rowRef.value.clientWidth * 0.8
      rowRef.value.scrollTo({
        left: rowRef.value.scrollLeft + (direction === 'next' ? amount : -amount),
        behavior: 'smooth',
      })
    }

    const toggleWatchlist = async () => {
      if (!authStore.isAuthenticated) { window.location.href = '/CinePhix/auth/login'; return }
      if (isInWatchlist.value) {
        await watchlistStore.removeByTmdbId(seriesDetail.value.id, 'tv')
      } else {
        await watchlistStore.addItem(seriesDetail.value.id, 'tv')
      }
    }

    const toggleFavorite = async () => {
      if (!authStore.isAuthenticated) { window.location.href = '/CinePhix/auth/login'; return }
      await favoritesStore.toggleFavorite(seriesDetail.value.id, 'tv')
    }

    // ── Reviews ──
    const fetchSeriesReviews = async (sort = reviewsSort.value) => {
      if (!seriesDetail.value.id) return
      isLoadingReviews.value = true
      try {
        const data = await getReviewsForMedia({ tmdbId: seriesDetail.value.id, mediaType: 'tv', sortBy: sort })
        seriesReviews.value = data.items
      } catch (e) {
        console.error('Error fetching reviews', e)
      } finally {
        isLoadingReviews.value = false
      }
    }

    const handleSortChange = async (sort) => {
      reviewsSort.value = sort
      await fetchSeriesReviews(sort)
    }

    const handleCreateReview = async ({ rating, content, isSpoiler }) => {
      if (!authStore.isAuthenticated) { window.location.href = '/CinePhix/auth/login'; return }
      reviewError.value = null
      isSubmittingReview.value = true
      try {
        await createReview({ tmdbId: seriesDetail.value.id, mediaType: 'tv', rating, content, isSpoiler })
        showReviewForm.value = false
        await fetchSeriesReviews()
      } catch (e) {
        reviewError.value = e.response?.data?.detail || 'Failed to post review'
      } finally {
        isSubmittingReview.value = false
      }
    }

    const handleVoteReview = async (reviewId, voteType) => {
      if (!authStore.isAuthenticated) { window.location.href = '/CinePhix/auth/login'; return }
      try {
        await voteReview(reviewId, voteType)
        await fetchSeriesReviews()
      } catch (e) {
        console.error('Error voting on review', e)
      }
    }

    const handleEditReview = (review) => {
      editingReview.value  = review
      showReviewForm.value = true
    }

    const handleCancelReview = () => {
      showReviewForm.value = false
      editingReview.value  = null
      reviewError.value    = null
    }

    onMounted(() => {
      fetchSeries()
      setPageMeta({ title: 'TV Series', description: 'Browse popular, top-rated and trending TV series on CinePhix.' })
    })

    return {
      popularSeries, topRatedSeries, trendingSeries,
      isLoading, isDialogOpen, seriesDetail, seriesCredits,
      seriesReviews, reviewsSort, isLoadingReviews,
      isSubmittingReview, reviewError, showReviewForm, editingReview,
      authStore, isInWatchlist, isFavorite, seriesShareUrl,
      popularRow, topRatedRow, trendingRow,
      getImageUrl, scrollCategory, openDialog, closeDialog,
      toggleWatchlist, toggleFavorite,
      fetchSeriesReviews, handleSortChange, handleCreateReview,
      handleVoteReview, handleEditReview, handleCancelReview,
    }
  },
}
</script>

<style scoped>
.noise-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

.main-content {
  padding: 1.5rem 1rem;
  position: relative;
  z-index: 2;
}
@media (min-width: 600px)  { .main-content { padding: 2rem 1.5rem; } }
@media (min-width: 900px)  { .main-content { padding: 2.5rem 3rem; } }
@media (min-width: 1200px) { .main-content { padding: 3rem 4rem; } }

.content-section { margin-bottom: 2.5rem; }
@media (min-width: 600px)  { .content-section { margin-bottom: 3rem; } }
@media (min-width: 1200px) { .content-section { margin-bottom: 4rem; } }

/* card-slot controls carousel card width */
.card-slot { flex: 0 0 auto; width: 150px; }
@media (min-width: 481px)  { .card-slot { width: 185px; } }
@media (min-width: 769px)  { .card-slot { width: 210px; } }
@media (min-width: 1200px) { .card-slot { width: 240px; } }

/* Reviews section inside dialog */
.reviews-section {
  border-top: 1px solid rgba(255,255,255,0.07);
  padding-top: 1.5rem;
  margin-top: 0.5rem;
}

.share-row { padding: 0 !important; background: transparent !important; border: none !important; }
</style>
