<template>
  <div class="register-page">
    <div class="noise-overlay"></div>
    <div class="bg-glow bg-glow--tl"></div>
    <div class="bg-glow bg-glow--br"></div>

    <div class="auth-container">
      <!-- Brand -->
      <div class="auth-brand">
        <div class="brand-icon"><i class="fas fa-film"></i></div>
        <div class="brand-name"><span class="brand-accent">C</span>INEPHIX</div>
        <p class="brand-tagline">{{ $t('auth.login.tagline') }}</p>
      </div>

      <!-- Card -->
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">{{ $t('auth.register.title') }}</h1>
          <p class="auth-subtitle">{{ $t('auth.register.subtitle') }}</p>
        </div>

        <v-alert v-if="error" type="error" variant="tonal" class="mb-4" closable @click:close="clearError">
          {{ error }}
        </v-alert>

        <v-form ref="formRef" @submit.prevent="handleRegister" v-model="isFormValid">
          <v-text-field
            v-model="username"
            :label="$t('auth.register.username')"
            variant="outlined"
            :rules="[rules.required, rules.minLength(3), rules.username]"
            prepend-inner-icon="mdi-at"
            class="mb-2 auth-field"
            :hint="$t('auth.register.usernameHint')"
            persistent-hint
          />

          <v-text-field
            v-model="email"
            :label="$t('auth.register.email')"
            type="email"
            variant="outlined"
            :rules="[rules.required, rules.email]"
            prepend-inner-icon="mdi-email-outline"
            class="mb-2 auth-field"
          />

          <v-text-field
            v-model="password"
            :label="$t('auth.register.password')"
            :type="showPassword ? 'text' : 'password'"
            variant="outlined"
            :rules="[rules.required, rules.minLength(8), rules.passwordStrength]"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            class="mb-2 auth-field"
            :hint="$t('auth.register.passwordHint')"
            persistent-hint
          />

          <v-text-field
            v-model="confirmPassword"
            :label="$t('auth.register.confirmPassword')"
            :type="showPassword ? 'text' : 'password'"
            variant="outlined"
            :rules="[rules.required, rules.matchPassword]"
            prepend-inner-icon="mdi-lock-check-outline"
            class="mb-5 auth-field"
          />

          <button
            type="submit"
            class="submit-btn"
            :disabled="!isFormValid || isLoading"
          >
            <span v-if="!isLoading">{{ $t('auth.register.create') }}</span>
            <v-progress-circular v-else indeterminate size="20" width="2" color="white" />
          </button>
        </v-form>

        <p class="terms-text">{{ $t('auth.register.terms') }}</p>

        <div class="auth-divider"><span>{{ $t('auth.register.or') }}</span></div>

        <button class="google-btn" @click="handleGoogleRegister">
          <v-icon size="18" class="mr-2">mdi-google</v-icon>
          {{ $t('auth.register.google') }}
        </button>

        <div class="auth-footer">
          <span>{{ $t('auth.register.hasAccount') }}</span>
          <router-link to="/CinePhix/auth/login" class="auth-link">{{ $t('auth.register.signIn') }}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { t } = useI18n()

const formRef = ref(null)
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const isFormValid = ref(false)
const isLoading = ref(false)
const error = ref(null)

const rules = {
  required: (v) => !!v || t('auth.validation.required'),
  email: (v) => /.+@.+\..+/.test(v) || t('auth.validation.email'),
  minLength: (min) => (v) => (v && v.length >= min) || t('auth.validation.minChars', { min }),
  username: (v) => /^[a-zA-Z0-9_]+$/.test(v) || t('auth.validation.usernameCharset'),
  passwordStrength: (v) => /^(?=.*[A-Za-z])(?=.*\d)/.test(v) || t('auth.validation.passwordStrength'),
  matchPassword: (v) => v === password.value || t('auth.validation.passwordMatch'),
}

async function handleRegister() {
  if (!isFormValid.value) return
  isLoading.value = true
  error.value = null
  const result = await authStore.register(email.value, password.value, username.value)
  if (result.success) {
    router.push('/CinePhix/home')
  } else {
    error.value = result.error || authStore.error
  }
  isLoading.value = false
}

async function handleGoogleRegister() {
  error.value = t('auth.googleNotConfigured')
}

function clearError() {
  error.value = null
  authStore.clearError()
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #060606;
  padding: 24px 16px;
  position: relative;
  overflow: hidden;
}

.noise-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

.bg-glow {
  position: fixed;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}
.bg-glow--tl {
  top: -200px;
  left: -200px;
  background: radial-gradient(circle, rgba(229,9,20,0.14) 0%, transparent 65%);
}
.bg-glow--br {
  bottom: -200px;
  right: -200px;
  background: radial-gradient(circle, rgba(229,9,20,0.09) 0%, transparent 65%);
}

.auth-container {
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
}

/* Brand */
.auth-brand {
  text-align: center;
  margin-bottom: 24px;
}

.brand-icon {
  font-size: 2rem;
  color: var(--cp-red, #e50914);
  margin-bottom: 10px;
  filter: drop-shadow(0 0 16px rgba(229,9,20,0.5));
}

.brand-name {
  font-size: 1.7rem;
  font-weight: 900;
  letter-spacing: 6px;
  color: #fff;
  text-transform: uppercase;
  line-height: 1;
  margin-bottom: 6px;
}

.brand-accent { color: var(--cp-red, #e50914); }

.brand-tagline {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.35);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0;
}

/* Card */
.auth-card {
  background: rgba(14,14,14,0.96);
  border: 1px solid rgba(229,9,20,0.2);
  border-top: 2px solid var(--cp-red, #e50914);
  border-radius: 18px;
  padding: 32px 32px 28px;
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.03) inset,
    0 2px 40px rgba(0,0,0,0.7),
    0 0 60px rgba(229,9,20,0.06);
  backdrop-filter: blur(12px);
}

.auth-header {
  text-align: center;
  margin-bottom: 24px;
}

.auth-title {
  font-size: 1.65rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 6px;
  letter-spacing: -0.3px;
}

.auth-subtitle {
  color: rgba(255,255,255,0.45);
  font-size: 0.85rem;
  margin: 0;
}

/* Submit button */
.submit-btn {
  width: 100%;
  padding: 14px;
  background: var(--cp-red, #e50914);
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.5px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
}

.submit-btn:hover:not(:disabled) {
  background: #c4060f;
  box-shadow: 0 6px 24px rgba(229,9,20,0.35);
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* Terms */
.terms-text {
  text-align: center;
  color: rgba(255,255,255,0.3);
  font-size: 11px;
  margin: 14px 0 0;
  line-height: 1.5;
}

/* Divider */
.auth-divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: rgba(255,255,255,0.25);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.08);
}
.auth-divider span { padding: 0 14px; }

/* Google button */
.google-btn {
  width: 100%;
  padding: 13px;
  background: transparent;
  color: rgba(255,255,255,0.75);
  font-family: 'Inter', sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
}
.google-btn:hover {
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.25);
  color: #fff;
}

/* Footer */
.auth-footer {
  text-align: center;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.45);
}

.auth-link {
  color: var(--cp-red, #e50914);
  text-decoration: none;
  margin-left: 6px;
  font-weight: 700;
  transition: opacity 0.2s;
}
.auth-link:hover { opacity: 0.8; text-decoration: underline; }
</style>
