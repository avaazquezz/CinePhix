
//POSTERS

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

