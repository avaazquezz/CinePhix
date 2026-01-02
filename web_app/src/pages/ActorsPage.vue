<template>
  <div class="actors-page">
    <!-- Header con efecto parallax -->
    <div class="hero-parallax">
      <div class="hero-content">
  <h1 class="hero-title"><span v-html="$t('actors.title')"></span></h1>
  <p class="hero-subtitle">{{ $t('actors.subtitle') }}</p>

        <!-- Buscador mejorado con animación -->
        <div class="search-container">
          <div class="search-bar-wrapper">
            <div class="search-bar">
              <i class="search-icon fas fa-search"></i>
              <input
                type="text"
                v-model="searchQuery"
                :placeholder="$t('actors.searchPlaceholder')"
                @keyup.enter="searchForActors"
              />
              <button class="search-button pulse-animation" @click="searchForActors">
                <span>{{ $t('actors.search') }}</span>
              </button>
            </div>
          </div>

          <!-- Sugerencias de búsqueda mejoradas y más visibles -->
          <div class="search-suggestion" v-if="!actors.length && !searchQuery">
            <span class="suggestion-label">{{ $t('actors.trySearching') }}</span>
            <div class="suggestion-tags">
              <span class="tag" @click="quickSearch('Tom Hanks')">Tom Hanks</span>
              <span class="tag" @click="quickSearch('Scarlett Johansson')">Scarlett Johansson</span>
              <span class="tag" @click="quickSearch('Mario Casas')">Mario Casas</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Resultados de búsqueda con mejor presentación -->
    <div v-if="actors.length > 0" class="content-container search-results-section">
      <div class="section-header">
  <h2 v-html="$t('actors.results', { query: searchQuery })"></h2>
  <div class="results-count">{{ $t('actors.found', { count: actors.length }) }}</div>
      </div>

      <!-- Grid de actores con animación -->
      <div class="actors-grid">
        <div
          v-for="(actor, index) in actors"
          :key="actor.id"
          class="actor-card"
          :style="{'--animation-order': index}"
          @click="openActorDialog(actor.id)"
        >
          <div class="actor-image-container">
            <div class="actor-image">
              <img :src="getActorImage(actor.profile_path)" :alt="actor.name" />
            </div>
            <div class="actor-overlay">
              <span class="view-details">{{ $t('actors.viewDetails') }}</span>
            </div>
          </div>
          <div class="actor-info">
            <h3 class="actor-name">{{ actor.name }}</h3>
            <div class="actor-known-for" v-if="actor.known_for_department">
              <span class="department-badge">{{ actor.known_for_department }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje de no resultados más atractivo -->
    <div v-if="searchQuery && actors.length === 0" class="content-container no-results">
      <div class="no-results-content">
        <div class="no-results-icon">
          <i class="fas fa-search-minus"></i>
        </div>
        <h3 v-html="$t('actors.noResultsTitle', { query: searchQuery })"></h3>
        <p>{{ $t('actors.noResultsHint') }}</p>
        <button class="retry-button" @click="searchQuery = ''">
          <i class="fas fa-redo-alt"></i> {{ $t('actors.newSearch') }}
        </button>
      </div>
    </div>

    <!-- Página inicial mejorada con cards de características -->
    <div class="content-container" v-if="!actors.length && !searchQuery">
      <div class="trending-section">
  <h2 class="section-title">{{ $t('actors.discoverTitle') }}</h2>
  <p class="section-subtitle">{{ $t('actors.discoverSubtitle') }}</p>

        <div class="features">
          <div class="feature-card">
            <div class="feature-content">
              <h3>{{ $t('actors.features.filmography.title') }}</h3>
              <p>{{ $t('actors.features.filmography.description') }}</p>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-content">
              <h3>{{ $t('actors.features.career.title') }}</h3>
              <p>{{ $t('actors.features.career.description') }}</p>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-content">
              <h3>{{ $t('actors.features.roles.title') }}</h3>
              <p>{{ $t('actors.features.roles.description') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de créditos del actor completamente rediseñado -->
    <transition name="modal-fade">
      <div v-if="showDialog" class="modal" @click.self="closeDialog">
        <div class="modal-content">
          <button class="close-button" @click="closeDialog" :aria-label="$t('common.close')">
            <span class="close-icon">✖</span>
            <span class="sr-only">{{ $t('common.close') }}</span>
          </button>

          <div class="actor-profile">
            <h2 class="actor-profile-name">{{ selectedActorName }}</h2>

            <div class="credits-wrapper">
              <div class="credits-header">
                <h3>{{ $t('actors.filmography') }}</h3>
                <div class="credits-count">{{ $t('actors.titles', { count: credits.length }) }}</div>
              </div>

              <div v-if="credits.length > 0" class="credits-container">
                <div v-for="(credit, index) in sortedCredits" :key="credit.id" class="credit-card" :style="{'--animation-order': index}">
                  <div class="credit-year-badge" v-if="credit.release_date || credit.first_air_date">
                    {{ getYearFromDate(credit.release_date || credit.first_air_date) }}
                  </div>

                  <div class="credit-details">
                    <h4 class="credit-title">{{ credit.title || credit.name }}</h4>

                    <div class="credit-meta">
                      <span class="credit-type" :class="credit.media_type === 'movie' ? 'movie-badge' : 'tv-badge'">
                        <i :class="credit.media_type === 'movie' ? 'fas fa-film' : 'fas fa-tv'"></i>
                        {{ credit.media_type === 'movie' ? $t('actors.movie') : $t('actors.tv') }}
                      </span>

                      <span class="credit-character" v-if="credit.character">
                        <i class="fas fa-user"></i> {{ credit.character }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="credits-loading">
                <div class="loading-spinner"></div>
                <p>{{ $t('actors.loading') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { searchActors, getActorCredits } from "@/ApiController/services/actorService";

export default {
  name: "ActorsPage",
  data() {
    return {
      searchQuery: "",
      actors: [],
      credits: [],
      selectedActorName: "",
      showDialog: false,
    };
  },
  computed: {
    sortedCredits() {
      return [...this.credits].sort((a, b) => {
        const yearA = this.getYearFromDate(a.release_date || a.first_air_date) || 0;
        const yearB = this.getYearFromDate(b.release_date || b.first_air_date) || 0;
        return yearB - yearA; // Orden descendente (más reciente primero)
      });
    },
  },
  methods: {
    async searchForActors() {
      if (!this.searchQuery.trim()) return;
      try {
        this.actors = await searchActors(this.searchQuery);
        this.credits = []; // Limpiar créditos al realizar una nueva búsqueda
        this.selectedActorName = "";
      } catch (error) {
        console.error("Error al buscar actores:", error);
      }
    },
    quickSearch(name) {
      this.searchQuery = name;
      this.searchForActors();
    },
    async openActorDialog(actorId) {
      try {
        const actor = this.actors.find((actor) => actor.id === actorId);
        if (!actor) {
          console.error("Actor no encontrado en el array de actores.");
          return;
        }
        console.log("Actor seleccionado:", actor);
        this.selectedActorName = actor.name;
        this.credits = await getActorCredits(actorId);
        console.log("Créditos obtenidos:", this.credits);
        this.showDialog = true; // Mostrar el modal
      } catch (error) {
        console.error("Error al obtener créditos del actor:", error);
      }
    },
    closeDialog() {
      this.showDialog = false; // Cerrar el modal
    },
    getActorImage(path) {
      if (!path) return "https://via.placeholder.com/300x450/2a2a2a/ffffff?text=Sin+Imagen";
      return `https://image.tmdb.org/t/p/w342${path}`; // Imagen más grande y de mayor calidad
    },
    getYearFromDate(dateString) {
      if (!dateString) return 'Desconocido';
      return dateString.split('-')[0];
    },
  },
};
</script>

<style scoped>
/* Variables globales para colores y estilos consistentes */
:root {
  --primary-color: #ff5252;
  --primary-dark: #c50e29;
  --primary-light: #ff867f;
  --dark-bg: #121212;
  --card-bg: #1d1d1d;
  --card-hover: #252525;
  --text-primary: #ffffff;
  --text-secondary: #bbbbbb;
  --text-muted: #8c8c8c;
  --gradient-primary: linear-gradient(135deg, #ff5252, #ff867f);
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 5px 15px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.6);
  --border-radius-sm: 6px;
  --border-radius-md: 10px;
  --border-radius-lg: 16px;
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
}

/* Estilos base y reset */
.actors-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #050505 0%, #0a0a0a 50%, #050505 100%);
  color: #e0e0e0;
  font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow-x: hidden;
  position: relative;
}

/* Hero con diseño cinematográfico premium */
.hero-parallax {
  min-height: 20rem;
  background: 
    radial-gradient(ellipse at top, rgba(229, 9, 20, 0.15), transparent 50%),
    radial-gradient(ellipse at bottom, rgba(255, 76, 76, 0.1), transparent 50%),
    linear-gradient(135deg, rgba(5, 5, 5, 0.98) 0%, rgba(10, 10, 10, 0.95) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  padding: 3rem 1rem;
  border-bottom: 2px solid transparent;
  border-image: linear-gradient(90deg, transparent, #e50914 30%, #ff4c4c 50%, #e50914 70%, transparent) 1;
  overflow: hidden;
}

@media (min-width: 600px) {
  .hero-parallax {
    min-height: 24rem;
    padding: 4rem 2rem;
  }
}

@media (min-width: 1200px) {
  .hero-parallax {
    min-height: 28rem;
    padding: 5rem 3rem;
  }
}

.hero-parallax::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(229, 9, 20, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 76, 76, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 40% 20%, rgba(229, 9, 20, 0.06) 0%, transparent 50%);
  opacity: 0.6;
  pointer-events: none;
  animation: particlesFloat 20s ease-in-out infinite;
}

@keyframes particlesFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(10px, -10px) scale(1.05); }
  50% { transform: translate(-10px, 10px) scale(0.95); }
  75% { transform: translate(10px, 10px) scale(1.02); }
}

.hero-parallax::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to top, #050505, transparent);
}

.hero-content {
  max-width: 900px;
  padding: 0 2rem;
  z-index: 2;
}

.hero-title {
  font-size: 1.8rem;
  font-weight: 900;
  color: white;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 50%, #ffffff 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s linear infinite;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

@keyframes shimmer {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}

@media (min-width: 600px) {
  .hero-title {
    font-size: 2.5rem;
  }
}

@media (min-width: 900px) {
  .hero-title {
    font-size: 3rem;
    letter-spacing: 3px;
  }
}

.accent-text {
  background: linear-gradient(135deg, #e50914, #ff4c4c);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.hero-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 2;
  line-height: 1.6;
}

@media (min-width: 600px) {
  .hero-subtitle {
    font-size: 1.1rem;
    margin-bottom: 2.5rem;
  }
}

@media (min-width: 900px) {
  .hero-subtitle {
    font-size: 1.25rem;
  }
}

/* Contenedor principal para el contenido */
.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
  position: relative;
}

/* Buscador mejorado con animación y efectos */
.search-container {
  animation: fadeInUp 1s ease-out 0.4s both;
}

.search-bar-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  position: relative;
}

.search-bar {
  display: flex;
  width: 90%;
  max-width: 600px;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(229, 9, 20, 0.1) inset,
    0 0 20px rgba(229, 9, 20, 0.2);
  border-radius: 50px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(20, 20, 20, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  z-index: 2;
}

.search-bar::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50px;
  padding: 2px;
  background: linear-gradient(135deg, #e50914 0%, #ff4c4c 50%, #e50914 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.search-bar:focus-within::before {
  opacity: 1;
  animation: borderGlow 2s linear infinite;
}

@keyframes borderGlow {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.search-bar:focus-within {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 
    0 15px 50px rgba(0, 0, 0, 0.7),
    0 0 0 1px rgba(229, 9, 20, 0.3) inset,
    0 0 30px rgba(229, 9, 20, 0.4),
    0 5px 15px rgba(229, 9, 20, 0.3);
  background: rgba(25, 25, 25, 0.85);
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
  transition: all 0.2s ease;
  z-index: 3;
}

.search-bar:focus-within .search-icon {
  color: #e50914;
}

.search-bar input {
  flex: 1;
  min-width: 0;
  padding: 1.2rem 1.2rem 1.2rem 3.2rem;
  font-size: 1.1rem;
  border: none;
  background-color: transparent;
  color: white;
  outline: none;
  font-family: 'Inter', sans-serif;
}

.search-bar input::placeholder {
  color: rgba(255, 255, 255, 0.4);
  opacity: 1;
}

.search-button {
  padding: 0 2rem;
  background: linear-gradient(135deg, #e50914, #ff4c4c);
  color: white;
  border: none;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-width: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: 'Inter', sans-serif;
}

.search-button:hover {
  background: linear-gradient(135deg, #c50914, #e50914);
  box-shadow: 0 0 20px rgba(229, 9, 20, 0.6);
  transform: translateX(-2px);
}

.pulse-animation {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(255, 82, 82, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 82, 82, 0); }
}

/* Sugerencias de búsqueda mejoradas */
.search-suggestion {
  margin-top: 1rem;
  color: var(--text-secondary);
  font-size: 1rem;
  animation: fadeIn 1s ease-out;
}

.suggestion-label {
  display: block;
  margin-bottom: 0.75rem;
  opacity: 0.8;
}

.suggestion-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.tag {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(229, 9, 20, 0.3);
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.tag:hover {
  background: rgba(229, 9, 20, 0.2);
  border-color: #e50914;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(229, 9, 20, 0.3);
  color: white;
}

/* Sección de resultados de búsqueda */
.search-results-section {
  animation: fadeIn 0.5s ease-out;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1rem;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 700;
}

.results-count {
  color: var(--text-secondary);
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.08);
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

/* Grid de actores con animación y hover */
.actors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 600px) {
  .actors-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.75rem;
  }
}

@media (min-width: 900px) {
  .actors-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 2rem;
  }
}

.actor-card {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 15px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.03) inset;
  animation: cardFadeIn 0.5s ease-out both;
  animation-delay: calc(var(--animation-order) * 0.05s);
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  position: relative;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.actor-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(229, 9, 20, 0.3) 0%, transparent 50%, rgba(255, 76, 76, 0.2) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.actor-card:hover::before {
  opacity: 1;
}

.actor-card:hover {
  transform: translateY(-12px) scale(1.02) rotateX(2deg);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(229, 9, 20, 0.2) inset,
    0 0 30px rgba(229, 9, 20, 0.15);
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(229, 9, 20, 0.3);
}

.actor-image-container {
  position: relative;
  padding-bottom: 150%; /* 2:3 aspect ratio */
  overflow: hidden;
}

.actor-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.actor-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), filter 0.5s ease;
  filter: brightness(0.9) contrast(1.05);
}

.actor-card:hover .actor-image img {
  transform: scale(1.08);
  filter: brightness(0.7) contrast(1.1) saturate(1.2);
}

.actor-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(229, 9, 20, 0.3) 30%,
    transparent 70%
  );
  opacity: 0;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 2rem;
  backdrop-filter: blur(5px);
}

