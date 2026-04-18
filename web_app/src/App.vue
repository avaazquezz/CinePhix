<template>
  <div id="app">
    <AppBarNavigation />
    <div class="layout">
      <div class="content">
        <router-view />
      </div>
      <AppFooter />
    </div>
    <!-- Bottom Navigation para móvil -->
    <BottomNavigation />
  </div>
</template>

<script>
import { onMounted } from 'vue'
import AppFooter from '@/components/AppFooter.vue'
import AppBarNavigation from '@/components/AppBarNavigation.vue'
import BottomNavigation from '@/components/BottomNavigation.vue'
import { useAuthStore } from '@/stores/auth'
import { useWatchlistStore } from '@/stores/watchlist'
import { useFavoritesStore } from '@/stores/favorites'

export default {
  name: 'App',
  components: {
    AppFooter,
    AppBarNavigation,
    BottomNavigation,
  },
  setup() {
    const authStore = useAuthStore()
    const watchlistStore = useWatchlistStore()
    const favoritesStore = useFavoritesStore()

    // Initialize auth and load user data on app start
    onMounted(async () => {
      await authStore.initialize()

      // If authenticated, load watchlist and favorites
      if (authStore.isAuthenticated) {
        watchlistStore.fetchWatchlist()
        favoritesStore.fetchFavorites()
      }
    })

    return {}
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;0,14..32,900;1,14..32,400&display=swap');

/* ── Design Tokens ── */
:root {
  --cp-bg-base:        #080808;
  --cp-bg-surface:     #0f0f0f;
  --cp-bg-elevated:    #161616;
  --cp-bg-card:        #121212;
  --cp-bg-overlay:     rgba(0, 0, 0, 0.93);

  --cp-red:            #e50914;
  --cp-red-dark:       #b20710;
  --cp-red-glow:       rgba(229, 9, 20, 0.35);
  --cp-red-border:     rgba(229, 9, 20, 0.25);
  --cp-green:          #04ff24;
  --cp-gold:           #f5c518;

  --cp-text-primary:   #ffffff;
  --cp-text-secondary: rgba(255, 255, 255, 0.70);
  --cp-text-muted:     rgba(255, 255, 255, 0.42);
  --cp-text-disabled:  rgba(255, 255, 255, 0.22);

  --cp-border:         rgba(255, 255, 255, 0.07);
  --cp-border-hover:   rgba(255, 255, 255, 0.14);
  --cp-border-accent:  rgba(229, 9, 20, 0.28);

  --cp-radius-xs:   4px;
  --cp-radius-sm:   6px;
  --cp-radius:      10px;
  --cp-radius-lg:   16px;
  --cp-radius-xl:   24px;

  --cp-shadow-sm:     0 2px 12px rgba(0, 0, 0, 0.4);
  --cp-shadow-card:   0 6px 28px rgba(0, 0, 0, 0.55);
  --cp-shadow-dialog: 0 32px 80px rgba(0, 0, 0, 0.85);
  --cp-shadow-red:    0 0 28px rgba(229, 9, 20, 0.45);

  --cp-ease:         cubic-bezier(0.4, 0, 0.2, 1);
  --cp-ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);
  --cp-duration:     0.25s;
  --cp-duration-slow:0.4s;
}

/* ── Reset ── */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  background-color: var(--cp-bg-base);
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.6;
  letter-spacing: 0.01em;
  color: var(--cp-text-primary);
}

#app {
  background-color: var(--cp-bg-base);
  min-height: 100vh;
}

.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--cp-bg-base);
}

.content {
  flex: 1;
  background-color: var(--cp-bg-base);
}

/* ── Global Scrollbar ── */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(229, 9, 20, 0.4); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(229, 9, 20, 0.7); }

