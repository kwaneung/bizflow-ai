# Implementation Plan: BizFlow AI Comprehensive Test Suite

**Branch**: `001-project-tests` | **Date**: 2025-12-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-project-tests/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build comprehensive test infrastructure for BizFlow AI that enables thorough testing of all domain modules (ecommerce, realestate, pt), shared libraries (types, llm, ui), and the web application. The test suite includes unit tests, integration tests, component tests, and E2E tests, all leveraging Nx monorepo capabilities for efficient test execution, caching, and parallelization. Test utilities are distributed within each library/module's `__tests__/utils/` directory to maintain independence and avoid circular dependencies. The test infrastructure follows TDD principles and targets 80%+ code coverage for critical paths.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)  
**Primary Dependencies**:

- Jest 29.7.0 (unit and integration tests)
- React Testing Library 16.3.0 (component tests)
- Playwright (E2E tests - needs to be added)
- Nx 22.2.5 (test execution, caching, parallelization)
- @nx/jest (Jest integration for Nx)
- @nx/next (Next.js test support)
- @testing-library/react (React component testing)
- @testing-library/dom (DOM testing utilities)
- jest-environment-jsdom (JS DOM environment for React tests)

**Storage**:

- Test fixtures stored in `modules/*/src/__tests__/utils/fixtures.ts` (module-specific test data)
- Test utilities stored in `libs/shared/llm/src/__tests__/utils/` (LLMService mocks, Supabase mocks)
- Test helpers stored in `apps/web/src/__tests__/utils/` (API route helpers, component helpers, assertion helpers)
- No database/API calls in tests (all mocked)

**Testing**:

- **Unit Tests**: Jest for modules and libraries
- **Integration Tests**: Jest for API routes
- **Component Tests**: React Testing Library for React components
- **E2E Tests**: Playwright for complete user flows
- **Test Execution**: Nx commands (`nx test <project-name>`)
- **Coverage**: Jest coverage reports with 80%+ target

**Target Platform**:

- Web (Next.js applications)
- Node.js runtime (for API route tests)
- Browser environments (for E2E tests via Playwright)

**Project Type**: Nx monorepo (test infrastructure addition)

**Performance Goals**:

- Unit tests: < 30 seconds per project execution time
- Integration tests: < 2 minutes total execution time
- E2E tests: < 5 minutes total execution time
- Test caching: 100% cache hit rate for unchanged tests
- Parallel execution: All independent tests run in parallel

**Constraints**:

- Must work within existing Nx workspace structure
- Must not break existing test configurations
- Must support project-level test execution (`nx test <project-name>`)
- Must leverage Nx caching for efficient test runs
- Must support affected testing (only test changed projects)
- All tests must be independent and runnable in any order
- No external dependencies in tests (all services mocked)
- Must maintain 80%+ code coverage for critical paths

**Scale/Scope**:

- 3 domain modules (ecommerce, realestate, pt) - unit and integration tests
- 3 shared libraries (types, llm, ui) - unit tests
- 1 web application (apps/web) - integration and component tests
- Distributed test utilities across libraries/modules (`__tests__/utils/` directories)
- Multiple API routes (4+ endpoints) - integration tests
- Multiple page components (7+ pages) - component tests
- 3 complete user flows - E2E tests
- Cross-browser testing (Chrome, Firefox, Safari) - E2E tests

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### I. Module-First Architecture ✅

- **Status**: PASS
- **Compliance**: Test infrastructure supports independent testing of each module. Each module can be tested independently via `nx test <module-name>`. Tests maintain module boundaries and do not create cross-module dependencies. Shared testing library is a shared library, not a module.

### II. Shared Component Reusability ✅

- **Status**: PASS
- **Compliance**: Test utilities are distributed within each library/module's `__tests__/utils/` directory. LLM test utilities in `libs/shared/llm/src/__tests__/utils/` are reused by modules for mocking. Each module has its own fixtures, and web app has its own helpers. This maintains independence while allowing reuse of shared utilities (LLM mocks) without creating circular dependencies.

### III. Type Safety & TypeScript First ✅

- **Status**: PASS
- **Compliance**: All test code will be written in TypeScript with strict mode. Test utilities and mocks are fully typed. No `any` types allowed in test code. Test fixtures use proper TypeScript types from existing modules and libraries.

### IV. Test-First Development ✅

- **Status**: PASS
- **Compliance**: TDD is mandatory. Tests are written first, then implementation follows. Test coverage target is 80%+ for critical paths. All test types (unit, integration, component, E2E) are included in the test suite.

### V. LLM Integration Pattern ✅

- **Status**: PASS
- **Compliance**: LLMService is mocked in all tests using shared testing utilities. Tests verify the Input → LLM Processing → Output pattern without actual API calls. Mock LLM responses simulate real behavior for testing.

### VI. Progressive Module Development ✅

- **Status**: PASS
- **Compliance**: Test infrastructure is built to support all existing modules (ecommerce, realestate, pt) and future modules. Tests follow established patterns and can be extended for new modules.

### VII. Nx Monorepo Standards ✅

