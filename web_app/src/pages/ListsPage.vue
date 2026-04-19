<template>
  <v-container class="py-8">
    <!-- Header -->
    <div class="d-flex align-center mb-6">
      <h1 class="text-h5 font-weight-bold text-high-emphasis">{{ $t('lists.myLists') }}</h1>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="showCreateDialog = true">
        {{ $t('lists.newList') }}
      </v-btn>
    </div>

    <!-- Loading -->
    <div v-if="loading && lists.length === 0" class="d-flex justify-center py-12">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && lists.length === 0" class="text-center py-12">
      <v-icon icon="mdi-format-list-bulleted" size="64" color="grey-darken-1" class="mb-4" />
      <div class="text-h6 text-grey-darken-1 mb-2">{{ $t('lists.emptyTitle') }}</div>
      <div class="text-body-2 text-grey mb-4">{{ $t('lists.emptyHint') }}</div>
      <v-btn color="primary" @click="showCreateDialog = true">{{ $t('lists.createListBtn') }}</v-btn>
    </div>

    <!-- Lists Grid -->
    <v-row v-else>
      <v-col v-for="list in lists" :key="list.id" cols="12" sm="6" md="4">
        <v-card class="list-card" @click="openList(list)">
          <v-card-item>
            <template #prepend>
              <v-icon icon="mdi-format-list-bulleted" color="primary" />
            </template>
            <v-card-title class="text-body-1">{{ list.name }}</v-card-title>
            <v-card-subtitle>{{ $t('lists.itemsMeta', { count: list.items_count, visibility: list.is_public ? $t('lists.public') : $t('lists.private') }) }}</v-card-subtitle>
          </v-card-item>

          <v-card-actions>
            <v-btn variant="text" size="small" @click.stop="openList(list)">{{ $t('lists.open') }}</v-btn>
            <v-btn variant="text" size="small" @click.stop="editList(list)">{{ $t('lists.edit') }}</v-btn>
            <v-spacer />
            <v-menu>
              <template #activator="{ props }">
                <v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="props" />
              </template>
              <v-list density="compact">
                <v-list-item @click="shareList(list)">
                  <template #prepend><v-icon icon="mdi-share-variant" size="small" /></template>
                  <v-list-item-title>{{ $t('lists.share') }}</v-list-item-title>
                </v-list-item>
                <v-list-item class="text-error" @click="confirmDelete(list)">
                  <template #prepend><v-icon icon="mdi-delete" size="small" color="error" /></template>
                  <v-list-item-title>{{ $t('lists.delete') }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="showCreateDialog" max-width="500">
      <v-card>
        <v-card-title>{{ editingList ? $t('lists.dialogEditTitle') : $t('lists.dialogCreateTitle') }}</v-card-title>
        <v-card-text>
          <v-form ref="formRef" @submit.prevent="submitList">
            <v-text-field v-model="form.name" :label="$t('lists.listName')" :rules="nameRules" class="mb-2" />
            <v-textarea v-model="form.description" :label="$t('lists.descriptionOptional')" rows="2" class="mb-2" />
            <v-switch v-model="form.is_public" :label="$t('lists.makePublic')" color="primary" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeDialog">{{ $t('lists.cancel') }}</v-btn>
          <v-btn color="primary" :loading="saving" @click="submitList">
            {{ editingList ? $t('lists.save') : $t('lists.submitCreate') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- List Detail Dialog -->
    <v-dialog v-model="showDetailDialog" max-width="700">
      <v-card v-if="selectedList">
        <v-card-item>
          <v-card-title>{{ selectedList.name }}</v-card-title>
          <v-card-subtitle>{{ $t('publicProfile.listItemsCount', { count: selectedList.items_count }) }}</v-card-subtitle>
          <template #append>
            <v-btn icon="mdi-close" variant="text" @click="showDetailDialog = false" />
          </template>
        </v-card-item>

        <!-- Add Item -->
        <v-card-text class="pb-0">
          <div class="d-flex gap-2 mb-4">
            <v-text-field
              v-model="addItemTmdb"
              type="number"
              :label="$t('lists.tmdbId')"
              density="compact"
              hide-details
              style="max-width: 150px"
            />
            <v-select
              v-model="addItemMediaType"
              :items="mediaTypeItems"
              :label="$t('lists.type')"
              density="compact"
              hide-details
              style="max-width: 120px"
            />
            <v-btn color="primary" :loading="addingItem" :disabled="!addItemTmdb" @click="addItem">
              {{ $t('lists.add') }}
            </v-btn>
          </div>
        </v-card-text>

        <!-- Items List -->
        <v-card-text>
          <div v-if="listItems.length === 0" class="text-center py-6 text-grey">
            {{ $t('lists.noItemsInList') }}
          </div>
          <v-list density="compact" v-else>
            <v-list-item v-for="item in listItems" :key="item.id">
              <template #prepend>
                <v-icon icon="mdi-movie" />
              </template>
              <v-list-item-title>{{ $t('lists.tmdbRow', { id: item.tmdb_id, type: item.media_type }) }}</v-list-item-title>
              <template #append>
                <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="removeItem(item)" />
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete Confirm -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title>{{ $t('lists.deleteConfirmTitle') }}</v-card-title>
        <v-card-text>{{ $t('lists.deleteConfirmBody') }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showDeleteDialog = false">{{ $t('lists.cancel') }}</v-btn>
          <v-btn color="error" :loading="deleting" @click="deleteListConfirmed">{{ $t('lists.delete') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useListsService } from '@/api/services/listService'
import { useMetaTags } from '@/composables/useMetaTags'

const { t } = useI18n()
const { setPageMeta } = useMetaTags()
const { loading, error, getMyLists, createList, updateList, deleteList, getList, addItemToList, removeItemFromList } = useListsService()

const mediaTypeItems = computed(() => [
  { title: t('lists.movie'), value: 'movie' },
  { title: t('lists.tv'), value: 'tv' },
])

const nameRules = [(v) => !!v || t('lists.required')]

const lists = ref([])
const showCreateDialog = ref(false)
const showDetailDialog = ref(false)
const showDeleteDialog = ref(false)
const editingList = ref(null)
const selectedList = ref(null)
const listItems = ref([])
const saving = ref(false)
const addingItem = ref(false)
const deleting = ref(false)

const form = ref({ name: '', description: '', is_public: true })
const formRef = ref(null)

const addItemTmdb = ref(null)
const addItemMediaType = ref('movie')

const loadLists = async () => {
  try {
    lists.value = await getMyLists()
  } catch (e) {
    console.error('Failed to load lists:', e)
  }
}

const openList = async (list) => {
  selectedList.value = list
  listItems.value = []
  try {
    const full = await getList(list.id)
    selectedList.value = full
    listItems.value = full.items || []
    showDetailDialog.value = true
  } catch (e) {
    console.error('Failed to load list:', e)
  }
}

const editList = (list) => {
  editingList.value = list
  form.value = { name: list.name, description: list.description || '', is_public: list.is_public }
  showCreateDialog.value = true
}

const closeDialog = () => {
  showCreateDialog.value = false
  editingList.value = null
  form.value = { name: '', description: '', is_public: true }
}

const submitList = async () => {
  saving.value = true
  try {
    if (editingList.value) {
      await updateList(editingList.value.id, form.value)
    } else {
      await createList(form.value)
    }
    await loadLists()
    closeDialog()
  } catch (e) {
    console.error('Failed to save list:', e)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (list) => {
  selectedList.value = list
  showDeleteDialog.value = true
}

const deleteListConfirmed = async () => {
  deleting.value = true
  try {
    await deleteList(selectedList.value.id)
    await loadLists()
    showDeleteDialog.value = false
    selectedList.value = null
  } catch (e) {
    console.error('Failed to delete list:', e)
  } finally {
    deleting.value = false
  }
}

const addItem = async () => {
  if (!addItemTmdb.value) return
  addingItem.value = true
  try {
    await addItemToList(selectedList.value.id, { tmdb_id: Number(addItemTmdb.value), media_type: addItemMediaType.value })
    const full = await getList(selectedList.value.id)
    selectedList.value = full
    listItems.value = full.items || []
    addItemTmdb.value = null
  } catch (e) {
    console.error('Failed to add item:', e)
  } finally {
    addingItem.value = false
  }
}

const removeItem = async (item) => {
  try {
    await removeItemFromList(selectedList.value.id, item.tmdb_id, item.media_type)
    listItems.value = listItems.value.filter(i => i.id !== item.id)
    if (selectedList.value) selectedList.value.items_count--
  } catch (e) {
    console.error('Failed to remove item:', e)
  }
}

const shareList = (list) => {
  const url = `${window.location.origin}/CinePhix/lists/${list.id}`
  navigator.clipboard.writeText(url)
}

onMounted(() => {
  setPageMeta({
    title: t('meta.lists.title'),
    description: t('meta.lists.description'),
  })
  loadLists()
})
</script>

<style scoped>
.list-card {
  cursor: pointer;
  transition: transform 0.2s;
}
.list-card:hover {
  transform: translateY(-2px);
}
</style>
