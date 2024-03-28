


// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (email, pass) => {
    cy.visit('https://app2.abtasty.com/login')
    // cy.url().should('eq', "https://auth.abtasty.com/login")
    // connect@infiniti.stream , Qikmu6-xydfit-cirtow 
    cy.contains("E-mail").click()
    cy.wait(2000)
    cy.get("#email").clear().type(email)
    cy.get("#password").type(pass)

    cy.get("#signInButton").should('have.text', 'Sign in' ).click({force:true})
  })