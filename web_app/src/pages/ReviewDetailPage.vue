<template>
  <div class="review-detail-page">
    <div class="noise-overlay"></div>

    <main class="main-content" v-if="review">
      <!-- Back button + header -->
      <div class="page-header">
        <v-btn icon variant="text" @click="$router.back()" class="back-btn">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <div class="header-spacer"></div>
      </div>

      <!-- Review Card (large) -->
      <div class="review-card">
        <div class="review-header">
          <!-- Media poster -->
          <div class="poster-column" v-if="review.media">
            <router-link v-if="review.media_type === 'movie'" :to="`/CinePhix/movies?open=${review.tmdb_id}`">
              <img
                v-if="review.media.poster_path"
                :src="`https://image.tmdb.org/t/p/w342${review.media.poster_path}`"
                :alt="review.media.title"
                class="poster"
              />
              <div v-else class="poster-placeholder">
                <v-icon size="48" color="#333">mdi-film</v-icon>
              </div>
            </router-link>
            <router-link v-else :to="`/CinePhix/series?open=${review.tmdb_id}`">
              <img
                v-if="review.media.poster_path"
                :src="`https://image.tmdb.org/t/p/w342${review.media.poster_path}`"
                :alt="review.media.title"
                class="poster"
              />
              <div v-else class="poster-placeholder">
                <v-icon size="48" color="#333">mdi-television</v-icon>
              </div>
            </router-link>
          </div>

          <!-- Review content -->
          <div class="review-content">
            <div class="media-title-row">
              <router-link
                v-if="review.media_type === 'movie'"
                :to="`/CinePhix/movies?open=${review.tmdb_id}`"
                class="media-title-link"
              >
                {{ review.media?.title || $t('reviewDetail.fallbackMovie') }}
              </router-link>
              <router-link
                v-else
                :to="`/CinePhix/series?open=${review.tmdb_id}`"
                class="media-title-link"
              >
                {{ review.media?.title || $t('reviewDetail.fallbackTv') }}
              </router-link>
              <span class="media-year">{{ review.media?.release_date?.slice(0, 4) || '' }}</span>
            </div>

            <!-- Author -->
            <div class="author-row">
              <router-link :to="`/CinePhix/user/${review.user?.username}`" class="author-link">
                <img
                  v-if="review.user?.avatar_url"
                  :src="review.user.avatar_url"
                  :alt="review.user.username"
                  class="author-avatar"
                />
                <div v-else class="author-avatar-placeholder">
                  {{ (review.user?.display_name || review.user?.username || 'U')[0].toUpperCase() }}
                </div>
                <span class="author-name">{{ review.user?.display_name || review.user?.username }}</span>
              </router-link>
              <span class="review-date">{{ formatDate(review.created_at) }}</span>
              <v-chip v-if="review.is_spoiler" size="small" class="spoiler-chip">{{ $t('reviewDetail.spoilersChip') }}</v-chip>
            </div>

            <!-- Rating -->
            <div class="rating-row" v-if="review.rating">
              <span class="rating-label">{{ $t('reviewDetail.rating') }}</span>
              <div class="star-rating">
                <v-icon
                  v-for="n in 10"
                  :key="n"
                  :color="n <= review.rating ? '#04ff24' : '#333'"
                  size="22"
                >mdi-star</v-icon>
              </div>
            </div>

            <!-- Review text -->
            <div v-if="review.is_spoiler && !showSpoiler" class="spoiler-warning">
              <v-icon color="#ff9800">mdi-alert</v-icon>
              <p>{{ $t('reviewDetail.spoilerBody') }}</p>
              <v-btn color="warning" size="small" @click="showSpoiler = true">{{ $t('reviews.spoilerShow') }}</v-btn>
            </div>
            <div v-else class="review-text">{{ review.content }}</div>

            <!-- Actions -->
            <div class="review-actions">
              <ShareButtons
                :url="shareUrl"
                :title="shareTitleText"
                :description="review.content?.slice(0, 200) || ''"
              />
              <v-btn
                v-if="isOwner"
                variant="outlined"
                size="small"
                @click="$router.push(`/CinePhix/reviews/edit/${review.id}`)"
              >
                <v-icon start>mdi-pencil</v-icon>
                {{ $t('reviewDetail.edit') }}
              </v-btn>
            </div>
          </div>
        </div>
      </div>

      <!-- Comments section -->
      <div class="comments-section">
        <h2 class="section-title">{{ $t('reviewDetail.comments') }}</h2>

        <!-- Add comment -->
        <div v-if="authStore.isAuthenticated" class="add-comment">
          <textarea
            v-model="newComment"
            :placeholder="$t('reviewDetail.commentPlaceholder')"
            class="comment-input"
            rows="3"
          ></textarea>
          <v-btn
            color="primary"
            size="small"
            :disabled="!newComment.trim()"
            @click="submitComment"
          >
            {{ $t('reviewDetail.post') }}
          </v-btn>
        </div>
        <div v-else class="login-prompt">
          <router-link to="/CinePhix/auth/login">{{ $t('reviewDetail.loginPrompt') }}</router-link> {{ $t('reviewDetail.toComment') }}
        </div>

        <!-- Comments list -->
        <div v-if="comments.length > 0" class="comments-list">
          <div
            v-for="comment in comments"
            :key="comment.id"
            class="comment-item"
          >
            <router-link :to="`/CinePhix/user/${comment.username}`" class="comment-avatar-link">
              <img
                v-if="comment.avatar_url"
                :src="comment.avatar_url"
                :alt="comment.username"
                class="comment-avatar"
              />
              <div v-else class="comment-avatar-placeholder">
                {{ (comment.display_name || comment.username)[0].toUpperCase() }}
              </div>
            </router-link>
            <div class="comment-body">
              <div class="comment-header">
                <router-link :to="`/CinePhix/user/${comment.username}`" class="comment-author">
                  {{ comment.display_name || comment.username }}
                </router-link>
                <span class="comment-date">{{ formatDate(comment.created_at) }}</span>
                <v-btn
                  v-if="comment.user_id === currentUserId"
                  icon="mdi-delete"
                  size="x-small"
                  variant="text"
                  @click="deleteComment(comment.id)"
                />
              </div>
              <p class="comment-text">{{ comment.content }}</p>
            </div>
          </div>
        </div>
        <div v-else class="no-comments">
          <p>{{ $t('reviewDetail.noComments') }}</p>
        </div>
      </div>
    </main>

    <!-- Loading state -->
    <div v-else-if="loading" class="loading-state">
      <v-progress-circular indeterminate color="primary" size="64" />
    </div>

    <!-- Error state -->
    <div v-else class="error-state">
      <v-alert type="error" variant="tonal">{{ error }}</v-alert>
      <v-btn @click="$router.push('/CinePhix')" class="mt-4">{{ $t('reviewDetail.goHome') }}</v-btn>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getLocale } from '@/i18n'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMetaTags } from '@/composables/useMetaTags'
