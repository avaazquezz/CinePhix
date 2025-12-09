<template>
  <div class="home-container">
    <div class="noise-overlay"></div>
    
    <main class="main-content">
      <section class="movie-section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="title-accent"></span>
            {{$t('home.todayTrending')}}
          </h2>
          <div class="title-underline"></div>
        </div>
        
        <div class="movie-grid">
          <div
            v-for="item in trendingContent"
            :key="item.id"
            class="movie-card"
            @click="openDialog(item)"
          >
            <div class="card-inner">
              <div class="poster-container">
                <img
                  :src="getImageUrl(item.poster_path)"
                  :alt="item.title || item.name"
                  class="movie-poster"
                />
                <div class="poster-overlay">
                  <div class="play-icon">
                    <i class="fas fa-play"></i>
                  </div>
                </div>
              </div>
              <div class="card-info">
                <h3 class="movie-title">{{ item.title || item.name }}</h3>
                <div class="movie-meta">
                  <span class="movie-type">{{ item.media_type === 'movie' ? $t('home.type.movie') : $t('home.type.tv') }}</span>
                  <span class="movie-rating">
                    <i class="fas fa-star"></i>
                    {{ item.vote_average ? (item.vote_average).toFixed(1) : 'N/A' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <transition name="dialog-fade">
      <div v-if="dialogVisible" class="dialog-overlay" @click.self="closeDialog">
        <div class="dialog-content">
          <button class="dialog-close" @click="closeDialog" :aria-label="$t('home.dialog.close')">
            <i class="fas fa-times"></i>
          </button>
          
          <div class="dialog-layout">
            <div class="dialog-poster-section">
              <img
                :src="getImageUrl(selectedItem.poster_path)"
                :alt="selectedItem.title || selectedItem.name"
                class="dialog-poster"
              />
            </div>
            
            <div class="dialog-details">
              <h2 class="dialog-title">{{ selectedItem.title || selectedItem.name }}</h2>
              
              <div class="dialog-meta">
                <span class="meta-item">
                  <i class="fas fa-film"></i>
                  {{ selectedItem.media_type === 'movie' ? $t('home.type.movie') : $t('home.type.tv') }}
                </span>
                <span class="meta-item rating-badge">
                  <i class="fas fa-star"></i>
                  {{ selectedItem.vote_average ? (selectedItem.vote_average).toFixed(1) : $t('home.dialog.na') }}/10
                </span>
              </div>
              
              <div class="dialog-overview-container">
                <h3 class="overview-title">{{ $t('home.dialog.overview') || 'Overview' }}</h3>
                <p class="dialog-overview">{{ selectedItem.overview || $t('home.dialog.noOverview') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
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

.movie-section {
  margin-bottom: 4rem;
}

.section-header {
  margin-bottom: 1.5rem;
  position: relative;
}

@media (min-width: 600px) {
  .section-header {
    margin-bottom: 2rem;
  }
}

@media (min-width: 1200px) {
  .section-header {
    margin-bottom: 3rem;
  }
}

.section-title {
  font-size: 1.5rem;
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
    font-size: 1.8rem;
    letter-spacing: 1.5px;
    gap: 12px;
  }
}

@media (min-width: 900px) {
  .section-title {
    font-size: 2.2rem;
    gap: 15px;
  }
}

@media (min-width: 1200px) {
  .section-title {
    font-size: 2.5rem;
    letter-spacing: 2px;
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
    height: 40px;
  }
}

.title-underline {
  height: 2px;
  width: 80px;
  background: linear-gradient(to right, #e50914, transparent);
  margin-top: 5px;
}

@media (min-width: 600px) {
  .title-underline {
    width: 100px;
  }
}

@media (min-width: 1200px) {
  .title-underline {
    width: 120px;
  }
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 600px) {
  .movie-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 900px) {
  .movie-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
}

@media (min-width: 1200px) {
  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 2rem;
  }
}

.movie-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.movie-card:hover {
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

.movie-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease, filter 0.4s ease;
}

.card-inner:hover .movie-poster {
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
  width: 45px;
  height: 45px;
  background: #e50914;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: white;
  box-shadow: 0 0 15px rgba(229, 9, 20, 0.6);
  transform: scale(0.8);
  transition: transform 0.3s ease;
}

@media (min-width: 600px) {
  .play-icon {
    width: 50px;
    height: 50px;
    font-size: 1.3rem;
  }
}

@media (min-width: 1200px) {
  .play-icon {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
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

.movie-title {
  font-size: 0.9rem;
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
  .movie-title {
    font-size: 1rem;
    min-height: 2.4rem;
  }
}

@media (min-width: 1200px) {
  .movie-title {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    min-height: 2.6rem;
  }
}

.movie-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
}

@media (min-width: 600px) {
  .movie-meta {
    font-size: 0.8rem;
  }
}

@media (min-width: 1200px) {
  .movie-meta {
    font-size: 0.85rem;
  }
}

.movie-type {
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.65rem;
}

@media (min-width: 600px) {
  .movie-type {
    font-size: 0.7rem;
    letter-spacing: 0.75px;
  }
}

@media (min-width: 1200px) {
  .movie-type {
    font-size: 0.75rem;
    letter-spacing: 1px;
  }
}

.movie-rating {
  color: #e50914;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
}

@media (min-width: 1200px) {
  .movie-rating {
    gap: 5px;
  }
}

.movie-rating i {
  font-size: 0.65rem;
}

@media (min-width: 1200px) {
  .movie-rating i {
    font-size: 0.7rem;
  }
}

/* Dialog Styles */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
  overflow-y: auto;
  backdrop-filter: blur(10px);
}

@media (min-width: 600px) {
  .dialog-overlay {
    padding: 1.5rem;
  }
}

@media (min-width: 1200px) {
  .dialog-overlay {
    padding: 2rem;
  }
}

.dialog-content {
  background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
  color: #fff;
  border-radius: 0;
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

.dialog-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(229, 9, 20, 0.2);
  border: 1px solid #e50914;
  color: #e50914;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

@media (min-width: 600px) {
  .dialog-close {
    top: 15px;
    right: 15px;
    width: 38px;
    height: 38px;
    font-size: 1.1rem;
  }
}

@media (min-width: 1200px) {
  .dialog-close {
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}

.dialog-close:hover {
  background: #e50914;
  color: white;
  transform: rotate(90deg);
}

.dialog-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
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
  max-width: 250px;
  margin: 0 auto;
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
  border-radius: 0;
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
  gap: 1rem;
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
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.2;
  margin-bottom: 0;
}

@media (min-width: 600px) {
  .dialog-title {
    font-size: 1.8rem;
    letter-spacing: 0.75px;
  }
}

@media (min-width: 900px) {
  .dialog-title {
    font-size: 2.2rem;
    letter-spacing: 1px;
  }
}

@media (min-width: 1200px) {
  .dialog-title {
    font-size: 2.5rem;
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
  gap: 6px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (min-width: 600px) {
  .meta-item {
    gap: 7px;
    font-size: 0.85rem;
    letter-spacing: 0.75px;
  }
}

@media (min-width: 1200px) {
  .meta-item {
    gap: 8px;
    font-size: 0.95rem;
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
  flex: 1;
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
  font-size: 1rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (min-width: 600px) {
  .overview-title {
    font-size: 1.1rem;
    letter-spacing: 0.75px;
  }
}

@media (min-width: 1200px) {
  .overview-title {
    font-size: 1.2rem;
    letter-spacing: 1px;
  }
}

.dialog-overview {
  font-size: 0.9rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  text-align: justify;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 8px;
}

@media (min-width: 600px) {
  .dialog-overview {
    font-size: 0.95rem;
    line-height: 1.65;
    max-height: 250px;
  }
}

@media (min-width: 900px) {
  .dialog-overview {
    max-height: 280px;
  }
}

@media (min-width: 1200px) {
  .dialog-overview {
    font-size: 1.05rem;
    line-height: 1.7;
    max-height: 300px;
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

/* Responsive */
@media (max-width: 1200px) {
  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.5rem;
  }
  
  .main-content {
    padding: 2.5rem 3rem;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 2rem 1.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
  }
  
  .dialog-layout {
    flex-direction: column;
    padding: 2rem;
    gap: 2rem;
  }
  
  .dialog-poster-section {
    flex: 0 0 auto;
    max-width: 300px;
    margin: 0 auto;
  }
  
  .dialog-title {
    font-size: 1.8rem;
  }
  
  .dialog-meta {
    flex-wrap: wrap;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 1.5rem 1rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .title-accent {
    width: 4px;
    height: 30px;
  }
  
  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  
  .dialog-layout {
    padding: 1.5rem;
  }
  
  .dialog-close {
    top: 10px;
    right: 10px;
    width: 35px;
    height: 35px;
  }
  
  .dialog-title {
    font-size: 1.4rem;
  }
  
  .dialog-overview {
    font-size: 0.95rem;
  }
}
</style>
