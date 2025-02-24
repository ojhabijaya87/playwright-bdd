import { Page } from "@playwright/test";
import { BasePage } from "./basePage";


export class AddContactPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  private firstNameField = this.page.locator("#firstName");
  private lastNameField = this.page.locator("#lastName");
  private submitButton = this.page.getByRole("button", { name: "Submit" });

  async fillContactForm(contact: {
    firstName: string;
    lastName: string;
  }): Promise<void> {
    await this.fill(this.firstNameField, contact.firstName);
    await this.fill(this.lastNameField, contact.lastName);
    await this.click(this.submitButton);
  }
}
