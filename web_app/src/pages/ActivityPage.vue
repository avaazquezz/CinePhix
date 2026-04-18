<template>
  <v-container class="py-8">
    <h1 class="text-h5 font-weight-bold text-high-emphasis mb-4">Activity Feed</h1>

    <!-- Tabs -->
    <v-tabs v-model="tab" color="primary" class="mb-4">
      <v-tab value="following">Following</v-tab>
      <v-tab value="public">Public</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <!-- My Feed (Following) -->
      <v-window-item value="following">
        <div v-if="loadingMy && myActivities.length === 0" class="d-flex justify-center py-12">
          <v-progress-circular indeterminate color="primary" />
        </div>
        <div v-else-if="myActivities.length === 0" class="text-center py-12">
          <v-icon icon="mdi-account-group" size="64" color="grey-darken-1" class="mb-4" />
          <div class="text-h6 text-grey-darken-1 mb-2">No activity yet</div>
          <div class="text-body-2 text-grey">Follow users to see their activity here</div>
        </div>
        <ActivityCard v-else v-for="activity in myActivities" :key="activity.id" :activity="activity" class="mb-3" />
      </v-window-item>

      <!-- Public Feed -->
      <v-window-item value="public">
        <div v-if="loadingPublic && publicActivities.length === 0" class="d-flex justify-center py-12">
          <v-progress-circular indeterminate color="primary" />
        </div>
        <div v-else-if="publicActivities.length === 0" class="text-center py-12">
          <v-icon icon="mdi-earth" size="64" color="grey-darken-1" class="mb-4" />
          <div class="text-h6 text-grey-darken-1">No public activity</div>
        </div>
        <ActivityCard v-else v-for="activity in publicActivities" :key="activity.id" :activity="activity" class="mb-3" />
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMetaTags } from '@/composables/useMetaTags'
import { useActivityService } from '@/api/services/activityService'

const { loading: loadingMy, error: errorMy, getMyActivity, getPublicActivity } = useActivityService()

const myActivities = ref([])
const publicActivities = ref([])
const loadingPublic = ref(false)
const tab = ref('following')
const { setPageMeta } = useMetaTags()

const loadMyActivity = async () => {
  try {
    const data = await getMyActivity({ page: 1, per_page: 20 })
    myActivities.value = data.items || []
  } catch (e) {
    console.error('Failed to load my activity:', e)
  }
}

const loadPublicActivity = async () => {
  loadingPublic.value = true
  try {
    const data = await getPublicActivity({ page: 1, per_page: 20 })
    publicActivities.value = data.items || []
  } catch (e) {
    console.error('Failed to load public activity:', e)
  } finally {
    loadingPublic.value = false
  }
}

onMounted(() => {
  loadMyActivity()
  loadPublicActivity()
  setPageMeta({ title: 'Activity', description: 'See what your network is watching, reviewing and listing on CinePhix.' })
})
</script>
