import { Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class ContactListPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  private addNewContactButton = this.page.getByRole("button", {
    name: "Add a New Contact",
  });
  private contactList = this.page.locator("#myTable");
  private logOutButton = this.page.getByRole("button", { name: "Logout" });
  
  
  async addNewContact() {
    await this.click(this.addNewContactButton);
  }
  async logOut() {
    await this.click(this.logOutButton);
  }
  async addedContact() {
    await this.page.waitForURL("**/contactList");
    return await this.contactList.innerText();
  }
  async clickContactByName(contactName: string) {
    const contactLocator = this.page.locator(
      `role=cell[name="${contactName}"]`
    );
    contactLocator.click();
  }
}
