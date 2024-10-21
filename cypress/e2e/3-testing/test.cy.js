describe("Login Test", () => {
  it("should log in with valid credentials", () => {
    cy.visit("index.html");

    cy.get("#loginEmail").type("validemail@noroff.no");
    cy.get("#loginPassword").type("validpassword");

    cy.get("#loginForm").submit();

    cy.get('[data-auth="logout"]').should("be.visible");
  });
});

describe("Invalid Login Test", () => {
  it("should show error message for invalid credentials", () => {
    cy.visit("index.html");

    cy.get("#loginEmail").type("invalidemail@noroff.no");
    cy.get("#loginPassword").type("wrongpassword");

    cy.get("#loginForm").submit();

    cy.on("window:alert", (alertText) => {
      expect(alertText).to.equal(
        "Either your username was not found or your password is incorrect",
      );
    });
  });
});

describe("Logout Test", () => {
  it("should log out the user successfully", () => {
    cy.visit("index.html");

    cy.get('[data-auth="logout"]').click();

    cy.get('[data-auth="login"]').should("be.visible");
  });
});
