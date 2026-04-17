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
      VITE_API_URL: process.env.VITE_API_URL || 'http://localhost:8000',
    },
  },
})
