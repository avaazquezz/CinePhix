/**
 * useMetaTags — dynamic Open Graph + Twitter Card meta tags
 *
 * Uses injectHead() + head.push() so updates work from async callbacks (dialogs, onMounted).
 * useHead() alone only works during synchronous setup().
 */
import { injectHead } from '@unhead/vue'
import { getCurrentInstance, onBeforeUnmount } from 'vue'

const APP_NAME = 'CinePhix'
const BASE_URL = 'https://cinephix.com'
const DEFAULT_IMAGE = 'https://cinephix.com/og-default.jpg'

export function useMetaTags() {
  const head = injectHead()
  let activeEntry = null

  function pushHead(input) {
    try {
      activeEntry?.dispose()
    } catch {
      /* ignore */
    }
    activeEntry = null
    if (input && typeof input === 'object') {
      activeEntry = head.push(input)
    }
  }

  const vm = getCurrentInstance()
  if (vm) {
    onBeforeUnmount(() => {
      try {
        activeEntry?.dispose()
      } catch {
        /* ignore */
      }
      activeEntry = null
    })
  }

  function setMovieMeta({ title, year, rating, poster, overview, genres, tmdbId }) {
    const fullTitle = `${title}${year ? ` (${year})` : ''} — ${APP_NAME}`
    const description = overview
      ? overview.slice(0, 160)
      : `Discover ${title} on CinePhix — AI-powered movie database.`
    const pageUrl = tmdbId
      ? `${BASE_URL}/CinePhix/movies?open=${encodeURIComponent(String(tmdbId))}`
      : `${BASE_URL}/CinePhix/movies`

    pushHead({
      title: fullTitle,
      meta: [
        { name: 'description', content: description },
        { property: 'og:title', content: fullTitle },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'video.movie' },
        { property: 'og:url', content: pageUrl },
        { property: 'og:image', content: poster || DEFAULT_IMAGE },
        { property: 'og:site_name', content: APP_NAME },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: fullTitle },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: poster || DEFAULT_IMAGE },
      ],
      link: [{ rel: 'canonical', href: pageUrl }],
    })
  }

  function setSeriesMeta({ title, year, rating, poster, overview, genres, tmdbId }) {
    const fullTitle = `${title}${year ? ` (${year})` : ''} — ${APP_NAME}`
    const description = overview
      ? overview.slice(0, 160)
      : `Discover ${title} on CinePhix — AI-powered TV show database.`
    const pageUrl = tmdbId
      ? `${BASE_URL}/CinePhix/series?open=${encodeURIComponent(String(tmdbId))}`
      : `${BASE_URL}/CinePhix/series`

    pushHead({
      title: fullTitle,
      meta: [
        { name: 'description', content: description },
        { property: 'og:title', content: fullTitle },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'video.tv_show' },
        { property: 'og:url', content: pageUrl },
        { property: 'og:image', content: poster || DEFAULT_IMAGE },
        { property: 'og:site_name', content: APP_NAME },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: fullTitle },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: poster || DEFAULT_IMAGE },
      ],
      link: [{ rel: 'canonical', href: pageUrl }],
    })
  }

  function setListMeta({ name, owner, itemsCount, coverImage, description }) {
    const fullTitle = `${name} — ${APP_NAME}`
    const desc = description || `Check out ${name} on CinePhix — ${itemsCount} movies/shows curated by ${owner}.`

    pushHead({
      title: fullTitle,
      meta: [
        { name: 'description', content: desc.slice(0, 160) },
        { property: 'og:title', content: fullTitle },
        { property: 'og:description', content: desc.slice(0, 160) },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: coverImage || DEFAULT_IMAGE },
        { property: 'og:site_name', content: APP_NAME },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: fullTitle },
        { name: 'twitter:description', content: desc.slice(0, 160) },
        { name: 'twitter:image', content: coverImage || DEFAULT_IMAGE },
      ],
    })
  }

  function setReviewMeta(review) {
    const movieTitle = review.media?.title || review.tmdb_id || 'Unknown'
    const username = review.user?.username || 'User'
    const content = review.content
    const poster = review.media?.poster_path ? `https://image.tmdb.org/t/p/w342${review.media.poster_path}` : null
    const fullTitle = `${username}'s review of ${movieTitle} — ${APP_NAME}`
    const excerpt = content ? content.slice(0, 160) : `${username} reviewed ${movieTitle} on CinePhix.`

    pushHead({
      title: fullTitle,
      meta: [
        { name: 'description', content: excerpt },
        { property: 'og:title', content: fullTitle },
        { property: 'og:description', content: excerpt },
        { property: 'og:type', content: 'article' },
        { property: 'og:image', content: poster || DEFAULT_IMAGE },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: fullTitle },
        { name: 'twitter:description', content: excerpt },
      ],
    })
  }

  function setUserMeta({ username, displayName, bio, avatarUrl }) {
    const fullTitle = `${displayName || username} (@${username}) — ${APP_NAME}`
    const desc = bio || `${username}'s profile on CinePhix.`

    pushHead({
      title: fullTitle,
      meta: [
        { name: 'description', content: desc.slice(0, 160) },
        { property: 'og:title', content: fullTitle },
        { property: 'og:description', content: desc.slice(0, 160) },
        { property: 'og:type', content: 'profile' },
        { property: 'og:image', content: avatarUrl || DEFAULT_IMAGE },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: fullTitle },
        { name: 'twitter:description', content: desc.slice(0, 160) },
      ],
    })
  }

  function setPageMeta({ title, description, image }) {
    const fullTitle = title ? `${title} — ${APP_NAME}` : APP_NAME
    pushHead({
      title: fullTitle,
      meta: [
        { name: 'description', content: description || `${APP_NAME} — AI-powered movie & TV database.` },
        { property: 'og:title', content: fullTitle },
        { property: 'og:description', content: description || `${APP_NAME} — AI-powered movie & TV database.` },
        { property: 'og:image', content: image || DEFAULT_IMAGE },
        { property: 'og:site_name', content: APP_NAME },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: fullTitle },
      ],
    })
  }

  return { setMovieMeta, setSeriesMeta, setListMeta, setReviewMeta, setUserMeta, setPageMeta }
}
