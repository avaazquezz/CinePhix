import axios from 'axios'
import { getLocale } from '@/i18n'

const apiKey = import.meta.env.VITE_TMDB_API_KEY

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: apiKey,
    language: getLocale() === 'es' ? 'es-ES' : 'en-US',
  },
})

// Update language on each request based on current locale
api.interceptors.request.use((config) => {
  const lang = getLocale() === 'es' ? 'es-ES' : 'en-US'
  config.params = {
    ...(config.params || {}),
    language: lang,
  }
  return config
})


export default api
