# Research: BizFlow AI Comprehensive Test Suite

**Date**: 2025-12-11  
**Feature**: Comprehensive Test Suite  
**Phase**: 0 - Outline & Research

## Overview

This document consolidates research findings for technology choices, best practices, and integration patterns for the BizFlow AI comprehensive test suite. All decisions are documented with rationale and alternatives considered.

## Technology Choices

### 1. Jest Configuration for Nx Monorepo

**Decision**: Use `@nx/jest` plugin for Jest integration

**Rationale**:

- Native Nx support with automatic test target generation
- Built-in caching support for efficient test execution
- Seamless integration with Nx affected testing
- Automatic path mapping configuration
- Coverage report generation support
- Parallel test execution support

**Alternatives Considered**:

- **Manual Jest Configuration**: More control but requires manual maintenance of test targets, path mappings, and caching configuration
- **Vitest**: Modern alternative but less mature Nx integration

**Best Practices**:

- Use `@nx/jest:jest` executor in `project.json`
- Configure `jest.config.ts` per project for project-specific needs
- Leverage Nx's automatic path mapping from `tsconfig.base.json`
- Use `jest.setup.ts` for global test configuration
- Enable coverage reports with `--coverage` flag

**Integration Pattern**:

- Each project has its own `jest.config.ts` extending base preset
- Test targets configured in `project.json` using `@nx/jest:jest` executor
- Coverage reports generated per project and aggregated at workspace level

---

### 2. React Testing Library Setup

**Decision**: Use `@testing-library/react` with `jest-environment-jsdom`

**Rationale**:

- Industry standard for React component testing
- User-centric testing approach (tests user interactions, not implementation)
- Excellent Next.js support
- Accessibility-focused queries
- Good TypeScript support
- Active community and maintenance

**Alternatives Considered**:

- **Enzyme**: Outdated, no longer maintained, shallow rendering doesn't test integration
- **React Test Utils**: Low-level, requires more boilerplate
- **Cypress Component Testing**: Overkill for unit component tests

**Best Practices**:

- Use `render()` from `@testing-library/react` for component rendering
- Use queries like `getByRole`, `getByLabelText` for accessibility-focused testing
- Use `screen` utility for queries
- Use `userEvent` for user interactions (more realistic than `fireEvent`)
- Test user behavior, not implementation details
- Use `cleanup()` or `afterEach` for cleanup (automatic in React Testing Library v9+)

**Integration Pattern**:

- Configure `jest-environment-jsdom` in `jest.config.ts` for React components
- Use `@testing-library/jest-dom` for custom matchers
- Setup test utilities in `jest.setup.ts`

---

### 3. Playwright E2E Testing

**Decision**: Add Playwright as E2E testing framework

**Rationale**:

- Modern, fast, and reliable E2E testing framework
- Excellent Next.js support
- Built-in cross-browser testing (Chromium, Firefox, WebKit)
- Auto-waiting and retry mechanisms
- Great debugging tools (trace viewer, UI mode)
- Good TypeScript support
- Active development and community

**Alternatives Considered**:

- **Cypress**: Slower execution, different architecture, less browser support
- **Puppeteer**: Lower-level API, requires more setup, no built-in test runner
- **Selenium**: Outdated, slower, more complex setup

**Best Practices**:

- Use Playwright's built-in test runner
- Leverage auto-waiting for elements
- Use page object pattern for complex flows
- Use `test.describe` for test organization
- Use `test.beforeEach` for test setup
- Use `test.afterEach` for cleanup
- Configure multiple browsers in `playwright.config.ts`
- Use `test.use()` for test-specific configuration

**Integration Pattern**:

- Install `@playwright/test` package
- Configure `playwright.config.ts` in `apps/web/`
- Create E2E tests in `apps/web/src/__tests__/e2e/`
- Run E2E tests via `npx playwright test` or Nx target

---

### 4. Test Utility Distribution Strategy

**Decision**: Distribute test utilities within each library/module's `__tests__/utils/` directory

**Rationale**:

- Maintains module independence
- Avoids circular dependencies
- Allows module-specific fixtures
- Enables reuse of shared utilities (LLM mocks) from `libs/shared/llm/src/__tests__/utils/`
- Follows Nx monorepo best practices
- Type-safe test utilities

**Alternatives Considered**:

- **Centralized `libs/shared/testing` library**: Creates circular dependency risk, breaks module independence
- **Per-Test Utilities**: Leads to duplication and inconsistency

**Best Practices**:

