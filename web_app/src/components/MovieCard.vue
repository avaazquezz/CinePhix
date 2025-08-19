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
.movie-card{ width:150px; cursor:pointer; color:#fff }
img{ width:100%; border-radius:8px }
.title{ font-size:.9rem; margin-top:.25rem }
</style>
