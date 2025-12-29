import type { NextResponse } from 'next/server';

/**
 * Common assertion helpers for tests.
 * 
 * Use these helpers to create consistent assertions across all tests.
 */

/**
 * Assert that a value is a valid error response structure.
 */
export function assertErrorResponse(error: unknown): asserts error is {
  code: string;
  message: string;
  details?: Record<string, unknown>;
} {
  expect(error).toBeDefined();
  expect(typeof error).toBe('object');
  expect(error).toHaveProperty('code');
  expect(error).toHaveProperty('message');
  expect(typeof (error as { code?: unknown }).code).toBe('string');
  expect(typeof (error as { message?: unknown }).message).toBe('string');
}

/**
 * Assert that a response has the expected structure for a successful API response.
 */
export function assertSuccessResponse(response: unknown): asserts response is {
  success: boolean;
  content?: unknown;
  data?: unknown;
} {
  expect(response).toBeDefined();
  expect(typeof response).toBe('object');
  expect(response).toHaveProperty('success');
  expect((response as { success?: unknown }).success).toBe(true);
}

/**
 * Assert that a NextResponse has the expected status and structure.
 */
export async function assertApiResponse(
  response: NextResponse,
  expectedStatus: number,
  expectedStructure?: {
    hasSuccess?: boolean;
    hasError?: boolean;
    hasContent?: boolean;
  }
): Promise<void> {
  expect(response.status).toBe(expectedStatus);

  if (expectedStructure) {
    const text = await response.text();
    const body = text ? JSON.parse(text) : null;

    if (expectedStructure.hasSuccess) {
      expect(body).toHaveProperty('success');
      expect(body.success).toBe(true);
    }

    if (expectedStructure.hasError) {
      expect(body).toHaveProperty('error');
      expect(body.error).toHaveProperty('code');
      expect(body.error).toHaveProperty('message');
    }

    if (expectedStructure.hasContent) {
      expect(body).toHaveProperty('content');
    }
  }
}

/**
 * Assert that a component renders without errors.
 */
export function assertComponentRenders(
  container: HTMLElement
): void {
  expect(container).toBeTruthy();
  expect(container.innerHTML).toBeTruthy();
}

/**
 * Assert that a form field has the expected value.
 */
export function assertFormFieldValue(
  field: HTMLElement,
  expectedValue: string
): void {
  if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
    expect((field as HTMLInputElement | HTMLTextAreaElement).value).toBe(
      expectedValue
    );
  } else {
    expect(field.textContent).toContain(expectedValue);
  }
}

/**
 * Assert that a button is disabled.
 */
export function assertButtonDisabled(button: HTMLElement): void {
  expect(button).toBeDisabled();
}

/**
 * Assert that a button is enabled.
 */
export function assertButtonEnabled(button: HTMLElement): void {
  expect(button).not.toBeDisabled();
}

/**
 * Assert that an element is visible.
 */
export function assertElementVisible(element: HTMLElement): void {
  expect(element).toBeVisible();
}

/**
 * Assert that an element is not visible (hidden).
 */
export function assertElementHidden(element: HTMLElement): void {
  expect(element).not.toBeVisible();
}

/**
 * Assert that text content is present in the document.
 */
export function assertTextPresent(
  container: HTMLElement | Document,
  text: string | RegExp
): void {
  if (typeof text === 'string') {
    expect(container.textContent).toContain(text);
  } else {
    expect(container.textContent).toMatch(text);
  }
}

/**
 * Assert that text content is not present in the document.
 */
export function assertTextNotPresent(
  container: HTMLElement | Document,
  text: string | RegExp
): void {
  if (typeof text === 'string') {
    expect(container.textContent).not.toContain(text);
  } else {
    expect(container.textContent).not.toMatch(text);
  }
}

/**
 * Assert that a link has the expected href.
 */
export function assertLinkHref(
  link: HTMLElement,
  expectedHref: string
): void {
  expect(link).toHaveAttribute('href', expectedHref);
}

/**
 * Assert that an image has the expected src.
 */
export function assertImageSrc(
  image: HTMLElement,
  expectedSrc: string
): void {
  expect(image).toHaveAttribute('src', expectedSrc);
}

/**
 * Assert that a form has validation errors.
 */
export function assertFormHasErrors(
  form: HTMLElement,
  errorMessages?: string[]
): void {
  const errorElements = form.querySelectorAll('[role="alert"], .error, [aria-invalid="true"]');
  expect(errorElements.length).toBeGreaterThan(0);

  if (errorMessages) {
    errorMessages.forEach((message) => {
      assertTextPresent(form, message);
    });
  }
}

/**
 * Assert that a form has no validation errors.
 */
export function assertFormHasNoErrors(form: HTMLElement): void {
  const errorElements = form.querySelectorAll('[role="alert"], .error, [aria-invalid="true"]');
  expect(errorElements.length).toBe(0);
}

