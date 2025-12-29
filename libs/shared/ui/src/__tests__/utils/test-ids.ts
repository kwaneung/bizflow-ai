/**
 * Common test IDs used across UI component tests.
 * Centralized to ensure consistency and prevent typos.
 */
export const TEST_IDS = {
  BUTTON: 'test-button',
  INPUT: 'test-input',
  CARD: 'test-card',
  ALERT: 'test-alert',
  SPINNER: 'test-spinner',
  BADGE: 'test-badge',
  TABS: {
    ROOT: 'test-tabs',
    LIST: 'test-tabs-list',
    TRIGGER: 'test-tabs-trigger',
    CONTENT: 'test-tabs-content',
  },
} as const;
