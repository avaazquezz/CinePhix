<template>
  <div class="main-page">
    <!-- Video de fondo -->
    <div class="background-container">
      <video autoplay loop muted playsinline class="background-video">
        <source src="@/assets/cinema-background.mp4" type="video/mp4">
      </video>
      <div class="overlay"></div>
    </div>

    <!-- Contenido principal -->
    <div class="content">
      <div class="logo">CINEPHIX</div>
      
      <h1 class="title">Explora el Cine como nunca antes.</h1>
      
      <p class="subtitle">La plataforma definitiva para los amantes del séptimo arte.</p>
      
      <div class="buttons">
        <router-link to="/home" class="btn primary-btn">
          Explorar películas
        </router-link>
      </div>

      <!-- Características -->
      <div class="features">
        <div class="feature">
          <div class="feature-icon">🎬</div>
          <div class="feature-title">Últimos Estrenos</div>
        </div>
        
        <div class="feature">
          <div class="feature-icon">⭐</div>
          <div class="feature-title">Crítica Experta</div>
        </div>
        
        <div class="feature">
            <div class="feature-icon">🔥</div>
          <div class="feature-title">Tendencias</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainPage"
}
</script>

<style scoped>
/* Estilos generales */
.main-page {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: 'Arial', sans-serif;
  overflow: hidden;
}

/* Video de fondo */
.background-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.background-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
}

/* Contenido */
.content {
  text-align: center;
  max-width: 800px;
  padding: 0 20px;
  z-index: 1;
}

.logo {
  font-size: 4rem;
  font-weight: bold;
  color: #e50914;
  margin-bottom: 3rem;
  margin-top: 1rem;
  letter-spacing: 2px;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 40px;
  opacity: 0.9;
}

/* Botones */
.buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 1rem;
  margin-top: 4rem;
}

.btn {
  padding: 12px 30px;
  font-size: 1.1rem;
  border-radius: 30px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: bold;
}

.primary-btn {
  background-color: #e50914;
  color: white;
}

.primary-btn:hover {
  background-color: #b20710;
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(229, 9, 20, 0.3);
}

.secondary-btn {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.secondary-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-3px);
}

/* Features */
.features {
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
  gap: 30px;
}

.feature {
  text-align: center;
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.feature-title {
  font-weight: bold;
}

/* Footer */
.footer {
  position: absolute;
  bottom: 20px;
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.7;
}

/* Responsive */
@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1.2rem;
  }
  
  .buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .btn {
    width: 100%;
  }
  
  .features {
    flex-direction: column;
    gap: 20px;
  }
}
</style>