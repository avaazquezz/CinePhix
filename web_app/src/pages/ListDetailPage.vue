<template>
  <div class="list-detail-page">
    <div class="list-container">
      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <v-progress-circular indeterminate color="primary" size="64" />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-state">
        <v-alert type="error" variant="tonal">{{ error }}</v-alert>
        <v-btn @click="$router.push('/CinePhix/lists')" class="mt-4">{{ $t('listDetail.backMyLists') }}</v-btn>
      </div>

      <!-- List -->
      <template v-else-if="list">
        <!-- Header -->
        <div class="list-header">
          <v-btn icon variant="text" @click="$router.back()" class="back-btn">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <div class="list-info">
            <div class="name-row">
              <h1 class="list-name">{{ list.name }}</h1>
              <v-chip v-if="list.is_public" color="primary" size="small" class="ml-2">{{ $t('lists.public') }}</v-chip>
            </div>
            <p class="list-description">{{ list.description || $t('listDetail.noDescription') }}</p>
            <p class="list-meta">
              {{ $t('listDetail.itemsCount', { count: list.items_count }) }}
              <span v-if="list.user"> · {{ $t('listDetail.by') }} <router-link :to="`/CinePhix/user/${list.user.username}`" class="owner-link">{{ list.user.display_name || list.user.username }}</router-link></span>
            </p>
          </div>

          <!-- Actions -->
          <div class="list-actions">
            <ShareButtons
              :url="shareUrl"
              :title="list.name"
              :description="list.description || `${list.items_count} items on CinePhix`"
            />
            <v-btn
              v-if="isOwner && authStore.isAuthenticated"
              color="primary"
              @click="isEditing = true"
            >
              <v-icon start>mdi-pencil</v-icon>
              {{ $t('listDetail.edit') }}
            </v-btn>
          </div>
        </div>

        <!-- Edit Banner (shown to owner) -->
        <v-alert v-if="isOwner && authStore.isAuthenticated && !isEditing" type="info" variant="tonal" class="mb-4">
          {{ $t('listDetail.ownListInfo') }} <v-btn variant="text" @click="isEditing = true">{{ $t('listDetail.editIt') }}</v-btn>
        </v-alert>

        <!-- Items Grid -->
        <div v-if="items.length === 0" class="empty-state">
          <v-icon size="64" color="#333">mdi-format-list-bulleted</v-icon>
          <p>{{ $t('listDetail.emptyItems') }}</p>
        </div>

        <div v-else class="items-grid">
          <div
            v-for="item in items"
            :key="`${item.tmdb_id}-${item.media_type}`"
            class="item-card"
            @click="openMedia(item)"
          >
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.title"
              class="item-poster"
            />
            <div v-else class="item-poster-placeholder">
              <v-icon color="#333">mdi-film</v-icon>
            </div>
            <div class="item-info">
              <p class="item-title">{{ item.title }}</p>
              <p class="item-type">{{ item.media_type === 'movie' ? $t('home.type.movie') : $t('home.type.tv') }}</p>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { listService } from '@/api/services/listService'
import { useAuthStore } from '@/stores/auth'
import { useMetaTags } from '@/composables/useMetaTags'
import ShareButtons from '@/components/ShareButtons.vue'
import { getMovieDetail, getSeriesDetail } from '@/ApiController/services/movieService'

export default {
  name: 'ListDetailPage',

  components: { ShareButtons },

  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()
    const { setListMeta } = useMetaTags()

    const list = ref(null)
    const items = ref([])
    const loading = ref(true)
    const error = ref(null)
    const isEditing = ref(false)

    const isOwner = computed(() => {
      return authStore.user?.id === list.value?.user_id
    })

    const shareUrl = computed(() => {
      return `${window.location.origin}/CinePhix/list/${route.params.id}`
    })

    async function fetchList() {
      loading.value = true
      error.value = null
      try {
        const listId = route.params.id
        const response = await listService.getList(listId)
        list.value = response.data.list || response.data

        // Update meta tags
        setListMeta({
          name: list.value.name,
          owner: list.value.user?.display_name || list.value.user?.username,
          itemsCount: list.value.items_count,
          coverImage: list.value.cover_image,
          description: list.value.description,
        })
        document.title = `${list.value.name} — CinePhix`

        // Fetch items details
        const itemsData = list.value.items || []
        const detailedItems = await Promise.all(
          itemsData.map(async (item) => {
            try {
              if (item.media_type === 'movie') {
                const data = await getMovieDetail(item.tmdb_id)
                return {
                  tmdb_id: item.tmdb_id,
                  media_type: 'movie',
                  title: data.title,
                  image: data.poster_path
                    ? `https://image.tmdb.org/t/p/w342${data.poster_path}`
                    : null,
                }
              } else {
                const data = await getSeriesDetail(item.tmdb_id)
                return {
                  tmdb_id: item.tmdb_id,
                  media_type: 'tv',
                  title: data.name,
                  image: data.poster_path
                    ? `https://image.tmdb.org/t/p/w342${data.poster_path}`
                    : null,
                }
              }
            } catch {
              return {
                tmdb_id: item.tmdb_id,
                media_type: item.media_type,
                title: item.note || `TMDB ${item.tmdb_id}`,
                image: null,
              }
            }
          })
        )
        items.value = detailedItems
      } catch (e) {
        error.value = e.response?.status === 404 ? t('listDetail.notFound') : t('listDetail.loadFailed')
      } finally {
        loading.value = false
      }
    }

    function openMedia(item) {
      if (item.media_type === 'movie') {
        router.push({ path: '/CinePhix/movies', query: { open: item.tmdb_id } })
      } else {
        router.push({ path: '/CinePhix/series', query: { open: item.tmdb_id } })
      }
    }

    onMounted(fetchList)

    return {
      list,
      items,
      loading,
      error,
      isOwner,
      isEditing,
      shareUrl,
      authStore,
      openMedia,
    }
  },
}
</script>

<style scoped>
.list-detail-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #050505, #0a0a0a);
  padding: 40px 20px;
}

.list-container {
  max-width: 1100px;
  margin: 0 auto;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 16px;
}

.list-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.back-btn {
  flex-shrink: 0;
}

.list-info {
  flex: 1;
  min-width: 200px;
}

.name-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.list-name {
  font-family: 'Montserrat', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
}

.list-description {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  color: #888;
  margin: 8px 0 4px;
}

.list-meta {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  color: #555;
  margin: 0;
}

.owner-link {
  color: #04ff24;
  text-decoration: none;
}

.owner-link:hover {
  text-decoration: underline;
}

.list-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}

.item-card {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  background: #141414;
  transition: transform 0.2s, box-shadow 0.2s;
}

.item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
}

.item-poster {
  width: 100%;
  height: 210px;
  object-fit: cover;
  display: block;
}

.item-poster-placeholder {
  width: 100%;
  height: 210px;
  background: #111;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-info {
  padding: 10px;
}

.item-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-type {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.7rem;
  color: #666;
  margin: 0;
  text-transform: uppercase;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: 16px;
  color: #444;
}

.empty-state p {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
}
</style>
