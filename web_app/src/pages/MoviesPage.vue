<template>
  <div class="page-container">
    <div class="noise-overlay"></div>

    <main class="main-content">
      <!-- Tendencia semanal primero -->
      <section class="movie-section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="title-accent"></span>
            {{$t('movies.weeklyTrending')}}
          </h2>
          <div class="title-underline"></div>
        </div>
        <div class="row-container movie-row-container">
          <button class="nav-btn nav-button prev" @click="scrollCategory('trending', 'prev')" v-if="!isLoading">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="movie-row" ref="trendingRow">
            <template v-if="isLoading">
              <div v-for="n in 8" :key="`skeleton-trending-${n}`" class="carousel-card-slot">
                <SkeletonCard />
              </div>
            </template>
            <template v-if="!isLoading">
              <div
                v-for="item in trendingMovies"
                :key="item.id"
                class="carousel-card-slot"
              >
                <MovieCard
                  :id="item.id"
                  :title="item.title"
                  :image="getImageUrl(item.poster_path)"
                  media-type="movie"
                  :rating="item.vote_average ? item.vote_average / 2 : null"
                  fill-parent
                  @select="openMovieDialog(item.id)"
                />
              </div>
            </template>
          </div>
          <button class="nav-btn nav-button next" @click="scrollCategory('trending', 'next')" v-if="!isLoading">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </section>

      <section class="movie-section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="title-accent"></span>
            {{$t('movies.popular')}}
          </h2>
          <div class="title-underline"></div>
        </div>
        <div class="row-container movie-row-container">
          <button class="nav-btn nav-button prev" @click="scrollCategory('popular', 'prev')" v-if="!isLoading">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="movie-row" ref="popularRow">
            <template v-if="isLoading">
              <div v-for="n in 8" :key="`skeleton-popular-${n}`" class="carousel-card-slot">
                <SkeletonCard />
              </div>
            </template>
            <template v-if="!isLoading">
              <div
                v-for="item in popularMovies"
                :key="item.id"
                class="carousel-card-slot"
              >
                <MovieCard
                  :id="item.id"
                  :title="item.title"
                  :image="getImageUrl(item.poster_path)"
                  media-type="movie"
                  :rating="item.vote_average ? item.vote_average / 2 : null"
                  fill-parent
                  @select="openMovieDialog(item.id)"
                />
              </div>
            </template>
          </div>
          <button class="nav-btn nav-button next" @click="scrollCategory('popular', 'next')" v-if="!isLoading">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </section>

      <section class="movie-section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="title-accent"></span>
            {{$t('movies.topRated')}}
          </h2>
          <div class="title-underline"></div>
        </div>
        <div class="row-container movie-row-container">
          <button class="nav-btn nav-button prev" @click="scrollCategory('topRated', 'prev')" v-if="!isLoading">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="movie-row" ref="topRatedRow">
            <template v-if="isLoading">
              <div v-for="n in 8" :key="`skeleton-toprated-${n}`" class="carousel-card-slot">
                <SkeletonCard />
              </div>
            </template>
            <template v-if="!isLoading">
              <div
                v-for="item in topRatedMovies"
                :key="item.id"
                class="carousel-card-slot"
              >
                <MovieCard
                  :id="item.id"
                  :title="item.title"
                  :image="getImageUrl(item.poster_path)"
                  media-type="movie"
                  :rating="item.vote_average ? item.vote_average / 2 : null"
                  fill-parent
                  @select="openMovieDialog(item.id)"
                />
              </div>
            </template>
          </div>
          <button class="nav-btn nav-button next" @click="scrollCategory('topRated', 'next')" v-if="!isLoading">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </section>
    </main>

    <!-- Modal fuera de <main>: el main tiene z-index bajo y encerraría el fixed bajo el navbar -->
    <transition name="dialog-fade">
      <div v-if="isDialogOpen" class="cp-dialog-overlay" @click.self="closeMovieDialog">
        <div class="cp-dialog-box media-detail-dialog">
          <button class="cp-dialog-close" @click="closeMovieDialog" :aria-label="$t('common.close')">
            <i class="fas fa-times"></i>
          </button>

          <div class="media-detail-dialog-inner">
            <div class="media-detail-hero">
              <div class="cp-dialog-poster-wrap">
                <img
                  :src="getImageUrl(movieDetail.poster_path, true)"
                  :alt="movieDetail.title"
                  class="cp-dialog-poster"
                />
              </div>
              <div class="media-detail-hero-main">
                <h2 class="cp-dialog-title media-detail-title">{{ movieDetail.title }}</h2>
                <div v-if="movieGenres.length" class="media-detail-genres">
                  <span
                    v-for="g in movieGenres"
                    :key="g.id"
                    class="media-detail-genre-pill"
                  >{{ g.name }}</span>
                </div>
                <div class="cp-dialog-meta media-detail-meta-row">
                  <span class="cp-meta-chip">
                    <i class="fas fa-calendar"></i>
                    {{ formattedReleaseDate }}
                  </span>
                  <span class="cp-meta-chip rating">
                    <i class="fas fa-star"></i>
                    {{ movieDetail.vote_average?.toFixed(1) || '?' }}/10
                  </span>
                  <span v-if="formattedRuntime" class="cp-meta-chip">
                    <i class="fas fa-clock"></i>
                    {{ formattedRuntime }}
                  </span>
                </div>
                <div class="media-detail-share-row">
                  <span class="media-detail-share-label">{{ $t('common.media.share') }}</span>
                  <ShareButtons
                    :url="movieShareUrl"
                    :title="`${movieDetail.title} — CinePhix`"
                    description=""
                  />
                </div>
                <div class="cp-dialog-actions media-detail-actions">
                  <button
                    type="button"
                    class="cp-action-btn cp-action-btn--primary"
                    :class="{ active: isInWatchlist }"
                    @click="toggleWatchlist"
                  >
                    <i :class="isInWatchlist ? 'fas fa-bookmark' : 'far fa-bookmark'"></i>
                    {{ isInWatchlist ? $t('common.media.inWatchlist') : $t('common.media.watchlist') }}
                  </button>
                  <button
                    type="button"
                    class="cp-action-btn"
                    :class="{ active: isFavorite }"
                    @click="toggleFavorite"
                  >
                    <i :class="isFavorite ? 'fas fa-heart' : 'far fa-heart'"></i>
                    {{ isFavorite ? $t('common.media.favorited') : $t('common.media.favorite') }}
                  </button>
                </div>
              </div>
            </div>

            <div class="media-detail-scroll">
              <div class="media-detail-block">
                <p class="cp-section-label">{{ $t('movies.detail.overview') }}</p>
                <p class="cp-overview media-detail-overview">{{ movieDetail.overview || '—' }}</p>
              </div>
              <div class="media-detail-block">
                <p class="cp-section-label">{{ $t('movies.detail.credits') }}</p>
                <div class="cp-credits-grid media-detail-credits">
                  <div v-for="actor in movieCredits.slice(0, 8)" :key="actor.id" class="cp-credit-item">
                    <span class="cp-credit-name">{{ actor.name }}</span>
                    <span class="cp-credit-char">{{ actor.character }}</span>
                  </div>
                </div>
              </div>
              <div class="media-detail-reviews">
                <div class="cp-reviews-header">
                  <p class="cp-reviews-title">{{ $t('common.media.reviews') }}</p>
                  <v-btn
                    size="small"
                    color="primary"
                    variant="outlined"
                    @click="showReviewForm = !showReviewForm"
                  >
                    {{ showReviewForm ? $t('common.media.cancel') : $t('common.media.writeReview') }}
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
                  :reviews="movieReviews"
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
import { useI18n } from 'vue-i18n'
import SearchBar from '@/components/SearchBar.vue'
import MovieCard from '@/components/MovieCard.vue'
import {
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
  getMovieDetail,
  getMovieCredits,
} from '@/ApiController/services/movieService';
import { useWatchlistStore } from '@/stores/watchlist';
import { useFavoritesStore } from '@/stores/favorites';
import { useAuthStore } from '@/stores/auth';
import { getReviewsForMedia, createReview, voteReview } from '@/api/services/reviewService';
import ReviewForm from '@/components/ReviewForm.vue';
import ReviewList from '@/components/ReviewList.vue';
import ShareButtons from '@/components/ShareButtons.vue';
import { useMetaTags } from '@/composables/useMetaTags';

