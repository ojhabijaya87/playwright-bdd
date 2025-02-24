import { Page } from "@playwright/test";
import { BasePage } from "./basePage";


export class RegisterPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private firstNameField = this.page.locator("#firstName");
  private lastNameField = this.page.locator("#lastName");
  private emailField = this.page.locator("#email");
  private passwordField = this.page.locator("#password");
  private signUpButton = this.page.locator('button[type="submit"]');
  private successMessage = this.page.locator(".success-message");

  async registerUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    await this.fill(this.firstNameField, userData.firstName);
    await this.fill(this.lastNameField, userData.lastName);
    await this.fill(this.emailField, userData.email);
    await this.fill(this.passwordField, userData.password);
    await this.click(this.signUpButton);
  }
}
