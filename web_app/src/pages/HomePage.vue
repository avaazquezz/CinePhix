<template>
  <div class="home-container">
    <main class="main-content">
      <section class="movie-section">
        <h2 class="section-title">Películas y Series en Tendencia HOY</h2>
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
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getTrendingAllDay } from '@/ApiController/services/inicioService';

export default {
  name: 'HomePage',
  setup() {
    const trendingContent = ref([]);

    const getImageUrl = (path) => `https://image.tmdb.org/t/p/w500${path}`;

    const fetchTrendingContent = async () => {
      try {
        const trending = await getTrendingAllDay();
        trendingContent.value = trending;
      } catch (error) {
        console.error('Error al cargar contenido en tendencia:', error);
      }
    };

    onMounted(fetchTrendingContent);

    return {
      trendingContent,
      getImageUrl,
    };
  },
};
</script>

<style scoped>
/* General styles */
.home-container {
  min-height: 100vh;
  background-color: #141418;
  color: #fff;
  font-family: 'Arial', sans-serif;
}

.main-content {
  padding: 2rem;
}

.section-title {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid #e50914;
  padding-left: 0.75rem;
}

/* Movie grid styles */
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
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.movie-card:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  background-color: rgba(121, 70, 70, 0.966);
}

.movie-card:hover .movie-title {
  color: #ff0713;
}

.movie-card:hover .movie-poster {
  transform: scale(1.1);
  filter: brightness(110%);
}

.movie-poster {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: all 0.4s ease;
}

.movie-title {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
  transition: color 0.3s ease;
}

.movie-type {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Responsiveness */
@media (max-width: 1024px) {
  .main-content {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
  }

  .movie-card {
    padding: 0.75rem;
  }

  .movie-title {
    font-size: 0.9rem;
  }

  .movie-type {
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.75rem;
  }

  .movie-card {
    padding: 0.5rem;
  }

  .movie-title {
    font-size: 0.8rem;
  }

  .movie-type {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 0.5rem;
  }

  .section-title {
    font-size: 1rem;
  }

  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 0.5rem;
  }

  .movie-card {
    padding: 0.5rem;
  }

  .movie-title {
    font-size: 0.7rem;
  }

  .movie-type {
    font-size: 0.65rem;
  }
}
</style>
