<template>
  <div class="main-page">
    <!-- Fondo con efecto parallax -->
    <div class="background-container">
      <div class="parallax-bg"></div>
      <div class="overlay"></div>
      <div class="vignette"></div>
    </div>
    
    <div class="noise-overlay"></div>

    <!-- Contenido principal -->
    <div class="content">
      <div class="logo-container">
        <div class="logo">CINE<span>PHIX</span></div>
        <div class="logo-tagline" v-html="$t('main.tagline')"></div>
      </div>

      <h1 class="title" v-html="$t('main.exploreTitle')"></h1>

      <p class="subtitle" v-html="$t('main.subtitle')"></p>

      <div class="buttons">
        <router-link to="/CinePhix/home" class="btn primary-btn">
          <span class="btn-text">{{$t('main.cta')}}</span>
          <span class="btn-icon"><i class="fas fa-play"></i></span>
        </router-link>
      </div>

      <!-- Características -->
      <div class="features">
        <div class="feature">

          <div class="feature-title">{{$t('main.features.releases.title')}}</div>
          <div class="feature-description">{{$t('main.features.releases.desc')}}</div>
        </div>

        <div class="feature">
          <div class="feature-title">{{$t('main.features.reviews.title')}}</div>
          <div class="feature-description">{{$t('main.features.reviews.desc')}}</div>
        </div>

        <div class="feature">
          <div class="feature-title">{{$t('main.features.trending.title')}}</div>
          <div class="feature-description">{{$t('main.features.trending.desc')}}</div>
        </div>
      </div>

      <!-- Sección de estadísticas -->
      <div class="stats">
        <div class="stat-item">
          <div class="stat-number">10K+</div>
          <div class="stat-label">{{$t('main.stats.movies')}}</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">5K+</div>
          <div class="stat-label">{{$t('main.stats.series')}}</div>
        </div>
      </div>

      <!-- Llamado a la acción final -->
      <div class="cta-final">
        <h2>{{$t('main.finalCta.title')}}</h2>
        <router-link to="/home" class="btn glow-btn">
          <span>{{ $t('main.finalCta.action') }}</span>
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
  color: #e0e0e0;
  font-family: 'Montserrat', 'Poppins', sans-serif;
  overflow: hidden;
  padding: 0;
  margin: 0;
  background-color: #050505;
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
  top: -10%;
  left: -10%;
  width: 120%;
  height: 120%;
  background-image: url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  filter: brightness(0.4) contrast(1.2) saturate(1.1);
  will-change: transform;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(5, 5, 5, 0.3) 0%, rgba(5, 5, 5, 0.9) 100%);
  z-index: 1;
}

.vignette {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 0%, #000000 90%);
  z-index: 2;
  pointer-events: none;
}

.noise-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  opacity: 0.07;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

/* Contenido */
.content {
  position: relative;
  text-align: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 10vh 20px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-container {
  margin-bottom: 4rem;
  animation: fadeInDown 1.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.logo {
  font-size: 6rem;
  font-weight: 900;
  color: #ffffff;
  margin-bottom: 0.5rem;
  letter-spacing: 10px;
  text-transform: uppercase;
  text-shadow: 0 0 20px rgba(229, 9, 20, 0.8), 0 0 40px rgba(229, 9, 20, 0.4);
  font-family: 'Bebas Neue', sans-serif;
}

.logo span {
  color: #e50914;
  text-shadow: 0 0 20px rgba(229, 9, 20, 0.9);
}

.logo-tagline {
  font-size: 1.2rem;
  font-weight: 300;
  letter-spacing: 6px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 10px;
}

.title {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 2px;
  line-height: 1.1;
  animation: fadeInUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) both 0.3s;
  text-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 4rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 800px;
  line-height: 1.6;
  font-weight: 300;
  animation: fadeInUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) both 0.5s;
}

/* Botones */
.buttons {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 6rem;
  animation: fadeInUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) both 0.7s;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 18px 45px;
  font-size: 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
}

.primary-btn {
  background: #e50914;
  color: white;
  box-shadow: 0 0 20px rgba(229, 9, 20, 0.4);
  border: 1px solid #e50914;
}

.primary-btn:hover {
  background: #ff0f1f;
  transform: scale(1.05);
  box-shadow: 0 0 40px rgba(229, 9, 20, 0.6);
}

.btn-icon {
  font-size: 0.9em;
}

/* Features */
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  width: 100%;
  margin: 4rem 0;
  animation: fadeInUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) both 0.9s;
}

.feature {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3rem 2rem;
  text-align: left;
  transition: all 0.4s ease;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.feature::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: #e50914;
  transform: scaleY(0);
  transition: transform 0.4s ease;
  transform-origin: bottom;
}

.feature:hover {
  transform: translateY(-10px);
  background: rgba(255, 255, 255, 0.07);
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}

.feature:hover::before {
  transform: scaleY(1);
}

.feature-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
  text-transform: uppercase;
}

.feature-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
}

/* Estadísticas */
.stats {
  display: flex;
  justify-content: center;
  gap: 8rem;
  margin: 6rem 0;
  padding: 3rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  animation: fadeInUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) both 1.1s;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 4.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  color: white;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  line-height: 1;
}

.stat-label {
  font-size: 1.1rem;
  color: #e50914;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 600;
}

/* CTA Final */
.cta-final {
  margin: 4rem 0;
  animation: fadeInUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) both 1.3s;
  text-align: center;
}

.cta-final h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-weight: 700;
}

.glow-btn {
  background: transparent;
  border: 2px solid #e50914;
  color: #e50914;
  padding: 15px 40px;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(229, 9, 20, 0.2);
}

.glow-btn:hover {
  background: #e50914;
  color: white;
  box-shadow: 0 0 30px rgba(229, 9, 20, 0.6);
  transform: translateY(-3px);
}

/* Elementos decorativos */
.corner-decoration {
  position: absolute;
  width: 150px;
  height: 150px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 5;
  pointer-events: none;
}

.top-left {
  top: 30px;
  left: 30px;
  border-right: none;
  border-bottom: none;
}

.top-right {
  top: 30px;
  right: 30px;
  border-left: none;
  border-bottom: none;
}

.bottom-left {
  bottom: 30px;
  left: 30px;
  border-right: none;
  border-top: none;
}

.bottom-right {
  bottom: 30px;
  right: 30px;
  border-left: none;
  border-top: none;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 40px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translate3d(0, -40px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .title { font-size: 3rem; }
  .logo { font-size: 4rem; }
}

@media (max-width: 768px) {
  .content { padding: 8vh 20px; }
  .title { font-size: 2.5rem; }
  .logo { font-size: 3rem; }
  .stats { flex-direction: column; gap: 40px; }
  .features { grid-template-columns: 1fr; }
  .buttons { flex-direction: column; width: 100%; }
  .btn { width: 100%; }
}
</style>
