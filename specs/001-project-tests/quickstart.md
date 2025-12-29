# Quick Start: BizFlow AI Test Suite

**Date**: 2025-12-11  
**Feature**: Comprehensive Test Suite

## Overview

This guide helps developers quickly get started with writing and running tests in the BizFlow AI monorepo.

## Prerequisites

- Node.js 24.x
- pnpm 10+
- Nx workspace configured
- Jest and React Testing Library installed

## Running Tests

### Run Tests for a Specific Project

```bash
# Run tests for a module
nx test ecommerce
nx test realestate
nx test pt

# Run tests for a shared library
nx test shared-types
nx test shared-llm
nx test shared-ui

# Run tests for web application
nx test web
```

### Run All Tests

```bash
# Run all tests in workspace
nx test --all
```

### Run Affected Tests

```bash
# Run tests only for changed projects
nx affected:test
```

### Run Tests with Coverage

```bash
# Run tests with coverage report
nx test <project-name> --coverage
```

### Run Tests in Watch Mode

```bash
# Run tests in watch mode (auto-rerun on changes)
nx test <project-name> --watch
```

## Writing Tests

### Unit Test Example

```typescript
// modules/ecommerce/src/__tests__/unit/ecommerce-content-service.test.ts
import { EcommerceContentService } from '../services/ecommerce-content-service';
import { createMockLLMService } from '@bizflow/shared/llm/src/__tests__/utils';
import { createEcommerceInput } from '../utils/fixtures';

describe('EcommerceContentService', () => {
  let service: EcommerceContentService;
  let mockLLMService: ReturnType<typeof createMockLLMService>;

  beforeEach(() => {
    mockLLMService = createMockLLMService();
    service = new EcommerceContentService(mockLLMService);
  });

  it('should generate content', async () => {
    const input = createEcommerceInput();
    const result = await service.generateContent(input);

    expect(result).toBeDefined();
    expect(mockLLMService.process).toHaveBeenCalled();
  });
});
```

### Integration Test Example

```typescript
// apps/web/src/__tests__/api/ecommerce/generate.test.ts
import { POST } from '@/app/api/ecommerce/generate/route';
import {
  createMockJsonRequest,
  getResponseJson,
  expectSuccessResponse,
} from '../utils/api-route.helper';
import { createEcommerceInput } from '@bizflow/modules/ecommerce/src/__tests__/utils/fixtures';

describe('POST /api/ecommerce/generate', () => {
  it('should return 200 with generated content', async () => {
    const input = createEcommerceInput();
    const req = createMockJsonRequest({ productData: input.productData });

    const response = await POST(req);

    await expectSuccessResponse(response, 200);
    const body = await getResponseJson(response);
    expect(body).toHaveProperty('content');
  });
});
```

### Component Test Example

```typescript
// apps/web/src/__tests__/app/ecommerce/page.test.tsx
import { render, screen } from '@testing-library/react';
import { EcommercePage } from '@/app/ecommerce/page';

describe('EcommercePage', () => {
  it('should render form', () => {
    render(<EcommercePage />);

    expect(screen.getByLabelText(/product name/i)).toBeInTheDocument();
  });

  it('should submit form', async () => {
    const { user } = render(<EcommercePage />);

    await user.type(screen.getByLabelText(/product name/i), 'Test Product');
    await user.click(screen.getByRole('button', { name: /generate/i }));

    // Assert navigation or API call
  });
});
```

### E2E Test Example

```typescript
// apps/web/src/__tests__/e2e/ecommerce.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Ecommerce Module', () => {
  test('should generate content', async ({ page }) => {
    await page.goto('/ecommerce');

    await page.fill('[name="name"]', 'Test Product');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/ecommerce/result');
    await expect(page.locator('text=Generated Content')).toBeVisible();
  });
});
```

## Using Test Utilities

### Importing Utilities

**For LLM Mocks (in modules):**

```typescript
import { createMockLLMService } from '@bizflow/shared/llm/src/__tests__/utils';
```

**For Module Fixtures (in module tests):**

```typescript
import { createEcommerceInput } from '../utils/fixtures';
```

**For Web App Helpers (in web app tests):**

