import { createI18n } from 'vue-i18n'
import es from './es.json'
import en from './en.json'

// Detect language from localStorage or browser
const browser = navigator.language || navigator.userLanguage || 'es-ES'
const fromStorage = localStorage.getItem('locale')

const locale = fromStorage || (browser.startsWith('es') ? 'es' : 'en')

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale,
  fallbackLocale: 'es',
  messages: { es, en },
})

export function setLocale(lang) {
  i18n.global.locale.value = lang
  localStorage.setItem('locale', lang)
}

export function getLocale() {
  return i18n.global.locale.value
}
