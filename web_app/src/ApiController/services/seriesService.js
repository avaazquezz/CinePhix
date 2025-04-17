import api from '@/ApiController/api'


///////    SERIES      /////////

// Series Populares
export const getPopularSeries = async () => {
  try {
    const response = await api.get('/tv/popular');
    return response.data.results;
  } catch (error) {
    console.error('Error al obtener series populares', error);
    throw error;
  }
};

// Series Mejor Valoradas
export const getTopRatedSeries = async () => {
  try {
    const response = await api.get('/tv/top_rated');
    return response.data.results;
  } catch (error) {
    console.error('Error al obtener series mejor valoradas', error);
    throw error;
  }
};

// Series en Tendencia
export const getTrendingSeries = async () => {
  try {
    const response = await api.get('/trending/tv/week');
    return response.data.results;
  } catch (error) {
    console.error('Error al obtener series en tendencia', error);
    throw error;
  }
};

// Búsqueda de Series
export const searchSeries = async (query) => {
  try {
    const response = await api.get('/search/tv', {
      params: { query }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error en la búsqueda de series', error);
    throw error;
  }
};

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

