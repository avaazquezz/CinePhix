/**
 * Main app entry point - initializes Vue with plugins
 */

import { registerPlugins } from '@/plugins'

// App
import App from './App.vue'

// Vue
import { createApp } from 'vue'

// Router
import router from '@/router'

// Pinia
import { createPinia } from 'pinia'

const app = createApp(App)

// Register Pinia
const pinia = createPinia()
app.use(pinia)

// Unhead for dynamic meta tags
import { createHead } from '@unhead/vue'
app.use(createHead())

// Register plugins (Vuetify, i18n, etc.)
registerPlugins(app)

// Use router
app.use(router)

// Mount
app.mount('#app')