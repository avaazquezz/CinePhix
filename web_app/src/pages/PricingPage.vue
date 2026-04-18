<template>
  <div class="pricing-page">
    <div class="pricing-container">
      <!-- Header -->
      <div class="pricing-header">
        <h1 class="pricing-title">
          <span class="accent">Unlock</span> CinePhix Pro
        </h1>
        <p class="pricing-subtitle">
          One-time payments. Lifetime access per plan. No subscriptions, no surprises.
        </p>

        <!-- Current Pro Status Banner -->
        <v-alert v-if="proStatus.pro" type="success" variant="tonal" class="mt-4 pro-banner">
          <strong>You're on {{ proStatus.plan | formatPlan }}!</strong>
          Access active until {{ formatDate(proStatus.expires_at) }}
        </v-alert>
      </div>

      <!-- Pricing Cards -->
      <div class="plans-grid">
        <!-- Monthly -->
        <div class="plan-card">
          <div class="plan-header">
            <h3 class="plan-name">Pro Monthly</h3>
            <div class="plan-price">
              <span class="currency">€</span>
              <span class="amount">4</span>
              <span class="period">.99</span>
            </div>
            <p class="plan-billing">billed monthly</p>
            <p class="plan-note">€4.99/month</p>
          </div>
          <ul class="plan-features">
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Full AI Concierge access</li>
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Semantic search</li>
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Smart collections</li>
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Review assistant</li>
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Activity feed</li>
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Unlimited lists</li>
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Priority support</li>
          </ul>
          <v-btn
            class="plan-btn"
            :color="isCurrentPlan('pro_monthly') ? 'success' : 'primary'"
            :variant="isCurrentPlan('pro_monthly') ? 'tonal' : 'flat'"
            :disabled="isCurrentPlan('pro_monthly') || loading === 'pro_monthly'"
            :loading="loading === 'pro_monthly'"
            @click="checkout('pro_monthly')"
          >
            {{ isCurrentPlan('pro_monthly') ? 'Current Plan' : 'Get Started' }}
          </v-btn>
        </div>

        <!-- Quarterly -->
        <div class="plan-card plan-card--featured">
          <div class="featured-badge">BEST VALUE</div>
          <div class="plan-header">
            <h3 class="plan-name">Pro Trimestre</h3>
            <div class="plan-price">
              <span class="currency">€</span>
              <span class="amount">12</span>
              <span class="period">.99</span>
            </div>
            <p class="plan-billing">billed every 3 months</p>
            <p class="plan-note">€4.33/month — save 13%</p>
          </div>
          <ul class="plan-features">
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Full AI Concierge access</li>
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Semantic search</li>
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Smart collections</li>
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Review assistant</li>
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Activity feed</li>
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Unlimited lists</li>
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Priority support</li>
          </ul>
          <v-btn
            class="plan-btn"
            :color="isCurrentPlan('pro_quarterly') ? 'success' : 'primary'"
            :variant="isCurrentPlan('pro_quarterly') ? 'tonal' : 'flat'"
            :disabled="isCurrentPlan('pro_quarterly') || loading === 'pro_quarterly'"
            :loading="loading === 'pro_quarterly'"
            @click="checkout('pro_quarterly')"
          >
            {{ isCurrentPlan('pro_quarterly') ? 'Current Plan' : 'Get Started' }}
          </v-btn>
        </div>

        <!-- 6 Months -->
        <div class="plan-card">
          <div class="plan-header">
            <h3 class="plan-name">Pro 6 Meses</h3>
            <div class="plan-price">
              <span class="currency">€</span>
              <span class="amount">22</span>
              <span class="period">.99</span>
            </div>
            <p class="plan-billing">billed every 6 months</p>
            <p class="plan-note">€3.83/month — save 23%</p>
          </div>
          <ul class="plan-features">
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Full AI Concierge access</li>
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Semantic search</li>
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Smart collections</li>
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Review assistant</li>
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Activity feed</li>
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Unlimited lists</li>
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Priority support</li>
          </ul>
          <v-btn
            class="plan-btn"
            :color="isCurrentPlan('pro_6months') ? 'success' : 'primary'"
            :variant="isCurrentPlan('pro_6months') ? 'tonal' : 'flat'"
            :disabled="isCurrentPlan('pro_6months') || loading === 'pro_6months'"
            :loading="loading === 'pro_6months'"
            @click="checkout('pro_6months')"
          >
            {{ isCurrentPlan('pro_6months') ? 'Current Plan' : 'Get Started' }}
          </v-btn>
        </div>

        <!-- Annual -->
        <div class="plan-card">
          <div class="plan-header">
            <h3 class="plan-name">Pro Anual</h3>
            <div class="plan-price">
              <span class="currency">€</span>
              <span class="amount">39</span>
              <span class="period">.99</span>
            </div>
            <p class="plan-billing">billed yearly</p>
            <p class="plan-note">€3.33/month — save 33%</p>
          </div>
          <ul class="plan-features">
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Full AI Concierge access</li>
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Semantic search</li>
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Smart collections</li>
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Review assistant</li>
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Activity feed</li>
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Unlimited lists</li>
            <li><v-icon size="16" color="#e50914">mdi-check</v-icon> Priority support</li>
          </ul>
          <v-btn
            class="plan-btn"
            :color="isCurrentPlan('pro_annual') ? 'success' : 'primary'"
            :variant="isCurrentPlan('pro_annual') ? 'tonal' : 'flat'"
            :disabled="isCurrentPlan('pro_annual') || loading === 'pro_annual'"
            :loading="loading === 'pro_annual'"
            @click="checkout('pro_annual')"
          >
            {{ isCurrentPlan('pro_annual') ? 'Current Plan' : 'Get Started' }}
          </v-btn>
        </div>
      </div>

      <!-- Error Alert -->
      <v-alert v-if="error" type="error" variant="tonal" class="mt-6" closable @click:close="error = null">
        {{ error }}
      </v-alert>

      <!-- Footer note -->
      <p class="pricing-footer">
        Secure payment via Stripe. All plans are one-time payments — no subscription, no auto-renewal.
      </p>
    </div>
  </div>
