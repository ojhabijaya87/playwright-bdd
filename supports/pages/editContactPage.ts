import { Page, expect } from "@playwright/test";
import { BasePage } from "./basePage";


export class EditContactPage extends BasePage {
  private editButton = this.page.getByRole("button", { name: "Edit Contact" });
  private firstNameField = this.page.getByLabel("First Name:");
  private saveButton = this.page.getByRole("button", { name: "Submit" });
  private lastNameField = this.page.getByLabel("Last Name:");
  private returnToContactListButton = this.page.getByRole("button", {
    name: "Return to Contact List",
  });

  constructor(page: Page) {
    super(page);
  }

  async editContact(contact: { firstName: string; lastName: string }) {
    await this.click(this.editButton);
    await this.page.waitForURL("**/editContact");
    await this.fill(this.firstNameField, contact.firstName);
    await this.fill(this.lastNameField, contact.lastName);
    await this.click(this.saveButton);
  }
  async returnToContactListPage() {
    await this.click(this.returnToContactListButton);
  }
}
