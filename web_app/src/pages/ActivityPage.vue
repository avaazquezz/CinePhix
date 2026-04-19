<template>
  <v-container class="py-6" style="max-width: 720px;">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-4">
      <div>
        <h1 class="text-h5 font-weight-bold text-high-emphasis">{{ $t('activity.title') }}</h1>
        <div v-if="unreadCount > 0" class="text-caption text-grey">
          {{ $t('activity.unreadLine', { count: unreadCount }) }}
        </div>
      </div>
      <div class="d-flex gap-2">
        <v-btn
          v-if="unreadCount > 0"
          size="small"
          variant="tonal"
          color="primary"
          @click="markAllRead"
        >
          <v-icon icon="mdi-check-all" class="mr-1" /> {{ $t('activity.markRead') }}
        </v-btn>
        <v-btn
          size="small"
          variant="outlined"
          color="default"
          @click="loadFeed(true)"
        >
          <v-icon icon="mdi-refresh" />
        </v-btn>
      </div>
    </div>

    <!-- Filter tabs -->
    <v-tabs v-model="activeFilter" color="primary" class="mb-4" density="compact">
      <v-tab value="all">{{ $t('activity.tabAll') }}</v-tab>
      <v-tab value="follow">{{ $t('activity.tabFollow') }}</v-tab>
      <v-tab value="like">{{ $t('activity.tabLike') }}</v-tab>
      <v-tab value="review">{{ $t('activity.tabReview') }}</v-tab>
      <v-tab value="comment">{{ $t('activity.tabComment') }}</v-tab>
      <v-tab value="list">{{ $t('activity.tabList') }}</v-tab>
      <v-tab value="watch">{{ $t('activity.tabWatch') }}</v-tab>
    </v-tabs>

    <!-- Loading -->
    <div v-if="loading && items.length === 0" class="d-flex justify-center py-12">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <!-- Empty state -->
    <div v-else-if="!loading && items.length === 0" class="text-center py-12">
      <v-icon icon="mdi-bell-sleep-outline" size="64" color="grey-darken-1" class="mb-4" />
      <div class="text-h6 text-grey-darken-1 mb-2">
        {{ emptyTitle }}
      </div>
      <div class="text-body-2 text-grey">
        {{ emptyHint }}
      </div>
    </div>

    <!-- Feed items -->
    <div v-else>
      <ActivityCard
        v-for="activity in items"
        :key="activity.id"
        :activity="activity"
        class="mb-3"
      />

      <!-- Load more -->
      <div v-if="hasMore" class="text-center py-6">
        <v-btn
          v-if="!loading"
          variant="tonal"
          color="primary"
          @click="loadMore"
        >
          {{ $t('activity.loadMore') }}
        </v-btn>
        <v-progress-circular v-else indeterminate color="primary" size="24" />
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useActivityService } from '@/api/services/activityService'
import { useMetaTags } from '@/composables/useMetaTags'

const { t } = useI18n()
const { setPageMeta } = useMetaTags()
const { loading, getFeedV2, markFeedRead } = useActivityService()

const items = ref([])
const unreadCount = ref(0)
const currentPage = ref(1)
const hasMore = ref(false)
const activeFilter = ref('all')

function filterTabLabel(f) {
  const key = {
    all: 'tabAll',
    follow: 'tabFollow',
    like: 'tabLike',
    review: 'tabReview',
    comment: 'tabComment',
    list: 'tabList',
    watch: 'tabWatch',
  }[f]
  return key ? t(`activity.${key}`) : f
}

const emptyTitle = computed(() =>
  activeFilter.value === 'all'
    ? t('activity.empty')
    : t('activity.emptyForFilter', { label: filterTabLabel(activeFilter.value) })
)

const emptyHint = computed(() =>
  activeFilter.value === 'all'
    ? t('activity.hintAll')
    : t('activity.hintFilter', { label: filterTabLabel(activeFilter.value) })
)

const filterMap = {
  all: null,
  follow: 'follow',
  like: 'like',
  review: 'review',
  comment: 'comment',
  list: 'list',
  watch: 'watch',
}

const loadFeed = async (reset = false) => {
  if (reset) {
    currentPage.value = 1
    items.value = []
  }
  try {
    const data = await getFeedV2({
      page: currentPage.value,
      per_page: 20,
      event_type: filterMap[activeFilter.value],
    })
    if (reset) {
      items.value = data.items || []
    } else {
      items.value.push(...(data.items || []))
    }
    unreadCount.value = data.unread_count || 0
    hasMore.value = items.value.length < data.total
  } catch (e) {
    console.error('Failed to load activity feed:', e)
  }
}

const loadMore = async () => {
  currentPage.value++
  await loadFeed(false)
}

const markAllRead = async () => {
  await markFeedRead()
  unreadCount.value = 0
  items.value.forEach(item => item.is_read = true)
}

// Reload when filter changes
watch(activeFilter, () => loadFeed(true))

onMounted(() => {
  setPageMeta({
    title: t('meta.activity.title'),
    description: t('meta.activity.description'),
  })
  loadFeed(true)
})
</script>
