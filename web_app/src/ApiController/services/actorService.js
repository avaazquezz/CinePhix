import api from '@/ApiController/api'



/////////////    ACTORES    //////////////


// Buscar actores
export const searchActors = async (query) => {
  try {
    const response = await api.get('/search/person', {
      params: { query }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error en la búsqueda de actores', error);
    throw error;
  }
};


// Pelis y series en las que ha trabajado un actor
export const getActorCredits = async (personId) => {
  try {
    const response = await api.get(`/person/${personId}/combined_credits`);
    return response.data.cast;
  } catch (error) {
    console.error(`Error al obtener créditos del actor con ID ${personId}`, error);
    throw error;
  }
};

