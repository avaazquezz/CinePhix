<template>
  <div class="actors-page">
    <div class="page-content">
      <div class="hero-section">
        <h1>Explora el mundo del cine a través de sus protagonistas</h1>
        <p>Descubre a tus actores favoritos y explora sus filmografías</p>

        <div class="search-container">
          <div class="search-bar">
            <i class="search-icon fas fa-search"></i>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Buscar actores..."
              @keyup.enter="searchForActors"
            />
            <button @click="searchForActors">Buscar</button>
          </div>
          <div class="search-suggestion" v-if="!actors.length && !searchQuery">
            Prueba buscando: <span @click="quickSearch('Tom Hanks')">Tom Hanks</span>,
            <span @click="quickSearch('Scarlett Johansson')">Scarlett Johansson</span>,
            <span @click="quickSearch('Mario Casas')">Mario Casas</span>
          </div>
        </div>
      </div>

      <div v-if="actors.length > 0" class="search-results-section">
        <h2>Resultados de la búsqueda</h2>
        <div class="actors-grid">
          <div v-for="actor in actors" :key="actor.id" class="actor-card" @click="openActorDialog(actor.id)">
            <div class="actor-image">
              <img :src="getActorImage(actor.profile_path)" alt="Foto del actor" />
            </div>
            <div class="actor-name">{{ actor.name }}</div>
            <div class="actor-known-for" v-if="actor.known_for_department">{{ actor.known_for_department }}</div>
          </div>
        </div>
      </div>

      <div v-if="searchQuery && actors.length === 0" class="no-results">
        <i class="fas fa-exclamation-circle"></i>
        <p>No se encontraron resultados para "{{ searchQuery }}"</p>
        <p>Intenta con otro nombre o verifica la ortografía</p>
      </div>

      <div class="trending-section" v-if="!actors.length">
        <h3>Descubre el talento detrás de tus películas favoritas</h3>
        <p>Utiliza el buscador para explorar información sobre tus actores favoritos</p>
        <div class="features">
          <div class="feature">
            <i class="fas fa-film"></i>
            <h4>Filmografía Completa</h4>
            <p>Descubre todas las películas y series en las que ha participado</p>
          </div>
          <div class="feature">
            <i class="fas fa-calendar-alt"></i>
            <h4>Trayectoria Profesional</h4>
            <p>Explorar la evolución de su carrera a través de los años</p>
          </div>
          <div class="feature">
            <i class="fas fa-star"></i>
            <h4>Papeles Destacados</h4>
            <p>Conoce sus trabajos más aclamados y premiados</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para mostrar créditos -->
    <div v-if="showDialog" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeDialog">&times;</span>
        <div class="actor-info">
          <h2>Donde ha aparecido {{ selectedActorName }}</h2>
          <div class="credits-container">
            <ul v-if="credits.length > 0" class="credits-list">
              <li v-for="credit in credits" :key="credit.id" class="credit-item">
                <div class="credit-title">{{ credit.title || credit.name }}</div>
                <div class="credit-type">{{ credit.media_type === 'movie' ? 'Película' : 'Serie' }}</div>
                <div class="credit-year" v-if="credit.release_date || credit.first_air_date">
                  {{ getYearFromDate(credit.release_date || credit.first_air_date) }}
                </div>
              </li>
            </ul>
            <p v-else class="loading-text">Cargando créditos...</p>
          </div>
        </div>
      </div>
    </div>
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
      return path
        ? `https://image.tmdb.org/t/p/w200${path}`
        : "https://via.placeholder.com/200x300?text=Sin+Foto";
    },
    getYearFromDate(dateString) {
      if (!dateString) return 'Desconocido';
      return dateString.split('-')[0];
    },
  },
};
</script>

