import { Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private userNameField = this.page.locator("#email");
  private passWordField = this.page.locator("#password");
  private submitButton = this.page.locator("#submit");
  private dashboardTitle = this.page.locator("h1");
  private signUpButton = this.page.locator("#signup");

  async signUp() {
    await this.click(this.signUpButton);
  }

  async logIn(email: string, pasword: string) {
    await this.fill(this.userNameField, email);
    await this.fill(this.passWordField, pasword);
    await this.click(this.submitButton);
  }
}
