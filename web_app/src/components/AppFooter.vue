<template>
  <footer class="app-footer" role="contentinfo">
    <div class="footer-top-line" aria-hidden="true" />

    <div class="footer-body">
      <div class="footer-grid">
        <!-- Brand + newsletter -->
        <section class="footer-col footer-col--brand">
          <div class="brand-mark" aria-label="CinePhix">
            <span class="brand-mark__icon" aria-hidden="true">
              <i class="fas fa-film"></i>
            </span>
            <span class="brand-mark__text">CINE<span class="brand-mark__accent">PHIX</span></span>
          </div>
          <p class="brand-tagline">{{ $t('footer.tagline') }}</p>

          <form class="newsletter" @submit.prevent="onNewsletterSubmit">
            <p class="newsletter__title">{{ $t('footer.newsletterTitle') }}</p>
            <p class="newsletter__hint">{{ $t('footer.newsletterHint') }}</p>
            <div v-if="!newsletterSent" class="newsletter__row">
              <input
                v-model.trim="newsletterEmail"
                type="email"
                name="email"
                autocomplete="email"
                class="newsletter__input"
                :placeholder="$t('footer.newsletterPlaceholder')"
                :aria-label="$t('footer.newsletterPlaceholder')"
              />
              <button type="submit" class="newsletter__btn" :disabled="!newsletterEmail">
                {{ $t('footer.newsletterButton') }}
              </button>
            </div>
            <p v-else class="newsletter__thanks" role="status">{{ $t('footer.newsletterThanks') }}</p>
          </form>

          <div class="social-row">
            <a
              v-for="s in socialLinks"
              :key="s.name"
              :href="s.link"
              target="_blank"
              rel="noopener noreferrer"
              class="social-chip"
              :aria-label="s.ariaKey ? $t(s.ariaKey) : s.name"
            >
              <i :class="s.icon" aria-hidden="true" />
            </a>
          </div>
        </section>

        <!-- Explore -->
        <nav class="footer-col" :aria-label="$t('footer.exploreTitle')">
          <h3 class="footer-heading">{{ $t('footer.exploreTitle') }}</h3>
          <ul class="link-list">
            <li><router-link class="footer-link" to="/CinePhix/home">{{ $t('nav.home') }}</router-link></li>
            <li><router-link class="footer-link" to="/CinePhix/movies">{{ $t('nav.movies') }}</router-link></li>
            <li><router-link class="footer-link" to="/CinePhix/series">{{ $t('nav.series') }}</router-link></li>
            <li><router-link class="footer-link" to="/CinePhix/actores">{{ $t('nav.actors') }}</router-link></li>
            <li><router-link class="footer-link" to="/CinePhix/discover">{{ $t('footer.linkDiscover') }}</router-link></li>
            <li><router-link class="footer-link" to="/CinePhix/search-v2">{{ $t('footer.linkSearch') }}</router-link></li>
          </ul>
        </nav>

        <!-- Product -->
        <nav class="footer-col" :aria-label="$t('footer.productTitle')">
          <h3 class="footer-heading">{{ $t('footer.productTitle') }}</h3>
          <ul class="link-list">
            <li><router-link class="footer-link" to="/CinePhix/recommendations">{{ $t('footer.linkRecommendations') }}</router-link></li>
            <li><router-link class="footer-link" to="/CinePhix/watched">{{ $t('footer.linkWatched') }}</router-link></li>
            <li><router-link class="footer-link" to="/CinePhix/lists">{{ $t('footer.linkLists') }}</router-link></li>
            <li><router-link class="footer-link" to="/CinePhix/activity">{{ $t('footer.linkActivity') }}</router-link></li>
            <li><router-link class="footer-link" to="/CinePhix/ai">{{ $t('footer.linkAi') }}</router-link></li>
            <li><router-link class="footer-link" to="/CinePhix/pricing">{{ $t('footer.linkPricing') }}</router-link></li>
          </ul>
        </nav>

        <!-- Trust -->
        <section class="footer-col footer-col--trust">
          <h3 class="footer-heading">{{ $t('footer.trustTitle') }}</h3>
          <p class="trust-lead">{{ $t('footer.trustLead') }}</p>
          <p class="trust-body">{{ $t('footer.trustBody') }}</p>
          <p class="tmdb-line">{{ $t('footer.tmdbAttribution') }}</p>
          <a
            class="tmdb-link"
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
          >{{ $t('footer.tmdbLink') }}</a>
          <div class="trust-links">
            <a
              class="trust-inline-link"
              href="https://github.com/avaazquezz"
              target="_blank"
              rel="noopener noreferrer"
            >{{ $t('footer.linkGithub') }}</a>
            <span class="trust-dot" aria-hidden="true">·</span>
            <a
              class="trust-inline-link"
              href="https://www.linkedin.com/in/adrivaz/"
              target="_blank"
              rel="noopener noreferrer"
            >{{ $t('footer.linkLinkedin') }}</a>
          </div>
        </section>
      </div>
    </div>

    <div class="footer-bar">
      <div class="footer-bar-inner">
        <p class="footer-bar__left">
          {{ $t('footer.copyright', { year: currentYear }) }}
          <span class="footer-bar__sep">·</span>
          <span class="footer-bar__muted">{{ $t('footer.rightsReserved') }}</span>
        </p>
        <p class="footer-bar__right" v-html="$t('footer.creditsHtml')" />
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())

const newsletterEmail = ref('')
const newsletterSent = ref(false)

