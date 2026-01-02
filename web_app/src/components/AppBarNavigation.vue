<template>
  <header class="header">
    <div class="logo">
      <router-link to="/CinePhix/">
      <img src="@/assets/logo.png" alt="CinePhix Logo" class="logo-img" />
      </router-link>
    </div>
    <nav class="navigation">
      <ul class="nav-links">
        <li>
          <router-link to="/CinePhix/home" class="nav-link" :class="{ active: isActive('/CinePhix/home') }">
            {{$t('nav.home')}}
          </router-link>
        </li>
        <li>
          <router-link to="/CinePhix/movies" class="nav-link" :class="{ active: isActive('/CinePhix/movies') }">
            {{$t('nav.movies')}}
          </router-link>
        </li>
        <li>
          <router-link to="/CinePhix/series" class="nav-link" :class="{ active: isActive('/CinePhix/series') }">
            {{$t('nav.series')}}
          </router-link>
        </li>
        <li>
          <router-link to="/CinePhix/actores" class="nav-link" :class="{ active: isActive('/CinePhix/actores') }">
            {{$t('nav.actors')}}
          </router-link>
        </li>
      </ul>
      <div class="lang-switcher">
        <div class="lang-toggle">
          <button 
            class="lang-btn" 
            :class="{ active: currentLang === 'es' }" 
            @click="setLanguage('es')"
            aria-label="Español">
            ES
          </button>
          <button 
            class="lang-btn" 
            :class="{ active: currentLang === 'en' }" 
            @click="setLanguage('en')"
            aria-label="English">
            EN
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { setLocale, getLocale } from '@/i18n'

export default {
  name: 'AppBarNavigation',
  setup() {
    const route = useRoute();
  const currentLang = ref(getLocale())

    const isActive = (path) => {
      return route.path === path || route.path.startsWith(path + '/');
    };
    const setLanguage = (lang) => {
      currentLang.value = lang
      setLocale(lang)
    }

    return {
      isActive,
      currentLang,
      setLanguage,
    };
  },
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
}

.logo-img {
  height: 40px;
}

.navigation {
  display: flex;
  align-items: center;
}

.lang-switcher {
  margin-left: 1.5rem;
  position: relative;
}

.lang-toggle {
  display: flex;
  background-color: rgba(40, 40, 40, 0.7);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.lang-btn {
  color: #aaa;
  background: transparent;
  border: none;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
  position: relative;
  min-width: 40px;
  text-align: center;
}

.lang-btn.active {
  color: #ffffff;
  background: linear-gradient(135deg, #e50914, #b20710);
  box-shadow: 0 2px 10px rgba(229, 9, 20, 0.5);
}

.lang-btn:hover:not(.active) {
  color: #fff;
  background-color: rgba(229, 9, 20, 0.3);
}

.nav-links {
  display: flex;
  list-style-type: none;
  gap: 1.5rem;
  justify-content: center;
  padding: 0;
  margin: 0;
  flex-wrap: wrap; /* Permite que los enlaces se ajusten en varias líneas si es necesario */
}

.nav-link {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
  padding: 0.5rem 0;
  /* TIPOGRAFÍA INTER: Enlaces más legibles */
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.3px;
}

.nav-link:hover {
  color: rgba(229, 9, 20, 0.8);
}

.nav-link.active {
  color: #e50914;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #e50914;
}

/* Responsividad */
@media screen and (max-width: 768px) {
  /* DISEÑO MÓVIL PROFESIONAL: Logo + Idioma */
  .header {
    padding: 0.75rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid rgba(229, 9, 20, 0.15);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  }
  
  .logo {
    flex: 1;
  }
  
  .logo-img {
    height: 35px;
    filter: drop-shadow(0 0 10px rgba(229, 9, 20, 0.3));
    transition: transform 0.3s ease;
  }
  
  .logo-img:active {
    transform: scale(0.95);
  }
  
  /* Ocultar los enlaces de navegación en móvil (están en bottom bar) */
  .nav-links {
    display: none;
  }
  
  .navigation {
    display: flex;
    align-items: center;
  }
  
  .lang-switcher {
    margin-left: 0;
  }
  
  .lang-toggle {
    background-color: rgba(40, 40, 40, 0.8);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  
  .lang-btn {
    padding: 0.35rem 0.7rem;
    font-size: 0.8rem;
    min-width: 36px;
  }
}

@media screen and (min-width: 769px) {
  .nav-links {
    gap: 1.5rem;
  }
}

@media screen and (max-width: 480px) {
  /* Mobile muy pequeño: optimización adicional */
  .header {
    padding: 0.6rem 0.75rem;
  }
  
  .logo-img {
    height: 30px;
  }
  
  .lang-btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.75rem;
    min-width: 32px;
  }
}
</style>
