import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import '@testing-library/jest-dom';

/**
 * Custom render function that wraps React Testing Library's render
 * with any providers or setup needed for UI components.
 *
 * Currently a simple wrapper, but can be extended with:
 * - Theme providers
 * - Router context
 * - Other global contexts
 */
export function render(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return rtlRender(ui, options);
}

/**
 * Re-export everything from React Testing Library for convenience
 */
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
