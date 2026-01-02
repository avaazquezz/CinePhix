<template>
  <nav class="bottom-navigation" v-if="isMobile">
    <router-link 
      v-for="item in navItems" 
      :key="item.path"
      :to="item.path" 
      class="nav-item"
      :class="{ active: isActive(item.path) }"
    >
      <i :class="item.icon" class="nav-icon"></i>
      <span class="nav-label">{{ $t(item.label) }}</span>
      <div class="ripple-effect" v-if="isActive(item.path)"></div>
    </router-link>
  </nav>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'BottomNavigation',
  setup() {
    const route = useRoute();
    const isMobile = ref(false);
    
    const navItems = [
      { path: '/CinePhix/home', icon: 'fas fa-home', label: 'nav.home' },
      { path: '/CinePhix/movies', icon: 'fas fa-film', label: 'nav.movies' },
      { path: '/CinePhix/series', icon: 'fas fa-tv', label: 'nav.series' },
      { path: '/CinePhix/actores', icon: 'fas fa-users', label: 'nav.actors' },
    ];

    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768;
    };

    const isActive = (path) => {
      return route.path === path || route.path.startsWith(path + '/');
    };

    onMounted(() => {
      checkMobile();
      window.addEventListener('resize', checkMobile);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile);
    });

    return {
      isMobile,
      navItems,
      isActive,
    };
  },
};
</script>

<style scoped>
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 65px;
  background: rgba(10, 10, 10, 0.98);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-top: 1px solid rgba(229, 9, 20, 0.2);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 0.5rem;
  z-index: 9999;
  box-shadow: 0 -5px 30px rgba(0, 0, 0, 0.7),
              0 -1px 10px rgba(229, 9, 20, 0.1);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  padding: 8px 12px;
  border-radius: 12px;
  flex: 1;
  max-width: 90px;
  overflow: hidden;
}

.nav-icon {
  font-size: 1.35rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 2;
}

.nav-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 2;
  /* TIPOGRAFÍA INTER: Consistencia con el resto de la app */
  font-family: 'Inter', sans-serif;
}

/* Active state */
.nav-item.active {
  color: #ffffff;
  background: rgba(229, 9, 20, 0.12);
  border: 1px solid rgba(229, 9, 20, 0.3);
}

.nav-item.active .nav-icon {
  color: #e50914;
  transform: scale(1.15);
  filter: drop-shadow(0 0 8px rgba(229, 9, 20, 0.6));
}

.nav-item.active .nav-label {
  color: #ffffff;
  font-weight: 700;
}

/* Ripple effect for active item */
.ripple-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  background: radial-gradient(circle, rgba(229, 9, 20, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  animation: ripple 2s infinite ease-out;
  pointer-events: none;
  z-index: 1;
}

@keyframes ripple {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

/* Hover effect (for devices with hover capability) */
@media (hover: hover) {
  .nav-item:hover:not(.active) {
    color: rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.05);
  }
  
  .nav-item:hover:not(.active) .nav-icon {
    transform: scale(1.1);
  }
}

/* Touch feedback */
.nav-item:active {
  transform: scale(0.95);
}

/* Very small screens optimization */
@media (max-width: 360px) {
  .bottom-navigation {
    height: 60px;
    padding: 0 0.25rem;
  }
  
  .nav-item {
    padding: 6px 8px;
    max-width: 75px;
  }
  
  .nav-icon {
    font-size: 1.2rem;
  }
  
  .nav-label {
    font-size: 0.65rem;
  }
}

/* Tablet and larger - hide bottom nav */
@media (min-width: 769px) {
  .bottom-navigation {
    display: none;
  }
}
</style>