</template>

<script>
import { paymentService } from '@/api/services/paymentService'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'PricingPage',

  filters: {
    formatPlan(plan) {
      const labels = {
        pro_monthly: 'Pro Monthly',
        pro_quarterly: 'Pro Trimestre',
        pro_6months: 'Pro 6 Meses',
        pro_annual: 'Pro Anual',
      }
      return labels[plan] || plan
    },
  },

  data() {
    return {
      proStatus: {
        pro: false,
        plan: null,
        expires_at: null,
      },
      loading: null,
      error: null,
    }
  },

  computed: {
    authStore() {
      return useAuthStore()
    },
  },

  async mounted() {
    await this.fetchProStatus()
    await this.checkQueryParams()
  },

  methods: {
    async fetchProStatus() {
      try {
        this.proStatus = await paymentService.getProStatus()
      } catch (e) {
        // User not logged in or error — fine to ignore
        this.proStatus = { pro: false, plan: null, expires_at: null }
      }
    },

    async checkQueryParams() {
      const pro = this.$route.query.pro
      if (pro === 'success') {
        await this.fetchProStatus()
        await this.authStore.fetchUser()
      }
    },

    isCurrentPlan(plan) {
      return this.proStatus.pro && this.proStatus.plan === plan
    },

    formatDate(dateStr) {
      if (!dateStr) return ''
      return new Date(dateStr).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },

    async checkout(plan) {
      this.error = null
      this.loading = plan

      if (!this.authStore.getAccessToken()) {
        this.loading = null
        this.$router.push({
          path: '/CinePhix/auth/login',
          query: { redirect: this.$route.fullPath },
        })
        return
      }

      // Open synchronously (before await) so the browser does not block the new tab as a popup.
      // Do not use `noopener` here: Chromium then isolates the tab and the opener cannot set
      // `location` to the Stripe URL, leaving the tab stuck on `about:blank`.
      const checkoutTab = window.open('about:blank', '_blank')
      if (!checkoutTab) {
        this.error =
          'No se pudo abrir la ventana de pago. Permite ventanas emergentes para este sitio e inténtalo de nuevo.'
        this.loading = null
        return
      }

      try {
        const data = await paymentService.createCheckoutSession(plan)
        const checkoutUrl = data.checkout_url || data.checkoutUrl
        if (!checkoutUrl) {
          checkoutTab.close()
          this.error = 'No se recibió la URL de pago. Inténtalo de nuevo o contacta con soporte.'
          return
        }
        checkoutTab.location.assign(checkoutUrl)
      } catch (e) {
        checkoutTab.close()
        const status = e.response?.status
        if (status === 403) {
          this.error =
            e.response?.data?.detail === 'Account is disabled'
              ? 'Tu cuenta está desactivada. Contacta con soporte.'
              : 'Inicia sesión para continuar con el pago.'
          if (!this.authStore.getAccessToken()) {
            this.$router.push({
              path: '/CinePhix/auth/login',
              query: { redirect: this.$route.fullPath },
            })
          }
        } else {
          this.error = e.response?.data?.detail || 'Failed to start checkout. Please try again.'
        }
      } finally {
        this.loading = null
      }
    },
  },
}
</script>

