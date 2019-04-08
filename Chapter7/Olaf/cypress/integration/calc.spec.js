describe("Author", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3030/calc.html");
  });

  it("0 = 0", () => {
    cy.get("#btn-result")
      .click()
      .get("#result")
      .contains("0");
  });

  it(" 3 + 4 + 3 = 10", () => {
    cy.get("#number-input")
      .type(3)
      .get("#btn-add")
      .click()
      .get("#number-input")
      .type(4)
      .get("#btn-add")
      .click()
      .get("#number-input")
      .type(3)
      .get("#btn-result")
      .click()
      .get("#result")
      .contains("10");
  });
});
