<template>
  <div class="login-page">
    <div class="auth-container">
      <div class="auth-card">
        <!-- Header -->
        <div class="auth-header">
          <h1 class="auth-title">Welcome Back</h1>
          <p class="auth-subtitle">Sign in to your CinePhix account</p>
        </div>

        <!-- Error Alert -->
        <v-alert v-if="error" type="error" variant="tonal" class="mb-4" closable @click:close="clearError">
          {{ error }}
        </v-alert>

        <!-- Login Form -->
        <v-form ref="formRef" @submit.prevent="handleLogin" v-model="isFormValid">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            variant="outlined"
            :rules="[rules.required, rules.email]"
            prepend-inner-icon="mdi-email-outline"
            class="mb-2"
          />

          <v-text-field
            v-model="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            variant="outlined"
            :rules="[rules.required, rules.minLength]"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            class="mb-4"
          />

          <v-btn
            type="submit"
            color="primary"
            size="large"
            block
            :loading="isLoading"
            :disabled="!isFormValid"
          >
            Sign In
          </v-btn>
        </v-form>

        <!-- Divider -->
        <div class="auth-divider">
          <span>or</span>
        </div>

        <!-- Google OAuth -->
        <v-btn
          variant="outlined"
          size="large"
          block
          class="google-btn mb-4"
          @click="handleGoogleLogin"
        >
          <v-icon start>mdi-google</v-icon>
          Continue with Google
        </v-btn>

        <!-- Register Link -->
        <div class="auth-footer">
          <span class="text-muted">Don't have an account?</span>
          <router-link to="/CinePhix/auth/register" class="auth-link">Sign up</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Form state
const formRef = ref(null)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isFormValid = ref(false)

// Reactive auth store state
const isLoading = ref(false)
const error = ref(null)

// Form rules
const rules = {
  required: (v) => !!v || 'This field is required',
  email: (v) => /.+@.+\..+/.test(v) || 'Invalid email',
  minLength: (v) => (v && v.length >= 8) || 'Minimum 8 characters',
}

// Login handler
async function handleLogin() {
  if (!isFormValid.value) return

  isLoading.value = true
  error.value = null

  const success = await authStore.login(email.value, password.value)

  if (success) {
    // Redirect to original destination or home
    const redirect = route.query.redirect || '/CinePhix/home'
    router.push(redirect)
  } else {
    error.value = authStore.error
  }

  isLoading.value = false
}

// Google login handler
async function handleGoogleLogin() {
  // TODO: Implement Google OAuth flow
  error.value = 'Google OAuth not configured. Please use email/password.'
}

// Clear error
function clearError() {
  error.value = null
  authStore.clearError()
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0a0a 0%, #141414 100%);
  padding: 20px;
}

.auth-container {
  width: 100%;
  max-width: 420px;
}

.auth-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 40px;
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-title {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.auth-subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.auth-divider {
  display: flex;
  align-items: center;
  margin: 24px 0;
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.auth-divider span {
  padding: 0 16px;
}

.google-btn {
  border-color: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.google-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.auth-footer {
  text-align: center;
  margin-top: 24px;
  color: rgba(255, 255, 255, 0.6);
}

.auth-link {
  color: #04ff24;
  text-decoration: none;
  margin-left: 8px;
  font-weight: 600;
}

.auth-link:hover {
  text-decoration: underline;
}

.text-muted {
  color: rgba(255, 255, 255, 0.5);
}
</style>