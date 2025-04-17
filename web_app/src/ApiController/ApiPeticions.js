import api from '@/ApiController/api'

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

// Tendencias Semanales
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



// Construir la URL de la imagen para los posters
export const getImageUrl = (path, size = 'w500') => {
  const validSizes = ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'];
  const baseUrl = 'https://image.tmdb.org/t/p/';

  if (!path) {
    console.error('El path de la imagen es inválido o está vacío');
    return null;
  }

  if (!validSizes.includes(size)) {
    console.error(`El tamaño de imagen "${size}" no es válido. Usa uno de los siguientes: ${validSizes.join(', ')}`);
    return null;
  }

  return `${baseUrl}${size}${path}`;
};
