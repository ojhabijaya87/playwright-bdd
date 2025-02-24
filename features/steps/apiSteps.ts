import { expect } from "@playwright/test";
import { Given, When, Then, apiURL } from "./hooks";
import { UserDTO } from "../../supports/dtos/user";
import { AuthResponse } from "../../supports/dtos/authResponse";
import { AddContactDTO } from "../../supports/dtos/addNewContact";
import { ContactResponseDTO } from "../../supports/dtos/newContactResponse";

let userData: UserDTO;
let authResponse: AuthResponse;
let addNewContact: AddContactDTO;
let newContactResponse: ContactResponseDTO;

Given("a registered user logs in via API", async ({ apiContext, user }) => {
  const response = await apiContext.sendRequest(
    "POST",
    apiURL + "/auth/login",
    {
      data: {
        email: user.email,
        password: user.password,
      },
    }
  );
  await apiContext.expectSuccessfulResponse();
  authResponse = await apiContext.getResponseBody<AuthResponse>();
  apiContext.setAuthToken(authResponse.token);
});

Given("the user has the valid data to register", async ({ user }) => {
  userData = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
  };
});

When("the user registers using API", async ({ apiContext }) => {
  await apiContext.sendRequest("POST", "/users", {
    data: userData,
  });
});

Then(
  "the user should return {int} status code",
  async ({ apiContext }, statusCode: number) => {
    expect(apiContext.getResponseStatus()).toBe(statusCode);
  }
);

Then(
  "the API should return a valid authentication token",
  async ({ apiContext }) => {
    authResponse = await apiContext.getResponseBody<AuthResponse>();
    expect(authResponse.token).toBeDefined();
    expect(authResponse.token).not.toBeNull();
  }
);

Given(
  "the user has valid data to create a new contact",
  async ({ newContact }) => {
    addNewContact = {
      firstName: newContact.firstName,
      lastName: newContact.lastName,
    };
  }
);

When(
  "the user sends a request to create a new contact with valid data",
  async ({ apiContext }) => {
    await apiContext.sendRequest("POST", "/contacts", {
      data: addNewContact,
      headers: {
        Authorization: `Bearer ${authResponse.token}`,
      },
    });
  }
);

Then("the contact should be successfully created", async ({ apiContext }) => {
  newContactResponse = await apiContext.getResponseBody<ContactResponseDTO>();
  expect(newContactResponse._id).not.toBeNull();
});

// Retrieve Contact
Then(
  "the contact should be retrievable via the API",
  async ({ apiContext }) => {
    await apiContext.sendRequest("GET", `/contacts/${newContactResponse._id}`, {
      headers: { Authorization: `Bearer ${authResponse.token}` },
    });
    await apiContext.expectSuccessfulResponse();
  }
);

// Delete Contact
When(
  "the user sends a request to delete the contact",
  async ({ apiContext }) => {
    await apiContext.sendRequest(
      "DELETE",
      `/contacts/${newContactResponse._id}`,
      {
        headers: { Authorization: `Bearer ${authResponse.token}` },
      }
    );
  }
);

// Verify Contact Deletion
Then(
  "the contact should not be retrievable via the API",
  async ({ apiContext }) => {
    await apiContext.sendRequest("GET", `/contacts/${newContactResponse._id}`, {
      headers: { Authorization: `Bearer ${authResponse.token}` },
    });
    expect(apiContext.getResponseStatus()).toBe(404);
  }
);
