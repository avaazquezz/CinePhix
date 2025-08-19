describe('Movie search flow', () => {
  it('searches and shows results', () => {
    cy.visit('/movies')
    cy.get('[data-cy="search-input"]').type('Matrix')
    cy.get('[data-cy="search-button"]').click()
    cy.get('[data-cy="search-results"] [data-cy="movie-card"]').should('exist')
  })
})
