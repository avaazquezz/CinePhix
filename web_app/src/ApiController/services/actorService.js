import api from '@/ApiController/api'



/////////////    ACTORES    //////////////


// Buscar actores (descarta perfiles casi sin actividad / sin foto)
export const searchActors = async (query) => {
  try {
    const response = await api.get('/search/person', {
      params: { query }
    });
    return response.data.results.filter((p) => {
      const pop = Number(p.popularity ?? 0);
      if (pop < 3.5) return false;
      if (!p.profile_path) return false;
      return true;
    });
  } catch (error) {
    console.error('Error en la búsqueda de actores', error);
    throw error;
  }
};


// Actores populares del momento (tendencia TMDB; puede incluir rostros emergentes)
export const getPopularActors = async () => {
  try {
    const response = await api.get('/person/popular');
    return response.data.results;
  } catch (error) {
    console.error('Error al obtener actores populares', error);
    throw error;
  }
};

/**
 * Diez actores de reconocimiento global (IDs TMDB estables).
 * Orden fijo: leyendas y superestrellas, no la lista “popular” del día.
 */
const SPOTLIGHT_ACTOR_IDS = [
  31, // Tom Hanks
  6193, // Leonardo DiCaprio
  5064, // Meryl Streep
  287, // Brad Pitt
  5292, // Denzel Washington
  1245, // Scarlett Johansson
  192, // Morgan Freeman
  3223, // Robert Downey Jr.
  2231, // Samuel L. Jackson
  382, // Cate Blanchett
];

export const getSpotlightActors = async () => {
  try {
    const settled = await Promise.allSettled(
      SPOTLIGHT_ACTOR_IDS.map((id) => api.get(`/person/${id}`))
    );
    const out = [];
    for (let i = 0; i < settled.length; i++) {
      const r = settled[i];
      if (r.status !== 'fulfilled') continue;
      const p = r.value.data;
      out.push({
        id: p.id,
        name: p.name,
        profile_path: p.profile_path,
        known_for_department: p.known_for_department || 'Acting',
        popularity: p.popularity,
      });
    }
    return out;
  } catch (error) {
    console.error('Error al obtener actores destacados', error);
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

