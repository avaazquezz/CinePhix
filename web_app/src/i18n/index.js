import { createI18n } from 'vue-i18n'
import esBase from './es.json'
import enBase from './en.json'
import esExtra from './messages/es.extra.json'
import enExtra from './messages/en.extra.json'

const browser = navigator.language || navigator.userLanguage || 'es-ES'
const fromStorage = localStorage.getItem('locale')

const locale = fromStorage || (browser.startsWith('es') ? 'es' : 'en')

/** Deep merge locale objects (arrays from `extra` replace; objects merge recursively). */
function deepMerge(target, source) {
  if (!source) return { ...target }
  const out = { ...target }
  for (const key of Object.keys(source)) {
    const sv = source[key]
    const tv = target[key]
    if (Array.isArray(sv)) {
      out[key] = [...sv]
    } else if (sv !== null && typeof sv === 'object') {
      out[key] =
        tv !== null && typeof tv === 'object' && !Array.isArray(tv)
          ? deepMerge(tv, sv)
          : { ...sv }
    } else {
      out[key] = sv
    }
  }
  return out
}

const messages = {
  es: deepMerge(esBase, esExtra),
  en: deepMerge(enBase, enExtra),
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale,
  fallbackLocale: 'es',
  messages,
})

export function setLocale(lang) {
  i18n.global.locale.value = lang
  localStorage.setItem('locale', lang)
}

export function getLocale() {
  return i18n.global.locale.value
}
