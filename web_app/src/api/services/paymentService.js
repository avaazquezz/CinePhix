/**
 * Payment Service — Stripe checkout for CinePhix Pro plans
 */
import { apiClient } from './client'

const BASE = '/payments'

export const paymentService = {
  /**
   * Check current Pro subscription status.
   * @returns {Promise<{pro: boolean, plan: string|null, expires_at: string|null}>}
   */
  async getProStatus() {
    const response = await apiClient.get(`${BASE}/pro-status`)
    return response.data
  },

  /**
   * Create a Stripe Checkout session for a one-time Pro plan purchase.
   * Returns the Stripe checkout URL — redirect the browser there.
   * @param {string} plan - pro_monthly | pro_quarterly | pro_6months | pro_annual
   * @returns {Promise<{checkout_url: string, session_id: string}>}
   */
  async createCheckoutSession(plan) {
    const response = await apiClient.post(`${BASE}/create-checkout-session?plan=${encodeURIComponent(plan)}`)
    return response.data
  },
}