<style scoped>
.pricing-page {
  min-height: 100vh;
  background: var(--cp-bg-base, #080808);
  padding: 64px 20px 80px;
}

.pricing-container {
  max-width: 1120px;
  margin: 0 auto;
}

/* ── Header ── */
.pricing-header {
  text-align: center;
  margin-bottom: 64px;
}

.pricing-title {
  font-family: 'Inter', sans-serif;
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 14px;
  letter-spacing: -0.5px;
  line-height: 1.15;
}

.pricing-title .accent {
  color: var(--cp-red, #e50914);
  text-shadow: 0 0 28px rgba(229, 9, 20, 0.4);
}

.pricing-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 1.05rem;
  color: var(--cp-text-muted, rgba(255,255,255,0.42));
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.6;
}

.pro-banner { max-width: 520px; margin: 24px auto 0; }

/* ── Grid ── */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  align-items: start;
}

@media (max-width: 960px) { .plans-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .plans-grid { grid-template-columns: 1fr; } }

/* ── Card ── */
.plan-card {
  background: var(--cp-bg-card, #121212);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: var(--cp-radius-lg, 16px);
  padding: 28px 22px 24px;
  position: relative;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
}

.plan-card:hover {
  border-color: rgba(229, 9, 20, 0.35);
  box-shadow: 0 8px 40px rgba(0,0,0,0.5);
  transform: translateY(-3px);
}

.plan-card--featured {
  border-color: rgba(229, 9, 20, 0.5);
  box-shadow: 0 0 0 1px rgba(229,9,20,0.15), 0 12px 48px rgba(0,0,0,0.5);
  background: linear-gradient(160deg, #1a1212 0%, var(--cp-bg-card, #121212) 60%);
}

.plan-card--featured:hover { transform: translateY(-4px); }

.featured-badge {
  position: absolute;
  top: -13px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--cp-red, #e50914);
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 0.68rem;
  font-weight: 800;
  padding: 4px 14px;
  border-radius: 20px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  white-space: nowrap;
}

/* ── Card Header ── */
.plan-header {
  text-align: center;
  margin-bottom: 22px;
  padding-bottom: 22px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}

.plan-name {
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--cp-text-muted, rgba(255,255,255,0.42));
  text-transform: uppercase;
  letter-spacing: 1.4px;
  margin: 0 0 14px;
}

.plan-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 1px;
  margin-bottom: 6px;
}

.currency {
  font-family: 'Inter', sans-serif;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--cp-text-secondary, rgba(255,255,255,0.70));
  margin-bottom: 4px;
}

.amount {
  font-family: 'Inter', sans-serif;
  font-size: 2.9rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
  letter-spacing: -1px;
}

.period {
  font-family: 'Inter', sans-serif;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--cp-text-secondary, rgba(255,255,255,0.70));
  margin-bottom: 4px;
}

.plan-billing {
  font-family: 'Inter', sans-serif;
  font-size: 0.78rem;
  color: var(--cp-text-disabled, rgba(255,255,255,0.25));
  margin: 0 0 5px;
}

.plan-note {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--cp-gold, #f5c518);
  margin: 0;
}

/* ── Features ── */
.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 26px;
}

.plan-features li {
  display: flex;
  align-items: center;
  gap: 9px;
  font-family: 'Inter', sans-serif;
  font-size: 0.82rem;
  color: var(--cp-text-secondary, rgba(255,255,255,0.70));
  margin-bottom: 9px;
  line-height: 1.4;
}

/* ── Button ── */
.plan-btn {
  width: 100%;
  font-family: 'Inter', sans-serif !important;
  font-weight: 700 !important;
  text-transform: none !important;
  letter-spacing: 0.3px !important;
  border-radius: var(--cp-radius-sm, 6px) !important;
  padding: 11px !important;
  font-size: 0.88rem !important;
}

/* ── Footer ── */
.pricing-footer {
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-size: 0.78rem;
  color: var(--cp-text-disabled, rgba(255,255,255,0.22));
  margin-top: 48px;
}
</style>