```typescript
import {
  createMockJsonRequest,
  getResponseJson,
} from '../utils/api-route.helper';
import {
  renderWithProviders,
  createUserEvent,
} from '../utils/component.helper';
```

### Available Utilities

- **LLM Mocks** (`libs/shared/llm/src/__tests__/utils/`): `createMockLLMService()`, `createMockSupabaseClient()`
- **Module Fixtures** (`modules/*/src/__tests__/utils/fixtures.ts`): `createEcommerceInput()`, `createRealEstateInput()`, `createPTInput()`
- **Web Helpers** (`apps/web/src/__tests__/utils/`): `createMockJsonRequest()`, `renderWithProviders()`, assertion helpers

## Test Organization

### Directory Structure

```
<project>/
├── src/
│   ├── __tests__/
│   │   ├── unit/           # Unit tests
│   │   ├── integration/    # Integration tests
│   │   └── e2e/           # E2E tests (web app only)
│   └── [source files]
└── jest.config.ts
```

### Naming Conventions

- Unit tests: `*.test.ts`
- Integration tests: `*.test.ts`
- Component tests: `*.test.tsx`
- E2E tests: `*.spec.ts`

## Best Practices

### 1. Use Distributed Test Utilities

Always use utilities from the appropriate location instead of creating your own.

```typescript
// ✅ Good - Use LLM mocks from shared-llm
import { createMockLLMService } from '@bizflow/shared/llm/src/__tests__/utils';

// ✅ Good - Use module fixtures from module
import { createEcommerceInput } from '../utils/fixtures';

// ✅ Good - Use web helpers from web app
import { createMockJsonRequest } from '../utils/api-route.helper';

// ❌ Bad - Don't create inline mocks
const mockLLMService = { process: jest.fn() };
```

### 2. Keep Tests Independent

Tests should not depend on each other and should be runnable in any order.

```typescript
// ✅ Good
beforeEach(() => {
  mockLLMService = createMockLLMService();
});

// ❌ Bad
let sharedState = {};
```

### 3. Test User Behavior

Test what users see and do, not implementation details.

```typescript
// ✅ Good
expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();

// ❌ Bad
expect(component.state.isSubmitting).toBe(false);
```

### 4. Use Descriptive Test Names

Test names should clearly describe what is being tested.

```typescript
// ✅ Good
it('should return 400 when required fields are missing', () => { ... });

// ❌ Bad
it('should work', () => { ... });
```

### 5. Mock External Dependencies

Always mock external services (LLM, Supabase) in tests.

```typescript
// ✅ Good
const mockLLMService = createMockLLMService();
mockLLMService.process.mockResolvedValue({ outputData: { ... } });

// ❌ Bad
// Making actual API calls in tests
```

## Debugging Tests

### Run Single Test File

```bash
nx test <project-name> --testPathPattern=<test-file>
```

### Run Single Test Case

```bash
nx test <project-name> --testNamePattern="should generate content"
```

### Debug in VS Code

1. Set breakpoint in test file
2. Open Run and Debug panel
3. Select "Jest: Current File"
4. Press F5 to start debugging

## Coverage Reports

### Generate Coverage

```bash
nx test <project-name> --coverage
```

### View Coverage

Coverage reports are generated in `coverage/<project-name>/` directory. Open `index.html` in browser to view.

### Coverage Targets

- **Critical paths**: 80%+ coverage required
- **Non-critical paths**: 60%+ coverage recommended

## Troubleshooting

### Tests Not Found

Ensure test files are in `__tests__/` directory and follow naming convention (`*.test.ts`).

### Import Errors

Test utilities are co-located with tests, so import paths are relative to the test file location. For LLM mocks, use: `import { createMockLLMService } from '@bizflow/shared/llm/src/__tests__/utils'`

### Mock Not Working

Ensure mocks are reset between tests using `beforeEach` or `afterEach`.

### Slow Tests

- Use `nx affected:test` to run only changed tests
- Leverage Nx caching
- Run tests in parallel when possible

## Next Steps

- Read [research.md](./research.md) for detailed technology choices
- Read [data-model.md](./data-model.md) for entity definitions
- Check [contracts/](./contracts/) for API contracts
- See existing tests for examples
