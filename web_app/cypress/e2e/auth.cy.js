/**
 * E2E Tests for Authentication Flow
 * Tests login, register, protected routes and navigation guards
 */

describe('Authentication Flow', () => {
  beforeEach(() => {
    // Clear local storage and visit login page
    cy.clearLocalStorage()
    cy.visit('/CinePhix/auth/login')
  })

  describe('Login Page', () => {
    it('should display login form', () => {
      cy.contains('Welcome Back').should('be.visible')
      cy.contains('Sign in to your CinePhix account').should('be.visible')
      // Vuetify text fields render as divs with input inside
      cy.get('input[type="email"]').should('be.visible')
      cy.get('input[type="password"]').should('be.visible')
      cy.contains('Sign In').should('be.visible')
    })

    it('should validate email format', () => {
      cy.get('input[type="email"]').type('invalid-email')
      cy.get('input[type="password"]').type('password123')
      cy.get('button[type="submit"]').click()
      cy.contains('Invalid email').should('be.visible')
    })

    it('should validate password minimum length', () => {
      cy.get('input[type="email"]').type('test@example.com')
      cy.get('input[type="password"]').type('short')
      cy.get('button[type="submit"]').click()
      cy.contains('Minimum 8 characters').should('be.visible')
    })

    it('should show error for invalid credentials', () => {
      cy.get('input[type="email"]').type('nonexistent@test.com')
      cy.get('input[type="password"]').type('wrongpassword')
      cy.get('button[type="submit"]').click()
      // Wait for error message
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
    })

    it('should display registration form', () => {
      cy.contains('Create Account').should('be.visible')
      cy.contains('Join CinePhix and start your movie journey').should('be.visible')
      cy.get('input[placeholder*="Username"]').should('be.visible')
      cy.get('input[type="email"]').should('be.visible')
      cy.get('input[type="password"]').first().should('be.visible')
    })

    it('should validate username format', () => {
      cy.get('input[placeholder*="Username"]').type('invalid username!')
      cy.get('input[type="email"]').type('test@example.com')
      cy.get('input[type="password"]').first().type('password123')
      cy.get('input[placeholder*="Confirm"]').type('password123')
      cy.get('button[type="submit"]').click()
      cy.contains('Only letters, numbers and underscores').should('be.visible')
    })

    it('should validate password strength', () => {
      cy.get('input[placeholder*="Username"]').type('testuser')
      cy.get('input[type="email"]').type('test@example.com')
      cy.get('input[type="password"]').first().type('weakpass')
      cy.get('input[placeholder*="Confirm"]').type('weakpass')
      cy.get('button[type="submit"]').click()
      cy.contains('Must contain letters and numbers').should('be.visible')
    })

    it('should validate password match', () => {
      cy.get('input[placeholder*="Username"]').type('testuser')
      cy.get('input[type="email"]').type('test@example.com')
      cy.get('input[type="password"]').first().type('password123')
      cy.get('input[placeholder*="Confirm"]').type('different456')
      cy.get('button[type="submit"]').click()
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
      // Should redirect to login
      cy.url().should('include', '/auth/login')
    })
  })

  describe('Navigation Guards', () => {
    it('should not redirect authenticated user from login to home (if no token)', () => {
      // Without a valid token, should stay on login
      cy.visit('/CinePhix/auth/login')
      cy.url().should('include', '/auth/login')
    })
  })
})

describe('Movie Card Interactions', () => {
  beforeEach(() => {
    cy.visit('/CinePhix/home')
    // Wait for page to load
    cy.contains('Trending', { timeout: 10000 }).should('be.visible')
  })

  it('should show movie cards on home page', () => {
    cy.get('.movie-card').should('have.length.at.least', 1)
  })

  it('should show watchlist button on card hover', () => {
    cy.get('.movie-card').first().trigger('mouseenter')
    cy.get('.overlay-actions').should('be.visible')
  })
})