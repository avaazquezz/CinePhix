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
            @click="openDialog(item)"
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

    <div v-if="dialogVisible" class="dialog-overlay" @click.self="closeDialog">
      <div class="dialog-content">
        <button class="dialog-close" @click="closeDialog">×</button>
        <img
          :src="getImageUrl(selectedItem.poster_path)"
          :alt="selectedItem.title || selectedItem.name"
          class="dialog-poster"
        />
        <div class="dialog-details">
          <h2 class="dialog-title">{{ selectedItem.title || selectedItem.name }}</h2>
          <p class="dialog-overview">{{ selectedItem.overview }}</p>
          <p class="dialog-type">
            Tipo: {{ selectedItem.media_type === 'movie' ? 'Película' : 'Serie' }}
          </p>
          <p class="dialog-rating">Puntuación: {{ selectedItem.vote_average }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getTrendingAllDay } from '@/ApiController/services/inicioService';

export default {
  name: 'HomePage',
  setup() {
    const trendingContent = ref([]);
    const dialogVisible = ref(false);
    const selectedItem = ref({});

    const getImageUrl = (path) => `https://image.tmdb.org/t/p/w500${path}`;

    const fetchTrendingContent = async () => {
      try {
        const trending = await getTrendingAllDay();
        trendingContent.value = trending;
      } catch (error) {
        console.error('Error al cargar contenido en tendencia:', error);
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

    onMounted(fetchTrendingContent);

    return {
      trendingContent,
      dialogVisible,
      selectedItem,
      getImageUrl,
      openDialog,
      closeDialog,
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

.main-content {
  padding: 2rem;
}

.section-title {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid #e50914;
  padding-left: 0.75rem;
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

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow-y: auto;
}

.dialog-content {
  background-color: #1e1e1e;
  color: #fff;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 900px;
  display: flex;
  gap: 2rem;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}

.dialog-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #e50914;
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s ease, color 0.3s ease;
}

.dialog-close:hover {
  transform: scale(1.2);
  color: #ff4c4c;
}

.dialog-poster {
  flex: 1;
  max-width: 50%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.dialog-details {
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dialog-title {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.dialog-overview {
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: justify;
}

.dialog-type,
.dialog-rating {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .dialog-content {
    flex-direction: column;
    align-items: center;
  }

  .dialog-poster {
    max-width: 100%;
    margin-bottom: 1rem;
  }

  .dialog-details {
    flex: none;
    width: 100%;
  }

  .dialog-title {
    font-size: 1.5rem;
  }

  .dialog-overview {
    font-size: 0.9rem;
  }
}
</style>