- **Status**: PASS
- **Compliance**: Test infrastructure follows Nx conventions. Each project has test targets in `project.json`. Tests can be run at project level (`nx test <project-name>`) and workspace level. Nx caching and affected testing are leveraged for efficiency.

**Overall Status**: ✅ ALL GATES PASSED - Ready to proceed with implementation planning.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
libs/shared/llm/                     # LLM library with test utilities
├── src/
│   ├── __tests__/
│   │   ├── utils/
│   │   │   ├── llm-service.mock.ts  # LLMService mock utilities
│   │   │   ├── supabase.mock.ts     # Supabase client mocks
│   │   │   └── index.ts
│   │   ├── unit/
│   │   │   ├── llm-service.test.ts
│   │   │   ├── prompt-builder.test.ts
│   │   │   ├── response-parser.test.ts
│   │   │   ├── rate-limiter.test.ts
│   │   │   └── error-handler.test.ts
│   │   └── integration/
│   │       └── llm-flow.test.ts
│   └── [source files]

modules/ecommerce/                   # Ecommerce module with test utilities
├── src/
│   ├── __tests__/
│   │   ├── utils/
│   │   │   └── fixtures.ts          # Ecommerce test fixtures
│   │   └── unit/
│   │       └── ecommerce-content-service.test.ts
│   └── [source files]

modules/realestate/                  # Realestate module with test utilities
├── src/
│   ├── __tests__/
│   │   ├── utils/
│   │   │   └── fixtures.ts          # Realestate test fixtures
│   │   └── unit/
│   │       └── realestate-content-service.test.ts
│   └── [source files]

modules/pt/                          # PT module with test utilities
├── src/
│   ├── __tests__/
│   │   ├── utils/
│   │   │   └── fixtures.ts          # PT test fixtures
│   │   └── unit/
│   │       └── pt-content-service.test.ts
│   └── [source files]

libs/shared/types/                   # Types library tests
├── src/
│   └── __tests__/
│       ├── input.test.ts
│       ├── output.test.ts
│       └── type-guards.test.ts

libs/shared/ui/                      # UI library tests
├── src/
│   └── __tests__/
│       └── components/
│           ├── button.test.tsx
│           ├── card.test.tsx
│           ├── input.test.tsx
│           └── [other components].test.tsx

