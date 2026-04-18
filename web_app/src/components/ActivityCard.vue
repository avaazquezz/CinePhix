<template>
  <v-card class="activity-card">
    <v-card-item>
      <template #prepend>
        <v-avatar size="36" :color="activityIconColor">
          <v-icon :icon="activityIcon" size="small" />
        </v-avatar>
      </template>
      <v-card-title class="text-body-2">
        <span class="font-weight-bold">{{ activity.actor?.username || 'Unknown' }}</span>
        <span class="text-grey"> · {{ activityLabel }}</span>
      </v-card-title>
      <v-card-subtitle class="text-caption">
        {{ formatDate(activity.created_at) }}
      </v-card-subtitle>
    </v-card-item>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  activity: {
    type: Object,
    required: true
  }
})

const activityIcon = computed(() => {
  switch (props.activity.activity_type) {
    case 'created_list': return 'mdi-format-list-bulleted'
    case 'added_to_list': return 'mdi-plus'
    case 'removed_from_list': return 'mdi-minus'
    case 'followed_user': return 'mdi-account-plus'
    case 'unfollowed_user': return 'mdi-account-minus'
    case 'wrote_review': return 'mdi-comment-text'
    case 'added_to_watchlist': return 'mdi-clock'
    case 'added_to_favorites': return 'mdi-heart'
    default: return 'mdi-bulletin-board'
  }
})

const activityIconColor = computed(() => {
  switch (props.activity.activity_type) {
    case 'created_list': return 'blue-grey'
    case 'added_to_list': return 'green'
    case 'removed_from_list': return 'red'
    case 'followed_user': return 'primary'
    case 'wrote_review': return 'amber'
    case 'added_to_watchlist': return 'blue'
    case 'added_to_favorites': return 'red'
    default: return 'grey'
  }
})

const activityLabel = computed(() => {
  switch (props.activity.activity_type) {
    case 'created_list': return `created list "${props.activity.extra_data?.list_name || ''}"`
    case 'added_to_list': return `added TMDB ${props.activity.target_id} to list`
    case 'removed_from_list': return `removed TMDB ${props.activity.target_id} from list`
    case 'followed_user': return `started following`
    case 'unfollowed_user': return `unfollowed`
    case 'wrote_review': return `wrote a review`
    case 'added_to_watchlist': return `added to watchlist`
    case 'added_to_favorites': return `added to favorites`
    default: return props.activity.activity_type.replace(/_/g, ' ')
  }
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}
</script>

<style scoped>
.activity-card {
  border-left: 3px solid rgb(var(--v-theme-primary));
}
</style>
