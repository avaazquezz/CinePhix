/**
 * useNotificationsSocket
 * Connects to /ws/notifications with the JWT access token.
 * Listens for real-time push events and updates an `unreadCount` ref.
 */

import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace('http://', 'ws://').replace('https://', 'wss://')

export function useNotificationsSocket(onNotification) {
  const authStore = useAuthStore()
  const unreadCount = ref(0)
  let ws = null
  let reconnectTimer = null
  let destroyed = false

  const connect = () => {
    const token = authStore.accessToken
    if (!token) return

    try {
      ws = new WebSocket(`${API_URL}/ws/notifications?token=${token}`)

      ws.onopen = () => {
        console.log('[WS] Notifications connected')
        if (reconnectTimer) {
          clearTimeout(reconnectTimer)
          reconnectTimer = null
        }
      }

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data)
          if (msg.type === 'notification' && msg.data) {
            unreadCount.value++
            if (onNotification) onNotification(msg.data)
          }
        } catch (e) {
          console.error('[WS] Failed to parse message', e)
        }
      }

      ws.onclose = (event) => {
        console.log('[WS] Notifications disconnected', event.code)
        if (!destroyed) {
          // Auto-reconnect after 3 seconds
          reconnectTimer = setTimeout(connect, 3000)
        }
      }

      ws.onerror = (error) => {
        console.error('[WS] Notifications error', error)
      }
    } catch (e) {
      console.error('[WS] Failed to connect', e)
    }
  }

  const disconnect = () => {
    destroyed = true
    if (reconnectTimer) clearTimeout(reconnectTimer)
    if (ws) {
      ws.close()
      ws = null
    }
  }

  const decrementUnread = () => {
    unreadCount.value = Math.max(0, unreadCount.value - 1)
  }

  return { unreadCount, connect, disconnect, decrementUnread }
}

export default { useNotificationsSocket }