import SkeletonCard from '@/components/SkeletonCard.vue';

export default {
  name: 'MoviesPage',
  components: { SearchBar, MovieCard, SkeletonCard, ReviewForm, ReviewList, ShareButtons },
  setup() {
    const { t } = useI18n()
    const popularMovies = ref([]);
    const topRatedMovies = ref([]);
    const trendingMovies = ref([]);
    const isLoading = ref(true);
  const isDialogOpen = ref(false);
  const query = ref('');
  const searchResults = ref([]);
    const movieDetail = ref({});
    const movieCredits = ref([]);
    const movieReviews = ref([]);
    const reviewsSort = ref('recent');
    const isLoadingReviews = ref(false);
    const isSubmittingReview = ref(false);
    const reviewError = ref(null);
    const showReviewForm = ref(false);
    const editingReview = ref(null);
    const watchlistStore = useWatchlistStore();
    const favoritesStore = useFavoritesStore();
    const authStore = useAuthStore();
    const { setMovieMeta, setPageMeta } = useMetaTags()
    setPageMeta({ title: t('meta.movies.title'), description: t('meta.movies.description') })

    const isInWatchlist = computed(() => {
      return watchlistStore.hasItem(movieDetail.value.id, 'movie')
    })

    const movieShareUrl = computed(() => {
      if (!movieDetail.value.id) return window.location.href
      return `${window.location.origin}/CinePhix/movie/${movieDetail.value.id}`
    })

    const isFavorite = computed(() => {
      return favoritesStore.hasItem(movieDetail.value.id, 'movie')
    })

    const movieGenres = computed(() => movieDetail.value.genres || [])

    const formattedReleaseDate = computed(() => {
      const d = movieDetail.value.release_date
      if (!d) return '—'
      try {
        return new Intl.DateTimeFormat(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }).format(new Date(`${d}T12:00:00`))
      } catch {
        return d
      }
    })

    const formattedRuntime = computed(() => {
      const m = movieDetail.value.runtime
      if (m == null || m <= 0) return null
      const h = Math.floor(m / 60)
      const min = m % 60
      if (h <= 0) return `${min} min`
      if (min === 0) return `${h}h`
      return `${h}h ${min}m`
    })

    const toggleWatchlist = async () => {
      if (!authStore.isAuthenticated) {
        window.location.href = '/CinePhix/auth/login'
        return
      }
      if (isInWatchlist.value) {
        await watchlistStore.removeByTmdbId(movieDetail.value.id, 'movie')
      } else {
        await watchlistStore.addItem(movieDetail.value.id, 'movie')
      }
    }

    const toggleFavorite = async () => {
      if (!authStore.isAuthenticated) {
        window.location.href = '/CinePhix/auth/login'
        return
      }
      await favoritesStore.toggleFavorite(movieDetail.value.id, 'movie')
    }

    const popularRow = ref(null);
    const topRatedRow = ref(null);
    const trendingRow = ref(null);

    const getImageUrl = (path, isDetail = false) => {
      if (!path) return '';

      const isMobile = window.innerWidth <= 480;
      // List posters: same TMDB sizes as HomePage trending grid for matching sharpness.
      const size = isDetail
        ? (isMobile ? 'w342' : 'w500')
        : (isMobile ? 'w342' : 'w500');

      return `https://image.tmdb.org/t/p/${size}${path}`;
    };

    const fetchMovies = async () => {
      try {
        isLoading.value = true
        const [trending, popular, topRated] = await Promise.all([
          getTrendingMovies(),
          getPopularMovies(),
          getTopRatedMovies(),
        ])
        trendingMovies.value = trending
        popularMovies.value = popular
        topRatedMovies.value = topRated
      } catch (error) {
        console.error('Error al cargar las películas:', error)
      } finally {
        isLoading.value = false
      }
    }

    const onSearch = async () => {
      if (!query.value.trim()) { searchResults.value = []; return }
      try {
        const { searchMovies } = await import('@/ApiController/services/movieService')
        searchResults.value = await searchMovies(query.value)
      } catch (e) {
        console.error('Error en búsqueda de películas', e)
      }
    }

    const openMovieDialog = async (id) => {
      try {
        movieDetail.value = await getMovieDetail(id);
        movieCredits.value = await getMovieCredits(id);
        movieReviews.value = [];
        reviewsSort.value = 'recent';
        showReviewForm.value = false;
        editingReview.value = null;
        await fetchMovieReviews();
        isDialogOpen.value = true;
        document.body.style.overflow = 'hidden';
        window.dispatchEvent(new CustomEvent('dialog-opened'));

        // Update meta tags
        const m = movieDetail.value;
        setMovieMeta({
          title: m.title || m.name,
          year: m.release_date ? m.release_date.slice(0, 4) : null,
          rating: m.vote_average ? (m.vote_average / 2).toFixed(1) : null,
          poster: m.poster_path ? `https://image.tmdb.org/t/p/w780${m.poster_path}` : null,
          overview: m.overview,
          genres: m.genres ? m.genres.map(g => g.name).join(', ') : null,
          tmdbId: m.id,
        });
      } catch (error) {
        console.error('Error al cargar los detalles de la película:', error);
      }
    };

    const closeMovieDialog = () => {
      isDialogOpen.value = false;
      movieDetail.value = {};
      movieCredits.value = [];
      movieReviews.value = [];
      showReviewForm.value = false;
      editingReview.value = null;
      document.body.style.overflow = '';
      window.dispatchEvent(new CustomEvent('dialog-closed'));
      setPageMeta({ title: t('meta.movies.title'), description: t('meta.movies.description') })
    };

    const scrollCategory = (category, direction) => {
      const rowRef = {
        popular: popularRow,
        topRated: topRatedRow,
        trending: trendingRow,
      }[category];

      if (!rowRef.value) return;

      const scrollAmount = rowRef.value.clientWidth * 0.8;
      const scrollPosition =
        direction === 'next'
          ? rowRef.value.scrollLeft + scrollAmount
          : rowRef.value.scrollLeft - scrollAmount;

      rowRef.value.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    };

    onMounted(fetchMovies);

    // --- Reviews ---
    const fetchMovieReviews = async (sort = reviewsSort.value) => {
      if (!movieDetail.value.id) return
      isLoadingReviews.value = true
      try {
        const data = await getReviewsForMedia({
          tmdbId: movieDetail.value.id,
          mediaType: 'movie',
          sortBy: sort,
        })
        movieReviews.value = data.items
      } catch (e) {
        console.error('Error fetching reviews', e)
      } finally {
        isLoadingReviews.value = false
      }
    }

    const handleSortChange = async (sort) => {
      reviewsSort.value = sort
      await fetchMovieReviews(sort)
    }

    const handleCreateReview = async ({ rating, content, isSpoiler }) => {
      if (!authStore.isAuthenticated) {
        window.location.href = '/CinePhix/auth/login'
        return
      }
      reviewError.value = null
      isSubmittingReview.value = true
      try {
        await createReview({
          tmdbId: movieDetail.value.id,
          mediaType: 'movie',
          rating,
          content,
          isSpoiler,
        })
        showReviewForm.value = false
        await fetchMovieReviews()
      } catch (e) {
        reviewError.value = e.response?.data?.detail || t('errors.reviewPostFailed')
      } finally {
        isSubmittingReview.value = false
      }
    }

    const handleVoteReview = async (reviewId, voteType) => {
      if (!authStore.isAuthenticated) {
        window.location.href = '/CinePhix/auth/login'
        return
      }
      try {
        await voteReview(reviewId, voteType)
        await fetchMovieReviews()
      } catch (e) {
        console.error('Error voting on review', e)
      }
    }

    const handleEditReview = (review) => {
      editingReview.value = review
      showReviewForm.value = true
    }

    const handleCancelReview = () => {
      showReviewForm.value = false
      editingReview.value = null
      reviewError.value = null
    }

    return {
      popularMovies,
      topRatedMovies,
      trendingMovies,
      isDialogOpen,
      isLoading,
      movieDetail,
      movieCredits,
      movieReviews,
      reviewsSort,
      isLoadingReviews,
      isSubmittingReview,
      reviewError,
      showReviewForm,
      editingReview,
      authStore,
      movieShareUrl,
      isInWatchlist,
      isFavorite,
      movieGenres,
      formattedReleaseDate,
      formattedRuntime,
      toggleWatchlist,
      toggleFavorite,
      query,
      searchResults,
      popularRow,
      topRatedRow,
      trendingRow,
      getImageUrl,
      scrollCategory,
      openMovieDialog,
      closeMovieDialog,
      fetchMovieReviews,
      handleSortChange,
      handleCreateReview,
      handleVoteReview,
      handleEditReview,
      handleCancelReview,
      onSearch,
    };
  },
};
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

