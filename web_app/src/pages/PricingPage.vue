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
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Full AI Concierge access</li>
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Semantic search</li>
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Smart collections</li>
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Review assistant</li>
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Activity feed</li>
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Unlimited lists</li>
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Priority support</li>
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
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Full AI Concierge access</li>
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Semantic search</li>
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Smart collections</li>
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Review assistant</li>
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Activity feed</li>
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Unlimited lists</li>
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Priority support</li>
          </ul>
          <v-btn
            class="plan-btn"
            :color="isCurrentPlan('pro_quarterly') ? 'success' : 'accent'"
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
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Full AI Concierge access</li>
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Semantic search</li>
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Smart collections</li>
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Review assistant</li>
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Activity feed</li>
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Unlimited lists</li>
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Priority support</li>
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
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Full AI Concierge access</li>
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Semantic search</li>
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Smart collections</li>
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Review assistant</li>
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Activity feed</li>
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Unlimited lists</li>
            <li><v-icon size="16" color="#04ff24">mdi-check</v-icon> Priority support</li>
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
    this.checkQueryParams()
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

    checkQueryParams() {
      const pro = this.$route.query.pro
      if (pro === 'success') {
        // Refresh pro status and user data
        this.fetchProStatus()
        this.authStore.fetchUser()
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

      try {
        const { checkout_url } = await paymentService.createCheckoutSession(plan)
        window.location.href = checkout_url
      } catch (e) {
        this.error = e.response?.data?.detail || 'Failed to start checkout. Please try again.'
        this.loading = null
      }
    },
  },
}
</script>

<style scoped>
.pricing-page {
  min-height: 100vh;
  background: #0a0a0a;
  padding: 60px 20px;
}

.pricing-container {
  max-width: 1100px;
  margin: 0 auto;
}

.pricing-header {
  text-align: center;
  margin-bottom: 60px;
}

.pricing-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 3rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 16px;
}

.pricing-title .accent {
  color: #04ff24;
  text-shadow: 0 0 20px rgba(4, 255, 36, 0.4);
}

.pricing-subtitle {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.1rem;
  color: #888;
  max-width: 500px;
  margin: 0 auto;
}

.pro-banner {
  max-width: 500px;
  margin: 0 auto;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  align-items: start;
}

@media (max-width: 900px) {
  .plans-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .plans-grid {
    grid-template-columns: 1fr;
  }
}

.plan-card {
  background: #141414;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 28px 24px;
  position: relative;
  transition: border-color 0.2s;
}

.plan-card:hover {
  border-color: #04ff24;
}

.plan-card--featured {
  border-color: #04ff24;
  box-shadow: 0 0 30px rgba(4, 255, 36, 0.15);
}

.featured-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #04ff24;
  color: #000;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 20px;
  letter-spacing: 1px;
}

.plan-header {
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #222;
}

.plan-name {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 12px;
}

.plan-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
  margin-bottom: 4px;
}

.currency {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
}

.amount {
  font-family: 'Montserrat', sans-serif;
  font-size: 3rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}

.period {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
}

.plan-billing {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  color: #555;
  margin: 0 0 4px;
}

.plan-note {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.75rem;
  color: #04ff24;
  margin: 0;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 28px;
}

.plan-features li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.82rem;
  color: #ccc;
  margin-bottom: 10px;
}

.plan-btn {
  width: 100%;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  text-transform: none;
  letter-spacing: 0.5px;
  border-radius: 8px;
  padding: 12px !important;
}

.pricing-footer {
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  color: #444;
  margin-top: 40px;
}
</style>