.actor-card:hover .actor-overlay {
  opacity: 1;
}

.view-details {
  background: linear-gradient(135deg, #e50914 0%, #c50914 100%);
  color: white;
  padding: 0.7rem 1.5rem;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 700;
  transform: translateY(15px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 5px 20px rgba(229, 9, 20, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
}

.view-details::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.actor-card:hover .view-details {
  transform: translateY(0) scale(1.05);
  box-shadow: 
    0 10px 30px rgba(229, 9, 20, 0.8),
    0 0 0 2px rgba(255, 255, 255, 0.2) inset;
}

.view-details:hover::before {
  width: 300px;
  height: 300px;
}

.actor-info {
  padding: 1.2rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.actor-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.actor-known-for {
  margin-top: auto;
}

.department-badge {
  display: inline-block;
  font-size: 0.75rem;
  background: rgba(229, 9, 20, 0.15);
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  color: #ff4c4c;
  border: 1px solid rgba(229, 9, 20, 0.3);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Mensaje de no resultados*/
.no-results {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.no-results-content {
  max-width: 500px;
  animation: fadeIn 0.5s ease-out;
}

.no-results-icon {
  font-size: 4rem;
  color: rgba(255, 82, 82, 0.5);
  margin-bottom: 1rem;
}

.no-results h3 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.no-results p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.retry-button {
  background: transparent;
  border: 2px solid rgba(255, 82, 82, 0.5);
  color: var(--primary-light);
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-normal);
}

.retry-button:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* Sección de características */
.trending-section {
  text-align: center;
  animation: fadeIn 0.8s ease-out;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: white;
}

@media (min-width: 600px) {
  .section-title {
    font-size: 2rem;
  }
}

@media (min-width: 900px) {
  .section-title {
    font-size: 2.2rem;
  }
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  width: 60px;
  height: 4px;
  background: linear-gradient(135deg, #e50914, #ff4c4c);
  transform: translateX(-50%);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(229, 9, 20, 0.5);
}

@media (min-width: 600px) {
  .section-title::after {
    width: 80px;
  }
}

.section-subtitle {
  color: var(--text-secondary);
  margin-bottom: 4rem;
  font-size: 1.1rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  padding: 2rem 1.5rem;
  text-align: left;
  display: flex;
  transition: all 0.3s ease;
  border: 1px solid rgba(229, 9, 20, 0.2);
}

@media (min-width: 600px) {
  .feature-card {
    padding: 2.5rem 2rem;
  }
}

.feature-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  border-color: rgba(229, 9, 20, 0.4);
}

.feature-icon {
  font-size: 2rem;
  margin-right: 1.5rem;
  color: var(--primary-color);
  background: rgba(255, 82, 82, 0.1);
  height: 4rem;
  width: 4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: var(--transition-normal);
}

.feature-card:hover .feature-icon {
  background: var(--primary-color);
  color: white;
  transform: scale(1.1);
  box-shadow: 0 5px 15px rgba(255, 82, 82, 0.3);
}

.feature-content h3 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.feature-content p {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Modal de créditos completamente rediseñado */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(15px) saturate(150%);
  -webkit-backdrop-filter: blur(15px) saturate(150%);
  padding: 1rem;
  animation: modalBackdropFade 0.3s ease-out;
}

@keyframes modalBackdropFade {
  from { opacity: 0; backdrop-filter: blur(0px); }
  to { opacity: 1; backdrop-filter: blur(15px); }
}

.modal-content {
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #1a1a1a 100%);
  color: white;
  border-radius: 20px;
  width: 95%;
  max-width: 900px;
  max-height: 85vh;
  overflow: hidden;
  position: relative;
  border: 2px solid transparent;
  background-image: 
    linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #1a1a1a 100%),
    linear-gradient(135deg, #e50914 0%, #ff4c4c 50%, #e50914 100%);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  box-shadow: 
    0 30px 60px rgba(0, 0, 0, 0.9),
    0 0 0 1px rgba(229, 9, 20, 0.3) inset,
    0 0 50px rgba(229, 9, 20, 0.2);
  display: flex;
  flex-direction: column;
  transform: scale(0.9);
  animation: modalScale 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes modalScale {
  to { transform: scale(1); }
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: all 0.3s;
}

.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 2px solid #ff0000;
  background: rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-fast);
  z-index: 10;
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.7);
}

.close-icon {
  font-size: 24px;
  color: white;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

.close-button:hover {
  background: #ff0000;
  transform: rotate(90deg);
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.9);
  border: 2px solid white;
}

.close-button:hover .close-icon {
  transform: scale(1.2);
}

.actor-profile {
  padding: 2rem;
  overflow-y: auto;
}

.actor-profile-name {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(229, 9, 20, 0.3);
  position: relative;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: white;
}

@media (min-width: 600px) {
  .actor-profile-name {
    font-size: 2.2rem;
  }
}

.actor-profile-name::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 80px;
  height: 4px;
  background: linear-gradient(135deg, #e50914, #ff4c4c);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(229, 9, 20, 0.5);
}

.credits-wrapper {
  padding-bottom: 1rem;
}

.credits-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.credits-header h3 {
  font-size: 1.4rem;
  font-weight: 600;
}

.credits-count {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.credits-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.credit-card {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: creditFadeIn 0.4s ease-out both;
  animation-delay: calc(var(--animation-order) * 0.03s);
  border: 1px solid rgba(255, 255, 255, 0.03);
  position: relative;
  backdrop-filter: blur(5px);
}

.credit-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #e50914 0%, #ff4c4c 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.credit-card:hover::before {
  opacity: 1;
  box-shadow: 0 0 15px rgba(229, 9, 20, 0.6);
}

.credit-card:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateX(8px);
  box-shadow: 
    -3px 0 20px rgba(229, 9, 20, 0.3),
    0 8px 25px rgba(0, 0, 0, 0.5);
  border-color: rgba(229, 9, 20, 0.3);
}

.credit-year-badge {
  background: linear-gradient(135deg, #e50914 0%, #c50914 50%, #e50914 100%);
  color: white;
  padding: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  min-width: 4.5rem;
  font-size: 1.15rem;
  border-radius: 10px 0 0 10px;
  box-shadow: 
    inset 0 0 15px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(229, 9, 20, 0.4);
  position: relative;
  overflow: hidden;
}

.credit-year-badge::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 70%
  );
  animation: shimmerSlow 3s linear infinite;
}

@keyframes shimmerSlow {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.credit-details {
  padding: 1rem;
  flex: 1;
}

.credit-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  line-height: 1.4;
}

.credit-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.credit-type, .credit-character {
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.movie-badge {
  color: #ff4c4c;
  font-weight: 600;
}

.tv-badge {
  color: #ff867f;
  font-weight: 600;
}

.credits-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 0;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(229, 9, 20, 0.2);
  border-radius: 50%;
  border-top-color: #e50914;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  box-shadow: 0 0 20px rgba(229, 9, 20, 0.3);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Responsive Media Queries */
@media (max-width: 1200px) {
  .actors-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.5rem;
  }

  .hero-title {
    font-size: 2.8rem;
  }
}

@media (max-width: 992px) {
  .content-container {
    padding: 2.5rem 1.5rem;
  }

  .hero-parallax {
    height: 22rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .actors-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1.2rem;
  }

  .credit-card {
    flex-direction: column;
  }

  .credit-year-badge {
    padding: 0.4rem;
    border-radius: var(--border-radius-sm) var(--border-radius-sm) 0 0;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .hero-parallax {
    height: 20rem;
  }

  .hero-title {
    font-size: 2.2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  .search-bar {
    width: 100%;
  }

  .search-bar input {
    padding: 1.1rem 0.8rem 1.1rem 3rem;
    font-size: 1rem;
  }

  .search-button {
    padding: 0 1.5rem;
    font-size: 1rem;
    min-width: 90px;
  }

  .features {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .actor-profile {
    padding: 1.5rem;
  }

  .actor-profile-name {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }

  .credits-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  /* Ajustes para el buscador */
  .search-bar {
    flex-direction: column;
    border-radius: var(--border-radius-lg);
    overflow: visible;
    width: 100%; /* Asegurar ancho completo */
    background: rgba(37, 37, 37, 0.9);
  }

  .search-bar input {
    border-radius: var(--border-radius-lg);
    padding: 1rem 1rem 1rem 2.8rem;
    width: 100%;
    background: transparent; /* Fondo transparente para el input */
    border-bottom: 1px solid rgba(255, 255, 255, 0.1); /* Línea divisoria sutil */
  }

  .search-button {
    border-radius: var(--border-radius-lg);
    margin-top: 0; /* Eliminar margen superior */
    width: 100%;
    padding: 0.8rem;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .search-icon {
    top: 1rem;
    transform: none;
    left: 15px;
  }

  /* Ajustes para el hero en pantallas pequeñas */
  .hero-parallax {
    height: auto;
    padding: 4rem 0 3rem;
  }

  .hero-title {
    font-size: 1.6rem;
    max-width: 100%;
  }

  .hero-subtitle {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }

  /* Ajustes para las etiquetas de búsqueda */
  .suggestion-tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-top: 1.5rem;
  }

  .tag {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}

/* Ajustes específicos para dispositivos muy pequeños */
@media (max-width: 400px) {
  .hero-content {
    padding: 0 1rem;
  }

  .search-bar input {
    font-size: 0.95rem;
    padding: 0.9rem 1rem 0.9rem 2.6rem;
  }

  .search-button {
    font-size: 0.95rem;
    padding: 0.7rem;
  }

  .search-icon {
    font-size: 0.9rem;
  }

  .tag {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
}

/* Prevenir superposición de textos y elementos en dispositivos ultrapequeños */
@media (max-width: 360px) {
  .hero-title {
    font-size: 1.4rem;
    margin-bottom: 0.7rem;
  }

  .hero-subtitle {
    font-size: 0.9rem;
    margin-bottom: 1.2rem;
  }

  .search-container {
    margin-top: 0.5rem;
  }
  
  /* Mejorar visibilidad del botón de cierre en dispositivos muy pequeños */
  .close-button {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
    top: 0.5rem;
    right: 0.5rem;
    background: rgba(229, 9, 20, 1);
    border: 2px solid white;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  }
  
  .close-icon {
    font-size: 24px;
  }
}

/* Media queries específicas para el botón de cierre */
@media (max-width: 768px) {
  .close-button {
    width: 50px;
    height: 50px;
    background: #ff0000;
  }
  
  .close-icon {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .close-button {
    width: 55px;
    height: 55px;
    background: #ff0000;
    border: 3px solid white;
  }
  
  .close-icon {
    font-size: 32px;
  }
}
</style>
