<template>
  <div class="home-container">
    <div class="noise-overlay"></div>
    
    <main class="main-content">
      <!-- Sección de Series Populares -->
      <section class="serie-section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="title-accent"></span>
            {{$t('series.popular')}}
          </h2>
          <div class="title-underline"></div>
        </div>
        <div class="serie-row-container">
          <button class="nav-button prev" @click="scrollCategory('popular', 'prev')">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="serie-row" ref="popularRow">
            <div
              v-for="item in popularSeries"
              :key="item.id"
              class="serie-card"
              @click="openSeriesDialog(item.id)"
            >
              <div class="card-inner">
                <div class="poster-container">
                  <img
                    :src="getImageUrl(item.poster_path)"
                    :alt="item.name"
                    class="serie-poster"
                  />
                  <div class="poster-overlay">
                    <div class="play-icon">
                      <i class="fas fa-play"></i>
                    </div>
                  </div>
                </div>
                <div class="card-info">
                  <h3 class="serie-title">{{ item.name }}</h3>
                  <div class="serie-meta">
                    <span class="serie-rating">
                      <i class="fas fa-star"></i>
                      {{ item.vote_average ? item.vote_average.toFixed(1) : 'N/A' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button class="nav-button next" @click="scrollCategory('popular', 'next')">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </section>

      <!-- Sección de Series Mejor Valoradas -->
      <section class="serie-section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="title-accent"></span>
            {{$t('series.topRated')}}
          </h2>
          <div class="title-underline"></div>
        </div>
        <div class="serie-row-container">
          <button class="nav-button prev" @click="scrollCategory('topRated', 'prev')">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="serie-row" ref="topRatedRow">
            <div
              v-for="item in topRatedSeries"
              :key="item.id"
              class="serie-card"
              @click="openSeriesDialog(item.id)"
            >
              <div class="card-inner">
                <div class="poster-container">
                  <img
                    :src="getImageUrl(item.poster_path)"
                    :alt="item.name"
                    class="serie-poster"
                  />
                  <div class="poster-overlay">
                    <div class="play-icon">
                      <i class="fas fa-play"></i>
                    </div>
                  </div>
                </div>
                <div class="card-info">
                  <h3 class="serie-title">{{ item.name }}</h3>
                  <div class="serie-meta">
                    <span class="serie-rating">
                      <i class="fas fa-star"></i>
                      {{ item.vote_average ? item.vote_average.toFixed(1) : 'N/A' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button class="nav-button next" @click="scrollCategory('topRated', 'next')">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </section>

      <!-- Sección de Series en Tendencia -->
      <section class="serie-section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="title-accent"></span>
            {{$t('series.weeklyTrending')}}
          </h2>
          <div class="title-underline"></div>
        </div>
        <div class="serie-row-container">
          <button class="nav-button prev" @click="scrollCategory('trending', 'prev')">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="serie-row" ref="trendingRow">
            <div
              v-for="item in trendingSeries"
              :key="item.id"
              class="serie-card"
              @click="openSeriesDialog(item.id)"
            >
              <div class="card-inner">
                <div class="poster-container">
                  <img
                    :src="getImageUrl(item.poster_path)"
                    :alt="item.name"
                    class="serie-poster"
                  />
                  <div class="poster-overlay">
                    <div class="play-icon">
                      <i class="fas fa-play"></i>
                    </div>
                  </div>
                </div>
                <div class="card-info">
                  <h3 class="serie-title">{{ item.name }}</h3>
                  <div class="serie-meta">
                    <span class="serie-rating">
                      <i class="fas fa-star"></i>
                      {{ item.vote_average ? item.vote_average.toFixed(1) : 'N/A' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button class="nav-button next" @click="scrollCategory('trending', 'next')">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </section>

      <!-- Diálogo de Detalles de Serie -->
      <transition name="dialog-fade">
        <div v-if="isDialogOpen" class="serie-dialog" @click.self="closeSeriesDialog">
          <div class="dialog-content">
            <button class="close-button" @click="closeSeriesDialog" aria-label="Cerrar">
              <i class="fas fa-times"></i>
            </button>

            <div class="dialog-layout">
              <div class="dialog-poster-section">
                <img :src="getImageUrl(seriesDetail.poster_path)" :alt="seriesDetail.name" class="dialog-poster" />
              </div>
              
              <div class="dialog-details">
                <h2 class="dialog-title">{{ seriesDetail.name }}</h2>
                
                <div class="dialog-meta">
                  <span class="meta-item">
                    <i class="fas fa-calendar"></i>
                    {{ seriesDetail.first_air_date || '—' }}
                  </span>
                  <span class="meta-item rating-badge">
                    <i class="fas fa-star"></i>
                    {{ seriesDetail.vote_average?.toFixed(1) || '?' }}/10
                  </span>
                </div>
                
                <div class="dialog-overview-container">
                  <h3 class="overview-title">{{ $t('series.detail.overview') || 'Sinopsis' }}</h3>
                  <p class="dialog-overview">{{ seriesDetail.overview || '—' }}</p>
                </div>
                
                <div class="dialog-credits-container">
                  <h3 class="credits-title">{{ $t('series.detail.credits') || 'Reparto' }}</h3>
                  <div class="credits-list">
                    <div v-for="actor in seriesCredits.slice(0, 8)" :key="actor.id" class="credit-item">
                      <span class="actor-name">{{ actor.name }}</span>
                      <span class="actor-character">{{ actor.character }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
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

    const getImageUrl = (path) => {
      if (!path) return '';
      const isMobile = window.innerWidth <= 480;
      const size = isMobile ? 'w185' : 'w342';
      return `https://image.tmdb.org/t/p/${size}${path}`;
    };

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
        document.body.style.overflow = 'hidden';
        window.dispatchEvent(new CustomEvent('dialog-opened'));
      } catch (error) {
        console.error('Error al cargar los detalles de la serie:', error);
      }
    };

    const closeSeriesDialog = () => {
      isDialogOpen.value = false;
      seriesDetail.value = {};
      seriesCredits.value = [];
      document.body.style.overflow = '';
      window.dispatchEvent(new CustomEvent('dialog-closed'));
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
  background: linear-gradient(to bottom, #050505 0%, #0a0a0a 50%, #050505 100%);
  color: #e0e0e0;
  font-family: 'Montserrat', 'Poppins', sans-serif;
  position: relative;
  overflow-x: hidden;
}

.noise-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

.main-content {
  padding: 1.5rem 1rem;
  position: relative;
  z-index: 2;
}

@media (min-width: 600px) {
  .main-content {
    padding: 2rem 1.5rem;
  }
}

@media (min-width: 900px) {
  .main-content {
    padding: 2.5rem 3rem;
  }
}

@media (min-width: 1200px) {
  .main-content {
    padding: 3rem 4rem;
  }
}

.serie-section {
  margin-bottom: 2.5rem;
}

@media (min-width: 600px) {
  .serie-section {
    margin-bottom: 3rem;
  }
}

@media (min-width: 1200px) {
  .serie-section {
    margin-bottom: 4rem;
  }
}

.section-header {
  margin-bottom: 1rem;
  position: relative;
}

@media (min-width: 600px) {
  .section-header {
    margin-bottom: 1.5rem;
  }
}

@media (min-width: 1200px) {
  .section-header {
    margin-bottom: 2rem;
  }
}

.section-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

@media (min-width: 600px) {
  .section-title {
    font-size: 1.6rem;
    letter-spacing: 1.5px;
    gap: 12px;
  }
}

@media (min-width: 900px) {
  .section-title {
    font-size: 1.8rem;
    gap: 13px;
  }
}

@media (min-width: 1200px) {
  .section-title {
    font-size: 2rem;
    letter-spacing: 2px;
    gap: 15px;
    margin-bottom: 10px;
  }
}

.title-accent {
  width: 4px;
  height: 25px;
  background: linear-gradient(to bottom, #e50914, #ff4c4c);
  box-shadow: 0 0 10px rgba(229, 9, 20, 0.5);
}

@media (min-width: 600px) {
  .title-accent {
    width: 4px;
    height: 30px;
  }
}

@media (min-width: 1200px) {
  .title-accent {
    width: 5px;
    height: 35px;
  }
}

.title-underline {
  height: 2px;
  width: 60px;
  background: linear-gradient(to right, #e50914, transparent);
  margin-top: 5px;
}

@media (min-width: 600px) {
  .title-underline {
    width: 80px;
  }
}

@media (min-width: 1200px) {
  .title-underline {
    width: 100px;
  }
}

/* Estilo de fila de series */
.serie-row-container {
  position: relative;
  width: 100%;
  padding: 0 2rem;
}

@media (min-width: 600px) {
  .serie-row-container {
    padding: 0 2.5rem;
  }
}

@media (min-width: 1200px) {
  .serie-row-container {
    padding: 0 3rem;
  }
}

.serie-row {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 1rem 0;
  gap: 1rem;
  scrollbar-width: none;
}

@media (min-width: 600px) {
  .serie-row {
    padding: 1.25rem 0;
    gap: 1.25rem;
  }
}

@media (min-width: 1200px) {
  .serie-row {
    padding: 1.5rem 0;
    gap: 1.5rem;
  }
}

.serie-row::-webkit-scrollbar {
  display: none;
}

/* Estilos para las tarjetas de series */
.serie-card {
  flex: 0 0 auto;
  width: 130px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

@media (min-width: 600px) {
  .serie-card {
    width: 160px;
  }
}

@media (min-width: 900px) {
  .serie-card {
    width: 180px;
  }
}

@media (min-width: 1200px) {
  .serie-card {
    width: 200px;
  }
}

.serie-card:hover {
  transform: translateY(-10px);
}

.card-inner {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
  transition: all 0.4s ease;
}

.card-inner:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(229, 9, 20, 0.3);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
}

.poster-container {
  position: relative;
  overflow: hidden;
  aspect-ratio: 2/3;
}

.serie-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease, filter 0.4s ease;
}

.card-inner:hover .serie-poster {
  transform: scale(1.1);
  filter: brightness(0.6);
}

.poster-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.card-inner:hover .poster-overlay {
  opacity: 1;
}

.play-icon {
  width: 40px;
  height: 40px;
  background: #e50914;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: white;
  box-shadow: 0 0 15px rgba(229, 9, 20, 0.6);
  transform: scale(0.8);
  transition: transform 0.3s ease;
}

@media (min-width: 600px) {
  .play-icon {
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }
}

@media (min-width: 1200px) {
  .play-icon {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
    box-shadow: 0 0 20px rgba(229, 9, 20, 0.6);
  }
}

.card-inner:hover .play-icon {
  transform: scale(1);
}

.card-info {
  padding: 0.75rem;
}

@media (min-width: 600px) {
  .card-info {
    padding: 0.85rem;
  }
}

@media (min-width: 1200px) {
  .card-info {
    padding: 1rem;
  }
}

.serie-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.4rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.2rem;
}

@media (min-width: 600px) {
  .serie-title {
    font-size: 0.9rem;
    min-height: 2.3rem;
  }
}

@media (min-width: 1200px) {
  .serie-title {
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
    min-height: 2.4rem;
  }
}

.serie-meta {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.serie-rating {
  color: #e50914;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  font-size: 0.75rem;
}

@media (min-width: 600px) {
  .serie-rating {
    font-size: 0.8rem;
    gap: 4px;
  }
}

@media (min-width: 1200px) {
  .serie-rating {
    font-size: 0.85rem;
    gap: 5px;
  }
}

.serie-rating i {
  font-size: 0.65rem;
}

@media (min-width: 1200px) {
  .serie-rating i {
    font-size: 0.7rem;
  }
}

/* Botones de navegación */
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 35px;
  height: 35px;
  background: rgba(229, 9, 20, 0.2);
  border: 1px solid rgba(229, 9, 20, 0.4);
  color: white;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

@media (min-width: 600px) {
  .nav-button {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }
}

@media (min-width: 1200px) {
  .nav-button {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
}

.nav-button:hover {
  background: rgba(229, 9, 20, 0.8);
  border-color: #e50914;
  transform: translateY(-50%) scale(1.1);
}

.prev {
  left: 0;
}

.next {
  right: 0;
}

/* Estilos para el diálogo */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.serie-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 0.75rem;
  overflow-y: auto;
  backdrop-filter: blur(10px);
}

@media (min-width: 600px) {
  .serie-dialog {
    padding: 1.5rem;
  }
}

@media (min-width: 1200px) {
  .serie-dialog {
    padding: 2rem;
  }
}

.dialog-content {
  background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
  color: #fff;
  width: 100%;
  max-width: 1100px;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7);
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.dialog-layout {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2.5rem 1rem 1rem;
}

@media (min-width: 480px) {
  .dialog-layout {
    gap: 1.25rem;
    padding: 2.5rem 1.25rem 1.25rem;
  }
}

@media (min-width: 600px) {
  .dialog-layout {
    gap: 2rem;
    padding: 2rem;
  }
}

@media (min-width: 900px) {
  .dialog-layout {
    flex-direction: row;
    gap: 2.5rem;
    padding: 2.5rem;
  }
}

@media (min-width: 1200px) {
  .dialog-layout {
    gap: 3rem;
    padding: 3rem;
  }
}

.dialog-poster-section {
  flex: 0 0 auto;
  width: 100%;
  max-width: 180px;
  margin: 0 auto;
}

@media (min-width: 480px) {
  .dialog-poster-section {
    max-width: 220px;
  }
}

@media (min-width: 600px) {
  .dialog-poster-section {
    max-width: 280px;
  }
}

@media (min-width: 900px) {
  .dialog-poster-section {
    flex: 0 0 300px;
    max-width: 300px;
    margin: 0;
  }
}

@media (min-width: 1200px) {
  .dialog-poster-section {
    flex: 0 0 350px;
    max-width: 350px;
  }
}

.dialog-poster {
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
}

@media (min-width: 1200px) {
  .dialog-poster {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
  }
}

.dialog-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

@media (min-width: 480px) {
  .dialog-details {
    gap: 1rem;
  }
}

@media (min-width: 600px) {
  .dialog-details {
    gap: 1.25rem;
  }
}

@media (min-width: 1200px) {
  .dialog-details {
    gap: 1.5rem;
  }
}

.dialog-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.3;
  margin: 0;
}

@media (min-width: 480px) {
  .dialog-title {
    font-size: 1.9rem;
  }
}

@media (min-width: 600px) {
  .dialog-title {
    font-size: 2.2rem;
    letter-spacing: 0.75px;
  }
}

@media (min-width: 900px) {
  .dialog-title {
    font-size: 2.4rem;
    letter-spacing: 1px;
  }
}

@media (min-width: 1200px) {
  .dialog-title {
    font-size: 2.7rem;
  }
}

.dialog-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

@media (min-width: 600px) {
  .dialog-meta {
    gap: 1.5rem;
  }
}

@media (min-width: 1200px) {
  .dialog-meta {
    gap: 2rem;
  }
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (min-width: 600px) {
  .meta-item {
    gap: 8px;
    font-size: 1rem;
    letter-spacing: 0.75px;
  }
}

@media (min-width: 1200px) {
  .meta-item {
    gap: 9px;
    font-size: 1.1rem;
    letter-spacing: 1px;
  }
}

.meta-item i {
  color: #e50914;
  font-size: 0.75rem;
}

@media (min-width: 600px) {
  .meta-item i {
    font-size: 0.8rem;
  }
}

@media (min-width: 1200px) {
  .meta-item i {
    font-size: 0.9rem;
  }
}

.rating-badge {
  background: rgba(229, 9, 20, 0.15);
  padding: 6px 12px;
  border: 1px solid rgba(229, 9, 20, 0.3);
  color: #e50914;
  font-weight: 700;
}

@media (min-width: 600px) {
  .rating-badge {
    padding: 7px 13px;
  }
}

@media (min-width: 1200px) {
  .rating-badge {
    padding: 8px 15px;
  }
}

.dialog-overview-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 600px) {
  .dialog-overview-container {
    gap: 0.85rem;
  }
}

@media (min-width: 1200px) {
  .dialog-overview-container {
    gap: 1rem;
  }
}

.overview-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

@media (min-width: 600px) {
  .overview-title {
    font-size: 1.25rem;
    letter-spacing: 0.75px;
  }
}

@media (min-width: 1200px) {
  .overview-title {
    font-size: 1.35rem;
    letter-spacing: 1px;
  }
}

.dialog-overview {
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85);
  text-align: left;
  max-height: 180px;
  overflow-y: auto;
  padding-right: 8px;
}

@media (min-width: 480px) {
  .dialog-overview {
    font-size: 1.05rem;
    max-height: 190px;
  }
}

@media (min-width: 600px) {
  .dialog-overview {
    font-size: 1.05rem;
    line-height: 1.75;
    max-height: 190px;
    text-align: justify;
  }
}

@media (min-width: 900px) {
  .dialog-overview {
    max-height: 195px;
  }
}

@media (min-width: 1200px) {
  .dialog-overview {
    font-size: 1.15rem;
    line-height: 1.8;
    max-height: 200px;
    padding-right: 10px;
  }
}

.dialog-overview::-webkit-scrollbar {
  width: 4px;
}

.dialog-overview::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.dialog-overview::-webkit-scrollbar-thumb {
  background: #e50914;
}

.dialog-credits-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 600px) {
  .dialog-credits-container {
    gap: 0.85rem;
  }
}

@media (min-width: 1200px) {
  .dialog-credits-container {
    gap: 1rem;
  }
}

.credits-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

@media (min-width: 600px) {
  .credits-title {
    font-size: 1.25rem;
    letter-spacing: 0.75px;
  }
}

@media (min-width: 1200px) {
  .credits-title {
    font-size: 1.35rem;
    letter-spacing: 1px;
  }
}

.credits-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.6rem;
  max-height: 150px;
  overflow-y: auto;
  padding-right: 8px;
}

@media (min-width: 480px) {
  .credits-list {
    max-height: 170px;
  }
}

@media (min-width: 600px) {
  .credits-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.7rem;
    max-height: 190px;
  }
}

@media (min-width: 1200px) {
  .credits-list {
    gap: 0.75rem;
    max-height: 200px;
    padding-right: 10px;
  }
}

.credits-list::-webkit-scrollbar {
  width: 4px;
}

.credits-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.credits-list::-webkit-scrollbar-thumb {
  background: #e50914;
}

.credit-item {
  background: rgba(255, 255, 255, 0.03);
  padding: 0.6rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

@media (min-width: 600px) {
  .credit-item {
    padding: 0.65rem;
    gap: 0.22rem;
  }
}

@media (min-width: 1200px) {
  .credit-item {
    padding: 0.75rem;
    gap: 0.25rem;
  }
}

.actor-name {
  font-weight: 600;
  color: white;
  font-size: 0.9rem;
}

@media (min-width: 600px) {
  .actor-name {
    font-size: 0.95rem;
  }
}

@media (min-width: 1200px) {
  .actor-name {
    font-size: 1rem;
  }
}

.actor-character {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
}

@media (min-width: 600px) {
  .actor-character {
    font-size: 0.9rem;
  }
}

@media (min-width: 1200px) {
  .actor-character {
    font-size: 0.95rem;
  }
}

.close-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(229, 9, 20, 0.3);
  border: 1px solid #e50914;
  color: #e50914;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  border-radius: 2px;
}

@media (min-width: 480px) {
  .close-button {
    top: 10px;
    right: 10px;
    width: 38px;
    height: 38px;
  }
}

@media (min-width: 600px) {
  .close-button {
    top: 15px;
    right: 15px;
    font-size: 1.1rem;
  }
}

@media (min-width: 1200px) {
  .close-button {
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}

.close-button:hover {
  background: #e50914;
  color: white;
  transform: rotate(90deg);
}
</style>
