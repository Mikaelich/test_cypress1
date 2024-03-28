describe('ABTasty', () => {
    function switchLoginData(email, pass){
        if(email !== ""){
            cy.get("#email").clear().type(email)
        }
        if(pass !== ""){
            cy.get("#password").clear().type(pass)
        }
    cy.get("#signInButton").should('have.text', 'Sign in' ).click({force:true})
    }
    class UserCredentials {
        constructor(username, password) {
            this.username = username;
            this.password = password;
        }
    }
    class TestUserData {
        constructor() {
            this.validUsername = 'connect@infiniti.stream';
            this.validPassword = 'Qikmu6-xydfit-cirtow';
            this.invalidUsername = 'c@infiniti.stream';
            this.invalidPassword = '123123123';
        }
    }
    
    it.skip('Test1. Valid login data', () => {
        // cy.clearCookies()
        // cy.viewport(1920, 1080)
        cy.visit('https://app2.abtasty.com/login')
        cy.url().should('eq', "https://auth.abtasty.com/login")
        cy.contains("E-mail").click()
        cy.wait(2000)
        cy.get("#email").clear().type("connect@infiniti.stream")
        cy.get("#password").type("Qikmu6-xydfit-cirtow")

        cy.get("#signInButton").should('have.text', 'Sign in' ).click({force:true})
        cy.wait(10000)
        cy.url().should('eq', "https://app2.abtasty.com/dashboard")
    })
    it.skip('Test2. Invalid login data', () => {
        const testUserData = new TestUserData();

        cy.login(testUserData.invalidUsername,testUserData.invalidPassword) // invalid + invalid
        cy.get("#loginErrorMessage").should('contain', 'Please enter a valid email or password') // error assertion
        switchLoginData(testUserData.invalidUsername, "") // invalid login + empty
        cy.get("#loginErrorMessage").should('contain', 'Please enter a valid email or password')
        switchLoginData("", testUserData.invalidPassword ) // empty + invalid pass
        cy.get("#loginErrorMessage").should('contain', 'Please enter a valid email or password')
        switchLoginData(testUserData.validUsername,testUserData.invalidPassword) // valid login + invalid pass
        cy.get("#loginErrorMessage").should('contain', 'Please enter a valid email or password')
        switchLoginData(testUserData.invalidUsername,testUserData.validPassword) // invalid login + valid pass
        cy.get("#loginErrorMessage").should('contain', 'Please enter a valid email or password')
        switchLoginData("","") // empty + empty
        cy.get("#loginErrorMessage").should('contain', 'Please enter a valid email or password')
    })
    it.skip('Test3. An eye/strikethrough eye button allow to show/hide the password input ', () => {
        const testUserData = new TestUserData();
        cy.login(" ", testUserData.validPassword)
        cy.get('#password').should('have.attr', 'type', 'password'); // the pass is closed
        cy.get("div._inputContainer_1i9ec_22._default_1i9ec_54 > label > svg").click() // "eye" btn in pass field
        cy.get('#password').should('have.attr', 'type', 'text'); // the pass is open
        switchLoginData("", testUserData.invalidPassword)
        cy.get('#password').should('have.attr', 'type', 'text'); // the pass is open
        cy.get("div._inputContainer_1i9ec_22._default_1i9ec_54 > label > svg").click() // "eye" btn in pass field
        cy.get('#password').should('have.attr', 'type', 'password'); // the pass is closed
    })
    it.skip('Test4. If forgotten a link is present to reset it and send an email with reset link', () => {
        cy.login(" ", " ")
        cy.get("a[href='/reset-password']").should('contain', 'Forgot your password?').click().then(($link) => {
            const resetLink = $link.attr('href');
        cy.url().should('eq', "https://auth.abtasty.com/reset-password")
        cy.get("#email").should('have.attr', "required")
        cy.get("button[type='submit']").should("have.text", 'Send the password reset link').click()
        cy.get("a[href='/login']").should('contain', 'Return to login').click()
        cy.url().should('eq', "https://auth.abtasty.com/login")
        cy.visit(`https://auth.abtasty.com/${resetLink}`)
        let email = "cypress-cypress@email.com"
        cy.wait(5000)
        cy.get("#email").type(email) // invalid email
        cy.get("button[type='submit']").should("have.text", 'Send the password reset link').click()
        cy.get("body").should('contain', 'Sent!')
        const parts = email.split('@');
        const username = parts[0];
        const domain = parts[1];

        const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 1);
        const domainExtension = domain.slice(domain.lastIndexOf('.'));
        const maskedDomain = domain.charAt(0) + '*'.repeat(domain.length - domainExtension.length - 1) + domainExtension;
        const maskedEmail = maskedUsername + '@' + maskedDomain;
        cy.log(maskedEmail)
        cy.get(".sc-dLMFU").should('contain', `We've sent an email to ${maskedEmail}`)
        })
    })
    it.skip("Test5. After 3 wrong attempts the Captcha is triggered ; FAILED!!! captcha doesn't work", () => {
        const testUserData = new TestUserData();
        cy.login(testUserData.validUsername, testUserData.invalidPassword)
        cy.get("#loginErrorMessage").should('contain', 'Please enter a valid email or password')
        let i = 1
        while (i < 4) {
            switchLoginData("", testUserData.invalidPassword + i.toString())
        
            cy.get("#loginErrorMessage").should('contain', 'Please enter a valid email or password')
        
            i++
        }
    })
    it.skip("Can’t log in with wrong/failed Captcha ;", () => {
        // captcha doesn't work
    })
    it.skip("Test6. The page is responsive and adapts to screen size. Below 1024px width, the login form is full screen", () => {
       cy.login(" ", " ")
       // default viewport 1000x660 (<1024)
       cy.viewport(1920, 1080)
       cy.get("#layout-right-column-body").should("be.visible") // ABTasty blue right column (when viewport > 1024)
       cy.viewport(1024, 660)
       cy.get("#layout-right-column-body").should("not.be.visible") 
       cy.viewport(1025, 660)
       cy.get("#layout-right-column-body").should("be.visible") 
    })
    it("Test7.  If the email is identified as a Single Sign-On the user is invited to use the SSO login link below ;", () => {
        const testUserData = new TestUserData();
        cy.login(" ", " ")
        cy.get("div > section > button").should('have.text', 'Sign in with SSO').click()
        cy.url().should('contain', "https://auth.abtasty.com/ssologin")
        cy.get("header > h1").should('have.text', 'Sign in with SSO')
        cy.get("#email").type(testUserData.invalidPassword)
        cy.get("button[type='submit']").should('contain', 'Sign in').click()
        cy.get("[data-testid='emailErrorMessage']").should('be.visible').should('have.text', 'Please enter a valid email')

        cy.get("a[href='/login']").should('contain', 'Go back to Login page').click()
        cy.url().should('contain', "https://auth.abtasty.com/login")
    })

})