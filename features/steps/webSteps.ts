import { expect } from "@playwright/test";
import { When, Then, sharedUser } from "./hooks";

When(
  /^the user clicks on the "Sign Up" button from the login page$/,
  async ({ loginPage }) => {
    await loginPage.signUp();
  }
);

When(
  /^the user fills in the registration form with valid details$/,
  async ({ registerPage, user }) => {
    console.log(user.email);
    console.log(user.password);
    await registerPage.registerUser(user);
  }
);

Then(
  /^the user should be redirected to the "Add User" page$/,
  async ({ loginPage, page }) => {
    await page.waitForLoadState();
    await expect(page.url()).toContain("/addUser");
  }
);
When(/^the user logout from the application$/, async ({ contactListPage }) => {
  await contactListPage.logOut();
});

When(/^the user login to the application$/, async ({ loginPage }) => {
  await loginPage.logIn(sharedUser.email, sharedUser.password);
});

Then(
  /^the user should be redirected to the "Contact List" page$/,
  async ({ page }) => {
    await page.waitForURL("**/contactList");
    await expect(page.url()).toContain("/contactList");
  }
);
When(
  /^the user clicks on "Add New Contact"$/,
  async ({ contactListPage, user }) => {
    await contactListPage.addNewContact();
  }
);

When(
  /^the user fills in the contact form with valid details$/,
  async ({ addContactPage, newContact }) => {
    await addContactPage.fillContactForm(newContact);
  }
);

Then(
  /^the new contact should be added to the contact list$/,
  async ({ contactListPage, newContact }) => {
    expect(await contactListPage.addedContact()).toContain(
      newContact.firstName
    );
    expect(await contactListPage.addedContact()).toContain(newContact.lastName);
  }
);

When(
  /^the user selects a contact by name$/,
  async ({ contactListPage, newContact }) => {
    await contactListPage.clickContactByName(
      newContact.firstName + " " + newContact.lastName
    );
  }
);

When(
  /^the user updates the contact’s details$/,
  async ({ editContactPage, updatedContact }) => {
    await editContactPage.editContact(updatedContact);
  }
);

When(
  /^the user navigates back to the contact list$/,
  async ({ editContactPage }) => {
    await editContactPage.returnToContactListPage();
  }
);

Then(
  /^the updated contact details should be visible in the contact list$/,
  async ({ contactListPage, updatedContact }) => {
    expect(await contactListPage.addedContact()).toContain(
      updatedContact.firstName
    );
    expect(await contactListPage.addedContact()).toContain(
      updatedContact.lastName
    );
  }
);
