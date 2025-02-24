@api
Feature: API Testing for User and Contact Management

  Scenario: User Authentication via API
    Given the user has the valid data to register
    When the user registers using API
    Then the user should return 201 status code
    Then the API should return a valid authentication token

  Scenario: Create a Contact via API
    Given the user has valid data to create a new contact
    When the user sends a request to create a new contact with valid data
    Then the user should return 201 status code
    Then the contact should be successfully created
    And the contact should be retrievable via the API
    Then the user should return 200 status code

  Scenario: Delete a Contact via API
    When the user sends a request to delete the contact
    Then the user should return 200 status code
    And the contact should not be retrievable via the API
    Then the user should return 404 status code
