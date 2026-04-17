import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
    video: false,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    env: {
      VITE_TMDB_API_KEY: process.env.VITE_TMDB_API_KEY || 'e546f0210838c597382ddcad9f8e0647',
      VITE_API_URL: process.env.VITE_API_URL || 'http://localhost:8001',
      CI: process.env.CI === 'true',
    },
    setupNodeEvents(on, config) {
      on('task', {
        isBackendReachable(url) {
          const raw = String(url || config.env.VITE_API_URL || 'http://localhost:8001').replace(
            /\/$/,
            '',
          )
          const target = raw.startsWith('http') ? raw : `http://${raw}`
          return fetch(target, { method: 'GET', signal: AbortSignal.timeout(4000) })
            .then(() => true)
            .catch(() => false)
        },
      })
      return config
    },
  },
})
