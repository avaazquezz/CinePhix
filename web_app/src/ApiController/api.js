import axios from 'axios'

const apiKey = import.meta.env.VITE_TMDB_API_KEY

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: apiKey,
    language: 'es-ES',
  },
})



export default api