import ShareButtons from '@/components/ShareButtons.vue'
import { reviewService } from '@/api/services/reviewService'

export default {
  name: 'ReviewDetailPage',

  components: { ShareButtons },

  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const authStore = useAuthStore()
    const { setReviewMeta } = useMetaTags()

    const review = ref(null)
    const loading = ref(true)
    const error = ref(null)
    const showSpoiler = ref(false)
    const newComment = ref('')
    const comments = ref([])
    const currentUserId = computed(() => authStore.user?.id)

    const shareUrl = computed(() => {
      if (!review.value) return window.location.href
      const mediaTitle = review.value.media?.title || review.value.tmdb_id
      return `${window.location.origin}/CinePhix/reviews/${review.value.id}`
    })

    const isOwner = computed(() => {
      return review.value?.user_id === authStore.user?.id
    })

    const shareTitleText = computed(() => {
      if (!review.value) return ''
      const mt = review.value.media_type === 'movie' ? t('reviewDetail.fallbackMovie') : t('reviewDetail.fallbackTv')
      const title = review.value.media?.title || mt
      return t('reviewDetail.shareTitle', { title, user: review.value.user?.username || '' })
    })

    async function fetchReview() {
      loading.value = true
      try {
        const res = await reviewService.getReview(route.params.id)
        review.value = res.data
        setReviewMeta(review.value)
      } catch (e) {
        error.value = t('errors.reviewNotFound')
      } finally {
        loading.value = false
      }
    }

    async function submitComment() {
      if (!newComment.value.trim()) return
      try {
        await reviewService.addComment(route.params.id, { content: newComment.value })
        newComment.value = ''
        await fetchComments()
      } catch (e) {
        console.error('Failed to post comment', e)
      }
    }

    async function deleteComment(commentId) {
      try {
        await reviewService.deleteComment(commentId)
        comments.value = comments.value.filter(c => c.id !== commentId)
      } catch (e) {
        console.error('Failed to delete comment', e)
      }
    }

    async function fetchComments() {
      try {
        const res = await reviewService.getComments(route.params.id)
        comments.value = res.data.items || []
      } catch (e) {
        console.error('Failed to fetch comments', e)
      }
    }

    function formatDate(dateStr) {
      if (!dateStr) return ''
      const loc = getLocale() === 'es' ? 'es-ES' : 'en-US'
      return new Date(dateStr).toLocaleDateString(loc, {
        year: 'numeric', month: 'short', day: 'numeric'
      })
    }

    onMounted(async () => {
      await fetchReview()
      if (review.value) {
        await fetchComments()
      }
    })

    return {
      review,
      loading,
      error,
      showSpoiler,
      newComment,
      comments,
      currentUserId,
      shareUrl,
      isOwner,
      shareTitleText,
      submitComment,
      deleteComment,
      formatDate,
    }
  },
}
</script>

