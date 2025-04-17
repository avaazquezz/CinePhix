<template>
  <div class="home-container">
    <header class="header">
      <div class="logo">
        <img src="@/assets/logo.png" alt="CinePhix Logo" class="logo-img" />
      </div>
      <nav class="navigation">
        <ul class="nav-links">
          <li><router-link to="/home" class="nav-link active">Inicio</router-link></li>
          <li><router-link to="/movies" class="nav-link">Películas</router-link></li>
          <li><router-link to="/series" class="nav-link">Series</router-link></li>
          <li><router-link to="/search" class="nav-link">Buscar</router-link></li>
        </ul>
      </nav>
      <div class="user-menu">
        <button class="user-btn">Mi Cuenta</button>
      </div>
    </header>

    <main class="main-content">
      <!-- Slider de películas destacadas -->
      <section class="featured-slider">
        <h2 class="section-title">Destacados</h2>
        <div class="slider-container">
          <!-- Aquí irían los slides de películas destacadas -->
          <div class="placeholder-text">Slider de películas destacadas</div>
        </div>
      </section>

      <!-- Sección de películas populares -->
      <section class="movie-section">
        <h2 class="section-title">Películas Populares</h2>
        <div class="movie-grid">
          <!-- Aquí irían las tarjetas de películas -->
          <div class="placeholder-text">Cuadrícula de películas populares</div>
        </div>
      </section>

      <!-- Sección de películas mejor valoradas -->
      <section class="movie-section">
        <h2 class="section-title">Mejor Valoradas</h2>
        <div class="movie-grid">
          <!-- Aquí irían las tarjetas de películas -->
          <div class="placeholder-text">Cuadrícula de películas mejor valoradas</div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2025 CinePhix - Todos los derechos reservados</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #141418;
  color: #fff;
  font-family: 'Arial', sans-serif;
}

/* Header styles */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: rgba(0, 0, 0, 0.8);
}

.logo-img {
  height: 40px;
}

.navigation {
  flex: 1;
  margin: 0 2rem;
}

.nav-links {
  display: flex;
  list-style-type: none;
  gap: 1.5rem;
  justify-content: center;
  padding: 0;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover, .nav-link.active {
  color: #e50914;
}

.user-btn {
  background-color: #e50914;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

/* Main content styles */
.main-content {
  padding: 2rem;
}

.section-title {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid #e50914;
  padding-left: 0.75rem;
}

.featured-slider, .movie-section {
  margin-bottom: 3rem;
}

/* Placeholder for demonstration */
.placeholder-text {
  background-color: rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  color: rgba(255,255,255,0.7);
}

/* Footer styles */
.footer {
  background-color: rgba(0, 0, 0, 0.8);
  padding: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}
</style>