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

// Unhead for dynamic meta tags (client build — v3 entry)
import { createHead } from '@unhead/vue/client'

const app = createApp(App)

// Register Pinia
const pinia = createPinia()
app.use(pinia)

app.use(createHead())

// Register plugins (Vuetify, i18n, etc.)
registerPlugins(app)

// Use router
app.use(router)

// Mount
app.mount('#app')