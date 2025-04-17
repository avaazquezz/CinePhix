import api from '@/ApiController/api'

////    PELICULAS   //////

// Películas Populares
export const getPopularMovies = async () => {
  try {
    const response = await api.get('/movie/popular')
    return response.data.results
  } catch (error) {
    console.error('Error al obtener películas populares', error)
    throw error
  }
}

// Películas Mejor Valoradas (Top Rated)
export const getTopRatedMovies = async () => {
  try {
    const response = await api.get('/movie/top_rated')
    return response.data.results
  } catch (error) {
    console.error('Error al obtener películas mejor valoradas', error)
    throw error
  }
}

// Tendencias Semanales Pelisculas
export const getTrendingMovies = async () => {
  try {
    const response = await api.get('/trending/movie/week')
    return response.data.results
  } catch (error) {
    console.error('Error al obtener películas en tendencia', error)
    throw error
  }
}

//  Búsqueda de Películas
export const searchMovies = async (query) => {
  try {
    const response = await api.get('/search/movie', {
      params: {
        query
      }
    })
    return response.data.results
  } catch (error) {
    console.error('Error en la búsqueda de películas', error)
    throw error
  }
}

//  Detalle de Película por ID
export const getMovieDetail = async (id) => {
  try {
    const response = await api.get(`/movie/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error al obtener los detalles de la película con ID ${id}`, error)
    throw error
  }
}

//  Créditos de Película por ID
export const getMovieCredits = async (id) => {
  try {
    const response = await api.get(`/movie/${id}/credits`)
    return response.data.cast
  } catch (error) {
    console.error(`Error al obtener los créditos de la película con ID ${id}`, error)
    throw error
  }
}
