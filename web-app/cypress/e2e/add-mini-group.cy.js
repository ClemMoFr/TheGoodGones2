describe("template spec", () => {
  beforeEach(() => {
    cy.viewport(414, 896);
  });
  it("add jeune", () => {
    cy.visit("http://localhost:3000/membres/jeunes");
    cy.get("button").click();
    cy.get(".popupAddJeuneTop > label > input").type("Jean");
    cy.get(".popupAddJeune > button").click();
    cy.get("button").click();
    cy.get(".popupAddJeuneTop > label > input").type("Jeanne");
    cy.get(".popupAddJeune > button").click();
    cy.get("button").click();
    cy.get(".popupAddJeuneTop > label > input").type("Mickaël");
    cy.get(".popupAddJeune > button").click();
    cy.get("button").click();
    cy.get(".popupAddJeuneTop > label > input").type("Bobby");
    cy.get(".popupAddJeune > button").click();
    //
    cy.visit("http://localhost:3000/membres/Monos");
    cy.get("button").click();
    cy.get(".popupAddMonosTop > label > input").type("Raphaël");
    cy.get(".popupAddMonos > button").click();
    cy.get("button").click();
    cy.get(".popupAddMonosTop > label > input").type("Steve");
    cy.get(".popupAddMonos > button").click();
    cy.get("button").click();
    cy.get(".popupAddMonosTop > label > input").type("Sandra");
    cy.get(".popupAddMonos > button").click();
    cy.get("button").click();
    cy.get(".popupAddMonosTop > label > input").type("Barbara");
    cy.get(".popupAddMonos > button").click();
    //
    cy.visit("http://localhost:3000/membres/petits-groupes");
    cy.get(".btnAddGroup").click();
    cy.get("input").type("Groupe 1");
    cy.get(".popupAddPetitsGroupes > :nth-child(3) > :nth-child(1)").click();
    cy.get(
      '[style="overflow-y: scroll; width: 100%; height: 100%;"] > :nth-child(1)'
    ).click({ force: true });
    cy.get(
      '[style="overflow-y: scroll; width: 100%; height: 100%;"] > :nth-child(2)'
    ).click({ force: true });
    cy.get(".btnClosePopuplist").click({ force: true });
    cy.get(":nth-child(4) > :nth-child(1) > .multiSelectContainer").click();
    cy.get(
      '[style="overflow-y: scroll; width: 100%; height: 100%;"] > :nth-child(1)'
    ).click({ force: true });
    cy.get(
      '[style="overflow-y: scroll; width: 100%; height: 100%;"] > :nth-child(2)'
    ).click({ force: true });
    cy.get(".btnClosePopuplist").click({ force: true });
    cy.get(".btnAddPetitGroup").click();
    //
    cy.get(".btnAddGroup").click();
    cy.get("input").type("Groupe 2");
    cy.get(".popupAddPetitsGroupes > :nth-child(3) > :nth-child(1)").click();
    cy.get(
      '[style="overflow-y: scroll; width: 100%; height: 100%;"] > :nth-child(3)'
    ).click({ force: true });
    cy.get(
      '[style="overflow-y: scroll; width: 100%; height: 100%;"] > :nth-child(4)'
    ).click({ force: true });
    cy.get(".btnClosePopuplist").click({ force: true });
    cy.get(":nth-child(4) > :nth-child(1) > .multiSelectContainer").click();
    cy.get(
      '[style="overflow-y: scroll; width: 100%; height: 100%;"] > :nth-child(3)'
    ).click({ force: true });
    cy.get(
      '[style="overflow-y: scroll; width: 100%; height: 100%;"] > :nth-child(4)'
    ).click({ force: true });
    cy.get(".btnClosePopuplist").click({ force: true });
    cy.get(".btnAddPetitGroup").click();
  });
});
