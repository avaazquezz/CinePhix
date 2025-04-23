<template>
  <div class="main-page">
    <!-- Fondo con efecto parallax -->
    <div class="background-container">
      <div class="parallax-bg"></div>
      <div class="overlay"></div>
    </div>

    <!-- Contenido principal -->
    <div class="content">
      <div class="logo-container">
        <div class="logo">CINE<span>PHIX</span></div>
        <div class="logo-tagline">Donde el cine cobra vida</div>
      </div>

      <h1 class="title">Explora el Séptimo Arte <br class="hide-mobile">Como Nunca Antes</h1>

      <p class="subtitle">La plataforma definitiva para los verdaderos cinéfilos. <br class="hide-mobile">Descubre, explora y enamórate del cine en un solo lugar.</p>

      <div class="buttons">
        <router-link to="/CinePhix/home" class="btn primary-btn">
          <span class="btn-text">Comenzar Aventura</span>
          <span class="btn-icon"><i class="fas fa-play"></i></span>
        </router-link>
      </div>

      <!-- Características -->
      <div class="features">
        <div class="feature">

          <div class="feature-title">Últimos Estrenos</div>
          <div class="feature-description">Mantente al día con los más recientes lanzamientos del mundo cinematográfico</div>
        </div>

        <div class="feature">
          <div class="feature-title">Crítica Experta</div>
          <div class="feature-description">Análisis detallados y reseñas de expertos en cine para guiar tus elecciones</div>
        </div>

        <div class="feature">
          <div class="feature-title">Tendencias</div>
          <div class="feature-description">Descubre qué está causando sensación en la comunidad cinéfila mundial</div>
        </div>
      </div>

      <!-- Sección de estadísticas -->
      <div class="stats">
        <div class="stat-item">
          <div class="stat-number">10K+</div>
          <div class="stat-label">Películas</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">5K+</div>
          <div class="stat-label">Series</div>
        </div>
      </div>

      <!-- Llamado a la acción final -->
      <div class="cta-final">
        <h2>¿Listo para empezar?</h2>
        <router-link to="/home" class="btn glow-btn">
          <span>Explorar Ahora</span>
        </router-link>
      </div>
    </div>

    <!-- Elemento decorativo -->
    <div class="corner-decoration top-left"></div>
    <div class="corner-decoration top-right"></div>
    <div class="corner-decoration bottom-left"></div>
    <div class="corner-decoration bottom-right"></div>
  </div>
</template>

<script>


export default {
  name: "MainPage",
  components: {},
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      const scrollY = window.scrollY;
      const parallaxBg = document.querySelector('.parallax-bg');
      if (parallaxBg) {
        parallaxBg.style.transform = `translateY(${scrollY * 0.4}px)`;
      }
    }
  }
};
</script>

<style scoped>
/* Estilos generales */
.main-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  color: white;
  font-family: 'Poppins', sans-serif;
  overflow: hidden;
  padding: 0;
  margin: 0;
}

/* Background con efecto parallax */
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.parallax-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120%;
  background-image: url('https://images.unsplash.com/photo-1535016120720-40c646be5580?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80');
  background-size: cover;
  background-position: center;
  transform: translateY(0);
  will-change: transform;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(20, 20, 25, 0.95) 0%, rgba(20, 20, 25, 0.8) 100%);
  backdrop-filter: blur(3px);
}

/* Contenido */
.content {
  position: relative;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 5vh 20px;
  z-index: 1;
}

.logo-container {
  margin-bottom: 3rem;
  animation: fadeInDown 1.2s both;
}

.logo {
  font-size: 4rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
  letter-spacing: 5px;
  text-shadow: 0 0 15px rgba(229, 9, 20, 0.7);
}

.logo span {
  color: #e50914;
}

.logo-tagline {
  font-size: 1rem;
  font-style: italic;
  opacity: 0.8;
  letter-spacing: 2px;
}

.title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 2.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #b3b3b3 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: fadeInUp 1.2s both 0.3s;
  line-height: 1.2;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 3rem;
  opacity: 0.85;
  line-height: 1.6;
  animation: fadeInUp 1.2s both 0.6s;
}

/* Botones */
.buttons {
  display: flex;
  justify-content: center;
  gap: 25px;
  margin: 3rem 0;
  animation: fadeInUp 1.2s both 0.9s;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 35px;
  font-size: 1.1rem;
  border-radius: 50px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-weight: 600;
  position: relative;
  overflow: hidden;
}

