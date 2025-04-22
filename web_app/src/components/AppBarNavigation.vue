<template>
  <header class="header">
    <div class="logo">
      <img src="@/assets/logo.png" alt="CinePhix Logo" class="logo-img" />
    </div>
    <nav class="navigation">
      <ul class="nav-links">
        <li>
          <router-link to="/CinePhix/home" class="nav-link" :class="{ active: isActive('/CinePhix/home') }">
            Inicio
          </router-link>
        </li>
        <li>
          <router-link to="/CinePhix/movies" class="nav-link" :class="{ active: isActive('/CinePhix/movies') }">
            Películas
          </router-link>
        </li>
        <li>
          <router-link to="/CinePhix/series" class="nav-link" :class="{ active: isActive('/CinePhix/series') }">
            Series
          </router-link>
        </li>
        <li>
          <router-link to="/CinePhix/actores" class="nav-link" :class="{ active: isActive('/CinePhix/actores') }">
            Actores
          </router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { useRoute } from 'vue-router';

export default {
  name: 'AppBarNavigation',
  setup() {
    const route = useRoute();

    const isActive = (path) => {
      return route.path === path || route.path.startsWith(path + '/');
    };

    return {
      isActive,
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
  background-color: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 1000;
}

.logo-img {
  height: 40px;
}

.navigation {
  display: flex;
  align-items: center;
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
}

@media screen and (max-width: 480px) {
  .nav-links {
    gap: 0.5rem; /* Reduce aún más el espacio entre enlaces */
  }

  .nav-link {
    font-size: 0.8rem; /* Ajusta el tamaño del texto para pantallas muy pequeñas */
  }
}
</style>
