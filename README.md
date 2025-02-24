# Playwright BDD Automation Framework

## Overview

This project is an automated testing framework using Playwright with BDD (Behavior-Driven Development) approach. It supports both UI and API testing, utilizing TypeScript for robust type checking and improved developer experience.

## Capabilities

1. **Cross-Browser Testing**: Supports Chrome, Firefox, and WebKit for consistent behavior across different browser engines.

2. **API and UI Testing**: Comprehensive support for both RESTful API and UI testing with robust interaction mechanisms.

3. **Parallel Execution**: Multi-threaded test execution with configurable workers for faster test suite runs.

4. **Data-Driven Testing**: Integration with external data sources and dynamic test data generation using Faker.

5. **Reporting and CI/CD Integration**: HTML reports with Cucumber reporter and seamless integration with GitHub Actions for automated testing workflows.

6. **Environment Management**: Easy switching between multiple environment configurations (dev, qa, prod).

7. **BDD Support**: Gherkin syntax for test scenarios with step definition auto-generation.

8. **Debugging Tools**: Video recording and trace viewer for detailed execution analysis.

## Prerequisites

Before setting up and running the tests, ensure you have the following:

- **Node.js**: 18+
- **Operating System**: Windows 10+ (or WSL), macOS 13+, Debian/Ubuntu 20.04+ on x86-64 and arm64.

## Installation

### 1. Clone the Repository

Clone the project repository from GitHub:

```bash
git clone https://github.com/ojhabijaya87/playwright-bdd.git
```

```bash
cd playwright-bdd
```

### 2. Install Dependencies

Navigate to the project directory and install all dependencies:

```bash
npm install
```

### 3. Install Playwright Browsers

Install Playwright and its supported browsers:

```bash
npx playwright install
```

This command downloads the supported browsers (Chromium, Firefox, and WebKit) required for cross-browser testing.

### 4. Set Up Environment Variables

Configure the environment files under the `env` directory:

- `.env.dev` for the development environment
- `.env.qa` for the QA environment
- `.env.prod` for the production environment

  ```bash
  BASE_URL= https://thinking-tester-contact-list.herokuapp.com/
  API_URL= https://thinking-tester-contact-list.herokuapp.com
  BROWSERS= chromium
  ```

- `BASE_URL`: Sets the base URL for UI tests.
- `API_URL`: Sets the base URL for API tests.
- `BROWSERS`: Defines the browsers to be used for multi-browser testing (comma-separated, e.g., chromium,firefox,webkit). The framework is currently set to run with `chromium`.

## Configuration

The primary configurations are set in:

- `playwright.config.ts`: Defines test settings such as browser, base URL, and timeouts.
- `.env` files under `env/`: Environment-specific configurations such as base URLs and Browsers.

## Running Tests

To execute tests, use the following commands:

- `npm run test`: Generates BDD tests and runs all Playwright tests in default headless mode.
- `npm run report`: Serves the cucumber report using http-server and opens it in the default browser.
- `npm run test:dev`: Runs tests in development environment using Playwright's UI mode.
- `npm run test:qa`: Runs tests in QA environment using Playwright's UI mode.
- `npm run test:api:qa`: Runs API tests in QA environment (tests marked with @api tag).
- `npm run test:prod`: Runs tests in production environment using Playwright's UI mode.

## Design Choices, Tools, and Challenges

### Design Choices and Tools

1. **Playwright**: Chosen for its cross-browser support, parallel execution, and advanced debugging tools.

2. **BDD (Playwright-BDD)**: Simplifies the setup and leverages Playwright’s strengths while following a clear Gherkin-based structure.

3. **TypeScript**: TypeScript is used for its strong typing system, which helps catch errors early and improves code maintainability.

4. **Page Object Model (POM)**: Implemented to encapsulate page-specific elements and actions, promoting reusability and easier maintenance.

5. **Fixture-Based Test Setup**: The test setup extends Playwright's test.extend() to provide reusable fixtures.

6. **Custom API Client**: A custom APITestContext class was built for handling API requests, making API tests more robust and easier to manage.

7. **Data Generation**: Faker was integrated for dynamic test data generation, allowing for more diverse and realistic test scenarios.

8. **Environment Management**: Support for multiple environments (dev, qa, prod) was implemented using dotenv, allowing easy switching between different configurations.

9. **Parallel Execution**: Tests are configured to run features in parallel while keeping scenarios within each feature sequential, optimizing test execution time.

10. **Reporting**: Cucumber HTML reporter is set up for detailed test results, viewable both locally and in CI/CD pipelines.

### Design Patterns and Principles

1. **Factory Pattern**: Implemented for lazy initialization of page objects, improving performance and resource management.

2. **Singleton Pattern**: Used for maintaining shared state across tests, such as for user data or contact information.

3. **Command Pattern**: Employed in the custom API client for encapsulating and parameterizing API requests.

4. **SOLID Principles**:

   - Single Responsibility Principle: Each class, like APITestContext, has a single, well-defined purpose.
   - Open/Closed Principle: The framework is designed to be easily extendable without modifying existing code.
   - Liskov Substitution Principle (LSP): Page objects follow inheritance correctly (e.g., AddContactPage extends BasePage). API request methods allow extending or modifying behavior without breaking existing functionality.
   - Interface Segregation Principle (Partially Followed): Separate DTOs are correctly defined and page classes only expose relevant methods. However, the APITestContext class has multiple responsibilities.

   - Dependency Inversion: Playwright's fixture-based system promotes dependency injection.

5. **DRY (Don't Repeat Yourself)**: Implemented through the use of reusable components and utility functions.

6. **KISS (Keep It Simple, Stupid)**: Maintained simplicity in design with clear and descriptive class and method names.

### Challenges Faced

1. **Authentication State Management**: Initially, Playwright's storage state was considered for efficient login handling. However, due to the need to test user registration, a more flexible approach was adopted to accommodate all test scenarios.

2. **Balancing Parallelization and Test Dependencies**: Achieving optimal test execution speed while ensuring that dependent tests don't interfere with each other was challenging. The solution of running features in parallel but scenarios sequentially addresses this.

3. **Cross-browser Consistency**: Ensuring consistent behavior across different browsers required careful consideration in test design and implementation.

4. **Dynamic Content Handling**: Dealing with lazy-loaded elements and dynamically changing content necessitated the implementation of robust waiting strategies.
