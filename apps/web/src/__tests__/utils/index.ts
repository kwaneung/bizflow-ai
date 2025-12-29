/**
 * Test utilities for web application.
 * 
 * This module exports all test helpers, utilities, and assertions for testing
 * the web application, including API routes, React components, and E2E scenarios.
 */

// API Route Test Helpers
export {
  createMockRequest,
  createMockJsonRequest,
  getResponseJson,
  expectStatus,
  expectJsonBody,
  expectErrorResponse,
  expectSuccessResponse,
  testApiRoute,
  createMockParams,
} from './api-route.helper';

// Component Test Helpers
export {
  renderWithProviders,
  createUserEvent,
  waitForVisible,
  waitForText,
  fillFormField,
  selectOption,
  toggleCheckbox,
  submitForm,
  createMockRouter,
  mockUseRouter,
  findButtonByText,
  findLinkByText,
} from './component.helper';

// Assertion Helpers
export {
  assertErrorResponse,
  assertSuccessResponse,
  assertApiResponse,
  assertComponentRenders,
  assertFormFieldValue,
  assertButtonDisabled,
  assertButtonEnabled,
  assertElementVisible,
  assertElementHidden,
  assertTextPresent,
  assertTextNotPresent,
  assertLinkHref,
  assertImageSrc,
  assertFormHasErrors,
  assertFormHasNoErrors,
} from './assertions.helper';

