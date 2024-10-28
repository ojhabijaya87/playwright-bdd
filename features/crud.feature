# features/booking.feature
@api
Feature: User CRUD Operations with DTO

    Background: Obtain an authorization token
        When I obtain an authorization token from the auth endpoint

    Scenario: Create a new booking
        Given I have a new booking with firstname "John", lastname "Doe", totalprice "123", depositpaid "true", checkin "2024-01-01", checkout "2024-01-07"
        When I send a POST request to the booking endpoint
        Then I should receive a 200 status code for the POST request
        And the response body should include the booking data

    Scenario: Retrieve an existing booking by ID
        When I send a GET request with the created booking ID
        Then I should receive a 200 status code for the GET request
        And the response body should include the booking data for get request

    Scenario: Update the booking
        Given I have updated booking data with firstname "Jane" and lastname "Doe Updated"
        When I send a PUT request to the booking endpoint with updated firstname "Jane" and lastname "Doe Updated"
        Then I should receive a 200 status code for the PUT request
        And the response body should include the updated booking data

    Scenario: Delete the booking
        When I send a DELETE request to the booking endpoint
        Then I should receive a 201 status code for the DELETE request
