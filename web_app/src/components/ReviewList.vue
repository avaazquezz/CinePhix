<template>
  <div class="review-list">
    <!-- Filter tabs -->
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

    <!-- Loading -->
    <div v-if="isLoading" class="loading-state">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <!-- Empty -->
    <div v-else-if="reviews.length === 0" class="empty-state">
      <v-icon size="48" color="grey-darken-1">mdi-message-text-outline</v-icon>
      <p>No reviews yet. Be the first to write one!</p>
    </div>

    <!-- Reviews -->
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

    <!-- Load more -->
    <div v-if="!isLoading && hasMore" class="load-more">
      <v-btn variant="outlined" @click="loadMore" :loading="isLoadingMore">
        Load more reviews
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import ReviewCard from './ReviewCard.vue'

const props = defineProps({
  reviews: { type: Array, default: () => [] },
  isLoading: { type: Boolean, default: false },
  hasMore: { type: Boolean, default: false },
  currentSort: { type: String, default: 'recent' },
  currentUserId: { type: String, default: null },
})

const emit = defineEmits(['update:sort', 'vote', 'edit', 'click-user', 'load-more', 'share'])

const sortOptions = [
  { label: 'Most Recent', value: 'recent' },
  { label: 'Top Rated', value: 'top_rated' },
  { label: 'Most Useful', value: 'most_useful' },
]

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
  padding-bottom: 8px;
}

.filter-tab {
  padding: 6px 16px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.filter-tab:hover {
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.05);
}

.filter-tab.active {
  color: #fff;
  background: rgba(229, 9, 20, 0.3);
  border: 1px solid rgba(229, 9, 20, 0.5);
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  gap: 12px;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
}

.empty-state p {
  margin: 0;
  font-size: 0.9rem;
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