apps/web/                            # Web application with test utilities
├── src/
│   ├── __tests__/
│   │   ├── utils/
│   │   │   ├── api-route.helper.ts  # API route test helpers
│   │   │   ├── component.helper.ts  # Component test helpers
│   │   │   ├── assertions.helper.ts # Assertion helpers
│   │   │   └── index.ts
│   │   ├── api/
│   │   │   ├── ecommerce/
│   │   │   │   └── generate.test.ts
│   │   │   ├── realestate/
│   │   │   │   └── generate.test.ts
│   │   │   ├── pt/
│   │   │   │   └── generate.test.ts
│   │   │   └── llm/
│   │   │       └── [llm routes].test.ts
│   │   ├── app/
│   │   │   ├── page.test.tsx        # Home page
│   │   │   ├── ecommerce/
│   │   │   │   ├── page.test.tsx
│   │   │   │   └── result/
│   │   │   │       └── page.test.tsx
│   │   │   ├── realestate/
│   │   │   │   ├── page.test.tsx
│   │   │   │   └── result/
│   │   │   │       └── page.test.tsx
│   │   │   └── pt/
│   │   │       ├── page.test.tsx
│   │   │       └── result/
│   │   │           └── page.test.tsx
│   │   └── e2e/
│   │       ├── ecommerce.spec.ts
│   │       ├── realestate.spec.ts
│   │       └── pt.spec.ts
│   └── [source files]
└── playwright.config.ts             # Playwright configuration
```

**Structure Decision**: Test infrastructure follows Nx monorepo conventions. Test utilities are placed within each library/module's `__tests__/utils/` directory for independent testing. `libs/shared/llm/src/__tests__/utils/` provides LLMService and Supabase mocks. Each module has its own fixtures in `modules/*/src/__tests__/utils/fixtures.ts`. Web application has test utilities in `apps/web/src/__tests__/utils/` for integration and E2E tests. Tests are co-located with source code in `__tests__` directories. E2E tests use Playwright and are located in `apps/web/src/__tests__/e2e/`. All projects maintain their own `jest.config.ts` and `project.json` with test targets.

## Complexity Tracking

> **No Constitution violations identified. All principles are followed.**

No violations to justify. The test infrastructure follows Nx best practices and Constitution requirements. Shared testing library is a shared library (not a module), maintaining clear separation. All tests use shared utilities, reducing duplication. Test structure follows existing patterns and Nx conventions.

---

## Phase 0: Outline & Research

**Status**: ✅ COMPLETE

### Research Tasks

1. **Jest Configuration for Nx Monorepo**
   - Decision: Use `@nx/jest` plugin for Jest integration
   - Rationale: Native Nx support, automatic test target generation, caching support
   - Alternatives: Manual Jest configuration (rejected - more maintenance)

2. **React Testing Library Setup**
   - Decision: Use `@testing-library/react` with `jest-environment-jsdom`
   - Rationale: Industry standard, good Next.js support, accessibility-focused
   - Alternatives: Enzyme (rejected - outdated), React Test Utils (rejected - low-level)

3. **Playwright E2E Testing**
   - Decision: Add Playwright as E2E testing framework
   - Rationale: Modern, fast, good Next.js support, cross-browser testing
   - Alternatives: Cypress (rejected - slower), Puppeteer (rejected - less features)

4. **Test Utility Distribution Strategy**
   - Decision: Distribute test utilities within each library/module's `__tests__/utils/` directory
   - Rationale: Maintains independence, avoids circular dependencies, allows module-specific fixtures while enabling reuse of shared utilities (LLM mocks) from `libs/shared/llm/src/__tests__/utils/`
   - Alternatives: Centralized `libs/shared/testing` library (rejected - creates circular dependency risk)

5. **Mock Strategy for LLMService**
   - Decision: Create mock factory in `libs/shared/llm/src/__tests__/utils/`
   - Rationale: Consistent mocking across all tests, easy to update, modules can import from shared-llm without circular dependencies
   - Alternatives: Per-test mocks (rejected - inconsistency), centralized shared-testing library (rejected - circular dependency risk)

6. **Test Fixture Organization**
   - Decision: Module-specific fixtures in each module's `src/__tests__/utils/fixtures.ts`
   - Rationale: Maintains module independence, avoids cross-module dependencies, allows module-specific test data
   - Alternatives: Centralized fixtures in shared library (rejected - breaks module independence)

7. **API Route Testing Strategy**
   - Decision: Use Jest with Next.js test utilities for API route testing
   - Rationale: Native Next.js support, fast execution, easy mocking
   - Alternatives: Supertest (rejected - unnecessary complexity)

8. **Component Testing Strategy**
   - Decision: React Testing Library with jsdom environment
   - Rationale: User-centric testing, accessibility focus, good Next.js support
   - Alternatives: Shallow rendering (rejected - doesn't test integration)

9. **E2E Test Organization**
   - Decision: Module-specific E2E test files in `apps/web/src/__tests__/e2e/`
   - Rationale: Clear organization, easy to find and maintain
   - Alternatives: Single E2E file (rejected - too large)

10. **Nx Test Execution Strategy**
    - Decision: Leverage Nx caching and affected testing
    - Rationale: Fast test execution, only test what changed
    - Alternatives: Always run all tests (rejected - too slow)

### Research Output

See `research.md` for detailed findings.

---

## Phase 1: Design & Contracts

**Status**: ✅ COMPLETE

### Data Model

See `data-model.md` for detailed entity definitions.

**Key Entities**:

- **TestSuite**: Collection of test files organized by test type
- **SharedTestingLibrary**: Common test utilities, mocks, fixtures, helpers
- **MockLLMService**: Test double for LLMService
- **TestFixtures**: Reusable test data for all modules
- **TestUtilities**: Helper functions for common test operations
- **NxTestTargets**: Project-level test execution configuration

### API Contracts

See `contracts/` directory for detailed API contracts.

**Test Execution Contracts**:

- `nx test <project-name>` - Run tests for specific project
- `nx test --all` - Run all tests in workspace
- `nx affected:test` - Run tests for affected projects
- `nx test <project-name> --coverage` - Run tests with coverage

### Quick Start Guide

See `quickstart.md` for developer quick start guide.

**Key Sections**:

- Setting up test environment
- Running tests
- Writing new tests
- Using shared testing utilities
- Debugging tests

### Agent Context Update

Agent context files updated with test infrastructure information.

---

## Phase Completion Report

### Phase 0: Research ✅ COMPLETE

**Generated Artifacts**:

- `research.md` - Technology choices, best practices, and integration patterns documented

**Key Decisions**:

- Jest with `@nx/jest` for unit and integration tests
- React Testing Library for component tests
- Playwright for E2E tests
- Shared testing library structure
- Mock strategy for LLMService
- Test fixture organization
- API route testing approach
- Component testing approach
- E2E test organization
- Nx test execution strategy

**Research Findings**:

- All technology choices align with existing Nx workspace
- Jest and React Testing Library already configured
- Playwright needs to be added
- Shared testing library pattern follows Nx best practices
- Test structure follows existing project patterns

### Phase 1: Design & Contracts ✅ COMPLETE

**Generated Artifacts**:

- `data-model.md` - Test infrastructure entity definitions
- `contracts/` - Test execution API contracts
- `quickstart.md` - Developer quick start guide
- Agent context updated

**Key Design Elements**:

- Shared testing library structure defined
- Test organization patterns established
- Mock utilities design
- Test fixture structure
- API route testing helpers
- Component testing helpers
- E2E test structure
- Nx test execution configuration

**Design Validation**:

- All designs follow Nx conventions
- Test structure maintains module boundaries
- Shared utilities reduce duplication
- Test execution leverages Nx capabilities

### Next Steps

Ready for `/speckit.tasks` command to generate actionable task list for implementation.