- LLM test utilities in `libs/shared/llm/src/__tests__/utils/` (reusable by modules)
- Module fixtures in `modules/*/src/__tests__/utils/fixtures.ts` (module-specific)
- Web app helpers in `apps/web/src/__tests__/utils/` (integration/E2E helpers)
- Export from `index.ts` in each utils directory
- Use TypeScript for type safety
- Document utility functions

**Integration Pattern**:

- LLM mocks: `import { createMockLLMService } from '@bizflow/shared/llm/src/__tests__/utils'`
- Module fixtures: `import { createEcommerceInput } from '../utils/fixtures'`
- Web helpers: `import { createMockRequest } from '../utils/api-route.helper'`

---

### 5. Mock Strategy for LLMService

**Decision**: Create mock factory in `libs/shared/llm/src/__tests__/utils/`

**Rationale**:

- Consistent mocking across all tests
- Easy to update when LLMService changes
- Reusable mock implementations
- Type-safe mocks
- Supports various test scenarios (success, error, rate limit)
- Modules can import from shared-llm without circular dependencies

**Alternatives Considered**:

- **Per-Test Mocks**: Leads to duplication and inconsistency
- **Manual Mocking**: More boilerplate, error-prone
- **Centralized shared-testing library**: Creates circular dependency risk

**Best Practices**:

- Create mock factory functions in `libs/shared/llm/src/__tests__/utils/llm-service.mock.ts`
- Support different response scenarios
- Use TypeScript for type safety
- Provide default mock implementations
- Allow customization for specific test cases

**Integration Pattern**:

- Create `libs/shared/llm/src/__tests__/utils/llm-service.mock.ts`
- Export mock factory: `createMockLLMService()`
- Modules import: `import { createMockLLMService } from '@bizflow/shared/llm/src/__tests__/utils'`
- Use in tests: `const mockLLMService = createMockLLMService()`
- Configure mock responses per test

---

### 6. Test Fixture Organization

**Decision**: Module-specific fixtures in each module's `src/__tests__/utils/fixtures.ts`

**Rationale**:

- Maintains module independence
- Avoids cross-module dependencies
- Allows module-specific test data
- Type-safe fixtures using module types
- Co-located with module tests

**Alternatives Considered**:

- **Centralized fixtures in shared library**: Breaks module independence, creates cross-module dependencies
- **Per-Test Fixtures**: Leads to duplication

**Best Practices**:

- Each module has its own `src/__tests__/utils/fixtures.ts`
- Use TypeScript types from the module itself
- Provide both valid and invalid fixtures
- Document fixture purpose
- Export factory functions (e.g., `createEcommerceInput()`)

**Integration Pattern**:

- Create `modules/ecommerce/src/__tests__/utils/fixtures.ts`
- Export fixtures: `export function createEcommerceInput() { ... }`
- Import in module tests: `import { createEcommerceInput } from '../utils/fixtures'`
- Each module maintains its own fixtures independently

---

### 7. API Route Testing Strategy

**Decision**: Use Jest with Next.js test utilities for API route testing

**Rationale**:

- Native Next.js support
- Fast execution
- Easy mocking of Next.js APIs
- Good TypeScript support
- Familiar Jest API

**Alternatives Considered**:

- **Supertest**: Unnecessary complexity, requires server setup
- **Manual HTTP Requests**: More boilerplate, harder to maintain

**Best Practices**:

- Use Next.js test utilities for request/response mocking
- Mock external dependencies (LLMService, Supabase)
- Test request validation
- Test error handling
- Test response formatting
- Use shared testing helpers for API route testing

**Integration Pattern**:

- Create API route test files: `apps/web/src/__tests__/api/<module>/<route>.test.ts`
- Use `createMockRequest()` and `createMockResponse()` helpers
- Mock LLMService using shared testing library
- Test various scenarios (valid, invalid, error)

---

### 8. Component Testing Strategy

**Decision**: React Testing Library with jsdom environment

**Rationale**:

- User-centric testing approach
- Accessibility focus
- Good Next.js support
- Fast execution
- Good TypeScript support

**Alternatives Considered**:

- **Shallow Rendering**: Doesn't test component integration
- **Snapshot Testing**: Too brittle, doesn't test behavior

**Best Practices**:

- Test user interactions, not implementation
- Use accessibility-focused queries
- Test component behavior, not internal state
- Mock external dependencies
- Use `userEvent` for interactions
- Test error states and edge cases

**Integration Pattern**:

- Create component test files: `apps/web/src/__tests__/app/<page>.test.tsx`
- Use React Testing Library's `render()` function
- Mock Next.js router and APIs
- Test user interactions and navigation

---

### 9. E2E Test Organization

**Decision**: Module-specific E2E test files in `apps/web/src/__tests__/e2e/`

**Rationale**:

- Clear organization
- Easy to find and maintain
- Module-specific test isolation
- Parallel execution support

**Alternatives Considered**:

- **Single E2E File**: Too large, harder to maintain
- **Feature-Based Organization**: Less clear module boundaries

**Best Practices**:

- One E2E test file per module
- Use `test.describe` for test organization
- Use page object pattern for complex flows
- Test complete user journeys
- Include error scenarios

**Integration Pattern**:

- Create E2E test files: `apps/web/src/__tests__/e2e/<module>.spec.ts`
- Use Playwright's test API
- Test complete user flows (form → generation → result → copy/download)
- Run via `npx playwright test` or Nx target

---

### 10. Nx Test Execution Strategy

**Decision**: Leverage Nx caching and affected testing

**Rationale**:

- Fast test execution (only run what changed)
- Efficient CI/CD pipeline
- Cost savings (less compute time)
- Better developer experience

**Alternatives Considered**:

- **Always Run All Tests**: Too slow, especially as project grows
- **Manual Test Selection**: Error-prone, requires developer discipline

**Best Practices**:

- Use `nx test <project-name>` for project-level testing
- Use `nx affected:test` for CI/CD
- Configure test targets in `project.json`
- Enable test caching in `nx.json`
- Use `--skip-nx-cache` when needed

**Integration Pattern**:

- Configure test targets in each project's `project.json`
- Use `@nx/jest:jest` executor
- Leverage Nx's automatic dependency graph
- Use `nx affected:test` in CI/CD pipeline

---

## Architecture Patterns

### Shared Testing Library Structure

**Pattern**: Independent Nx library with organized utilities

**Structure** (Distributed):

```
libs/shared/llm/src/__tests__/utils/
├── llm-service.mock.ts  # LLMService mock utilities
├── supabase.mock.ts     # Supabase mock utilities
└── index.ts             # Public API

modules/*/src/__tests__/utils/
└── fixtures.ts          # Module-specific test fixtures

apps/web/src/__tests__/utils/
├── api-route.helper.ts  # API route test helpers
├── component.helper.ts   # Component test helpers
├── assertions.helper.ts  # Assertion helpers
└── index.ts             # Public API
```

**Best Practices**:

- Test utilities co-located with tests in `__tests__/utils/` directories
- LLM mocks in shared-llm for reuse by modules
- Module-specific fixtures in each module
- Web app helpers in web app
- Type-safe utilities
- Documented functions
- Maintains module independence

---

### Test Organization Pattern

**Pattern**: Co-located tests with source code

**Structure**:

```
<project>/
├── src/
│   ├── __tests__/       # Test files
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   └── [source files]
└── jest.config.ts
```

**Best Practices**:

- Co-locate tests with source code
- Organize by test type (unit, integration, e2e)
- Use consistent naming (`*.test.ts`, `*.spec.ts`)
- Keep tests close to code they test

---

## Integration Patterns

### Mock LLMService Pattern

```typescript
// libs/shared/llm/src/__tests__/utils/llm-service.mock.ts
export function createMockLLMService() {
  return {
    process: jest.fn().mockResolvedValue({
      outputData: { ... },
      requestId: 'test-request-id',
    }),
  };
}
```

### Test Fixture Pattern

```typescript
// modules/ecommerce/src/__tests__/utils/fixtures.ts
export function createEcommerceInput(): EcommerceInput {
  return {
    moduleId: 'ecommerce',
    source: 'manual',
    productData: {
      name: 'Test Product',
      // ... other fields
    },
  };
}
```

### API Route Test Pattern

```typescript
// apps/web/src/__tests__/api/ecommerce/generate.test.ts
import { createMockJsonRequest, getResponseJson } from '../utils/api-route.helper';

describe('POST /api/ecommerce/generate', () => {
  it('should generate content', async () => {
    const req = createMockRequest({ body: validEcommerceInput });
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
```

---

## Summary

All technology choices align with existing Nx workspace and project patterns. Jest and React Testing Library are already configured. Playwright needs to be added. Shared testing library follows Nx best practices. Test structure maintains module boundaries and leverages Nx capabilities for efficient test execution.
