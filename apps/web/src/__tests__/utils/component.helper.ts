import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import type { UserEvent } from '@testing-library/user-event';

/**
 * Test helpers for React component testing.
 * 
 * Use these helpers to create consistent component test setups.
 */

/**
 * Custom render function with common providers.
 * Use this instead of the default render from @testing-library/react.
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  // Add any global providers here (e.g., ThemeProvider, Router, etc.)
  return render(ui, {
    ...options,
  });
}

/**
 * Create a user event instance for testing user interactions.
 */
export function createUserEvent(): UserEvent {
  return userEvent.setup();
}

/**
 * Wait for a component to be visible.
 */
export async function waitForVisible(
  element: HTMLElement,
  timeout: number = 1000
): Promise<void> {
  const { waitFor } = await import('@testing-library/react');
  await waitFor(
    () => {
      expect(element).toBeVisible();
    },
    { timeout }
  );
}

/**
 * Wait for text to appear in the document.
 */
export async function waitForText(
  text: string | RegExp,
  timeout: number = 1000
): Promise<HTMLElement> {
  const { waitFor, screen } = await import('@testing-library/react');
  return waitFor(
    () => {
      return screen.getByText(text);
    },
    { timeout }
  );
}

/**
 * Helper to fill a form field.
 */
export async function fillFormField(
  user: UserEvent,
  field: HTMLElement,
  value: string
): Promise<void> {
  await user.clear(field);
  await user.type(field, value);
}

/**
 * Helper to select an option from a select dropdown.
 */
export async function selectOption(
  user: UserEvent,
  select: HTMLElement,
  optionText: string
): Promise<void> {
  await user.click(select);
  const option = await waitForText(optionText);
  await user.click(option);
}

/**
 * Helper to check/uncheck a checkbox.
 */
export async function toggleCheckbox(
  user: UserEvent,
  checkbox: HTMLElement
): Promise<void> {
  await user.click(checkbox);
}

/**
 * Helper to submit a form.
 */
export async function submitForm(
  user: UserEvent,
  form: HTMLElement
): Promise<void> {
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) {
    await user.click(submitButton);
  } else {
    throw new Error('No submit button found in form');
  }
}

/**
 * Mock Next.js router for testing.
 */
export function createMockRouter(overrides?: Partial<{
  push: jest.Mock;
  replace: jest.Mock;
  back: jest.Mock;
  pathname: string;
  query: Record<string, string>;
  asPath: string;
}>): {
  push: jest.Mock;
  replace: jest.Mock;
  back: jest.Mock;
  pathname: string;
  query: Record<string, string>;
  asPath: string;
} {
  return {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    ...overrides,
  };
}

/**
 * Mock Next.js useRouter hook.
 */
export function mockUseRouter(router: ReturnType<typeof createMockRouter>) {
  jest.mock('next/navigation', () => ({
    useRouter: () => router,
    usePathname: () => router.pathname,
    useSearchParams: () => new URLSearchParams(router.query as Record<string, string>),
  }));
}

/**
 * Helper to find a button by text.
 */
export function findButtonByText(
  container: HTMLElement,
  text: string | RegExp
): HTMLElement | null {
  const buttons = container.querySelectorAll('button');
  for (const button of buttons) {
    if (typeof text === 'string' ? button.textContent === text : text.test(button.textContent || '')) {
      return button;
    }
  }
  return null;
}

/**
 * Helper to find a link by text.
 */
export function findLinkByText(
  container: HTMLElement,
  text: string | RegExp
): HTMLElement | null {
  const links = container.querySelectorAll('a');
  for (const link of links) {
    if (typeof text === 'string' ? link.textContent === text : text.test(link.textContent || '')) {
      return link;
    }
  }
  return null;
}

