<template>
  <div id="app">
    <AppBarNavigation />
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

export default {
  components: {
    AppFooter,
    AppBarNavigation,
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
