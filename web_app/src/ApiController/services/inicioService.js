import api from '@/ApiController/api'

/////  enpopiont para el inicio: contenido mixto en tendencia (pelis + series)  /////

export const getTrendingAllWeek = async () => {
  try {
    const response = await api.get('/trending/all/day');
    return response.data.results.filter(item =>
      item.media_type === 'movie' || item.media_type === 'tv'
    );
  } catch (error) {
    console.error('Error al obtener contenido mixto en tendencia', error);
    throw error;
  }
};