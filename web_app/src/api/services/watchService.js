/**
 * Watch service — watched history + progress tracking
 */
import api from '@/api/client'

export function getWatched({ page = 1, per_page = 20, media_type = null, completed = null } = {}) {
  const params = { page, per_page }
  if (media_type) params.media_type = media_type
  if (completed !== null) params.completed = completed
  return api.get('/watched', { params })
}

export function markWatched({ tmdb_id, media_type, progress_seconds = 0, duration_seconds = null, completed = false }) {
  return api.post('/watched', {
    tmdb_id,
    media_type,
    progress_seconds,
    duration_seconds,
    completed,
  })
}

export function updateProgress(watchedId, { progress_seconds, duration_seconds, completed }) {
  return api.patch(`/watched/${watchedId}`, { progress_seconds, duration_seconds, completed })
}

export function deleteWatched(watchedId) {
  return api.delete(`/watched/${watchedId}`)
}

export function getProgress(tmdbId, mediaType) {
  return api.get(`/watched/progress/${tmdbId}`, { params: { media_type: mediaType } })
}