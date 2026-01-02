<template>
  <div class="skeleton-card">
    <div class="skeleton-poster"></div>
    <div class="skeleton-title"></div>
    <div class="skeleton-meta"></div>
  </div>
</template>

<script>
export default {
  name: 'SkeletonCard',
}
</script>

<style scoped>
.skeleton-card {
  width: 100%;
  cursor: default;
  animation: fadeIn 0.3s ease-in;
}

.skeleton-poster {
  width: 100%;
  aspect-ratio: 2 / 3; /* Proporción típica de póster de película */
  background: linear-gradient(
    90deg,
    #2a2a2a 0%,
    #3a3a3a 50%,
    #2a2a2a 100%
  );
  background-size: 200% 100%;
  border-radius: 8px;
  animation: shimmer 1.5s infinite ease-in-out;
}

.skeleton-title {
  height: 16px;
  width: 80%;
  margin-top: 12px;
  background: linear-gradient(
    90deg,
    #2a2a2a 0%,
    #3a3a3a 50%,
    #2a2a2a 100%
  );
  background-size: 200% 100%;
  border-radius: 4px;
  animation: shimmer 1.5s infinite ease-in-out;
  animation-delay: 0.1s;
}

.skeleton-meta {
  height: 12px;
  width: 60%;
  margin-top: 8px;
  background: linear-gradient(
    90deg,
    #2a2a2a 0%,
    #3a3a3a 50%,
    #2a2a2a 100%
  );
  background-size: 200% 100%;
  border-radius: 4px;
  animation: shimmer 1.5s infinite ease-in-out;
  animation-delay: 0.2s;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Asegurar que el skeleton se vea bien en modo claro también */
@media (prefers-color-scheme: light) {
  .skeleton-poster,
  .skeleton-title,
  .skeleton-meta {
    background: linear-gradient(
      90deg,
      #e0e0e0 0%,
      #f0f0f0 50%,
      #e0e0e0 100%
    );
    background-size: 200% 100%;
  }
}
</style>