/* ── Global Selection ── */
::selection { background: rgba(229, 9, 20, 0.3); color: #fff; }

/* ── Shared page layout ── */
.page-container {
  min-height: 100vh;
  background: var(--cp-bg-base);
  color: var(--cp-text-primary);
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* ── Shared section header ── */
.section-header { margin-bottom: 1.25rem; position: relative; }
@media (min-width: 600px)  { .section-header { margin-bottom: 1.75rem; } }
@media (min-width: 1200px) { .section-header { margin-bottom: 2.25rem; } }

.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--cp-text-primary);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}
@media (min-width: 600px)  { .section-title { font-size: 1.5rem; } }
@media (min-width: 900px)  { .section-title { font-size: 1.7rem; } }
@media (min-width: 1200px) { .section-title { font-size: 1.9rem; letter-spacing: 2px; } }

.title-accent {
  width: 3px;
  height: 22px;
  background: linear-gradient(180deg, var(--cp-red) 0%, #ff4c4c 100%);
  box-shadow: 0 0 10px var(--cp-red-glow);
  border-radius: 2px;
  flex-shrink: 0;
}
@media (min-width: 600px)  { .title-accent { width: 4px; height: 28px; } }
@media (min-width: 1200px) { .title-accent { width: 4px; height: 32px; } }

.title-underline {
  height: 1.5px;
  width: 50px;
  background: linear-gradient(90deg, var(--cp-red), transparent);
  border-radius: 1px;
}
@media (min-width: 600px)  { .title-underline { width: 70px; } }
@media (min-width: 1200px) { .title-underline { width: 90px; } }

/* ── Shared carousel ── */
.row-container {
  position: relative;
  width: 100%;
  padding: 0 2.25rem;
}
@media (min-width: 1200px) { .row-container { padding: 0 3rem; } }

.content-row {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 0.75rem 0 1rem;
  gap: 0.875rem;
  scrollbar-width: none;
}
.content-row::-webkit-scrollbar { display: none; }
@media (min-width: 600px)  { .content-row { gap: 1rem; } }
@media (min-width: 1200px) { .content-row { gap: 1.25rem; } }

/* ── Shared nav buttons ── */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  background: rgba(15, 15, 15, 0.9);
  border: 1px solid var(--cp-border-accent);
  color: white;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
  transition: all var(--cp-duration) var(--cp-ease);
  backdrop-filter: blur(12px);
  border-radius: var(--cp-radius-sm);
}
@media (min-width: 1200px) { .nav-btn { width: 44px; height: 44px; } }

.nav-btn:hover {
  background: var(--cp-red);
  border-color: var(--cp-red);
  transform: translateY(-50%) scale(1.05);
  box-shadow: var(--cp-shadow-red);
}
.nav-btn.prev { left: 0; }
.nav-btn.next { right: 0; }

/* ── Shared dialog overlay ── */
.cp-dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 10000;
  padding: 1rem;
  overflow-y: auto;
  backdrop-filter: blur(16px) saturate(0.6);
}
@media (min-width: 600px)  { .cp-dialog-overlay { padding: 2rem; align-items: center; } }

.cp-dialog-box {
  background: linear-gradient(160deg, #1c1c1c 0%, #0e0e0e 100%);
  color: var(--cp-text-primary);
  width: 100%;
  max-width: 1050px;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--cp-radius-lg);
  box-shadow: var(--cp-shadow-dialog);
  animation: dialogSlideUp 0.35s var(--cp-ease) forwards;
  margin: auto;
}

