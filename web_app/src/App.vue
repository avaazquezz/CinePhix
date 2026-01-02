<template>
  <div id="app">
    <AppBarNavigation />
    <div class="layout">
      <div class="content">
        <router-view />
      </div>
      <AppFooter />
    </div>
    <!-- Bottom Navigation para móvil -->
    <BottomNavigation />
  </div>
</template>

<script>
import AppFooter from "@/components/AppFooter.vue";
import AppBarNavigation from "@/components/AppBarNavigation.vue";
import BottomNavigation from "@/components/BottomNavigation.vue";

export default {
  components: {
    AppFooter,
    AppBarNavigation,
    BottomNavigation,
  },
};
</script>

<style>
/* Reset global y fondo negro */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background-color: #000000;
  min-height: 100vh;
  /* TIPOGRAFÍA MODERNA: Inter como fuente principal */
  font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
               'Helvetica Neue', Arial, sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.6;
  letter-spacing: 0.3px;
}

#app {
  background-color: #000000;
  min-height: 100vh;
}

.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #000000;
}

.content {
  flex: 1;
  background-color: #000000;
}

/* Agregar padding inferior en móvil para el bottom navigation */
@media (max-width: 768px) {
  .content {
    padding-bottom: 75px; /* 65px bottom nav + 10px extra spacing */
  }
}
</style>
