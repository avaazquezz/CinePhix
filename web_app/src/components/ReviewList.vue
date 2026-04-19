<template>
  <div class="review-list">
    <div class="filter-tabs">
      <button
        v-for="tab in sortOptions"
        :key="tab.value"
        class="filter-tab"
        :class="{ active: currentSort === tab.value }"
        @click="setSort(tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="isLoading" class="loading-state">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-else-if="reviews.length === 0" class="empty-state">
      <v-icon size="48" color="grey-darken-1">mdi-message-text-outline</v-icon>
      <p>{{ $t('reviews.empty') }}</p>
    </div>

    <div v-else class="reviews-container">
      <ReviewCard
        v-for="review in reviews"
        :key="review.id"
        :review="review"
        :is-own-review="review.user_id === currentUserId"
        @vote="handleVote"
        @edit="$emit('edit', review)"
        @click-user="$emit('click-user', review.user)"
        @share="handleShare"
      />
    </div>

    <div v-if="!isLoading && hasMore" class="load-more">
      <v-btn variant="outlined" @click="loadMore" :loading="isLoadingMore">
        {{ $t('reviews.loadMore') }}
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ReviewCard from './ReviewCard.vue'

const props = defineProps({
  reviews: { type: Array, default: () => [] },
  isLoading: { type: Boolean, default: false },
  hasMore: { type: Boolean, default: false },
  currentSort: { type: String, default: 'recent' },
  currentUserId: { type: String, default: null },
})

const emit = defineEmits(['update:sort', 'vote', 'edit', 'click-user', 'load-more', 'share'])

const { t } = useI18n()

const sortOptions = computed(() => [
  { label: t('reviews.sortRecent'), value: 'recent' },
  { label: t('reviews.sortTopRated'), value: 'top_rated' },
  { label: t('reviews.sortUseful'), value: 'most_useful' },
])

const isLoadingMore = ref(false)

function setSort(value) {
  emit('update:sort', value)
}

async function loadMore() {
  isLoadingMore.value = true
  emit('load-more')
  isLoadingMore.value = false
}

function handleVote(reviewId, voteType) {
  emit('vote', reviewId, voteType)
}

function handleShare(reviewId) {
  emit('share', reviewId)
}
</script>

<style scoped>
.review-list {
  width: 100%;
}

.filter-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.filter-tab {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  padding: 8px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color 0.2s;
}

.filter-tab:hover {
  color: rgba(255, 255, 255, 0.8);
}

.filter-tab.active {
  color: #e50914;
  border-bottom-color: #e50914;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  gap: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.reviews-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
