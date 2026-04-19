<template>
  <v-card class="activity-card" :class="{ 'unread': !activity.is_read }">
    <v-card-item>
      <template #prepend>
        <v-avatar size="40" :color="iconColor" class="mr-3">
          <v-icon :icon="icon" size="small" />
        </v-avatar>
      </template>

      <v-card-title class="text-body-2 pa-0">
        <!-- Actor -->
        <router-link :to="`/CinePhix/user/${activity.actor?.username}`" class="user-link">
          {{ activity.actor?.username || $t('activityCard.unknown') }}
        </router-link>

        <!-- Action label -->
        <span class="text-grey"> · {{ label }}</span>
      </v-card-title>

      <v-card-subtitle class="text-caption pa-0 mt-1">
        <span v-if="targetTitle" class="mr-2">{{ targetTitle }}</span>
        <span v-if="activity.is_read === false" class="unread-badge">{{ $t('activityCard.new') }}</span>
        <span class="text-grey">{{ timeAgo }}</span>
      </v-card-subtitle>
    </v-card-item>

    <!-- Optional preview (poster for media actions) -->
    <v-card-text v-if="posterUrl" class="pt-2 pb-2">
      <div class="d-flex align-center">
        <v-img v-if="posterUrl" :src="posterUrl" width="32" height="48" cover class="mr-3 rounded" />
        <div>
          <div class="text-body-2 text-high-emphasis">{{ targetTitle }}</div>
          <div v-if="metadata?.rating" class="text-caption text-grey">
            <v-icon icon="mdi-star" size="x-small" color="amber" class="mr-1" />{{ metadata.rating }}/10
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getLocale } from '@/i18n'

const { t } = useI18n()

const props = defineProps({
  activity: { type: Object, required: true }
})

const metadata = computed(() => props.activity.metadata || props.activity.event_metadata || {})

const eventType = computed(() => props.activity.event_type || props.activity.activity_type || 'unknown')

const iconMap = {
  follow: { icon: 'mdi-account-plus', color: 'primary' },
  follow_request: { icon: 'mdi-account-clock', color: 'blue' },
  like: { icon: 'mdi-heart', color: 'red' },
  review: { icon: 'mdi-comment-text', color: 'amber' },
  comment: { icon: 'mdi-comment', color: 'teal' },
  list: { icon: 'mdi-format-list-bulleted', color: 'blue-grey' },
  watch: { icon: 'mdi-eye', color: 'green' },
  added_to_list: { icon: 'mdi-plus', color: 'green' },
  removed_from_list: { icon: 'mdi-minus', color: 'orange' },
  added_to_watchlist: { icon: 'mdi-clock', color: 'blue' },
  added_to_favorites: { icon: 'mdi-heart', color: 'red' },
  followed_user: { icon: 'mdi-account-plus', color: 'primary' },
  wrote_review: { icon: 'mdi-comment-text', color: 'amber' },
  created_list: { icon: 'mdi-format-list-bulleted', color: 'blue-grey' },
}

const icon = computed(() => iconMap[eventType.value]?.icon || 'mdi-bulletin-board')
const iconColor = computed(() => iconMap[eventType.value]?.color || 'grey')

const label = computed(() => {
  switch (eventType.value) {
    case 'follow': return t('activityCard.follow')
    case 'follow_request': return t('activityCard.followRequest')
    case 'like': return t('activityCard.like')
    case 'review': return t('activityCard.review')
    case 'comment': return t('activityCard.comment')
    case 'list': return t('activityCard.list')
    case 'watch': return t('activityCard.watch')
    case 'added_to_list': return t('activityCard.addedToList')
    case 'removed_from_list': return t('activityCard.removedFromList')
    case 'added_to_watchlist': return t('activityCard.addedToWatchlist')
    case 'added_to_favorites': return t('activityCard.favorited')
    case 'followed_user': return t('activityCard.followed')
    case 'wrote_review': return t('activityCard.wroteReview')
    case 'created_list': return t('activityCard.createdList')
    default: return t('activityCard.generic', { type: eventType.value.replace(/_/g, ' ') })
  }
})

const targetTitle = computed(() => {
  return metadata.value?.list_name
    || metadata.value?.title
    || metadata.value?.media_title
    || metadata.value?.username
    || ''
})

const posterUrl = computed(() => {
  const poster = metadata.value?.poster_path || metadata.value?.poster
  if (!poster) return null
  return poster.startsWith('http') ? poster : `https://image.tmdb.org/t/p/w92${poster}`
})

const timeAgo = computed(() => {
  const dateStr = props.activity.created_at
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  const loc = getLocale() === 'es' ? 'es-ES' : 'en-US'
  if (minutes < 1) return t('activityCard.justNow')
  if (minutes < 60) return t('activityCard.minutesAgo', { n: minutes })
  if (hours < 24) return t('activityCard.hoursAgo', { n: hours })
  if (days < 7) return t('activityCard.daysAgo', { n: days })
  return date.toLocaleDateString(loc)
})
</script>

<style scoped>
.activity-card {
  border-left: 3px solid rgb(var(--v-theme-on-surface));
  opacity: 0.9;
  transition: opacity 0.2s;
}
.activity-card:hover { opacity: 1; }
.activity-card.unread {
  border-left-color: #04ff24;
  opacity: 1;
}
.user-link {
  color: #04ff24;
  text-decoration: none;
  font-weight: 700;
}
.user-link:hover { text-decoration: underline; }
.unread-badge {
  background: #04ff24;
  color: #000;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 8px;
  margin-right: 6px;
}
</style>
