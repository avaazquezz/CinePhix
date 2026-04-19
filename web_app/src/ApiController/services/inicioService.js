import api from '@/ApiController/api'
import { dedupeTmdbResultsById, filterTmdbBrowseResults } from '@/utils/tmdbBrowseFilters'

/////  enpopiont para el inicio: contenido mixto en tendencia (pelis + series)  /////

export const getTrendingAllDay = async () => {
  try {
    const [r1, r2] = await Promise.all([
      api.get('/trending/all/day', { params: { page: 1 } }),
      api.get('/trending/all/day', { params: { page: 2 } }),
    ])
    const merged = dedupeTmdbResultsById([...r1.data.results, ...r2.data.results])
    return filterTmdbBrowseResults(
      merged.filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
    ).slice(0, 24)
  } catch (error) {
    console.error('Error al obtener contenido mixto en tendencia', error)
    throw error
  }
}

/** Películas + series en tendencia semanal (TMDB week window). */
export const getTrendingAllWeek = async () => {
  try {
    const [r1, r2] = await Promise.all([
      api.get('/trending/all/week', { params: { page: 1 } }),
      api.get('/trending/all/week', { params: { page: 2 } }),
    ])
    const merged = dedupeTmdbResultsById([...r1.data.results, ...r2.data.results])
    return filterTmdbBrowseResults(
      merged.filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
    ).slice(0, 24)
  } catch (error) {
    console.error('Error al obtener contenido mixto en tendencia semanal', error)
    throw error
  }
}