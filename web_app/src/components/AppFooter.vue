<template>
  <footer class="app-footer">
    <!-- Main Footer Content -->
    <div class="footer-main">
      <div class="footer-container">
        <!-- Brand Section -->
        <div class="footer-section footer-brand">
          <div class="brand-logo">
            <i class="fas fa-film"></i>
            <span class="brand-name">CinePhix</span>
          </div>
          <p class="brand-tagline">{{ $t('footer.tagline') }}</p>
          
          <!-- Social Links in Brand -->
          <div class="social-links">
            <a
              v-for="icon in socialLinks"
              :key="icon.name"
              :href="icon.link"
              target="_blank"
              rel="noopener noreferrer"
              :title="icon.name"
              class="social-btn"
            >
              <i :class="icon.icon"></i>
            </a>
          </div>
        </div>

        <!-- Navigation Section -->
        <div class="footer-section footer-navigation">
          <h3 class="footer-heading">{{ $t('footer.quickLinks') }}</h3>
          <ul class="links-list">
            <li><router-link to="/CinePhix/home" class="footer-link">{{ $t('nav.home') }}</router-link></li>
            <li><router-link to="/CinePhix/movies" class="footer-link">{{ $t('nav.movies') }}</router-link></li>
            <li><router-link to="/CinePhix/series" class="footer-link">{{ $t('nav.series') }}</router-link></li>
            <li><router-link to="/CinePhix/actores" class="footer-link">{{ $t('nav.actors') }}</router-link></li>
          </ul>
        </div>

        <!-- About Section -->
        <div class="footer-section footer-about">
          <h3 class="footer-heading">{{ $t('nav.home') === 'Inicio' ? 'Acerca de' : 'About' }}</h3>
          <p class="about-text" v-html="$t('footer.projectDesc')"></p>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="footer-bottom">
      <div class="footer-bottom-content">
        <div class="copyright">
          © {{ new Date().getFullYear() }} CinePhix. {{ $t('footer.rights') }}.
        </div>
        <div class="developer-info" v-html="$t('footer.by')"></div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const socialLinks = [
  { name: 'GitHub', icon: 'fab fa-github', link: 'https://github.com/avaazquezz' },
  { name: 'LinkedIn', icon: 'fab fa-linkedin', link: 'https://www.linkedin.com/in/adrivaz/' },
];
</script>

<style scoped>
/* Mobile-first Footer */
.app-footer {
  background: linear-gradient(180deg, #1a0000 0%, #2a0000 50%, #3b0101 100%);
  color: white;
  font-family: 'Montserrat', sans-serif;
  position: relative;
}

.app-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #e50914 20%, #ff4c4c 50%, #e50914 80%, transparent);
  box-shadow: 0 0 30px rgba(229, 9, 20, 0.8), 0 0 60px rgba(229, 9, 20, 0.4);
}

/* Main Footer Content */
.footer-main {
  padding: 3rem 0 2rem;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
}

@media (min-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    padding: 0 2.5rem;
  }
  
  .footer-main {
    padding: 4rem 0 2.5rem;
  }
}

@media (min-width: 1024px) {
  .footer-container {
    grid-template-columns: 1.5fr 1fr 1.5fr;
    gap: 4rem;
    padding: 0 3.5rem;
  }
  
  .footer-main {
    padding: 5rem 0 3rem;
  }
}

/* Footer Sections */
.footer-section {
  display: flex;
  flex-direction: column;
}

/* Brand Section */
.footer-brand {
  gap: 1.25rem;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  font-size: 2rem;
  font-weight: 900;
  color: white;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  margin-bottom: 0.5rem;
}

.brand-logo i {
  color: #e50914;
  font-size: 2.2rem;
  filter: drop-shadow(0 0 15px rgba(229, 9, 20, 0.7));
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { filter: drop-shadow(0 0 15px rgba(229, 9, 20, 0.7)); }
  50% { filter: drop-shadow(0 0 25px rgba(229, 9, 20, 0.9)); }
}

.brand-name {
  background: linear-gradient(135deg, #ff4c4c 0%, #e50914 50%, #c50914 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Bebas Neue', sans-serif;
}

.brand-tagline {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.7;
  margin: 0 0 1.5rem 0;
  font-weight: 400;
}

@media (min-width: 1024px) {
  .brand-tagline {
    font-size: 1rem;
    max-width: 280px;
  }
}

/* Footer Headings */
.footer-heading {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 1.5rem;
  font-family: 'Bebas Neue', sans-serif;
  position: relative;
  padding-bottom: 0.75rem;
}

.footer-heading::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #e50914, #ff4c4c);
  border-radius: 2px;
}

/* Navigation Section */
.footer-navigation {
  gap: 0;
}

.links-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.footer-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  position: relative;
  padding-left: 0;
  font-weight: 500;
}

.footer-link::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: #e50914;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.footer-link:hover {
  color: #e50914;
  padding-left: 18px;
  transform: translateX(2px);
}

.footer-link:hover::before {
  opacity: 1;
  transform: translateX(0);
}

/* About Section */
.footer-about {
  gap: 0;
}

.about-text {
  font-size: 0.9rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.75);
  margin: 0;
  font-weight: 400;
}

@media (min-width: 1024px) {
  .about-text {
    font-size: 0.95rem;
  }
}

/* Social Links */
.social-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.social-btn {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(229, 9, 20, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 1.3rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.social-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(229, 9, 20, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.social-btn:hover {
  color: #e50914;
  border-color: #e50914;
  background: rgba(229, 9, 20, 0.08);
  box-shadow: 0 0 25px rgba(229, 9, 20, 0.5), 0 0 50px rgba(229, 9, 20, 0.3);
  transform: translateY(-4px) scale(1.05);
}

.social-btn:hover::before {
  transform: translate(-50%, -50%) scale(1);
}

/* Bottom Bar */
.footer-bottom {
  background: rgba(0, 0, 0, 0.4);
  padding: 1.75rem 1.5rem;
  border-top: 1px solid rgba(229, 9, 20, 0.3);
  backdrop-filter: blur(10px);
}

@media (min-width: 768px) {
  .footer-bottom {
    padding: 2rem 2.5rem;
  }
}

@media (min-width: 1024px) {
  .footer-bottom {
    padding: 2rem 3.5rem;
  }
}

.footer-bottom-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
}

@media (min-width: 768px) {
  .footer-bottom-content {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}

.copyright {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
  letter-spacing: 0.3px;
}

.developer-info {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.3px;
}

/* Link Styles in HTML content */
:deep(.tmdb-link) {
  color: #ff4c4c;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
  border-bottom: 1px solid transparent;
}

:deep(.tmdb-link:hover) {
  color: #e50914;
  border-bottom-color: #e50914;
}
</style>