<template>
  <div class="home-container">
    <AppBarNavigation />

    <main class="main-content">
      <section class="movie-section">
        <h2 class="section-title">Peliculas y Series en Tendencia HOY</h2>
        <div class="movie-grid">
          <div
            v-for="item in trendingContent"
            :key="item.id"
            class="movie-card"
          >
            <img
              :src="getImageUrl(item.poster_path)"
              :alt="item.title || item.name"
              class="movie-poster"
            />
            <h3 class="movie-title">{{ item.title || item.name }}</h3>
            <p class="movie-type">{{ item.media_type === 'movie' ? 'Película' : 'Serie' }}</p>
            <p class="movie-provider">{{ getProviderText(item.provider) }}</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getTrendingAllDay } from '@/ApiController/services/inicioService';
import {getWatchProviders } from '@/ApiController/services/watchProvidersService';

export default {
  name: 'HomePage',
  setup() {
    const trendingContent = ref([]);

    const getImageUrl = (path) => `https://image.tmdb.org/t/p/w500${path}`;

    const getProviderText = (provider) => {
      if (!provider) return 'No disponible';
      return provider.flatrate?.[0]?.provider_name || 'Cines';
    };

    const fetchTrendingContent = async () => {
      try {
        const trending = await getTrendingAllDay();
        const trendingWithProviders = await Promise.all(
          trending.map(async (item) => {
            const provider = await getWatchProviders(item.media_type, item.id);
            return { ...item, provider };
          })
        );
        trendingContent.value = trendingWithProviders;
      } catch (error) {
        console.error('Error al cargar contenido en tendencia:', error);
      }
    };

    onMounted(fetchTrendingContent);

    return {
      trendingContent,
      getImageUrl,
      getProviderText,
    };
  },
};
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #141418;
  color: #fff;
  font-family: 'Arial', sans-serif;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
}

.movie-card {
  text-align: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
}

.movie-poster {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.movie-title {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.movie-type {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
}

.movie-provider {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 0.5rem;
}

/* Header styles */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: rgba(0, 0, 0, 0.8);
}

.logo-img {
  height: 40px;
}

.navigation {
  flex: 1;
  margin: 0 2rem;
}

.nav-links {
  display: flex;
  list-style-type: none;
  gap: 1.5rem;
  justify-content: center;
  padding: 0;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover, .nav-link.active {
  color: #e50914;
}

.user-btn {
  background-color: #e50914;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

/* Main content styles */
.main-content {
  padding: 2rem;
}

.section-title {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid #e50914;
  padding-left: 0.75rem;
}

.featured-slider, .movie-section {
  margin-bottom: 3rem;
}

/* Placeholder for demonstration */
.placeholder-text {
  background-color: rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  color: rgba(255,255,255,0.7);
}

/* Footer styles */
.footer {
  background-color: rgba(0, 0, 0, 0.8);
  padding: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}
</style>