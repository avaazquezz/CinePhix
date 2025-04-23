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
/* Estilos generales - existentes con pequeñas mejoras */
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

/* Sección Hero con búsqueda - mejorada con responsive */
.hero-section {
  text-align: center;
  padding: 3rem 1rem;  /* Cambiado a unidades rem para mejor escalabilidad */
  margin-bottom: 2.5rem;
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 1.25rem;
  background: linear-gradient(45deg, #ff5252, #ff8a80);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 700;
  line-height: 1.2;
}

.hero-section p {
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
  color: #bbbbbb;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

/* Mejoras en el buscador */
.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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
  min-width: 0; /* Importante para evitar que el input empuje fuera del botón */
  padding: 1.1rem 0.6rem 1.1rem 3.1rem;
  font-size: 1.1rem;
  border: none;
  background-color: #2a2a2a;
  color: white;
  border-radius: 50px 0 0 50px;
  transition: all 0.3s;
  text-overflow: ellipsis; /* Muestra ... si el texto es demasiado largo */
}

.search-bar button {
  padding: 0 1.8rem;
  background: linear-gradient(45deg, #ff5252, #ff8a80);
  color: white;
  border: none;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap; /* Evita que el texto del botón se divida */
  min-width: 80px; /* Asegura un ancho mínimo para el botón */
}

/* Ajustes responsive para el buscador */
@media screen and (max-width: 768px) {
  .search-bar {
    width: 90%;
  }

  .search-bar input {
    padding: 0.9rem 0.7rem 0.9rem 2.8rem;
    font-size: 1rem;
  }

  .search-bar button {
    padding: 0 1.4rem;
    font-size: 1rem;
    min-width: 75px;
  }
}

@media screen and (max-width: 576px) {
  .search-bar {
    width: 95%;
  }

  .search-bar input {
    padding: 0.8rem 0.6rem 0.8rem 2.5rem;
    font-size: 0.95rem;
  }

  .search-bar button {
    padding: 0 1.2rem;
    font-size: 0.95rem;
    min-width: 70px;
  }

  .search-icon {
    left: 15px;
    font-size: 0.9rem;
  }
}

/* Ajustes específicos para dispositivos muy pequeños */
@media screen and (max-width: 400px) {
  .search-bar {
    width: 98%;
  }

  .search-bar input {
    padding: 0.8rem 0.5rem 0.8rem 2.2rem;
    font-size: 0.9rem;
  }

  .search-bar button {
    padding: 0 1rem;
    font-size: 0.9rem;
    min-width: 65px;
  }

  .search-icon {
    left: 12px;
    font-size: 0.85rem;
  }
}

/* Ajustes extremos para dispositivos ultra pequeños */
@media screen and (max-width: 320px) {
  .search-bar input {
    padding: 0.8rem 0.3rem 0.8rem 2rem;
    font-size: 0.85rem;
  }

  .search-bar button {
    padding: 0 0.8rem;
    font-size: 0.85rem;
    min-width: 60px;
  }

  .search-icon {
    left: 10px;
  }
}

/* Grid de actores - mejorado para responsive */
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
  height: 100%;
  display: flex;
  flex-direction: column;
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

/* Modal y diálogo - mejorados para responsive */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.modal-content {
  background: linear-gradient(145deg, #1e1e1e, #171717);
  color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 650px;
  position: relative;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.8);
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: modalFadeIn 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.actor-info {
  padding: 1.5rem 1.8rem;
}

.actor-info h2 {
  font-size: 1.7rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  padding-bottom: 1.2rem;
  position: relative;
  color: #fff;
  border-bottom: 1px solid rgba(255, 82, 82, 0.4);
}

.actor-info h2::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 50%;
  height: 2px;
  background: linear-gradient(90deg, #ff5252, transparent);
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
  background: rgba(255, 255, 255, 0.05);
  margin-bottom: 12px;
  border-radius: 8px;
  padding: 15px 18px;
  position: relative;
  transition: all 0.25s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  grid-template-areas:
    "title year"
    "type type";
}

.credit-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.credit-title {
  grid-area: title;
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: #fff;
}

.credit-type {
  grid-area: type;
  font-size: 0.9rem;
  color: #ff8a80;
  display: flex;
  align-items: center;
}

.credit-type::before {
  content: "";
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ff8a80;
  margin-right: 8px;
}

.credit-year {
  grid-area: year;
  font-size: 0.85rem;
  color: #aaa;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.1);
  padding: 3px 10px;
  border-radius: 30px;
}

.close {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 28px;
  color: #ffffff;
  cursor: pointer;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  transition: all 0.2s ease;
  z-index: 2;
}

.close:hover {
  background: rgba(255, 82, 82, 0.25);
  transform: rotate(90deg);
}

/* Custom scrollbar para la lista de créditos */
.credits-container::-webkit-scrollbar {
  width: 6px;
}

.credits-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.credits-container::-webkit-scrollbar-thumb {
  background: rgba(255, 82, 82, 0.5);
  border-radius: 10px;
}

.credits-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 82, 82, 0.7);
}

/* Responsive para el modal */
@media screen and (max-width: 768px) {
  .modal-content {
    width: 95%;
    max-height: 80vh;
  }

  .actor-info {
    padding: 1.3rem 1.5rem;
  }

  .actor-info h2 {
    font-size: 1.5rem;
    margin-bottom: 1.2rem;
    padding-bottom: 1rem;
  }

  .credit-item {
    padding: 12px 15px;
    margin-bottom: 10px;
  }
}

@media screen and (max-width: 576px) {
  .actor-info {
    padding: 1.2rem;
  }

  .actor-info h2 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }

  .credit-item {
    padding: 10px 12px;
    margin-bottom: 8px;
    grid-template-columns: 1fr;
    grid-template-areas:
      "title"
      "year"
      "type";
    gap: 3px;
  }

  .credit-year {
    justify-self: start;
  }

  .credit-title {
    font-size: 1rem;
    margin-bottom: 3px;
  }

  .close {
    top: 10px;
    right: 10px;
    font-size: 22px;
    height: 28px;
    width: 28px;
  }
}

