<template>
  <div class="review-form">
    <h3 class="form-title">{{ isEditing ? $t('reviews.editReview') : $t('reviews.writeReview') }}</h3>

    <v-alert v-if="error" type="error" variant="tonal" class="mb-4" closable @click:close="error = null">
      {{ error }}
    </v-alert>

    <div class="rating-section">
      <label class="section-label">{{ $t('reviews.yourRating') }}</label>
      <div class="star-selector">
        <button
          v-for="star in 5"
          :key="star"
          type="button"
          class="star-btn"
          :class="{ active: star <= localRating }"
          @click="localRating = star"
        >
          <v-icon size="32">{{ star <= localRating ? 'mdi-star' : 'mdi-star-outline' }}</v-icon>
        </button>
        <span class="rating-label">{{ ratingLabel }}</span>
      </div>
    </div>

    <v-textarea
      v-model="localContent"
      :label="$t('reviews.yourReview')"
      variant="outlined"
      rows="4"
      counter
      maxlength="5000"
      class="review-textarea"
    />

    <div class="spoiler-toggle">
      <v-switch
        v-model="localSpoiler"
        :label="$t('reviews.containsSpoilers')"
        color="primary"
        hide-details
        density="compact"
      />
    </div>

    <div class="form-actions">
      <v-btn variant="outlined" @click="$emit('cancel')" :disabled="isSubmitting">
        {{ $t('common.media.cancel') }}
      </v-btn>
      <v-btn
        color="primary"
        :loading="isSubmitting"
        :disabled="!canSubmit"
        @click="handleSubmit"
      >
        {{ isEditing ? $t('reviews.saveChanges') : $t('reviews.postReview') }}
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  initialRating: { type: Number, default: 0 },
  initialContent: { type: String, default: '' },
  initialSpoiler: { type: Boolean, default: false },
  isEditing: { type: Boolean, default: false },
  isSubmitting: { type: Boolean, default: false },
  error: { type: String, default: null },
})

const emit = defineEmits(['submit', 'cancel', 'update:error'])

const { t } = useI18n()

const localRating = ref(props.initialRating)
const localContent = ref(props.initialContent)
const localSpoiler = ref(props.initialSpoiler)

watch(() => props.initialRating, (v) => { localRating.value = v })
watch(() => props.initialContent, (v) => { localContent.value = v })
watch(() => props.initialSpoiler, (v) => { localSpoiler.value = v })

const ratingLabel = computed(() => {
  const labels = [
    '',
    t('reviews.ratingPoor'),
    t('reviews.ratingFair'),
    t('reviews.ratingGood'),
    t('reviews.ratingGreat'),
    t('reviews.ratingExcellent'),
  ]
  return labels[localRating.value] || t('reviews.ratingSelect')
})

const canSubmit = computed(() => localRating.value > 0 && localContent.value.trim().length > 0)

function handleSubmit() {
  if (!canSubmit.value) return
  emit('submit', {
    rating: localRating.value,
    content: localContent.value.trim(),
    isSpoiler: localSpoiler.value,
  })
}
</script>

<style scoped>
.review-form {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
}

.form-title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.rating-section {
  margin-bottom: 16px;
}

.section-label {
  display: block;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.star-selector {
  display: flex;
  align-items: center;
  gap: 4px;
}

.star-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.3);
  transition: all 0.15s ease;
}

.star-btn:hover,
.star-btn.active {
  color: #ffc107;
  transform: scale(1.1);
}

.rating-label {
  margin-left: 8px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  min-width: 70px;
}

.review-textarea {
  margin-bottom: 8px;
}

.spoiler-toggle {
  margin-bottom: 16px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
