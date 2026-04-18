<template>
  <div class="follow-button-wrapper">
    <!-- Loading -->
    <v-btn
      v-if="loading"
      size="small"
      variant="tonal"
      color="primary"
      loading
      disabled
    />

    <!-- Follow button (not following, not pending) -->
    <v-btn
      v-else-if="!isFollowing && !isPending"
      size="small"
      color="#04ff24"
      class="text-black"
      @click="handleFollow"
    >
      <v-icon icon="mdi-account-plus" class="mr-1" /> Follow
    </v-btn>

    <!-- Following button (click to unfollow) -->
    <v-btn
      v-else-if="isFollowing"
      size="small"
      variant="outlined"
      color="default"
      @click="handleUnfollow"
      @mouseenter="hovering = true"
      @mouseleave="hovering = false"
    >
      <v-icon :icon="hovering ? 'mdi-account-minus' : 'mdi-check'" class="mr-1" />
      {{ hovering ? 'Unfollow' : 'Following' }}
    </v-btn>

    <!-- Pending button (sent follow request, click to cancel) -->
    <v-btn
      v-else-if="isPending"
      size="small"
      variant="outlined"
      color="grey"
      @click="handleCancel"
    >
      <v-icon icon="mdi-clock-outline" class="mr-1" /> Pending
    </v-btn>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFollowService } from '@/api/services/followService'

const props = defineProps({
  userId: { type: String, required: true },
  initialFollowing: { type: Boolean, default: false },
  initialPending: { type: Boolean, default: false },
})

const emit = defineEmits(['follow-changed'])

const { loading, sendFollowRequest, unfollowUser, getFollowStatus } = useFollowService()

const isFollowing = ref(props.initialFollowing)
const isPending = ref(props.initialPending)
const hovering = ref(false)

const handleFollow = async () => {
  try {
    const result = await sendFollowRequest(props.userId)
    if (result.status === 'following') {
      isFollowing.value = true
      isPending.value = false
    } else if (result.status === 'pending') {
      isPending.value = true
      isFollowing.value = false
    }
    emit('follow-changed', { isFollowing: isFollowing.value, isPending: isPending.value })
  } catch (e) {
    console.error('Follow error:', e)
  }
}

const handleUnfollow = async () => {
  try {
    await unfollowUser(props.userId)
    isFollowing.value = false
    isPending.value = false
    emit('follow-changed', { isFollowing: false, isPending: false })
  } catch (e) {
    console.error('Unfollow error:', e)
  }
}

const handleCancel = async () => {
  try {
    await unfollowUser(props.userId)
    isPending.value = false
    emit('follow-changed', { isFollowing: false, isPending: false })
  } catch (e) {
    console.error('Cancel request error:', e)
  }
}

onMounted(async () => {
  // Sync with server state if not provided as props
  if (!props.initialFollowing && !props.initialPending) {
    try {
      const status = await getFollowStatus(props.userId)
      isFollowing.value = status.is_following
      isPending.value = status.is_pending
    } catch (e) {
      // Not logged in or error - ignore
    }
  }
})
</script>
