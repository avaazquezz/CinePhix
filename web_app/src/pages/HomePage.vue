<template>
  <div class="page-container home-container">
    <div class="noise-overlay"></div>
    
    <main class="main-content">
      <section class="movie-section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="title-accent"></span>
            {{ $t('home.weeklyTrending') }}
          </h2>
          <div class="title-underline"></div>
        </div>
        
        <!-- Skeletons Loading State -->
        <div v-if="isLoading" class="movie-grid">
          <SkeletonCard v-for="n in 12" :key="`skeleton-${n}`" />
        </div>
        
        <!-- Contenido Real -->
        <div v-else class="movie-grid">
          <MovieCard
            v-for="item in trendingContent"
            :key="item.id"
            :id="item.id"
            :title="item.title || item.name"
            :image="getImageUrl(item.poster_path)"
            :media-type="item.media_type || 'movie'"
            :rating="item.vote_average ? item.vote_average / 2 : null"
            @select="openDialog(item)"
          />
        </div>
      </section>
    </main>

    <transition name="dialog-fade">
      <div v-if="dialogVisible" class="cp-dialog-overlay" @click.self="closeDialog">
        <div class="cp-dialog-box media-detail-dialog">
          <button class="cp-dialog-close" @click="closeDialog" :aria-label="$t('home.dialog.close')">
            <i class="fas fa-times"></i>
          </button>

          <div class="media-detail-dialog-inner">
            <div class="media-detail-hero">
              <div class="cp-dialog-poster-wrap">
                <img
                  :src="getImageUrl(selectedItem.poster_path)"
                  :alt="selectedItem.title || selectedItem.name"
                  class="cp-dialog-poster"
                />
              </div>
              <div class="media-detail-hero-main">
                <h2 class="cp-dialog-title media-detail-title">{{ selectedItem.title || selectedItem.name }}</h2>
                <div class="cp-dialog-meta media-detail-meta-row">
                  <span class="cp-meta-chip">
                    <i class="fas fa-film"></i>
                    {{ selectedItem.media_type === 'movie' ? $t('home.type.movie') : $t('home.type.tv') }}
                  </span>
                  <span class="cp-meta-chip rating">
                    <i class="fas fa-star"></i>
                    {{ selectedItem.vote_average ? selectedItem.vote_average.toFixed(1) : $t('home.dialog.na') }}/10
                  </span>
                </div>
                <div class="media-detail-share-row">
                  <span class="media-detail-share-label">{{ $t('common.media.share') }}</span>
                  <ShareButtons
                    :url="homeItemShareUrl"
                    :title="`${selectedItem.title || selectedItem.name} — CinePhix`"
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
                <p class="cp-section-label">{{ $t('home.dialog.overview') }}</p>
                <p class="cp-overview media-detail-overview">{{ selectedItem.overview || $t('home.dialog.noOverview') }}</p>
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
import { useMetaTags } from '@/composables/useMetaTags';
import { getTrendingAllWeek } from '@/ApiController/services/inicioService'
import SkeletonCard from '@/components/SkeletonCard.vue';
import MovieCard from '@/components/MovieCard.vue'
import ShareButtons from '@/components/ShareButtons.vue'
import { useWatchlistStore } from '@/stores/watchlist';
import { useFavoritesStore } from '@/stores/favorites';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'HomePage',
  components: {
    SkeletonCard,
    MovieCard,
    ShareButtons,
  },
  setup() {
    const { t } = useI18n()
    const trendingContent = ref([]);
    const dialogVisible = ref(false);
    const selectedItem = ref({});
    const isLoading = ref(true);
    const watchlistStore = useWatchlistStore();
    const favoritesStore = useFavoritesStore();
    const authStore = useAuthStore();
    const { setPageMeta } = useMetaTags();

    const isInWatchlist = computed(() => {
      return watchlistStore.hasItem(selectedItem.value.id, selectedItem.value.media_type || 'movie')
    })

    const isFavorite = computed(() => {
      return favoritesStore.hasItem(selectedItem.value.id, selectedItem.value.media_type || 'movie')
    })

    const homeItemShareUrl = computed(() => {
      const item = selectedItem.value
      if (!item.id) return window.location.href
      const origin = window.location.origin
      if (item.media_type === 'tv') {
        return `${origin}/CinePhix/series?open=${item.id}`
      }
      return `${origin}/CinePhix/movie/${item.id}`
    })

    const toggleWatchlist = async () => {
      if (!authStore.isAuthenticated) {
        window.location.href = '/CinePhix/auth/login'
        return
      }
      const mediaType = selectedItem.value.media_type || 'movie'
      if (isInWatchlist.value) {
        await watchlistStore.removeByTmdbId(selectedItem.value.id, mediaType)
      } else {
        await watchlistStore.addItem(selectedItem.value.id, mediaType)
      }
    }

    const toggleFavorite = async () => {
      if (!authStore.isAuthenticated) {
        window.location.href = '/CinePhix/auth/login'
        return
      }
      await favoritesStore.toggleFavorite(selectedItem.value.id, selectedItem.value.media_type || 'movie')
    }

    // Versión mejorada para diferentes tamaños de pantalla
    const getImageUrl = (path) => {
      if (!path) return '';

      // Usar tamaños de imagen apropiados según el dispositivo
      const isMobile = window.innerWidth <= 480;
      const isDialogView = window.innerWidth <= 768;

      // Para la cuadrícula principal usa imágenes más pequeñas en móvil
      const size = isMobile ? 'w342' : 'w500';

      return `https://image.tmdb.org/t/p/${size}${path}`;
    };

    const fetchTrendingContent = async () => {
      try {
        isLoading.value = true;
        const trending = await getTrendingAllWeek()
        trendingContent.value = trending;
      } catch (error) {
        console.error('Error al cargar contenido en tendencia:', error);
      } finally {
        isLoading.value = false;
      }
    };

    const openDialog = (item) => {
      selectedItem.value = item;
      dialogVisible.value = true;
    };

    const closeDialog = () => {
      dialogVisible.value = false;
      selectedItem.value = {};
    };

    onMounted(() => {
      fetchTrendingContent()
      setPageMeta({ title: t('meta.home.title'), description: t('meta.home.description') })
    });

    return {
      trendingContent,
      dialogVisible,
      selectedItem,
      isLoading,
      getImageUrl,
      openDialog,
      closeDialog,
      homeItemShareUrl,
      isInWatchlist,
      isFavorite,
      toggleWatchlist,
      toggleFavorite,
    };
  },
};
</script>

<style scoped>
.home-container { position: relative; overflow-x: hidden; }

.noise-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

.main-content {
  padding: 2rem 1.25rem;
  position: relative;
  z-index: 2;
}
@media (max-width: 768px) { .main-content { padding: 1.5rem 1rem; } }
@media (min-width: 600px)  { .main-content { padding: 2.5rem 2rem; } }
@media (min-width: 900px)  { .main-content { padding: 3rem 3.5rem; } }
@media (min-width: 1200px) { .main-content { padding: 4rem 5rem; } }

.movie-section { margin-bottom: 4rem; }

.movie-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
}
@media (min-width: 600px)  { .movie-grid { grid-template-columns: repeat(3, 1fr); gap: 1.25rem; } }
@media (min-width: 900px)  { .movie-grid { grid-template-columns: repeat(4, 1fr); gap: 1.5rem; } }
@media (min-width: 1200px) { .movie-grid { grid-template-columns: repeat(5, 1fr); gap: 1.75rem; } }
@media (min-width: 1600px) { .movie-grid { grid-template-columns: repeat(6, 1fr); gap: 2rem; } }
</style>
