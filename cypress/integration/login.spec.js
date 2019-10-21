/// <reference types="Cypress" />

context('Login', () => {
    describe('When I login', () => {
        before('Login to page', () => {
            cy.viewport(600, 300)
            cy.login('wim.barelds@gmail.com', 'BestPassword ever');
        })

        it('I should have an auth cookie', () => {
            cy.getCookie('auth').should('exist');
        })
    })
})
