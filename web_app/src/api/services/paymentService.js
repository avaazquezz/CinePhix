/**
 * Payment Service — Stripe checkout for CinePhix Pro plans
 */
import api from '@/api/client'

const BASE = '/payments'

export const paymentService = {
  /**
   * Check current Pro subscription status.
   * @returns {Promise<{pro: boolean, plan: string|null, expires_at: string|null}>}
   */
  async getProStatus() {
    const response = await api.get(`${BASE}/pro-status`)
    return response.data
  },

  /**
   * Create a Stripe Checkout session for a one-time Pro plan purchase.
   * Returns the Stripe checkout URL — redirect the browser there.
   * Requires a logged-in user: `api` request interceptor adds `Authorization: Bearer`
   * only when `localStorage.access_token` is set (see `@/api/client.js`).
   * @param {string} plan - pro_monthly | pro_quarterly | pro_6months | pro_annual
   * @returns {Promise<{checkout_url: string, session_id: string}>}
   */
  async createCheckoutSession(plan) {
    const response = await api.post(`${BASE}/create-checkout-session?plan=${encodeURIComponent(plan)}`)
    return response.data
  },
}
