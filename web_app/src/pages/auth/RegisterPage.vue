<template>
  <div class="register-page">
    <div class="auth-container">
      <div class="auth-card">
        <!-- Header -->
        <div class="auth-header">
          <h1 class="auth-title">Create Account</h1>
          <p class="auth-subtitle">Join CinePhix and start your movie journey</p>
        </div>

        <!-- Error Alert -->
        <v-alert v-if="error" type="error" variant="tonal" class="mb-4" closable @click:close="clearError">
          {{ error }}
        </v-alert>

        <!-- Register Form -->
        <v-form ref="formRef" @submit.prevent="handleRegister" v-model="isFormValid">
          <v-text-field
            v-model="username"
            label="Username"
            variant="outlined"
            :rules="[rules.required, rules.minLength(3), rules.username]"
            prepend-inner-icon="mdi-at"
            class="mb-2"
            hint="3-50 characters, letters, numbers and underscores only"
            persistent-hint
          />

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
            :rules="[rules.required, rules.minLength(8), rules.passwordStrength]"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            class="mb-4"
            hint="Minimum 8 characters with letters and numbers"
            persistent-hint
          />

          <v-text-field
            v-model="confirmPassword"
            label="Confirm Password"
            :type="showPassword ? 'text' : 'password'"
            variant="outlined"
            :rules="[rules.required, rules.matchPassword]"
            prepend-inner-icon="mdi-lock-check-outline"
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
            Create Account
          </v-btn>
        </v-form>

        <!-- Terms -->
        <p class="terms-text">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>

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
          @click="handleGoogleRegister"
        >
          <v-icon start>mdi-google</v-icon>
          Sign up with Google
        </v-btn>

        <!-- Login Link -->
        <div class="auth-footer">
          <span class="text-muted">Already have an account?</span>
          <router-link to="/CinePhix/auth/login" class="auth-link">Sign in</router-link>
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
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const isFormValid = ref(false)

// Reactive auth store state
const isLoading = ref(false)
const error = ref(null)

// Form rules
const rules = {
  required: (v) => !!v || 'This field is required',
  email: (v) => /.+@.+\..+/.test(v) || 'Invalid email',
  minLength: (min) => (v) => (v && v.length >= min) || `Minimum ${min} characters`,
  username: (v) => /^[a-zA-Z0-9_]+$/.test(v) || 'Only letters, numbers and underscores',
  passwordStrength: (v) =>
    /^(?=.*[A-Za-z])(?=.*\d)/.test(v) || 'Must contain letters and numbers',
  matchPassword: (v) =>
    v === password.value || 'Passwords do not match',
}

// Register handler
async function handleRegister() {
  if (!isFormValid.value) return

  isLoading.value = true
  error.value = null

  const result = await authStore.register(email.value, password.value, username.value)

  if (result.success) {
    // Redirect to home
    router.push('/CinePhix/home')
  } else {
    error.value = result.error || authStore.error
  }

  isLoading.value = false
}

// Google register handler
async function handleGoogleRegister() {
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
.register-page {
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

.terms-text {
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
  margin-top: 16px;
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