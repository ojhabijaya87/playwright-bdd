import { APIResponse, expect, request } from "@playwright/test";
import { Given, When, Then, apiURL } from "./hooks";
import { pageManager } from "../../supports/utilities/pageManager";
import { Booking } from "../../supports/dtos/booking";
import { BookingResponse } from "../../supports/dtos/bookingResponse";
let token: string;
let bookingData: Booking;
let bookingId: number;
let response: APIResponse;

When(/^I obtain an authorization token from the auth endpoint$/, async () => {
  const response = await (
    await request.newContext()
  ).post(`${apiURL}/auth`, {
    data: { username: "admin", password: "password123" },
    headers: { "Content-Type": "application/json" },
  });
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  token = body.token;
});

Given(
  /^I have a new booking with firstname "([^"]*)", lastname "([^"]*)", totalprice "([^"]*)", depositpaid "([^"]*)", checkin "([^"]*)", checkout "([^"]*)"$/,
  async (
    {},
    firstname: string,
    lastname: string,
    totalprice: string,
    depositpaid: string,
    checkin: string,
    checkout: string
  ) => {
    bookingData = {
      firstname,
      lastname,
      totalprice: parseInt(totalprice, 10), // Convert to integer
      depositpaid: depositpaid.toLowerCase() === "true", // Convert string to boolean
      bookingdates: { checkin, checkout },
    };
  }
);

When(/^I send a POST request to the booking endpoint$/, async ({}) => {
  response = await (
    await request.newContext()
  ).post(`${apiURL}/booking`, {
    data: bookingData,
    headers: { "Content-Type": "application/json" },
  });
});

Then(/^I should receive a 200 status code for the POST request$/, () => {
  expect(response.status()).toBe(200);
});

Then(/^the response body should include the booking data$/, async () => {
  const responseBody: BookingResponse = await response.json();
  bookingId = responseBody.bookingid;
  // Validate the response matches the request data
  expect(responseBody.booking.firstname).toBe(bookingData.firstname);
  expect(responseBody.booking.lastname).toBe(bookingData.lastname);
  expect(responseBody.booking.totalprice).toBe(bookingData.totalprice);
  expect(responseBody.booking.depositpaid).toBe(bookingData.depositpaid);
});

When(/^I send a GET request with the created booking ID$/, async () => {
  response = await (
    await request.newContext()
  ).get(`${apiURL}/booking/${bookingId}`);
  console.log(response.status());
});

Then(/^I should receive a 200 status code for the GET request$/, () => {
  expect(response.status()).toBe(200);
});

Then(
  /^the response body should include the booking data for get request$/,
  async () => {
    const responseBody: Booking = await response.json();

    // Validate the response matches the created booking data
    expect(responseBody.firstname).toBe(bookingData.firstname);
    expect(responseBody.lastname).toBe(bookingData.lastname);
  }
);

Given(
  /^I have updated booking data with firstname "([^"]*)" and lastname "([^"]*)"$/,
  async ({}, firstname: string, lastname: string) => {
    bookingData.firstname = firstname;
    bookingData.lastname = lastname;
  }
);

When(
  /^I send a PUT request to the booking endpoint with updated firstname "([^"]*)" and lastname "([^"]*)"$/,
  async ({}, firstname: string, lastname: string) => {
    response = await (
      await request.newContext()
    ).put(`${apiURL}/booking/${bookingId}`, {
      data: { ...bookingData, firstname, lastname },
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
    });
  }
);

Then(/^I should receive a 200 status code for the PUT request$/, () => {
  expect(response.status()).toBe(200);
});

Then(
  /^the response body should include the updated booking data$/,
  async () => {
    const responseBody: Booking = await response.json();

    expect(responseBody.firstname).toBe(bookingData.firstname);
    expect(responseBody.lastname).toBe(bookingData.lastname);
  }
);

When(/^I send a DELETE request to the booking endpoint$/, async () => {
  response = await (
    await request.newContext()
  ).delete(`${apiURL}/booking/${bookingId}`, {
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}`,
    },
  });
});

Then(
  /^I should receive a 201 status code for the DELETE request$/,
  async () => {
    expect(response.status()).toBe(201);

    // Confirm the deletion by attempting to retrieve the deleted booking
    const getResponse = await (
      await request.newContext()
    ).get(`${apiURL}/booking/${bookingId}`);
    expect(getResponse.status()).toBe(404);
  }
);