.primary-btn {
  background: linear-gradient(135deg, #e50914 0%, #b20710 100%);
  color: white;
  box-shadow: 0 10px 25px rgba(229, 9, 20, 0.3);
}

.primary-btn:hover {
  background: linear-gradient(135deg, #ff0a17 0%, #d10812 100%);
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 15px 30px rgba(229, 9, 20, 0.4);
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-5px) scale(1.03);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 15px 30px rgba(255, 255, 255, 0.15);
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Features */
.features {
  display: flex;
  justify-content: center;
  gap: 3.125rem; /* Convertido de 50px */
  margin: 7rem 0;
  animation: fadeInUp 1.2s both 1.2s;
}

.feature {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1.25rem; /* Convertido de 20px */
  padding: 3rem 2rem;
  text-align: center;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  backdrop-filter: blur(0.625rem); /* Convertido de 10px */
  border: 0.0625rem solid rgba(255, 255, 255, 0.1); /* Convertido de 1px */
  flex: 1;
  max-width: 20rem; /* Convertido de 320px */
}

.feature:hover {
  transform: translateY(-0.625rem); /* Convertido de -10px */
  box-shadow: 0 1.25rem 2.5rem rgba(0, 0, 0, 0.3); /* Convertido de 20px 40px */
  border: 0.0625rem solid rgba(255, 255, 255, 0.2); /* Convertido de 1px */
}

.feature-icon {
  font-size: 2.8rem;
  height: 5rem; /* Convertido de 80px */
  width: 5rem; /* Convertido de 80px */
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e50914 0%, #b20710 100%);
  border-radius: 50%;
  margin: 0 auto 2rem;
  box-shadow: 0 0.625rem 1.563rem rgba(229, 9, 20, 0.3); /* Convertido de 10px 25px */
}

/* Estadísticas */
.stats {
  display: flex;
  justify-content: center;
  gap: 6rem;
  margin: 5rem 0;
  padding: 2rem 0;
  border-top: 0.0625rem solid rgba(255, 255, 255, 0.1);
  border-bottom: 0.0625rem solid rgba(255, 255, 255, 0.1);
}

.stat-item {
  text-align: center;
  padding: 0 1rem;
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #e50914 0%, #ff5f67 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.125rem;
}

/* CTA Final */
.cta-final {
  margin: 6rem 0 3rem;
  animation: fadeInUp 1.2s both 1.8s;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.cta-final h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.cta-final p {
  font-size: 1.2rem;
  margin-bottom: 30px;
  opacity: 0.8;
}

.glow-btn {
  background: linear-gradient(45deg, #e50914, #ff464f, #e50914);
  background-size: 200% 200%;
  animation: gradientAnimation 3s ease infinite;
  color: white;
  border: none;
  margin: 0 auto;
  position: relative;
}

.glow-btn:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 0 30px rgba(229, 9, 20, 0.6);
}

.glow-btn::after {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #e50914, #ff464f, #e50914);
  background-size: 400% 400%;
  animation: gradientAnimation 3s ease infinite;
  z-index: -1;
  border-radius: 50px;
  filter: blur(15px);
  opacity: 0.7;
}

/* Elementos decorativos */
.corner-decoration {
  position: absolute;
  width: 200px;
  height: 200px;
  border: 2px solid rgba(229, 9, 20, 0.3);
  z-index: 0;
}

.top-left {
  top: 20px;
  left: 20px;
  border-right: none;
  border-bottom: none;
  border-radius: 20px 0 0 0;
}

.top-right {
  top: 20px;
  right: 20px;
  border-left: none;
  border-bottom: none;
  border-radius: 0 20px 0 0;
}

.bottom-left {
  bottom: 20px;
  left: 20px;
  border-right: none;
  border-top: none;
  border-radius: 0 0 0 20px;
}

.bottom-right {
  bottom: 20px;
  right: 20px;
  border-left: none;
  border-top: none;
  border-radius: 0 0 20px 0;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 30px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translate3d(0, -30px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .content {
    padding: 4vh 15px;
  }

  .title {
    font-size: 2.8rem;
  }

  .logo {
    font-size: 3.5rem;
  }

  .features {
    flex-wrap: wrap;
  }

  .feature {
    min-width: calc(50% - 30px);
  }
}

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
    max-width: 320px;
    margin-left: auto;
    margin-right: auto;
  }

  .features {
    flex-direction: column;
    align-items: center;
  }

  .feature {
    width: 100%;
    max-width: 320px;
  }

  .stats {
    flex-direction: column;
    gap: 30px;
  }

  .corner-decoration {
    width: 100px;
    height: 100px;
  }

  .hide-mobile {
    display: none;
  }

  .logo {
    font-size: 3rem;
  }
}
</style>
