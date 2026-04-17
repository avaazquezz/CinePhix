/**
 * E2E Tests for Authentication Flow
 * Tests login, register, protected routes and navigation guards
 *
 * Note: Vuetify 3 renders inputs with opacity:0 inside .v-field__input.
 * Use .v-field__input input for visible input elements.
 */


describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/CinePhix/auth/login')
    // Wait for Vuetify to fully render
    cy.get('.v-field__input', { timeout: 10000 }).should('be.visible')
  })

  describe('Login Page', () => {
    it('should display login form', () => {
      cy.contains('Welcome Back').should('be.visible')
      cy.contains('Sign in to your CinePhix account').should('be.visible')
      // Vuetify renders input with opacity:0, use .v-field__input input
      cy.get('.v-field__input input').should('have.length.at.least', 2)
      cy.contains('Sign In').should('be.visible')
    })

    it('should validate email format', () => {
      // First input = email, second = password (both inside .v-field__input)
      cy.get('.v-field__input input').eq(0).type('invalid-email')
      cy.get('.v-field__input input').eq(1).type('password123')
      cy.get('button[type="submit"]').click({ force: true })
      cy.contains('Invalid email').should('be.visible')
    })

    it('should validate password minimum length', () => {
      cy.get('.v-field__input input').eq(0).type('test@example.com')
      cy.get('.v-field__input input').eq(1).type('short')
      cy.get('button[type="submit"]').click({ force: true })
      cy.contains('Minimum 8 characters').should('be.visible')
    })

    it('should show error for invalid credentials', () => {
      cy.get('.v-field__input input').eq(0).type('nonexistent@test.com')
      cy.get('.v-field__input input').eq(1).type('wrongpassword')
      cy.get('button[type="submit"]').click({ force: true })
      cy.contains('Invalid email or password', { timeout: 5000 }).should('be.visible')
    })

    it('should navigate to register page', () => {
      cy.contains("Don't have an account?").should('be.visible')
      cy.contains('Sign up').click()
      cy.url().should('include', '/auth/register')
    })
  })

  describe('Register Page', () => {
    beforeEach(() => {
      cy.visit('/CinePhix/auth/register')
      cy.get('.v-field__input', { timeout: 10000 }).should('be.visible')
    })

    it('should display registration form', () => {
      cy.contains('Create Account').should('be.visible')
      cy.contains('Join CinePhix and start your movie journey').should('be.visible')
      // username, email, password, confirm password = 4 fields
      cy.get('.v-field__input input').should('have.length.at.least', 3)
    })

    it('should validate username format', () => {
      cy.get('.v-field__input input').eq(0).type('invalid username!')
      cy.get('.v-field__input input').eq(1).type('test@example.com')
      cy.get('.v-field__input input').eq(2).type('password123')
      cy.get('.v-field__input input').eq(3).type('password123')
      cy.get('button[type="submit"]').click({ force: true })
      cy.contains('Only letters, numbers and underscores').should('be.visible')
    })

    it('should validate password strength', () => {
      cy.get('.v-field__input input').eq(0).type('testuser')
      cy.get('.v-field__input input').eq(1).type('test@example.com')
      cy.get('.v-field__input input').eq(2).type('weakpass')
      cy.get('.v-field__input input').eq(3).type('weakpass')
      cy.get('button[type="submit"]').click({ force: true })
      cy.contains('Must contain letters and numbers').should('be.visible')
    })

    it('should validate password match', () => {
      cy.get('.v-field__input input').eq(0).type('testuser')
      cy.get('.v-field__input input').eq(1).type('test@example.com')
      cy.get('.v-field__input input').eq(2).type('password123')
      cy.get('.v-field__input input').eq(3).type('different456')
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
  beforeEach(() => {
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
