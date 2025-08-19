<template>
  <div class="search-bar">
    <input
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      data-cy="search-input"
    />
    <button @click="$emit('search')" data-cy="search-button">{{ buttonLabel }}</button>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: 'Search movies...' },
    buttonLabel: { type: String, default: 'Search' },
  },
  emits: ['update:modelValue', 'search'],
}
</script>

<style scoped>
.search-bar { display:flex; gap:.5rem; align-items:center; }
input { flex:1; padding:.5rem .75rem; border-radius:6px; border:1px solid #444; background:#1e1e1e; color:#fff }
button { padding:.5rem .75rem; background:#e50914; color:#fff; border:none; border-radius:6px; cursor:pointer }
button:hover{ opacity:.9 }
</style>
