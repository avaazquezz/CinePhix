import api from '@/ApiController/api'
import { dedupeTmdbResultsById, filterTmdbBrowseResults } from '@/utils/tmdbBrowseFilters'

///////    SERIES      /////////

async function fetchFilteredTvList(endpoint) {
  const [r1, r2] = await Promise.all([
    api.get(endpoint, { params: { page: 1 } }),
    api.get(endpoint, { params: { page: 2 } }),
  ])
  const merged = dedupeTmdbResultsById([...r1.data.results, ...r2.data.results])
  return filterTmdbBrowseResults(merged).slice(0, 24)
}

// Series Populares
export const getPopularSeries = async () => {
  try {
    return await fetchFilteredTvList('/tv/popular')
  } catch (error) {
    console.error('Error al obtener series populares', error)
    throw error
  }
}

// Series Mejor Valoradas
export const getTopRatedSeries = async () => {
  try {
    return await fetchFilteredTvList('/tv/top_rated')
  } catch (error) {
    console.error('Error al obtener series mejor valoradas', error)
    throw error
  }
}

// Series en Tendencia
export const getTrendingSeries = async () => {
  try {
    return await fetchFilteredTvList('/trending/tv/week')
  } catch (error) {
    console.error('Error al obtener series en tendencia', error)
    throw error
  }
}

// Búsqueda de Series
export const searchSeries = async (query) => {
  try {
    const response = await api.get('/search/tv', {
      params: { query }
    })
    return filterTmdbBrowseResults(response.data.results, { minVoteCount: 28 })
  } catch (error) {
    console.error('Error en la búsqueda de series', error)
    throw error
  }
}

// Detalle de Serie por ID
export const getSeriesDetail = async (id) => {
  try {
    const response = await api.get(`/tv/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener los detalles de la serie con ID ${id}`, error);
    throw error;
  }
};

// Créditos de Serie por ID
export const getSeriesCredits = async (id) => {
  try {
    const response = await api.get(`/tv/${id}/credits`);
    return response.data.cast;
  } catch (error) {
    console.error(`Error al obtener los créditos de la serie con ID ${id}`, error);
    throw error;
  }
};

