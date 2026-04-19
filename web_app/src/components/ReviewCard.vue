<template>
  <div class="review-card" :class="{ 'is-spoiler': review.is_spoiler }">
    <!-- Spoiler blur -->
    <div v-if="review.is_spoiler && !showSpoiler" class="spoiler-overlay">
      <div class="spoiler-warning">
        <v-icon size="20">mdi-alert</v-icon>
        <p>{{ $t('reviews.spoilerTitle') }}</p>
        <v-btn size="small" variant="outlined" @click="showSpoiler = true">
          {{ $t('reviews.spoilerShow') }}
        </v-btn>
      </div>
      <div class="spoiler-blur">
        <p>{{ review.content }}</p>
      </div>
    </div>

    <!-- Review content -->
    <div v-else class="review-content">
      <!-- Header -->
      <div class="review-header">
        <div class="user-info" @click="$router.push(`/CinePhix/user/${review.user?.username}`)">
          <v-avatar size="36" color="primary">
            <v-img v-if="review.user?.avatar_url" :src="review.user.avatar_url" />
            <span v-else>{{ review.user?.username?.charAt(0).toUpperCase() }}</span>
          </v-avatar>
          <div>
            <span class="username">{{ review.user?.display_name || review.user?.username }}</span>
            <span class="username handle">@{{ review.user?.username }}</span>
          </div>
        </div>
        <div class="review-meta">
          <div class="rating">
            <v-icon
              v-for="star in 5"
              :key="star"
              size="16"
              :color="star <= review.rating ? 'amber' : 'grey-darken-1'"
            >
              mdi-star
            </v-icon>
          </div>
          <span class="date">{{ formatDate(review.created_at) }}</span>
        </div>
      </div>

      <!-- Body -->
      <div class="review-body">
        <p class="review-text">{{ review.content }}</p>
      </div>

      <!-- Actions -->
      <div class="review-actions">
        <button
          class="action-btn"
          :class="{ active: hasVotedUseful }"
          @click="$emit('vote', review.id, 'useful')"
        >
          <v-icon size="18">mdi-thumb-up-outline</v-icon>
          <span v-if="review.likes_count > 0">{{ review.likes_count }}</span>
        </button>

        <button
          class="action-btn"
          :class="{ active: hasVotedNotUseful }"
          @click="$emit('vote', review.id, 'not_useful')"
        >
          <v-icon size="18">mdi-thumb-down-outline</v-icon>
        </button>

        <button class="action-btn" @click="$emit('share', review.id)">
          <v-icon size="18">mdi-share-variant</v-icon>
        </button>

        <v-btn
          v-if="isOwnReview"
          size="small"
          variant="text"
          color="primary"
          @click="$emit('edit', review)"
        >
          {{ $t('reviews.edit') }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  review: {
    type: Object,
    required: true,
  },
  isOwnReview: {
    type: Boolean,
    default: false,
  },
  hasVotedUseful: {
    type: Boolean,
    default: false,
  },
  hasVotedNotUseful: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['vote', 'share', 'edit', 'click-user'])

const { locale } = useI18n()
const showSpoiler = ref(false)

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const loc = locale.value === 'es' ? 'es-ES' : 'en-US'
  return date.toLocaleDateString(loc, { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<style scoped>
.review-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
  transition: border-color 0.2s ease;
}

.review-card:hover {
  border-color: rgba(255, 255, 255, 0.15);
}

.spoiler-overlay {
  position: relative;
}

.spoiler-warning {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
}

.spoiler-warning p {
  margin: 0;
  font-size: 0.9rem;
}

.spoiler-blur {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: transparent;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.user-info:hover .username {
  color: #e50914;
}

.username {
  display: block;
  font-weight: 600;
  font-size: 0.9rem;
  color: #fff;
  transition: color 0.2s ease;
}

.username.handle {
  font-size: 0.75rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
}

.review-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.rating {
  display: flex;
  gap: 2px;
}

.date {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}

.review-body {
  margin-bottom: 12px;
}

.review-text {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
}

.review-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.8);
}

.action-btn.active {
  color: #e50914;
}

.action-btn.active:hover {
  color: #e50914;
}
</style>
