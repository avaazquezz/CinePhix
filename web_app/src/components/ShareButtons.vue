<template>
  <div class="share-buttons">
    <v-btn
      icon
      variant="text"
      size="small"
      :color="color"
      :href="twitterUrl"
      target="_blank"
      rel="noopener"
      :aria-label="'Share on X'"
    >
      <v-icon>mdi-twitter</v-icon>
    </v-btn>

    <v-btn
      icon
      variant="text"
      size="small"
      :color="color"
      :href="facebookUrl"
      target="_blank"
      rel="noopener"
      :aria-label="'Share on Facebook'"
    >
      <v-icon>mdi-facebook</v-icon>
    </v-btn>

    <v-btn
      icon
      variant="text"
      size="small"
      :color="color"
      :href="redditUrl"
      target="_blank"
      rel="noopener"
      :aria-label="'Share on Reddit'"
    >
      <v-icon>mdi-reddit</v-icon>
    </v-btn>

    <v-btn
      icon
      variant="text"
      size="small"
      :color="color"
      aria-label="Copy link"
      @click="copyLink"
    >
      <v-icon>{{ copied ? 'mdi-check' : 'mdi-link' }}</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ShareButtons',

  props: {
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'white',
    },
  },

  setup(props) {
    const copied = ref(false)

    const encodedUrl = computed(() => encodeURIComponent(props.url))
    const encodedTitle = computed(() => encodeURIComponent(props.title))
    const encodedDesc = computed(() => encodeURIComponent(props.description))

    const twitterUrl = computed(
      () => `https://twitter.com/intent/tweet?url=${encodedUrl.value}&text=${encodedTitle.value}`
    )

    const facebookUrl = computed(
      () => `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl.value}`
    )

    const redditUrl = computed(
      () => `https://reddit.com/submit?url=${encodedUrl.value}&title=${encodedTitle.value}`
    )

    function copyLink() {
      navigator.clipboard.writeText(props.url).then(() => {
        copied.value = true
        setTimeout(() => {
          copied.value = false
        }, 2000)
      })
    }

    return {
      copied,
      twitterUrl,
      facebookUrl,
      redditUrl,
      copyLink,
    }
  },
}
</script>

<style scoped>
.share-buttons {
  display: flex;
  gap: 4px;
  align-items: center;
}
</style>
