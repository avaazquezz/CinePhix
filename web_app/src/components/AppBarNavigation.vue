<template>
  <header class="header">
    <div class="logo">
      <img src="@/assets/logo.png" alt="CinePhix Logo" class="logo-img" />
    </div>
    <nav class="navigation">
      <ul class="nav-links">
        <li><router-link to="/home" class="nav-link active">Inicio</router-link></li>
          <li><router-link to="/movies" class="nav-link">Películas</router-link></li>
          <li><router-link to="/series" class="nav-link">Series</router-link></li>
          <li><router-link to="/actores" class="nav-link">Actores</router-link></li>
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
      return route.path === path;
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

.nav-link:hover,
.nav-link.active {
  color: #e50914;
}
</style>