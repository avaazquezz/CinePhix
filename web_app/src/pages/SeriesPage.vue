<template>
  <div class="home-container">
    <main class="main-content">
      <!-- Sección de Series Populares -->
      <section class="serie-section">
        <h2 class="section-title">Series Populares</h2>
        <div class="serie-row-container">
          <button class="nav-button prev" @click="scrollCategory('popular', 'prev')">&lt;</button>
          <div class="serie-row" ref="popularRow">
            <div
              v-for="item in popularSeries"
              :key="item.id"
              class="serie-card"
              @click="openSeriesDialog(item.id)"
            >
              <img
                :src="getImageUrl(item.poster_path)"
                :alt="item.name"
                class="serie-poster"
              />
              <h3 class="serie-title">{{ item.name }}</h3>
            </div>
          </div>
          <button class="nav-button next" @click="scrollCategory('popular', 'next')">&gt;</button>
        </div>
      </section>

      <!-- Sección de Series Mejor Valoradas -->
      <section class="serie-section">
        <h2 class="section-title">Series Mejor Valoradas</h2>
        <div class="serie-row-container">
          <button class="nav-button prev" @click="scrollCategory('topRated', 'prev')">&lt;</button>
          <div class="serie-row" ref="topRatedRow">
            <div
              v-for="item in topRatedSeries"
              :key="item.id"
              class="serie-card"
              @click="openSeriesDialog(item.id)"
            >
              <img
                :src="getImageUrl(item.poster_path)"
                :alt="item.name"
                class="serie-poster"
              />
              <h3 class="serie-title">{{ item.name }}</h3>
            </div>
          </div>
          <button class="nav-button next" @click="scrollCategory('topRated', 'next')">&gt;</button>
        </div>
      </section>

      <!-- Sección de Series en Tendencia -->
      <section class="serie-section">
        <h2 class="section-title">Series en Tendencia Semanal</h2>
        <div class="serie-row-container">
          <button class="nav-button prev" @click="scrollCategory('trending', 'prev')">&lt;</button>
          <div class="serie-row" ref="trendingRow">
            <div
              v-for="item in trendingSeries"
              :key="item.id"
              class="serie-card"
              @click="openSeriesDialog(item.id)"
            >
              <img
                :src="getImageUrl(item.poster_path)"
                :alt="item.name"
                class="serie-poster"
              />
              <h3 class="serie-title">{{ item.name }}</h3>
            </div>
          </div>
          <button class="nav-button next" @click="scrollCategory('trending', 'next')">&gt;</button>
        </div>
      </section>

      <!-- Diálogo de Detalles de Serie -->
      <div v-if="isDialogOpen" class="serie-dialog" @click.self="closeSeriesDialog">
        <div class="dialog-content">
          <button class="close-button" @click="closeSeriesDialog">X</button>

          <div class="dialog-header">
            <h2>{{ seriesDetail.name }}</h2>
            <div class="serie-rating-container">
              <span class="serie-rating">{{ seriesDetail.vote_average?.toFixed(1) || '?' }}/10</span>
            </div>
          </div>

          <div class="dialog-body">
            <div class="dialog-poster">
              <img :src="getImageUrl(seriesDetail.poster_path)" :alt="seriesDetail.name" />
            </div>
            <div class="dialog-info">
              <p><strong>Fecha de lanzamiento:</strong> {{ seriesDetail.first_air_date }}</p>

              <p><strong>Sinopsis:</strong> {{ seriesDetail.overview }}</p>

              <p><strong>Créditos:</strong></p>
              <div class="credits-list">
                <div v-for="actor in seriesCredits" :key="actor.id" class="credit-item">
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
  getPopularSeries,
  getTopRatedSeries,
  getTrendingSeries,
  getSeriesDetail,
  getSeriesCredits,
} from '@/ApiController/services/seriesService';

export default {
  name: 'SeriesPage',
  setup() {
    const popularSeries = ref([]);
    const topRatedSeries = ref([]);
    const trendingSeries = ref([]);
    const isDialogOpen = ref(false);
    const seriesDetail = ref({});
    const seriesCredits = ref([]);

    const popularRow = ref(null);
    const topRatedRow = ref(null);
    const trendingRow = ref(null);

    const getImageUrl = (path) => `https://image.tmdb.org/t/p/w500${path}`;

    const fetchSeries = async () => {
      try {
        popularSeries.value = await getPopularSeries();
        topRatedSeries.value = await getTopRatedSeries();
        trendingSeries.value = await getTrendingSeries();
      } catch (error) {
        console.error('Error al cargar las series:', error);
      }
    };

    const openSeriesDialog = async (id) => {
      try {
        seriesDetail.value = await getSeriesDetail(id);
        seriesCredits.value = await getSeriesCredits(id);
        isDialogOpen.value = true;
      } catch (error) {
        console.error('Error al cargar los detalles de la serie:', error);
      }
    };

    const closeSeriesDialog = () => {
      isDialogOpen.value = false;
      seriesDetail.value = {};
      seriesCredits.value = [];
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

    onMounted(fetchSeries);

    return {
      popularSeries,
      topRatedSeries,
      trendingSeries,
      isDialogOpen,
      seriesDetail,
      seriesCredits,
      popularRow,
      topRatedRow,
      trendingRow,
      getImageUrl,
      scrollCategory,
      openSeriesDialog,
      closeSeriesDialog,
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

.serie-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  border-left: 0.25rem solid #fa000c;
  padding-left: 0.75rem;
}

/* Estilo de fila de series al estilo Netflix */
.serie-row-container {
  position: relative;
  width: 100%;
  padding: 0 2.5rem;
}

.serie-row {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 1rem 0;
  scrollbar-width: none; /* Firefox */
}

.serie-row::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* Estilos para las tarjetas de series */
.serie-card {
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

.serie-card:hover {
  transform: translateY(-0.625rem) scale(1.05);
  box-shadow: 0 0.625rem 1.563rem rgba(0, 0, 0, 0.5);
  background-color: rgba(99, 63, 63, 0.7);
}

.serie-card:hover .serie-title {
  color: #ff000d;
}

.serie-card:hover .serie-poster {
  transform: scale(1.1);
  filter: brightness(110%);
}

.serie-poster {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  border-radius: 0.5rem 0.5rem 0 0;
  box-shadow: 0 0.125rem 0.625rem rgba(233, 158, 158, 0.3);
  transition: all 0.4s ease;
}

.serie-title {
  font-size: 0.9rem;
  margin: 0.5rem 0.5rem 0.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s ease;
  padding: 0 0.25rem;
}

.serie-card::after {
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

.serie-card:hover::after {
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
.serie-dialog {
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

.serie-rating-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.serie-rating {
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
</style>
