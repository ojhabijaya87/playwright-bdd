Feature: Multi-Window Switching

    Scenario: User switches back to the original window from a new window
        Given the user navigates to the "Multiple Windows" page
        And the user opens a new window by clicking on "Click Here"
        When the user switches to the new window
        And the user reads the content of the new window
        And the user switches back to the original window
        Then the user should see the title "The Internet" in the original window
        And the user should see the content of the original page unchanged