<style scoped>
.review-detail-page {
  min-height: 100vh;
  background: #050505;
  position: relative;
}

.main-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 40px 80px;
}

.noise-overlay {
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 28px;
}

.back-btn { color: #888; }

.review-card {
  background: #111;
  border-radius: 12px;
  padding: 28px;
  margin-bottom: 40px;
}

.review-header {
  display: flex;
  gap: 24px;
}

.poster-column {
  flex-shrink: 0;
}

.poster {
  width: 140px;
  border-radius: 8px;
  display: block;
}

.poster-placeholder {
  width: 140px;
  aspect-ratio: 2/3;
  background: #1a1a1a;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.review-content {
  flex: 1;
  min-width: 0;
}

.media-title-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.media-title-link {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: #fff;
  text-decoration: none;
}

.media-year {
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  color: #666;
}

.author-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.author-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.author-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.author-avatar-placeholder {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #04ff24;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
}

.author-name {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
}

.review-date {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.78rem;
  color: #555;
}

.spoiler-chip {
  font-size: 0.65rem;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.rating-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  color: #666;
}

.star-rating {
  display: flex;
  gap: 2px;
}

.spoiler-warning {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: #1a1a1a;
  border-radius: 8px;
  text-align: center;
}

.spoiler-warning p {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  color: #888;
}

.review-text {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.95rem;
  line-height: 1.7;
  color: #ddd;
  white-space: pre-wrap;
  margin-bottom: 20px;
}

.review-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

/* Comments */
.comments-section {
  background: #111;
  border-radius: 12px;
  padding: 28px;
}

.section-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 20px;
}

.add-comment {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 28px;
}

.comment-input {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 12px;
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.85rem;
  resize: vertical;
  outline: none;
}

.comment-input:focus {
  border-color: #04ff24;
}

.login-prompt {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 24px;
}

.login-prompt a {
  color: #04ff24;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 12px;
}

.comment-avatar-link {
  flex-shrink: 0;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-avatar-placeholder {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #222;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 0.8rem;
}

.comment-body {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.comment-author {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
}

.comment-date {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.72rem;
  color: #444;
  flex: 1;
}

.comment-text {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.85rem;
  color: #aaa;
  line-height: 1.5;
  margin: 0;
}

.no-comments {
  text-align: center;
  padding: 24px;
  color: #444;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.85rem;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
}
</style>