@keyframes dialogSlideUp {
  from { transform: translateY(24px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

.cp-dialog-close {
  position: absolute;
  top: 14px;
  right: 14px;
  background: rgba(229, 9, 20, 0.12);
  border: 1px solid rgba(229, 9, 20, 0.35);
  color: var(--cp-red);
  width: 36px;
  height: 36px;
  border-radius: var(--cp-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  transition: all var(--cp-duration) var(--cp-ease);
  z-index: 10;
}
.cp-dialog-close:hover {
  background: var(--cp-red);
  color: #fff;
  transform: rotate(90deg);
  box-shadow: var(--cp-shadow-red);
}

/* ── Dialog fade transition ── */
.dialog-fade-enter-active, .dialog-fade-leave-active { transition: opacity 0.28s var(--cp-ease); }
.dialog-fade-enter-from, .dialog-fade-leave-to { opacity: 0; }

/* ── Shared dialog layout ── */
.cp-dialog-layout {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 2.75rem 1.25rem 1.5rem;
}
@media (min-width: 600px)  { .cp-dialog-layout { padding: 2.25rem; gap: 1.75rem; } }
@media (min-width: 900px)  { .cp-dialog-layout { flex-direction: row; gap: 2.5rem; padding: 2.5rem; } }
@media (min-width: 1200px) { .cp-dialog-layout { gap: 3rem; padding: 3rem; } }

.cp-dialog-poster-wrap {
  flex: 0 0 auto;
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
}
@media (min-width: 600px)  { .cp-dialog-poster-wrap { max-width: 260px; } }
@media (min-width: 900px)  { .cp-dialog-poster-wrap { flex: 0 0 280px; max-width: 280px; margin: 0; } }
@media (min-width: 1200px) { .cp-dialog-poster-wrap { flex: 0 0 320px; max-width: 320px; } }

.cp-dialog-poster {
  width: 100%;
  border-radius: var(--cp-radius);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7);
  display: block;
}

.cp-dialog-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  min-width: 0;
}

.cp-dialog-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--cp-text-primary);
  letter-spacing: 0.3px;
  line-height: 1.25;
  margin: 0;
}
@media (min-width: 600px)  { .cp-dialog-title { font-size: 2rem; } }
@media (min-width: 900px)  { .cp-dialog-title { font-size: 2.2rem; } }
@media (min-width: 1200px) { .cp-dialog-title { font-size: 2.5rem; } }

.cp-dialog-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  align-items: center;
}

.cp-meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 5px 11px;
  border-radius: var(--cp-radius-sm);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--cp-border);
  color: var(--cp-text-secondary);
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.cp-meta-chip.rating {
  background: rgba(245, 197, 24, 0.12);
  border-color: rgba(245, 197, 24, 0.3);
  color: var(--cp-gold);
}

.cp-meta-chip i { font-size: 0.7rem; }

.cp-section-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--cp-text-muted);
  margin-bottom: 0.5rem;
}

.cp-overview {
  font-size: 0.95rem;
  line-height: 1.75;
  color: var(--cp-text-secondary);
  max-height: 160px;
  overflow-y: auto;
}
@media (min-width: 1200px) { .cp-overview { font-size: 1rem; max-height: 185px; } }

.cp-credits-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  max-height: 180px;
  overflow-y: auto;
}
@media (min-width: 600px) { .cp-credits-grid { grid-template-columns: repeat(2, 1fr); } }

.cp-credit-item {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--cp-border);
  border-radius: var(--cp-radius-sm);
  padding: 0.55rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
  transition: border-color var(--cp-duration) var(--cp-ease);
}
.cp-credit-item:hover { border-color: var(--cp-border-accent); }

.cp-credit-name {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--cp-text-primary);
}

.cp-credit-char {
  font-size: 0.75rem;
  color: var(--cp-text-muted);
}

.cp-dialog-actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.cp-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 1.1rem;
  border-radius: var(--cp-radius-sm);
  border: 1px solid var(--cp-border-hover);
  background: rgba(255,255,255,0.04);
  color: var(--cp-text-secondary);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--cp-duration) var(--cp-ease);
  letter-spacing: 0.3px;
}
.cp-action-btn:hover { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.25); color: #fff; }
.cp-action-btn.active { background: rgba(229,9,20,0.15); border-color: var(--cp-red); color: var(--cp-red); }

.cp-reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.cp-reviews-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--cp-text-muted);
  margin: 0;
}

/* ── Mobile bottom nav padding ── */
@media (max-width: 768px) {
  .content { padding-bottom: 75px; }
}
</style>