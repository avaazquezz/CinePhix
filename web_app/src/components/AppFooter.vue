<template>
  <v-footer class="app-footer">
    <!-- Redes sociales -->
    <div class="social-links">
      <v-btn
        v-for="icon in socialLinks"
        :key="icon.name"
        :href="icon.link"
        target="_blank"
        :title="icon.name"
        :icon="icon.icon"
        density="comfortable"
        variant="text"
      ></v-btn>
    </div>

    <v-divider class="divider"></v-divider>

    <!-- Descripción del proyecto -->
  <div class="project-description" v-html="$t('footer.projectDesc')"></div>

    <v-divider class="divider"></v-divider>

    <!-- Información del desarrollador -->
  <div class="developer-info" v-html="$t('footer.by')"></div>
  </v-footer>
</template>

<script setup>
const socialLinks = [
  { name: 'GitHub', icon: 'mdi-github', link: 'https://github.com/avaazquezz' },
  { name: 'LinkedIn', icon: 'mdi-linkedin', link: 'https://www.linkedin.com/in/adrivaz/' },
  { name: 'Instagram', icon: 'mdi-instagram', link: 'https://instagram.com/a.vaazquezz21' },
];
</script>

<style scoped>
.app-footer {
  background-color: #3b0101 !important;
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.divider {
  margin: 0.5rem auto;
  height: 2px;
  width: 50%;
  background-color: white;
}

.project-description {
  font-size: 0.9rem;
  font-weight: 400;
  opacity: 0.8;
  padding: 0 1rem;
}

.tmdb-link {
  color: #f30b0b;
  text-decoration: none;
  transition: color 0.3s;
}

.tmdb-link:hover {
  color: #ff8a80;
}

.developer-info {
  font-size: 1rem;
  font-weight: 600;
}
</style>
