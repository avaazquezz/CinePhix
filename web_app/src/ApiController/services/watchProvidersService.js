import api from '@/ApiController/api';

export const getWatchProviders = async (mediaType, id) => {
  try {
    const response = await api.get(`/${mediaType}/${id}/watch/providers`);
    return response.data.results;
  } catch (error) {
    console.error('Error al obtener proveedores de visualización:', error);
    return null;
  }
};