<template>
  <div class="home-container">
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
              @click="openMovieDialog(item.id)"
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
              @click="openMovieDialog(item.id)"
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
              @click="openMovieDialog(item.id)"
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

      <!-- Diálogo de Detalles de Película -->
      <div v-if="isDialogOpen" class="movie-dialog" @click.self="closeMovieDialog">
        <div class="dialog-content">
          <button class="close-button" @click="closeMovieDialog">X</button>

          <div class="dialog-header">
            <h2>{{ movieDetail.title }}</h2>
            <div class="movie-rating-container">
              <span class="movie-rating">{{ movieDetail.vote_average?.toFixed(1) || '?' }}/10</span>
            </div>
          </div>

          <div class="dialog-body">
            <div class="dialog-poster">
              <img :src="getImageUrl(movieDetail.poster_path, true)" :alt="movieDetail.title" />
            </div>
            <div class="dialog-info">
              <p><strong>Fecha de lanzamiento:</strong> {{ movieDetail.release_date || 'No disponible' }}</p>

              <p class="movie-overview"><strong>Sinopsis:</strong> {{ movieDetail.overview || 'No disponible' }}</p>

              <p><strong>Créditos:</strong></p>
              <div class="credits-list">
                <div v-for="actor in movieCredits.slice(0, 8)" :key="actor.id" class="credit-item">
                  {{ actor.name }} como {{ actor.character }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import {
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
  getMovieDetail,
  getMovieCredits,
} from '@/ApiController/services/movieService';

export default {
  name: 'MoviesPage',
  setup() {
    const popularMovies = ref([]);
    const topRatedMovies = ref([]);
    const trendingMovies = ref([]);
    const isDialogOpen = ref(false);
    const movieDetail = ref({});
    const movieCredits = ref([]);

    const popularRow = ref(null);
    const topRatedRow = ref(null);
    const trendingRow = ref(null);

    const getImageUrl = (path, isDetail = false) => {
      if (!path) return '';

      const isMobile = window.innerWidth <= 480;
      const size = isDetail ? (isMobile ? 'w342' : 'w500') : (isMobile ? 'w185' : 'w342');

      return `https://image.tmdb.org/t/p/${size}${path}`;
    };

    const fetchMovies = async () => {
      try {
        popularMovies.value = await getPopularMovies();
        topRatedMovies.value = await getTopRatedMovies();
        trendingMovies.value = await getTrendingMovies();
      } catch (error) {
        console.error('Error al cargar las películas:', error);
      }
    };

    const openMovieDialog = async (id) => {
      try {
        movieDetail.value = await getMovieDetail(id);
        movieCredits.value = await getMovieCredits(id);
        isDialogOpen.value = true;
      } catch (error) {
        console.error('Error al cargar los detalles de la película:', error);
      }
    };

    const closeMovieDialog = () => {
      isDialogOpen.value = false;
      movieDetail.value = {};
      movieCredits.value = [];
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

    return {
      popularMovies,
      topRatedMovies,
      trendingMovies,
      isDialogOpen,
      movieDetail,
      movieCredits,
      popularRow,
      topRatedRow,
      trendingRow,
      getImageUrl,
      scrollCategory,
      openMovieDialog,
      closeMovieDialog,
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
  border-left: 0.25rem solid #fa000c;
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
  width: 11.25rem;
  margin-right: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 0.5rem;
  overflow: hidden;
  position: relative;
  background-color: rgba(20, 20, 24, 0.8);
  padding-bottom: 1rem;
}

.movie-card:hover {
  transform: translateY(-0.625rem) scale(1.05);
  box-shadow: 0 0.625rem 1.563rem rgba(0, 0, 0, 0.5);
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
  border-radius: 0.5rem 0.5rem 0 0;
  box-shadow: 0 0.125rem 0.625rem rgba(233, 158, 158, 0.3);
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
  width: 2.5rem;
  height: 2.5rem;
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

/* Estilos para el diálogo */
.movie-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow: auto;
  padding: 1.25rem;
}

.dialog-content {
  background: #1a1a1a;
  color: #fff;
  padding: 2.5rem 1.5rem 1.5rem;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 50rem;
  max-height: 85vh;
  position: relative;
  box-shadow: 0 0.313rem 1.563rem rgba(0, 0, 0, 0.5);
  border: 0.063rem solid rgba(229, 9, 20, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 0.063rem solid rgba(255, 255, 255, 0.1);
}

.dialog-header h2 {
  margin: 0;
  color: #ff000d;
  font-size: 1.75rem;
  max-width: 75%;
}

.movie-rating-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.movie-rating {
  background-color: rgba(229, 9, 20, 0.8);
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 4rem;
  text-align: center;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.5);
  font-size: 1.1rem;
}

.dialog-body {
  display: flex;
  gap: 1.5rem;
  overflow-y: auto;
  flex: 1;
  padding-right: 0.313rem;
}

.dialog-poster {
  flex: 0 0 12.5rem;
}

.dialog-poster img {
  width: 100%;
  border-radius: 0.5rem;
  box-shadow: 0 0.188rem 0.625rem rgba(0, 0, 0, 0.3);
}

.dialog-info {
  flex: 1;
  overflow-y: auto;
}

.dialog-info p {
  margin-bottom: 1.25rem;
}

.credits-list {
  max-height: 9.375rem;
  overflow-y: auto;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 0.313rem;
  margin-top: 0.5rem;
}

.credit-item {
  padding: 0.313rem 0;
  border-bottom: 0.063rem solid rgba(255, 255, 255, 0.1);
}

.credit-item:last-child {
  border-bottom: none;
}

.close-button {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(229, 9, 20, 0.9);
  border: none;
  color: white;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: all 0.3s ease;
  font-weight: bold;
  box-shadow: 0 0.125rem 0.375rem rgba(0, 0, 0, 0.5);
}

.close-button:hover {
  background: rgba(229, 9, 20, 1);
  transform: scale(1.1);
}

@media (max-width: 40rem) {
  .dialog-body {
    flex-direction: column;
  }

  .dialog-poster {
    flex: 0 0 auto;
    margin: 0 auto;
    max-width: 11.25rem;
  }
}

/* Mejoras responsive */
@media (max-width: 768px) {
  .section-title {
    font-size: 1.4rem;
    margin-bottom: 0.75rem;
  }

  .movie-row-container {
    padding: 0 2rem;
  }

  .movie-card {
    width: 9rem;
    margin-right: 0.5rem;
  }

  .nav-button {
    width: 2rem;
    height: 2rem;
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.25rem;
  }

  .movie-row-container {
    padding: 0 1.5rem;
  }

  .movie-card {
    width: 7.5rem;
    margin-right: 0.4rem;
  }

  .movie-title {
    font-size: 0.8rem;
    margin: 0.3rem 0.3rem 0.5rem;
  }

  .nav-button {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 1rem;
    opacity: 0.9;
  }
}

/* Mejoras para el diálogo en pantallas pequeñas */
@media (max-width: 600px) {
  .dialog-content {
    width: 95%;
    padding: 2rem 1rem 1rem;
    max-height: 90vh;
  }

  .dialog-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .dialog-header h2 {
    font-size: 1.4rem;
    max-width: 100%;
  }

  .movie-rating {
    padding: 0.3rem 0.5rem;
    min-width: 3rem;
    font-size: 0.95rem;
  }

  .dialog-body {
    gap: 1rem;
  }

  .dialog-poster {
    margin: 0 auto 1rem;
    max-width: 9rem;
  }

  .credits-list {
    max-height: 7rem;
  }

  .close-button {
    width: 2rem;
    height: 2rem;
    font-size: 1rem;
    top: 0.5rem;
    right: 0.5rem;
  }
}

/* Mejoras adicionales para el diálogo en pantallas pequeñas */
@media (max-width: 400px) {
  .dialog-content {
    width: 98%;
    padding: 1.5rem 1rem 1rem;
    max-height: 95vh;
    overflow-y: auto;
  }

  .dialog-header {
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
  }

  .dialog-header h2 {
    font-size: 1.2rem;
    line-height: 1.3;
  }

  .movie-rating {
    padding: 0.25rem 0.4rem;
    min-width: 2.8rem;
    font-size: 0.85rem;
    margin-top: 0.25rem;
  }

  .dialog-body {
    flex-direction: column;
    gap: 0.75rem;
    padding-right: 0;
  }

  .dialog-poster {
    margin: 0 auto 0.5rem;
    max-width: 7.5rem;
  }

  .dialog-poster img {
    width: 100%;
    max-height: 11rem;
    object-fit: cover;
  }

  .dialog-info {
    padding-bottom: 1rem;
  }

  .dialog-info p {
    margin-bottom: 0.75rem;
    font-size: 0.85rem;
    line-height: 1.4;
  }

  .dialog-info strong {
    display: block;
    margin-bottom: 0.25rem;
  }

  .credits-list {
    max-height: 6rem;
    padding: 0.3rem;
  }

  .credit-item {
    font-size: 0.8rem;
    padding: 0.25rem 0;
  }

  .close-button {
    width: 1.8rem;
    height: 1.8rem;
    font-size: 0.9rem;
    top: 0.4rem;
    right: 0.4rem;
  }
}

/* Ajustes específicos para dispositivos muy pequeños */
@media (max-width: 360px) {
  .dialog-content {
    padding: 1.25rem 0.75rem 0.75rem;
  }

  .dialog-header h2 {
    font-size: 1.1rem;
  }

  .dialog-header {
    padding-right: 1.5rem; /* Espacio para el botón de cierre */
  }

  .dialog-poster {
    max-width: 6.5rem;
  }

  .dialog-info p {
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
  }

  /* Mejora para que se vea bien la sinopsis */
  .dialog-info p:nth-child(2) {
    max-height: 9.5rem;
    overflow-y: auto;
    padding-right: 0.25rem;
  }
}

/* Mejoras para navegación en pantalla táctil */
@media (hover: none) {
  .nav-button {
    opacity: 1;
    background-color: rgba(151, 147, 147, 0.8);
  }

  .movie-card:hover {
    transform: none;
  }

  .movie-section {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
  }
}
</style>