.movie-section { margin-bottom: 2.5rem; }
@media (min-width: 600px)  { .movie-section { margin-bottom: 3rem; } }
@media (min-width: 1200px) { .movie-section { margin-bottom: 4rem; } }

/* Carousel rows — keep old class names for the existing refs */
.movie-row-container {
  position: relative;
  width: 100%;
  padding: 0 2.25rem;
}
@media (min-width: 1200px) { .movie-row-container { padding: 0 3rem; } }

.movie-row {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 0.75rem 0 1rem;
  gap: 1rem;
  scrollbar-width: none;
}
.movie-row::-webkit-scrollbar { display: none; }
@media (min-width: 600px)  { .movie-row { gap: 1.25rem; } }
@media (min-width: 900px)  { .movie-row { gap: 1.5rem; } }
@media (min-width: 1200px) { .movie-row { gap: 1.75rem; } }

/* Match Home grid “cell” width so carousel posters read the same as Inicio */
.carousel-card-slot {
  flex: 0 0 auto;
  width: 150px;
}
@media (min-width: 481px)  { .carousel-card-slot { width: 185px; } }
@media (min-width: 769px)  { .carousel-card-slot { width: 210px; } }
@media (min-width: 1200px) { .carousel-card-slot { width: 240px; } }

/* Nav buttons  */
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  background: rgba(15, 15, 15, 0.9);
  border: 1px solid var(--cp-border-accent, rgba(229,9,20,0.28));
  color: white;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
  transition: all 0.25s ease;
  backdrop-filter: blur(12px);
  border-radius: var(--cp-radius-sm, 6px);
}
.nav-button:hover {
  background: var(--cp-red, #e50914);
  border-color: var(--cp-red, #e50914);
  transform: translateY(-50%) scale(1.05);
  box-shadow: var(--cp-shadow-red, 0 0 28px rgba(229,9,20,0.45));
}
.prev { left: 0; }
.next { right: 0; }

</style>
