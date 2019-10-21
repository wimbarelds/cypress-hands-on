/// <reference types="Cypress" />

context('hello-world', () => {
    describe('When the backend is down and I open application', () => {
        before('Visit page and mock offline-backend', () => {
            cy.server();
            cy.route({
                method: 'POST',
                url: '/',
                status: 400,
                response: '',
                
            }).as('getFolder');
            cy.visit('http://localhost:8040/');
            cy.wait('@getFolder');
        });

        it('The page should display errors', () => {
            cy.get('.directorybrowser .error').should('have.text', 'Something went wrong fetching data from the server');
            cy.get('.filebrowser .error').should('have.text', 'Something went wrong fetching data from the server');
        });
    });
    describe('When I visit the homepage', () => {
        before('Visit the page', () => {
            cy.visit('http://localhost:8040/');
        });
    
        it('Page has a heading', () => {
            cy.get('h1').should('contain', 'vue-file-browser');
        });
    
        it('There are no active menu items', () => {
            cy.get('.directorybrowser .directory.active').should('not.exist')
        });

        describe('When I click on the src directory', () => {
            before('Click on src directory', () => {
                cy.contains('.directorybrowser .directory', 'src').click()
            });

            it('src directory becomes active', () => {
                cy.contains('.directorybrowser .directory', 'src').should('have.class', 'active');
            });

            it('Filebrowser contains a title, frontend and backend folder', () => {
                cy.get('.filebrowser').within(() => {
                    cy.contains('h2', 'src').should('exist');
                    cy.get('.file').should('have.length', 2);
                    cy.contains('.file', 'frontend')
                        .find('.file-icon')
                        .should('have.class', 'folder');

                    cy.contains('.file', 'backend')
                        .find('.file-icon')
                        .should('have.class', 'folder');
                });
            });

            it('File detail panel should not be visible', () => {
                cy.get('.filedetail').should('not.exist');
            });

            describe('When I double-click the frontend folder in the filebrowser', () => {
                before('Double click the frontend folder', () => {
                    cy.contains('.file', 'frontend').should('exist').dblclick();
                });

                it('There should be four files', () => {
                    cy.get('.file').should('have.length', 4);
                });

                describe("When I click a .vue file", () => {
                    before('Click App.vue', () => {
                        cy.contains('.file-name', 'App.vue').click();
                    });

                    it('I should see file-details without a preview', () => {
                        cy.get('.filedetail').within(() => {
                            cy.contains('h2', 'App.vue');
                            cy.get('.preview').should('not.exist');
                            cy.contains('.actions a', 'Download')
                                .should('have.attr', 'download', '')
                                .should('have.attr', 'href', '/src/frontend/App.vue');
                            
                            cy.contains('.details li label', 'Modified')
                                .parent()
                                .should('contain', '18-10-2019');
                        });
                    });
                });
            });
        });
    
    
        // it('Ugly mess', () => {
    
    
        // });
    })

});
