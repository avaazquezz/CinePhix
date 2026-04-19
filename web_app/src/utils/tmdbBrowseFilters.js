/**
 * Filtros para listados TMDB (popular / trending / top_rated):
 * - Descarta títulos casi sin votos o sin nota (evita “huecos” sin estrellas en UI).
 * - Endurece requisitos para idioma chino (zh): suele colarse mucho contenido local muy minoritario.
 */

const MIN_VOTE_COUNT = 42
/** Contenido con idioma original chino: exigir más consenso internacional. */
const MIN_VOTE_COUNT_ZH = 220
const MIN_VOTE_AVERAGE_ZH = 6.0
const STRICT_ORIGINAL_LANGS = new Set(['zh'])

/**
 * @param {Array<Record<string, unknown>>} items
 * @param {{ minVoteCount?: number }} [opts]
 * @returns {Array<Record<string, unknown>>}
 */
export function filterTmdbBrowseResults(items, opts = {}) {
  const minVotes = opts.minVoteCount ?? MIN_VOTE_COUNT
  if (!Array.isArray(items)) return []

  return items.filter((item) => {
    const vc = Number(item.vote_count ?? 0)
    const va = Number(item.vote_average ?? 0)
    if (vc < minVotes || va <= 0) return false

    const lang = String(item.original_language || '')
      .toLowerCase()
      .split('-')[0]
    if (STRICT_ORIGINAL_LANGS.has(lang)) {
      if (vc < MIN_VOTE_COUNT_ZH || va < MIN_VOTE_AVERAGE_ZH) return false
    }
    return true
  })
}

export function dedupeTmdbResultsById(items) {
  if (!Array.isArray(items)) return []
  const seen = new Set()
  return items.filter((item) => {
    const id = item.id
    if (id == null || seen.has(id)) return false
    seen.add(id)
    return true
  })
}
