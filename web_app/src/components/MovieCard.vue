<template>
  <div class="movie-card" @click="$emit('select')" data-cy="movie-card">
    <div class="poster-wrapper">
      <img :src="image" :alt="title" class="movie-poster" />
      <div class="poster-overlay">
        <div class="overlay-actions">
          <!-- Watchlist Button -->
          <button
            class="action-btn watchlist-btn"
            :class="{ active: isInWatchlist }"
            @click.stop="toggleWatchlist"
            :title="isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'"
          >
            <v-icon size="20">{{ isInWatchlist ? 'mdi-bookmark-check' : 'mdi-bookmark-plus-outline' }}</v-icon>
          </button>

          <!-- Favorite Button -->
          <button
            class="action-btn favorite-btn"
            :class="{ active: isFavorite }"
            @click.stop="toggleFavorite"
            :title="isFavorite ? 'Remove from Favorites' : 'Add to Favorites'"
          >
            <v-icon size="20">{{ isFavorite ? 'mdi-heart' : 'mdi-heart-plus' }}</v-icon>
          </button>
        </div>
        <div class="play-icon">
          <v-icon>mdi-play</v-icon>
        </div>
      </div>
    </div>
    <h4 class="title">{{ title }}</h4>
    <div class="meta">
      <span class="media-type">{{ mediaType }}</span>
      <span v-if="rating" class="rating">
        <v-icon size="12">mdi-star</v-icon>
        {{ rating.toFixed(1) }}
      </span>
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
    id: { type: Number, required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    mediaType: { type: String, default: 'movie' },
    rating: { type: Number, default: null },
  },
  emits: ['select'],
  setup(props) {
    const watchlistStore = useWatchlistStore()
    const favoritesStore = useFavoritesStore()
    const authStore = useAuthStore()

    const isInWatchlist = computed(() => {
      return watchlistStore.hasItem(props.id, props.mediaType)
    })

    const isFavorite = computed(() => {
      return favoritesStore.hasItem(props.id, props.mediaType)
    })

    const toggleWatchlist = async () => {
      if (!authStore.isAuthenticated) {
        // Redirect to login
        window.location.href = '/CinePhix/auth/login'
        return
      }

      if (isInWatchlist.value) {
        await watchlistStore.removeByTmdbId(props.id, props.mediaType)
      } else {
        await watchlistStore.addItem(props.id, props.mediaType)
      }
    }

    const toggleFavorite = async () => {
      if (!authStore.isAuthenticated) {
        window.location.href = '/CinePhix/auth/login'
        return
      }

      await favoritesStore.toggleFavorite(props.id, props.mediaType)
    }

    return {
      isInWatchlist,
      isFavorite,
      toggleWatchlist,
      toggleFavorite,
    }
  },
}
</script>

<style scoped>
.movie-card {
  width: 150px;
  cursor: pointer;
  color: #fff;
  font-family: 'Inter', sans-serif;
  position: relative;
}

.poster-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.movie-poster {
  width: 100%;
  display: block;
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 2px solid transparent;
}

.movie-card:hover .movie-poster {
  transform: scale(1.05);
  box-shadow:
    0 0 20px rgba(229, 9, 20, 0.6),
    0 0 40px rgba(229, 9, 20, 0.4),
    0 8px 25px rgba(0, 0, 0, 0.6);
  border-color: rgba(229, 9, 20, 0.8);
}

.poster-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.movie-card:hover .poster-overlay {
  opacity: 1;
}

.overlay-actions {
  display: flex;
  justify-content: flex-start;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: #fff;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.watchlist-btn.active {
  background: #04ff24;
  color: #000;
}

.favorite-btn.active {
  background: #e50914;
}

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  width: 45px;
  height: 45px;
  background: #e50914;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(229, 9, 20, 0.6);
}

.movie-card:hover .play-icon {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.title {
  font-size: 0.9rem;
  margin-top: 0.5rem;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0.2px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.media-type {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.rating {
  color: #e50914;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 2px;
}

@media (max-width: 768px) {
  .movie-card {
    width: 130px;
  }
}

@media (max-width: 480px) {
  .movie-card {
    width: 110px;
  }
}
</style>