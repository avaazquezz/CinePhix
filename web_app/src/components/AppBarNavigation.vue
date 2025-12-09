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
  position: relative;
  z-index: 1000;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.4);
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
  .nav-links {
    gap: 1rem; /* Reduce el espacio entre enlaces en pantallas pequeñas */
  }

  .nav-link {
    font-size: 0.9rem; /* Reduce el tamaño del texto en pantallas pequeñas */
  }
  
  .header {
    padding: 1rem;
  }
  
  .lang-switcher {
    margin-left: 1rem;
  }
}

@media screen and (max-width: 480px) {
  .header {
    flex-direction: column;
    padding: 0.8rem 0.5rem;
  }
  
  .logo {
    order: 2;
    margin-top: 0.5rem;
  }
  
  .navigation {
    flex-direction: column;
    width: 100%;
    order: 1;
  }
  
  .nav-links {
    width: 100%;
    gap: 0.5rem;
    margin-bottom: 0.8rem;
    justify-content: space-around;
    order: 2;
  }

  .nav-link {
    font-size: 0.8rem;
    padding: 0.3rem 0;
  }
  
  .lang-switcher {
    margin: 0;
    order: 1;
    margin-bottom: 0.8rem;
  }
  
  .lang-toggle {
    margin: 0 auto;
  }
  
  .lang-btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.75rem;
  }
}
</style>