<style scoped>
.actors-page {
  min-height: 100vh;
  background-color: #121212;
  color: white;
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Sección Hero con búsqueda */
.hero-section {
  text-align: center;
  padding: 60px 20px;
  margin-bottom: 40px;
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #ff5252, #ff8a80);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 700;
}

.hero-section p {
  font-size: 1.2rem;
  margin-bottom: 40px;
  color: #bbbbbb;
}

.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.search-bar {
  position: relative;
  display: flex;
  width: 80%;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  border-radius: 50px;
  overflow: hidden;
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaaaaa;
}

.search-bar input {
  flex: 1;
  padding: 18px 20px 18px 50px;
  font-size: 1.1rem;
  border: none;
  background-color: #2a2a2a;
  color: white;
  border-radius: 50px 0 0 50px;
  transition: all 0.3s;
}

.search-bar input:focus {
  outline: none;
  background-color: #333333;
}

.search-bar button {
  padding: 0 30px;
  background: linear-gradient(45deg, #ff5252, #ff8a80);
  color: white;
  border: none;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.search-bar button:hover {
  background: linear-gradient(45deg, #ff4242, #ff7a70);
  transform: translateY(-2px);
}

.search-suggestion {
  margin-top: 20px;
  color: #999999;
}

.search-suggestion span {
  color: #ff5252;
  cursor: pointer;
  margin: 0 5px;
  text-decoration: underline;
  transition: color 0.3s;
}

.search-suggestion span:hover {
  color: #ff8a80;
}

/* Resultados de la búsqueda */
.search-results-section {
  padding: 20px 0;
}

.search-results-section h2 {
  font-size: 1.8rem;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.actors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 25px;
}

.actor-card {
  background-color: #1d1d1d;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.actor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.actor-image {
  height: 250px;
  overflow: hidden;
}

.actor-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.actor-card:hover .actor-image img {
  transform: scale(1.05);
}

.actor-name {
  padding: 15px 15px 5px;
  font-weight: bold;
  font-size: 1.1rem;
}

.actor-known-for {
  padding: 0 15px 15px;
  font-size: 0.9rem;
  color: #bbbbbb;
}

/* Sin resultados */
.no-results {
  text-align: center;
  padding: 60px 0;
  color: #bbbbbb;
}

.no-results i {
  font-size: 3rem;
  color: #ff5252;
  margin-bottom: 20px;
}

.no-results p:first-of-type {
  font-size: 1.4rem;
  margin-bottom: 10px;
}

/* Sección de características */
.trending-section {
  text-align: center;
  padding: 40px 0;
  margin-top: 60px;
}

.trending-section h3 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #dddddd;
}

.trending-section > p {
  color: #999999;
  margin-bottom: 40px;
}

.features {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.feature {
  flex: 1;
  min-width: 250px;
  padding: 30px;
  background-color: #1d1d1d;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s;
}

.feature:hover {
  transform: translateY(-5px);
}

.feature i {
  font-size: 2.5rem;
  color: #ff5252;
  margin-bottom: 20px;
}

.feature h4 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #ffffff;
}

.feature p {
  color: #999999;
  font-size: 1rem;
}

/* Modal y diálogo */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background-color: #1a1a1a;
  color: white;
  padding: 25px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  position: relative;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.6);
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: modalFadeIn 0.3s;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 28px;
  color: #ffffff;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.close:hover {
  opacity: 1;
}

.actor-info {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.actor-info h2 {
  margin-top: 0;
  color: #ff5252;
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 15px;
}

.credits-container {
  overflow-y: auto;
  max-height: 60vh;
  padding-right: 10px;
}

.credits-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.credit-item {
  padding: 15px;
  margin-bottom: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  transition: background-color 0.2s;
}

.credit-item:hover {
  background-color: rgba(85, 51, 51, 0.87);
}

.credit-title {
  font-weight: bold;
  font-size: 18px;
  color: #ffffff;
  margin-bottom: 5px;
}

.credit-type {
  font-size: 14px;
  color: #cccccc;
  margin-bottom: 3px;
}

.credit-year {
  font-size: 14px;
  color: #999999;
}

.loading-text {
  text-align: center;
  color: #cccccc;
  padding: 20px;
}

/* Personalización del scrollbar */
.credits-container::-webkit-scrollbar {
  width: 8px;
}

.credits-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.credits-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.credits-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Responsive design */
@media screen and (max-width: 768px) {
  .hero-section h1 {
    font-size: 2rem;
  }

  .search-bar {
    width: 95%;
  }

  .actors-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }

  .features {
    flex-direction: column;
  }

  .feature {
    margin-bottom: 20px;
  }
}
</style>
