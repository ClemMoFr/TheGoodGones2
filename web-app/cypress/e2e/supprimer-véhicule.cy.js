describe("template spec", () => {
  beforeEach(() => {
    cy.viewport(414, 896);
  });
  it("add jeune", () => {
    cy.visit("http://localhost:3000/gestion/transport");
    cy.get("button").click();
    cy.get(":nth-child(1) > input").type("jean");
    cy.get(":nth-child(2) > input").type("3");
    cy.get("form > button").click();
    cy.get("button").click();
  });
});
