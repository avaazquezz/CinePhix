<template>
  <div class="home-container">
    <AppBarNavigation />

    <main class="main-content">
            <!-- Sección de Películas Populares -->
      <section class="movie-section">
        <h2 class="section-title">Películas Populares</h2>
        <div class="movie-row-container">
          <button class="nav-button prev" @click="scrollCategory('popular', 'prev')">&lt;</button>
          <div class="movie-row" ref="popularRow">
            <div
              v-for="item in popularMovies"
              :key="item.id"
              class="movie-card"
            >
              <img
                :src="getImageUrl(item.poster_path)"
                :alt="item.title"
                class="movie-poster"
              />
              <h3 class="movie-title">{{ item.title }}</h3>
            </div>
          </div>
          <button class="nav-button next" @click="scrollCategory('popular', 'next')">&gt;</button>
        </div>
      </section>

      <!-- Sección de Películas Mejor Valoradas -->
      <section class="movie-section">
        <h2 class="section-title">Películas Mejor Valoradas</h2>
        <div class="movie-row-container">
          <button class="nav-button prev" @click="scrollCategory('topRated', 'prev')">&lt;</button>
          <div class="movie-row" ref="topRatedRow">
            <div
              v-for="item in topRatedMovies"
              :key="item.id"
              class="movie-card"
            >
              <img
                :src="getImageUrl(item.poster_path)"
                :alt="item.title"
                class="movie-poster"
              />
              <h3 class="movie-title">{{ item.title }}</h3>
            </div>
          </div>
          <button class="nav-button next" @click="scrollCategory('topRated', 'next')">&gt;</button>
        </div>
      </section>

      <!-- Sección de Películas en Tendencia -->
      <section class="movie-section">
        <h2 class="section-title">Películas en Tendencia Semanal</h2>
        <div class="movie-row-container">
          <button class="nav-button prev" @click="scrollCategory('trending', 'prev')">&lt;</button>
          <div class="movie-row" ref="trendingRow">
            <div
              v-for="item in trendingMovies"
              :key="item.id"
              class="movie-card"
            >
              <img
                :src="getImageUrl(item.poster_path)"
                :alt="item.title"
                class="movie-poster"
              />
              <h3 class="movie-title">{{ item.title }}</h3>
            </div>
          </div>
          <button class="nav-button next" @click="scrollCategory('trending', 'next')">&gt;</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getPopularMovies, getTopRatedMovies, getTrendingMovies } from '@/ApiController/services/movieService';

export default {
  name: 'MoviesPage',
  setup() {
    const popularMovies = ref([]);
    const topRatedMovies = ref([]);
    const trendingMovies = ref([]);

    const popularRow = ref(null);
    const topRatedRow = ref(null);
    const trendingRow = ref(null);

    const getImageUrl = (path) => `https://image.tmdb.org/t/p/w500${path}`;

    const fetchMovies = async () => {
      try {
        popularMovies.value = await getPopularMovies();
        topRatedMovies.value = await getTopRatedMovies();
        trendingMovies.value = await getTrendingMovies();
      } catch (error) {
        console.error('Error al cargar las películas:', error);
      }
    };

    const scrollCategory = (category, direction) => {
      const rowRef = {
        'popular': popularRow,
        'topRated': topRatedRow,
        'trending': trendingRow
      }[category];

      if (!rowRef.value) return;

      const scrollAmount = rowRef.value.clientWidth * 0.8;
      const scrollPosition = direction === 'next'
        ? rowRef.value.scrollLeft + scrollAmount
        : rowRef.value.scrollLeft - scrollAmount;

      rowRef.value.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    };

    onMounted(fetchMovies);

    return {
      popularMovies,
      topRatedMovies,
      trendingMovies,
      popularRow,
      topRatedRow,
      trendingRow,
      getImageUrl,
      scrollCategory
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
  padding: 1rem;
}

.movie-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  border-left: 4px solid #fa000c;
  padding-left: 0.75rem;
}

/* Estilo de fila de películas al estilo Netflix */
.movie-row-container {
  position: relative;
  width: 100%;
  padding: 0 2.5rem;
}

.movie-row {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 1rem 0;
  scrollbar-width: none; /* Firefox */
}

.movie-row::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* Estilos para las tarjetas de películas */
.movie-card {
  flex: 0 0 auto;
  width: 180px;
  margin-right: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 8px; /* Aumentamos el radio del borde para que coincida */
  overflow: hidden;
  position: relative;
  background-color: rgba(20, 20, 24, 0.8); /* Fondo inicial más oscuro */
  padding-bottom: 1rem;
}

.movie-card:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  background-color: rgba(99, 63, 63, 0.7);
}

.movie-card:hover .movie-title {
  color: #ff000d;
}

.movie-card:hover .movie-poster {
  transform: scale(1.1);
  filter: brightness(110%);
}

.movie-poster {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 2px 10px rgba(233, 158, 158, 0.3);
  transition: all 0.4s ease;
}

.movie-title {
  font-size: 0.9rem;
  margin: 0.5rem 0.5rem 0.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s ease;
  padding: 0 0.25rem;
}

.movie-card::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to top, rgba(248, 16, 16, 0.144) 0%, rgba(70, 3, 3, 0) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.movie-card:hover::after {
  opacity: 1;
}

/* Botones de navegación */
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(151, 147, 147, 0.7);
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  z-index: 20;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.nav-button:hover {
  opacity: 1;
  background-color: rgba(229, 9, 20, 0.8);
}

.prev {
  left: 0.5rem;
}

.next {
  right: 0.5rem;
}
</style>
