<template>
  <div id="app">
    <AppBarNavigation v-show="showAppBar" />
    <div class="layout">
      <div class="content">
        <router-view />
      </div>
      <AppFooter />
    </div>
  </div>
</template>

<script>
import AppFooter from "@/components/AppFooter.vue";
import AppBarNavigation from "@/components/AppBarNavigation.vue";
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  components: {
    AppFooter,
    AppBarNavigation,
  },
  setup() {
    const showAppBar = ref(true);

    const handleDialogOpened = () => {
      if (window.innerWidth <= 768) {
        showAppBar.value = false;
      }
    };

    const handleDialogClosed = () => {
      showAppBar.value = true;
    };

    onMounted(() => {
      window.addEventListener('dialog-opened', handleDialogOpened);
      window.addEventListener('dialog-closed', handleDialogClosed);
    });

    onUnmounted(() => {
      window.removeEventListener('dialog-opened', handleDialogOpened);
      window.removeEventListener('dialog-closed', handleDialogClosed);
    });

    return {
      showAppBar,
    };
  },
};
</script>

<style>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
}
</style>
