describe('Diagrams appearance', () => {
    it('checks if text is appropriately converted to diagrams', () => {
        // Visit the root of example
        cy.visit("/");

        // Check if diagram section is text or an image
        // It should contain a diagram rather text in it
        cy.get('div[class="wsd"]').then(els => {
            // Ensure that wsd div should have 1 child,
            // As that child would be generated image
            expect(els.length).to.be.equal(1);

            // Ensure that image has a source of WebSequenceDiagrams
            // Irrespective of the contents in it
            cy.get('div[class="wsd"]')
                .find('img')
                .should('have.attr', 'src')
                .should('include', 'https://www.websequencediagrams.com/cgi-bin/cdraw');
        });
    });
});