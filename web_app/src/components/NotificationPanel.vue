<template>
  <v-navigation-drawer
    v-model="open"
    location="right"

    width="360"
  >
    <div class="notification-panel">
      <!-- Header -->
      <div class="panel-header">
        <div class="text-h6 font-weight-bold">Notifications</div>
        <div class="d-flex align-center ga-2">
          <v-btn
            v-if="unreadCount > 0"
            variant="text"
            size="small"
            color="primary"
            @click="markAll"
          >
            Mark all read
          </v-btn>
          <v-btn icon="mdi-close" variant="text" size="small" @click="open = false" />
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="d-flex justify-center py-8">
        <v-progress-circular indeterminate color="primary" />
      </div>

      <!-- Empty -->
      <div v-else-if="notifications.length === 0" class="text-center py-8 px-4">
        <v-icon icon="mdi-bell-outline" size="48" color="grey-darken-1" class="mb-2" />
        <div class="text-body-2 text-grey">No notifications yet</div>
      </div>

      <!-- List -->
      <v-list v-else density="compact" class="pa-0">
        <v-list-item
          v-for="notif in notifications"
          :key="notif.id"
          :class="['notification-item', { unread: !notif.read_at }]"
          @click="handleClick(notif)"
        >
          <template #prepend>
            <v-avatar size="36" :color="iconColor(notif.type)" class="mr-2">
              <v-icon :icon="iconName(notif.type)" size="small" />
            </v-avatar>
          </template>
          <v-list-item-title class="text-body-2">{{ label(notif) }}</v-list-item-title>
          <v-list-item-subtitle class="text-caption">{{ formatDate(notif.created_at) }}</v-list-item-subtitle>
          <template #append>
            <v-btn
              v-if="!notif.read_at"
              icon="mdi-check"
              variant="text"
              size="x-small"
              @click.stop="markRead(notif.id)"
            />
          </template>
        </v-list-item>
      </v-list>

      <!-- Load More -->
      <div v-if="hasMore" class="pa-3 text-center">
        <v-btn variant="text" size="small" @click="loadMore">Load more</v-btn>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useNotificationsService } from '@/api/services/notificationService'

const props = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const { loading, getNotifications, markRead: svcMarkRead, markAllRead, getUnreadCount } = useNotificationsService()

const open = ref(props.modelValue)
const notifications = ref([])
const unreadCount = ref(0)
const page = ref(1)
const hasMore = ref(false)

watch(() => props.modelValue, async (val) => {
  open.value = val
  if (val) {
    await refresh()
  }
})

watch(open, (val) => {
  emit('update:modelValue', val)
})

const refresh = async () => {
  unreadCount.value = await getUnreadCount()
  const data = await getNotifications({ page: 1, per_page: 20 })
  notifications.value = data.items || []
  hasMore.value = data.page < data.pages
  page.value = 1
}

const loadMore = async () => {
  page.value++
  const data = await getNotifications({ page: page.value, per_page: 20 })
  notifications.value.push(...(data.items || []))
  hasMore.value = data.page < data.pages
}

const markRead = async (id) => {
  try {
    await svcMarkRead(id)
    const n = notifications.value.find(n => n.id === id)
    if (n) n.read_at = new Date().toISOString()
    unreadCount.value = Math.max(0, unreadCount.value - 1)
  } catch (e) {
    console.error(e)
  }
}

const markAll = async () => {
  try {
    await markAllRead()
    notifications.value.forEach(n => { n.read_at = n.read_at || new Date().toISOString() })
    unreadCount.value = 0
  } catch (e) {
    console.error(e)
  }
}

const handleClick = async (notif) => {
  if (!notif.read_at) await markRead(notif.id)
  // TODO: navigate based on type
}

const iconName = (type) => ({
  new_follower: 'mdi-account-plus',
  review_liked: 'mdi-thumb-up',
  new_review_on_list: 'mdi-format-list-bulleted',
  list_featured: 'mdi-star',
}[type] || 'mdi-bell')

const iconColor = (type) => ({
  new_follower: 'primary',
  review_liked: 'amber',
  new_review_on_list: 'blue-grey',
  list_featured: 'deep-orange',
}[type] || 'grey')

const label = (notif) => ({
  new_follower: `${notif.data?.follower_username || 'Someone'} started following you`,
  review_liked: `${notif.data?.liker_username || 'Someone'} found your review useful`,
  new_review_on_list: `New review on your list`,
  list_featured: `Your list "${notif.data?.list_name || ''}" was featured`,
}[notif.type] || notif.type)

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

// Expose unreadCount for badge
defineExpose({ unreadCount })
</script>

<style scoped>
.notification-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgb(var(--v-theme-surface));
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.notification-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
}

.notification-item.unread {
  background: rgba(var(--v-theme-primary), 0.08);
}
</style>
