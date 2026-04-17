/**
 * E2E Tests for Authentication Flow
 * Tests login, register, protected routes and navigation guards
 *
 * Prefer native input selectors inside .auth-card — Vuetify internals
 * (.v-field__input) are not reliable across versions/builds in headless CI.
 */

describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/CinePhix/auth/login')
    cy.contains('Welcome Back', { timeout: 20000 }).should('be.visible')
    cy.get('.auth-card input[type="email"]', { timeout: 15000 }).should('exist')
    cy.get('.auth-card input[type="password"]', { timeout: 15000 }).should('exist')
  })

  describe('Login Page', () => {
    it('should display login form', () => {
      cy.contains('Welcome Back').should('be.visible')
      cy.contains('Sign in to your CinePhix account').should('be.visible')
      cy.get('.auth-card input').should('have.length', 2)
      cy.contains('Sign In').should('be.visible')
    })

    it('should validate email format', () => {
      cy.get('.auth-card input[type="email"]').type('invalid-email')
      cy.get('.auth-card input[type="password"]').type('password123')
      cy.get('button[type="submit"]').click({ force: true })
      cy.contains('Invalid email').should('be.visible')
    })

    it('should validate password minimum length', () => {
      cy.get('.auth-card input[type="email"]').type('test@example.com')
      cy.get('.auth-card input[type="password"]').type('short')
      cy.get('button[type="submit"]').click({ force: true })
      cy.contains('Minimum 8 characters').should('be.visible')
    })

    it('should show error for invalid credentials', () => {
      cy.get('.auth-card input[type="email"]').type('nonexistent@test.com')
      cy.get('.auth-card input[type="password"]').type('wrongpassword')
      cy.get('button[type="submit"]').click({ force: true })
      cy.url().should('include', '/auth/login')
      // auth store: response.data.detail || 'Login failed' — no backend / network → "Login failed"
      cy.contains(/Invalid email or password|Login failed/i, { timeout: 15000 }).should('be.visible')
    })

    it('should navigate to register page', () => {
      cy.contains("Don't have an account?").should('be.visible')
      cy.contains('Sign up').click()
      cy.url().should('include', '/auth/register')
    })
  })

  describe('Register Page', () => {
    beforeEach(() => {
      cy.clearLocalStorage()
      cy.visit('/CinePhix/auth/register')
      cy.contains('Create Account', { timeout: 20000 }).should('be.visible')
      cy.get('.auth-card input', { timeout: 15000 }).should('have.length.at.least', 4)
    })

    it('should display registration form', () => {
      cy.contains('Create Account').should('be.visible')
      cy.contains('Join CinePhix and start your movie journey').should('be.visible')
      cy.get('.auth-card input').should('have.length.at.least', 4)
    })

    it('should validate username format', () => {
      cy.get('.auth-card input').eq(0).type('invalid username!')
      cy.get('.auth-card input').eq(1).type('test@example.com')
      cy.get('.auth-card input').eq(2).type('password123')
      cy.get('.auth-card input').eq(3).type('password123')
      cy.get('button[type="submit"]').click({ force: true })
      cy.contains('Only letters, numbers and underscores').should('be.visible')
    })

    it('should validate password strength', () => {
      cy.get('.auth-card input').eq(0).type('testuser')
      cy.get('.auth-card input').eq(1).type('test@example.com')
      cy.get('.auth-card input').eq(2).type('weakpass')
      cy.get('.auth-card input').eq(3).type('weakpass')
      cy.get('button[type="submit"]').click({ force: true })
      cy.contains('Must contain letters and numbers').should('be.visible')
    })

    it('should validate password match', () => {
      cy.get('.auth-card input').eq(0).type('testuser')
      cy.get('.auth-card input').eq(1).type('test@example.com')
      cy.get('.auth-card input').eq(2).type('password123')
      cy.get('.auth-card input').eq(3).type('different456')
      cy.get('button[type="submit"]').click({ force: true })
      cy.contains('Passwords do not match').should('be.visible')
    })

    it('should navigate to login page', () => {
      cy.contains('Already have an account?').should('be.visible')

      cy.contains('Sign in').click()
      cy.url().should('include', '/auth/login')
    })
  })

  describe('Protected Routes', () => {
    it('should redirect to login when accessing profile without auth', () => {
      cy.visit('/CinePhix/profile')
      cy.url().should('include', '/auth/login')
    })
  })

  describe('Navigation Guards', () => {
    it('should not redirect authenticated user from login to home (if no token)', () => {
      cy.visit('/CinePhix/auth/login')
      cy.url().should('include', '/auth/login')
    })
  })
})

describe('Movie Card Interactions', () => {
  let skipMovieCardSuite = false

  before(function () {
    if (!Cypress.env('CI')) {
      return
    }
    return cy.task('isBackendReachable', Cypress.env('VITE_API_URL')).then((ok) => {
      if (!ok) {
        skipMovieCardSuite = true
        cy.log('Skipping Movie Card tests: backend not available in CI')
      }
    })
  })

  beforeEach(function () {
    if (skipMovieCardSuite) {
      this.skip()
    }
    cy.visit('/CinePhix/home')
    cy.get('.movie-card', { timeout: 15000 }).should('have.length.at.least', 1)
  })

  it('should show movie cards on home page', () => {
    cy.get('.movie-card').should('have.length.at.least', 1)
  })

  it('should show watchlist button on card hover', () => {
    cy.get('.movie-card').first().trigger('mouseenter')
    cy.get('.overlay-actions').should('be.visible')
  })
})
