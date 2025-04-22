<template>
  <div class="home-container">
    <AppBarNavigation />

    <main class="main-content">
      <section class="movie-section">
        <h2 class="section-title">Peliculas Tendencia HOY</h2>
        <div class="movie-grid">
          <div
            v-for="item in trendingContent"
            :key="item.id"
            class="movie-card"
          >
            <img
              :src="getImageUrl(item.poster_path)"
              :alt="item.title || item.name"
              class="movie-poster"
            />
            <h3 class="movie-title">{{ item.title || item.name }}</h3>
            <p class="movie-type">{{ item.media_type === 'movie' ? 'Película' : 'Serie' }}</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

</script>


<style scoped>


</style>
