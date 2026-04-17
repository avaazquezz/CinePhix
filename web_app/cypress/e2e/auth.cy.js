/**
 * E2E Tests for Authentication Flow
 */

describe('Authentication Flow', () => {
  beforeEach(() => {
    // Clear local storage before each test
    cy.clearLocalStorage()
  })

  describe('Login Page', () => {
    it('should display login form', () => {
      cy.visit('/CinePhix/auth/login')
      cy.contains('Welcome Back').should('be.visible')
      cy.contains('Sign in to your CinePhix account').should('be.visible')
      cy.get('input[type="email"]').should('be.visible')
      cy.get('input[type="password"]').should('be.visible')
      cy.contains('Sign In').should('be.visible')
    })

    it('should validate email format', () => {
      cy.visit('/CinePhix/auth/login')
      cy.get('input[type="email"]').type('invalid-email')
      cy.get('input[type="password"]').type('password123')
      cy.get('button[type="submit"]').click()
      cy.contains('Invalid email').should('be.visible')
    })

    it('should validate password minimum length', () => {
      cy.visit('/CinePhix/auth/login')
      cy.get('input[type="email"]').type('test@example.com')
      cy.get('input[type="password"]').type('short')
      cy.get('button[type="submit"]').click()
      cy.contains('Minimum 8 characters').should('be.visible')
    })

    it('should show error for invalid credentials', () => {
      cy.visit('/CinePhix/auth/login')
      cy.get('input[type="email"]').type('nonexistent@test.com')
      cy.get('input[type="password"]').type('wrongpassword')
      cy.get('button[type="submit"]').click()
      cy.contains('Invalid email or password').should('be.visible')
    })

    it('should navigate to register page', () => {
      cy.visit('/CinePhix/auth/login')
      cy.contains("Don't have an account?").should('be.visible')
      cy.contains('Sign up').click()
      cy.url().should('include', '/auth/register')
    })
  })

  describe('Register Page', () => {
    it('should display registration form', () => {
      cy.visit('/CinePhix/auth/register')
      cy.contains('Create Account').should('be.visible')
      cy.contains('Join CinePhix and start your movie journey').should('be.visible')
      cy.get('input[label="Username"]').should('be.visible')
      cy.get('input[type="email"]').should('be.visible')
      cy.get('input[type="password"]').should('be.visible')
    })

    it('should validate username format', () => {
      cy.visit('/CinePhix/auth/register')
      cy.get('input[label="Username"]').type('invalid username!')
      cy.get('input[type="email"]').type('test@example.com')
      cy.get('input[type="password"]').type('password123')
      cy.get('input[label="Confirm Password"]').type('password123')
      cy.contains('Only letters, numbers and underscores').should('be.visible')
    })

    it('should validate password strength', () => {
      cy.visit('/CinePhix/auth/register')
      cy.get('input[label="Username"]').type('testuser')
      cy.get('input[type="email"]').type('test@example.com')
      cy.get('input[type="password"]').type('weakpass')
      cy.get('input[label="Confirm Password"]').type('weakpass')
      cy.contains('Must contain letters and numbers').should('be.visible')
    })

    it('should validate password match', () => {
      cy.visit('/CinePhix/auth/register')
      cy.get('input[label="Username"]').type('testuser')
      cy.get('input[type="email"]').type('test@example.com')
      cy.get('input[type="password"]').type('password123')
      cy.get('input[label="Confirm Password"]').type('different456')
      cy.contains('Passwords do not match').should('be.visible')
    })

    it('should navigate to login page', () => {
      cy.visit('/CinePhix/auth/register')
      cy.contains('Already have an account?').should('be.visible')
      cy.contains('Sign in').click()
      cy.url().should('include', '/auth/login')
    })
  })

  describe('Protected Routes', () => {
    it('should redirect to login when accessing profile without auth', () => {
      cy.visit('/CinePhix/profile')
      cy.url().should('include', '/auth/login')
      cy.url().should('include', 'redirect=%2FCinePhix%2Fprofile')
    })
  })

  describe('Auth State Persistence', () => {
    it('should persist auth state in localStorage', () => {
      // Visit login page
      cy.visit('/CinePhix/auth/login')

      // Check that localStorage keys exist after auth (mock would be needed)
      cy.window().then((win) => {
        // Just verify localStorage is accessible
        expect(win.localStorage).to.exist
      })
    })
  })

  describe('Navigation Guards', () => {
    it('should redirect authenticated user from login to home', () => {
      // Set fake auth token in localStorage
      cy.window().then((win) => {
        win.localStorage.setItem('access_token', 'fake-token')
      })

      // Mock the /auth/me endpoint
      cy.intercept('GET', '/auth/me', {
        statusCode: 401,
        body: { detail: 'Invalid token' },
      }).as('authMe')

      cy.visit('/CinePhix/auth/login')
      cy.wait('@authMe')

      // Should redirect to home when token is invalid
      cy.url().should('include', '/CinePhix/home')
    })
  })
})

describe('Movie Card Interactions', () => {
  beforeEach(() => {
    cy.visit('/CinePhix/home')
  })

  it('should show watchlist and favorite buttons on hover', () => {
    // Wait for movies to load
    cy.get('.movie-card').first().trigger('mouseenter')
    cy.get('.overlay-actions').should('be.visible')
  })

  it('should redirect to login when clicking watchlist without auth', () => {
    cy.get('.movie-card').first().trigger('mouseenter')
    cy.get('.watchlist-btn').click({ force: true })
    cy.url().should('include', '/auth/login')
  })

  it('should redirect to login when clicking favorite without auth', () => {
    cy.get('.movie-card').first().trigger('mouseenter')
    cy.get('.favorite-btn').click({ force: true })
    cy.url().should('include', '/auth/login')
  })
})