function onNewsletterSubmit() {
  if (!newsletterEmail.value) return
  newsletterSent.value = true
}

const socialLinks = [
  { name: 'GitHub', icon: 'fab fa-github', link: 'https://github.com/avaazquezz', ariaKey: 'footer.socialGithubAria' },
  { name: 'LinkedIn', icon: 'fab fa-linkedin', link: 'https://www.linkedin.com/in/adrivaz/', ariaKey: 'footer.socialLinkedinAria' },
]
</script>

<style scoped>
.app-footer {
  position: relative;
  font-family: 'Inter', 'Roboto', system-ui, sans-serif;
  color: rgba(255, 255, 255, 0.88);
  background: linear-gradient(180deg, #080808 0%, #050505 40%, #030303 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.footer-top-line {
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, rgba(229, 9, 20, 0.35) 20%, rgba(229, 9, 20, 0.85) 50%, rgba(229, 9, 20, 0.35) 80%, transparent 100%);
  opacity: 0.9;
}

.footer-body {
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 1.25rem 2.5rem;
}

.footer-grid {
  display: grid;
  gap: 2.5rem;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .footer-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2rem 2.5rem;
  }

  .footer-col--brand {
    grid-column: span 2;
  }
}

@media (min-width: 1024px) {
  .footer-body {
    padding: 3.5rem 2rem 3rem;
  }

  .footer-grid {
    grid-template-columns: minmax(220px, 1.15fr) repeat(2, minmax(0, 1fr)) minmax(220px, 1.1fr);
    gap: 2.5rem 2rem;
    align-items: start;
  }

  .footer-col--brand {
    grid-column: auto;
  }
}

.footer-col {
  min-width: 0;
}

.footer-heading {
  margin: 0 0 1rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
}

.link-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.footer-link {
  color: rgba(255, 255, 255, 0.78);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s ease, transform 0.2s ease;
  display: inline-flex;
  align-items: center;
  width: fit-content;
}

.footer-link:hover {
  color: #ff4c6d;
}

.footer-link.router-link-active {
  color: #e50914;
}

/* Brand */
.brand-mark {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 0.75rem;
}

.brand-mark__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 10px;
  background: rgba(229, 9, 20, 0.12);
  border: 1px solid rgba(229, 9, 20, 0.35);
  color: #e50914;
  font-size: 1.15rem;
}

.brand-mark__text {
  font-family: 'Bebas Neue', 'Inter', sans-serif;
  font-size: 1.65rem;
  letter-spacing: 0.12em;
  font-weight: 400;
  color: #fff;
}

.brand-mark__accent {
  color: #e50914;
  text-shadow: 0 0 24px rgba(229, 9, 20, 0.35);
}

.brand-tagline {
  margin: 0 0 1.25rem;
  font-size: 0.9rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.55);
  max-width: 22rem;
}

/* Newsletter */
.newsletter {
  margin-bottom: 1.25rem;
}

.newsletter__title {
  margin: 0 0 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.newsletter__hint {
  margin: 0 0 0.65rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
}

.newsletter__row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.newsletter__input {
  flex: 1 1 160px;
  min-width: 0;
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.newsletter__input::placeholder {
  color: rgba(255, 255, 255, 0.35);
}

.newsletter__input:focus {
  border-color: rgba(229, 9, 20, 0.55);
  box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.12);
}

.newsletter__btn {
  padding: 0.55rem 1rem;
  border-radius: 8px;
  border: none;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  color: #0a0a0a;
  background: linear-gradient(135deg, #ff5a5a 0%, #e50914 100%);
  transition: filter 0.2s ease, transform 0.15s ease;
  white-space: nowrap;
}

.newsletter__btn:hover:not(:disabled) {
  filter: brightness(1.08);
}

.newsletter__btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.newsletter__thanks {
  margin: 0;
  font-size: 0.85rem;
  color: #7dffb2;
  font-weight: 500;
}

.social-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.social-chip {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.social-chip:hover {
  color: #fff;
  border-color: rgba(229, 9, 20, 0.5);
  background: rgba(229, 9, 20, 0.1);
}

/* Trust */
.trust-lead {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.45;
}

.trust-body {
  margin: 0 0 0.85rem;
  font-size: 0.82rem;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.52);
}

.tmdb-line {
  margin: 0 0 0.35rem;
  font-size: 0.72rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.42);
}

.tmdb-link {
  display: inline-block;
  margin-bottom: 0.85rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #ff6b6b;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.tmdb-link:hover {
  color: #ff9a9a;
  border-bottom-color: rgba(255, 154, 154, 0.5);
}

.trust-links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
}

.trust-dot {
  color: rgba(255, 255, 255, 0.25);
}

.trust-inline-link {
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.trust-inline-link:hover {
  color: rgba(255, 255, 255, 0.9);
}

/* Bottom bar */
.footer-bar {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(12px);
}

.footer-bar-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

@media (min-width: 768px) {
  .footer-bar-inner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem 1.15rem;
  }
}

@media (max-width: 767px) {
  .footer-bar-inner {
    padding-bottom: calc(1rem + 56px);
  }
}

.footer-bar__left {
  margin: 0;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.45);
}

.footer-bar__sep {
  margin: 0 0.35rem;
  opacity: 0.5;
}

.footer-bar__muted {
  color: rgba(255, 255, 255, 0.35);
}

.footer-bar__right {
  margin: 0;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.5);
}

:deep(.footer-bar__right a) {
  color: #c4b5fd;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

:deep(.footer-bar__right a:hover) {
  color: #e9d5ff;
}
</style>
