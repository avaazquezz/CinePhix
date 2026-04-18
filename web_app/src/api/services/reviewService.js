/**
 * Reviews API service for CinePhix backend
 */

import api from '@/api/client'

// --- Reviews ---

export const createReview = async ({ tmdbId, mediaType, rating, content, isSpoiler }) => {
  const response = await api.post('/reviews', {
    tmdb_id: tmdbId,
    media_type: mediaType,
    rating,
    content,
    is_spoiler: isSpoiler,
  })
  return response.data
}

export const getReviewById = async (reviewId) => {
  const response = await api.get(`/reviews/${reviewId}`)
  return response.data
}

export const updateReview = async (reviewId, { rating, content, isSpoiler }) => {
  const data = {}
  if (rating !== undefined) data.rating = rating
  if (content !== undefined) data.content = content
  if (isSpoiler !== undefined) data.is_spoiler = isSpoiler
  const response = await api.put(`/reviews/${reviewId}`, data)
  return response.data
}

export const deleteReview = async (reviewId) => {
  await api.delete(`/reviews/${reviewId}`)
}

export const getReviewsForMedia = async ({ tmdbId, mediaType, sortBy = 'recent', page = 1, perPage = 20 }) => {
  const response = await api.get(`/reviews/media/${tmdbId}/${mediaType}`, {
    params: { sort_by: sortBy, page, per_page: perPage },
  })
  return response.data
}

export const getReviewsByUser = async ({ userId, page = 1, perPage = 20 }) => {
  const response = await api.get(`/reviews/user/${userId}`, {
    params: { page, per_page: perPage },
  })
  return response.data
}

export const voteReview = async (reviewId, voteType) => {
  const response = await api.post(`/reviews/${reviewId}/vote`, {
    vote_type: voteType,
  })
  return response.data
}

// --- Follows ---

export const followUser = async (userId) => {
  const response = await api.post(`/users/${userId}/follow`)
  return response.data
}

export const unfollowUser = async (userId) => {
  await api.delete(`/users/${userId}/follow`)
}

export const getFollowers = async ({ userId, page = 1, perPage = 20 }) => {
  const response = await api.get(`/users/${userId}/followers`, {
    params: { page, per_page: perPage },
  })
  return response.data
}

export const getFollowing = async ({ userId, page = 1, perPage = 20 }) => {
  const response = await api.get(`/users/${userId}/following`, {
    params: { page, per_page: perPage },
  })
  return response.data
}

export const getFollowStatus = async (userId) => {
  const response = await api.get(`/users/${userId}/follow-status`)
  return response.data
}

// --- Review Comments ---

export const getComments = async (reviewId, { page = 1, perPage = 20 } = {}) => {
  const response = await api.get(`/reviews/${reviewId}/comments`, {
    params: { page, per_page: perPage },
  })
  return response.data
}

export const addComment = async (reviewId, { content }) => {
  const response = await api.post(`/reviews/${reviewId}/comments`, { content })
  return response.data
}

export const deleteComment = async (commentId) => {
  await api.delete(`/reviews/comments/${commentId}`)
}

// --- User Stats ---

export const getUserStats = async (userId) => {
  const response = await api.get(`/users/${userId}/stats`)
  return response.data
}
