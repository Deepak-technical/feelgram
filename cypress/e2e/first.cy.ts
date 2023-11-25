describe('template spec', () => {
  it('renders the default elements on the screen', () => {
    cy.visit('http://localhost:5173/')

    cy.get('[data-testid="cypress-title"]').should('exist').should("have.text","Login in your Account")
    
  })
})