@media screen and (max-width: 400px) {
  .modal-content {
    width: 98%;
  }

  .actor-info {
    padding: 1rem;
  }

  .actor-info h2 {
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
    padding-bottom: 0.8rem;
  }

  .credit-title {
    font-size: 0.95rem;
  }

  .credit-type, .credit-year {
    font-size: 0.8rem;
  }
}

@media screen and (max-width: 1024px) {
  .actors-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 20px;
  }

  .actor-image {
    height: 220px;
  }

  .features {
    gap: 25px;
  }
}

@media screen and (max-width: 768px) {
  .page-content {
    padding: 15px;
  }

  .hero-section {
    padding: 2.5rem 1rem;
    margin-bottom: 2rem;
  }

  .hero-section h1 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }

  .hero-section p {
    font-size: 1rem;
    margin-bottom: 2rem;
  }

  .search-bar {
    width: 95%;
  }

  .search-bar input {
    padding: 0.9rem 1rem 0.9rem 2.8rem;
    font-size: 1rem;
  }

  .search-bar button {
    padding: 0 1.5rem;
    font-size: 1rem;
  }

  .actors-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 15px;
  }

  .actor-image {
    height: 190px;
  }

  .actor-name {
    font-size: 1rem;
    padding: 12px 12px 5px;
  }

  .actor-known-for {
    font-size: 0.8rem;
    padding: 0 12px 12px;
  }

  .features {
    flex-direction: column;
    gap: 20px;
  }

  .feature {
    min-width: auto;
    padding: 25px;
  }

  .feature i {
    font-size: 2rem;
    margin-bottom: 15px;
  }

  .feature h4 {
    font-size: 1.2rem;
    margin-bottom: 12px;
  }

  .trending-section h3 {
    font-size: 1.6rem;
  }

  .modal-content {
    padding: 1.5rem;
    width: 95%;
    max-height: 80vh;
  }

  .actor-info h2 {
    font-size: 1.4rem;
    margin-bottom: 15px;
    padding-bottom: 12px;
  }

  .credit-title {
    font-size: 1rem;
  }

  .close {
    top: 10px;
    right: 15px;
    font-size: 24px;
  }
}

@media screen and (max-width: 576px) {
  .hero-section {
    padding: 2rem 0.8rem;
    margin-bottom: 1.5rem;
  }

  .hero-section h1 {
    font-size: 1.5rem;
    margin-bottom: 0.8rem;
  }

  .hero-section p {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  .search-bar {
    width: 100%;
  }

  .search-bar input {
    padding: 0.8rem 0.8rem 0.8rem 2.6rem;
    font-size: 0.95rem;
  }

  .search-bar button {
    padding: 0 1.2rem;
    font-size: 0.95rem;
  }

  .search-icon {
    left: 15px;
    font-size: 0.9rem;
  }

  .actors-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }

  .actor-image {
    height: 170px;
  }

  .actor-name {
    font-size: 0.9rem;
    padding: 10px 10px 3px;
  }

  .actor-known-for {
    font-size: 0.75rem;
    padding: 0 10px 10px;
  }

  .no-results i {
    font-size: 2.5rem;
  }

  .no-results p:first-of-type {
    font-size: 1.2rem;
  }

  .feature {
    padding: 20px 15px;
  }

  .feature i {
    font-size: 1.8rem;
    margin-bottom: 10px;
  }

  .feature h4 {
    font-size: 1.1rem;
    margin-bottom: 8px;
  }

  .feature p {
    font-size: 0.9rem;
  }

  .credits-container {
    max-height: 50vh;
  }

  .credit-item {
    padding: 12px;
    margin-bottom: 8px;
  }

  .credit-title {
    font-size: 0.95rem;
    margin-bottom: 3px;
  }

  .credit-type, .credit-year {
    font-size: 0.8rem;
  }
}

@media screen and (max-width: 400px) {
  .page-content {
    padding: 12px 10px;
  }

  .hero-section {
    padding: 1.5rem 0.5rem;
    margin-bottom: 1.2rem;
  }

  .hero-section h1 {
    font-size: 1.3rem;
  }

  .search-suggestion {
    font-size: 0.85rem;
  }

  .search-suggestion span {
    display: inline-block;
    margin: 3px;
  }

  .actors-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
  }

  .actor-image {
    height: 140px;
  }

  .search-results-section h2 {
    font-size: 1.4rem;
    margin-bottom: 20px;
  }

  .modal-content {
    padding: 1.2rem 1rem;
    width: 95%;
  }

  .actor-info h2 {
    font-size: 1.2rem;
    margin-bottom: 12px;
    padding-bottom: 10px;
  }

  .close {
    top: 8px;
    right: 12px;
    font-size: 22px;
  }
}

/* Orientación landscape específica para móviles */
@media screen and (max-height: 500px) and (orientation: landscape) {
  .hero-section {
    padding: 1rem 0.8rem;
  }

  .hero-section h1 {
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
  }

  .hero-section p {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  .modal-content {
    max-height: 90vh;
    width: 85%;
  }

  .credits-container {
    max-height: 40vh;
  }

  .actor-image {
    height: 130px;
  }
}
</style>
