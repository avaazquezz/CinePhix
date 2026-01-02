<template>
  <div class="movie-card" @click="$emit('select')" data-cy="movie-card">
    <img :src="image" :alt="title" />
    <h4 class="title">{{ title }}</h4>
  </div>
</template>

<script>
export default {
  name: 'MovieCard',
  props: {
    title: { type: String, required: true },
    image: { type: String, required: true },
  },
  emits: ['select'],
}
</script>

<style scoped>
.movie-card { 
  width: 150px; 
  cursor: pointer; 
  color: #fff;
  /* TIPOGRAFÍA INTER: Consistencia con la app */
  font-family: 'Inter', sans-serif;
  position: relative;
}

img { 
  width: 100%; 
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 2px solid transparent;
}

.movie-card:hover img {
  transform: scale(1.05);
  box-shadow: 
    0 0 20px rgba(229, 9, 20, 0.6),
    0 0 40px rgba(229, 9, 20, 0.4),
    0 8px 25px rgba(0, 0, 0, 0.6);
  border-color: rgba(229, 9, 20, 0.8);
}

.title { 
  font-size: 0.9rem; 
  margin-top: 0.5rem;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0.2px;
}
</style>
