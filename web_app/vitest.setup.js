import { beforeAll } from 'vitest'

// JSDOM doesn't support CSS imports - mock all CSS files
const cssMock = () => ({})
import.meta.glob('../../node_modules/**/*.css', { eager: true })

// Mock window.matchMedia for Vuetify
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
})