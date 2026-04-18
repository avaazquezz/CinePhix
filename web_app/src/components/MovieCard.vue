<template>
  <div
    class="movie-card"
    :class="{ 'movie-card--fill': fillParent }"
    @click="$emit('select')"
    data-cy="movie-card"
  >
    <div class="poster-wrapper">
      <img :src="image" :alt="title" class="movie-poster" loading="lazy" />
      <div class="poster-overlay">
        <div class="overlay-top">
          <button
            class="card-action-btn watchlist-btn"
            :class="{ active: isInWatchlist }"
            @click.stop="toggleWatchlist"
            :title="isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'"
          >
            <v-icon size="16">{{ isInWatchlist ? 'mdi-bookmark-check' : 'mdi-bookmark-plus-outline' }}</v-icon>
          </button>
          <button
            class="card-action-btn favorite-btn"
            :class="{ active: isFavorite }"
            @click.stop="toggleFavorite"
            :title="isFavorite ? 'Remove from Favorites' : 'Add to Favorites'"
          >
            <v-icon size="16">{{ isFavorite ? 'mdi-heart' : 'mdi-heart-plus' }}</v-icon>
          </button>
        </div>
        <div class="play-ring">
          <v-icon size="18">mdi-play</v-icon>
        </div>
      </div>
    </div>
    <div class="card-body">
      <h4 class="card-title">{{ title }}</h4>
      <div class="card-meta">
        <span class="media-badge">{{ mediaType === 'movie' ? 'Film' : 'TV' }}</span>
        <span v-if="rating" class="rating-badge">
          <v-icon size="11" color="#f5c518">mdi-star</v-icon>
          {{ rating.toFixed(1) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useWatchlistStore } from '@/stores/watchlist'
import { useFavoritesStore } from '@/stores/favorites'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'MovieCard',
  props: {
    id:        { type: Number, required: true },
    title:     { type: String, required: true },
    image:     { type: String, required: true },
    mediaType: { type: String, default: 'movie' },
    rating:     { type: Number, default: null },
    /** When true, card stretches to parent width (carousel slots sized like Home grid). */
    fillParent: { type: Boolean, default: false },
  },
  emits: ['select'],
  setup(props) {
    const watchlistStore = useWatchlistStore()
    const favoritesStore = useFavoritesStore()
    const authStore      = useAuthStore()

    const isInWatchlist = computed(() => watchlistStore.hasItem(props.id, props.mediaType))
    const isFavorite    = computed(() => favoritesStore.hasItem(props.id, props.mediaType))

    const toggleWatchlist = async () => {
      if (!authStore.isAuthenticated) { window.location.href = '/CinePhix/auth/login'; return }
      if (isInWatchlist.value) {
        await watchlistStore.removeByTmdbId(props.id, props.mediaType)
      } else {
        await watchlistStore.addItem(props.id, props.mediaType)
      }
    }

    const toggleFavorite = async () => {
      if (!authStore.isAuthenticated) { window.location.href = '/CinePhix/auth/login'; return }
      await favoritesStore.toggleFavorite(props.id, props.mediaType)
    }

    return { isInWatchlist, isFavorite, toggleWatchlist, toggleFavorite }
  },
}
</script>

<style scoped>
.movie-card {
  cursor: pointer;
  color: #fff;
  font-family: 'Inter', sans-serif;
  transition: transform 0.3s var(--cp-ease-spring, cubic-bezier(0.34,1.56,0.64,1));
  width: 100%;
}

.movie-card:hover {
  transform: translateY(-5px) scale(1.03);
}

.poster-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: var(--cp-radius, 10px);
  aspect-ratio: 2 / 3;
  background: #1a1a1a;
}

.movie-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease, filter 0.3s ease;
  will-change: transform;
}

.movie-card:hover .movie-poster {
  transform: scale(1.08);
  filter: brightness(0.45) saturate(0.9);
}

.poster-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.15) 0%,
    transparent 35%,
    transparent 50%,
    rgba(0,0,0,0.55) 100%
  );
}

.movie-card:hover .poster-overlay { opacity: 1; }

.overlay-top {
  display: flex;
  gap: 6px;
  align-self: flex-start;
}

.card-action-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(8, 8, 8, 0.72);
  border: 1px solid rgba(255,255,255,0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: #fff;
  backdrop-filter: blur(8px);
}

.card-action-btn:hover {
  background: rgba(255,255,255,0.18);
  border-color: rgba(255,255,255,0.35);
  transform: scale(1.12);
}

.watchlist-btn.active { background: var(--cp-green, #04ff24); color: #000; border-color: var(--cp-green, #04ff24); }
.favorite-btn.active  { background: var(--cp-red, #e50914);   color: #fff; border-color: var(--cp-red, #e50914);   }

.play-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.75);
  width: 42px;
  height: 42px;
  background: rgba(229, 9, 20, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 5px rgba(229,9,20,0.2), 0 4px 20px rgba(229,9,20,0.5);
  transition: transform 0.3s var(--cp-ease-spring, cubic-bezier(0.34,1.56,0.64,1));
}

.movie-card:hover .play-ring {
  transform: translate(-50%, -50%) scale(1);
}

/* ── Card outline glow on hover ── */
.poster-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--cp-radius, 10px);
  border: 2px solid transparent;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  pointer-events: none;
}
.movie-card:hover .poster-wrapper::after {
  border-color: rgba(229, 9, 20, 0.7);
  box-shadow: 0 0 20px rgba(229,9,20,0.35), inset 0 0 10px rgba(229,9,20,0.05);
}

.card-body {
  padding: 0.6rem 0.1rem 0;
}

.card-title {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--cp-text-primary, #fff);
  line-height: 1.35;
  margin: 0 0 0.3rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.2em;
  letter-spacing: 0.1px;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
}

.media-badge {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--cp-text-muted, rgba(255,255,255,0.42));
}

.rating-badge {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--cp-gold, #f5c518);
  display: flex;
  align-items: center;
  gap: 3px;
}

/* ── Default widths (compact rows). Use fillParent for home-style carousel slots. ── */
.movie-card--fill {
  width: 100%;
  max-width: 100%;
}
@media (max-width: 480px) {
  .movie-card:not(.movie-card--fill) { width: 110px; }
}
@media (min-width: 481px) and (max-width: 768px) {
  .movie-card:not(.movie-card--fill) { width: 130px; }
}
@media (min-width: 769px) and (max-width: 1199px) {
  .movie-card:not(.movie-card--fill) { width: 150px; }
}
@media (min-width: 1200px) {
  .movie-card:not(.movie-card--fill) { width: 165px; }
}
</style>
