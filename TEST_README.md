# Testing Documentation

## Running Tests

This project uses Jest and React Testing Library for unit testing.

### Available Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

### StudentEnrollForm Component Tests

The `studentEnrollForm.test.tsx` file contains comprehensive unit tests covering:

#### Form Rendering (5 tests)
- ✓ Renders form with all fields
- ✓ Renders with custom submit label
- ✓ Renders with initial values
- ✓ Shows loading state when courses are loading
- ✓ Shows error state when courses fail to load

#### Form Validation (6 tests)
- ✓ Validates first name is required
- ✓ Validates last name is required
- ✓ Validates email is required
- ✓ Validates email format
- ✓ Validates course selection is required
- ✓ Validates minimum 3 subjects are selected

#### Form Interaction (3 tests)
- ✓ Allows user to fill in all fields
- ✓ Updates available subjects when course is changed
- ✓ Updates subject count display

#### Form Submission (5 tests)
- ✓ Calls onSubmit with correct data when form is valid
- ✓ Handles resetAfterSubmit correctly
- ✓ Maintains form data when resetAfterSubmit is false
- ✓ Shows submitting state during submission
- ✓ Handles submission errors gracefully

#### Dynamic Behavior (2 tests)
- ✓ Updates form when initialValues prop changes
- ✓ Supports custom instanceIdPrefix

#### Accessibility (2 tests)
- ✓ Has proper labels for form fields
- ✓ Uses role="alert" for error messages

**Total: 23 tests, all passing ✓**

## Test Structure

The tests use:
- **Jest** - Testing framework
- **React Testing Library** - For rendering and querying React components
- **@testing-library/user-event** - For simulating user interactions
- **@testing-library/jest-dom** - For additional DOM matchers

## Mocking

The tests mock the `useFetchCourses` hook to provide predictable course data without network delays.

## Configuration

- **jest.config.ts** - Jest configuration for Next.js and TypeScript
- **jest.setup.ts** - Setup file for testing library and global mocks
