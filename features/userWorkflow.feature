@web
Feature: User Workflow

Scenario: User Registration
When the user clicks on the "Sign Up" button from the login page
And the user fills in the registration form with valid details
Then the user should be redirected to the "Add User" page
When the user logout from the application
When the user login to the application
Then the user should be redirected to the "Contact List" page

Scenario: Create a New Contact
When the user login to the application
When the user clicks on "Add New Contact"
And the user fills in the contact form with valid details
Then the new contact should be added to the contact list

Scenario: Update an Existing Contact
When the user login to the application
When the user selects a contact by name
And the user updates the contact’s details
And the user navigates back to the contact list
Then the updated contact details should be visible in the contact list
