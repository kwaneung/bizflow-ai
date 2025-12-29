# Tasks: BizFlow AI Comprehensive Test Suite

**Input**: Design documents from `/specs/001-project-tests/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: TDD approach required per Constitution. Tests MUST be written first and fail before implementation.

**Organization**: Tasks are organized by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2], [US3])
- Include exact file paths in descriptions

## Path Conventions

- **Module Tests**: `modules/<module>/src/__tests__/` for module tests
- **Library Tests**: `libs/shared/<library>/src/__tests__/` for library tests
- **Test Utilities**: `*/src/__tests__/utils/` for test utilities within each library/module
- **Web App Tests**: `apps/web/src/__tests__/` for web application tests
- Paths follow Nx conventions as defined in plan.md

---

## Phase 1: Setup (Test Utilities per Library/Module)

**Purpose**: Create test utilities within each library and module for independent testing

- [X] T001 [P] Create LLMService mock factory in libs/shared/llm/src/__tests__/utils/llm-service.mock.ts
- [X] T002 [P] Create Supabase mock factory in libs/shared/llm/src/__tests__/utils/supabase.mock.ts
- [X] T003 [P] Create mocks index.ts in libs/shared/llm/src/__tests__/utils/index.ts
- [X] T004 [P] Create ecommerce test fixtures in modules/ecommerce/src/__tests__/utils/fixtures.ts
- [X] T005 [P] Create realestate test fixtures in modules/realestate/src/__tests__/utils/fixtures.ts
- [X] T006 [P] Create pt test fixtures in modules/pt/src/__tests__/utils/fixtures.ts
- [X] T007 [P] Create API route test helpers in apps/web/src/__tests__/utils/api-route.helper.ts
- [X] T008 [P] Create component test helpers in apps/web/src/__tests__/utils/component.helper.ts
- [X] T009 [P] Create assertion helpers in apps/web/src/__tests__/utils/assertions.helper.ts
- [X] T010 [P] Create helpers index.ts in apps/web/src/__tests__/utils/index.ts

**Checkpoint**: Test utilities created in each library/module, ready for use in tests

---

## Phase 2: User Story 1 - Shared Library Unit Tests (Priority: P2)

**Goal**: Ensure shared libraries (types, llm, ui) work correctly in isolation

**Independent Test**: Can be fully tested by writing unit tests for each library's exported functions and components. Tests run via `nx test shared-types`, `nx test shared-llm`, or `nx test shared-ui` commands. Test utilities (mocks, fixtures) are placed within each library's test directory. This delivers immediate value by ensuring shared infrastructure reliability.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T011 [P] [US1] Create unit test for Input type in libs/shared/types/src/__tests__/unit/input.test.ts
- [X] T012 [P] [US1] Create unit test for Output type in libs/shared/types/src/__tests__/unit/output.test.ts
- [X] T013 [P] [US1] Create unit test for type guards in libs/shared/types/src/__tests__/unit/type-guards.test.ts
- [X] T014 [P] [US1] Create unit test for LLMService in libs/shared/llm/src/__tests__/unit/llm-service.test.ts
- [X] T015 [P] [US1] Create unit test for PromptBuilder in libs/shared/llm/src/__tests__/unit/prompt-builder.test.ts
- [X] T016 [P] [US1] Create unit test for ResponseParser in libs/shared/llm/src/__tests__/unit/response-parser.test.ts
- [X] T017 [P] [US1] Create unit test for RateLimiter in libs/shared/llm/src/__tests__/unit/rate-limiter.test.ts
- [X] T018 [P] [US1] Create unit test for ErrorHandler in libs/shared/llm/src/__tests__/unit/error-handler.test.ts
- [X] T019 [P] [US1] Create component test for Button in libs/shared/ui/src/__tests__/unit/button.test.tsx
- [X] T020 [P] [US1] Create component test for Card in libs/shared/ui/src/__tests__/unit/card.test.tsx
- [X] T021 [P] [US1] Create component test for Input in libs/shared/ui/src/__tests__/unit/input.test.tsx
- [X] T022 [P] [US1] Create component test for other UI components in libs/shared/ui/src/__tests__/unit/

### Implementation for User Story 1

- [X] T023 [US1] Update or create shared-types tests to achieve 80%+ coverage
- [X] T024 [US1] Update or create shared-llm tests to achieve 80%+ coverage using test utilities from libs/shared/llm/src/__tests__/utils/
- [X] T025 [US1] Update or create shared-ui component tests to achieve 80%+ coverage
- [X] T026 [US1] Verify all shared library tests pass via `nx test shared-types`, `nx test shared-llm`, `nx test shared-ui`
- [X] T027 [US1] Verify test coverage meets 80%+ target for all shared libraries

**Checkpoint**: At this point, User Story 1 should be fully functional. All shared libraries have unit tests with 80%+ coverage.

---

## Phase 3: User Story 2 - Domain Module Unit Tests (Priority: P2)

**Goal**: Ensure each domain module's core service logic works correctly in isolation

**Independent Test**: Can be fully tested by mocking LLMService using test utilities from `libs/shared/llm/src/__tests__/utils/` and testing each service method independently. Tests run via `nx test ecommerce`, `nx test realestate`, or `nx test pt` commands, leveraging Nx's caching and parallel execution. This delivers immediate value by ensuring core business logic correctness for each domain.

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T028 [P] [US2] Create unit test for EcommerceContentService in modules/ecommerce/src/__tests__/unit/ecommerce-content-service.test.ts
- [ ] T029 [P] [US2] Create unit test for RealEstateContentService in modules/realestate/src/__tests__/unit/realestate-content-service.test.ts
- [ ] T030 [P] [US2] Create unit test for PTContentService in modules/pt/src/__tests__/unit/pt-content-service.test.ts

### Implementation for User Story 2

- [ ] T031 [US2] Update EcommerceContentService tests to use test utilities from libs/shared/llm/src/__tests__/utils/ and fixtures from modules/ecommerce/src/__tests__/utils/fixtures.ts (if tests already exist, refactor; if not, create new tests)
- [ ] T032 [US2] Update RealEstateContentService tests to use test utilities from libs/shared/llm/src/__tests__/utils/ and fixtures from modules/realestate/src/__tests__/utils/fixtures.ts (if tests already exist, refactor; if not, create new tests)
- [ ] T033 [US2] Update PTContentService tests to use test utilities from libs/shared/llm/src/__tests__/utils/ and fixtures from modules/pt/src/__tests__/utils/fixtures.ts (if tests already exist, refactor; if not, create new tests)
- [ ] T034 [US2] Verify all module unit tests pass via `nx test ecommerce`, `nx test realestate`, `nx test pt`
- [ ] T035 [US2] Verify test coverage meets 80%+ target for all module ContentService classes

**Checkpoint**: At this point, User Story 2 should be fully functional. All domain modules have unit tests with 80%+ coverage.

---

## Phase 4: User Story 3 - API Route Integration Tests (Priority: P3)

**Goal**: Ensure Next.js API routes work correctly with service layers and shared infrastructure

**Independent Test**: Can be fully tested by making HTTP requests to API endpoints (`/api/ecommerce/generate`, `/api/realestate/generate`, `/api/pt/generate`, `/api/llm/*`) with various input scenarios and verifying responses. Tests use test utilities from `apps/web/src/__tests__/utils/` for API route testing and mock Supabase/OpenAI services from `libs/shared/llm/src/__tests__/utils/`. This delivers value by ensuring the API contract is maintained.

### Tests for User Story 3 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T036 [P] [US3] Create integration test for POST /api/ecommerce/generate in apps/web/src/__tests__/api/ecommerce/generate.test.ts
- [ ] T037 [P] [US3] Create integration test for POST /api/realestate/generate in apps/web/src/__tests__/api/realestate/generate.test.ts
- [ ] T038 [P] [US3] Create integration test for POST /api/pt/generate in apps/web/src/__tests__/api/pt/generate.test.ts
- [ ] T039 [P] [US3] Create integration test for POST /api/llm/process in apps/web/src/__tests__/api/llm/process.test.ts
- [ ] T040 [P] [US3] Create integration test for GET /api/llm/rate-limit/status in apps/web/src/__tests__/api/llm/rate-limit/status.test.ts
- [ ] T041 [P] [US3] Create integration test for GET /api/llm/requests/[requestId] in apps/web/src/__tests__/api/llm/requests/[requestId].test.ts

### Implementation for User Story 3

- [ ] T042 [US3] Implement API route integration tests using test utilities from apps/web/src/__tests__/utils/api-route.helper.ts
- [ ] T043 [US3] Add test cases for valid requests (200 status)
- [ ] T044 [US3] Add test cases for invalid requests (400 status)
- [ ] T045 [US3] Add test cases for LLM service failures (500 status)
- [ ] T046 [US3] Add test cases for rate limiting (429 status)
- [ ] T047 [US3] Verify all API route tests pass via `nx test web`
- [ ] T048 [US3] Verify test coverage for API routes

**Checkpoint**: At this point, User Story 3 should be fully functional. All API routes have integration tests covering all scenarios.

---

## Phase 5: User Story 4 - React Component Rendering Tests (Priority: P3)

**Goal**: Ensure Next.js page components render correctly and handle user interactions

**Independent Test**: Can be fully tested by rendering components with React Testing Library, simulating user interactions (form inputs, button clicks), and verifying rendered output and behavior. Tests run via `nx test web` command. This delivers value by ensuring UI correctness and user experience quality.

### Tests for User Story 4 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T049 [P] [US4] Create component test for home page in apps/web/src/__tests__/app/page.test.tsx
- [ ] T050 [P] [US4] Create component test for ecommerce input page in apps/web/src/__tests__/app/ecommerce/page.test.tsx
- [ ] T051 [P] [US4] Create component test for ecommerce result page in apps/web/src/__tests__/app/ecommerce/result/page.test.tsx
- [ ] T052 [P] [US4] Create component test for realestate input page in apps/web/src/__tests__/app/realestate/page.test.tsx
- [ ] T053 [P] [US4] Create component test for realestate result page in apps/web/src/__tests__/app/realestate/result/page.test.tsx
- [ ] T054 [P] [US4] Create component test for pt input page in apps/web/src/__tests__/app/pt/page.test.tsx
- [ ] T055 [P] [US4] Create component test for pt result page in apps/web/src/__tests__/app/pt/result/page.test.tsx

### Implementation for User Story 4

- [ ] T056 [US4] Implement component tests using React Testing Library and test utilities from apps/web/src/__tests__/utils/component.helper.ts
- [ ] T057 [US4] Add test cases for component rendering
- [ ] T058 [US4] Add test cases for form interactions
- [ ] T059 [US4] Add test cases for navigation
- [ ] T060 [US4] Add test cases for copy and download functionality
- [ ] T061 [US4] Verify all component tests pass via `nx test web`
- [ ] T062 [US4] Verify test coverage for page components

**Checkpoint**: At this point, User Story 4 should be fully functional. All page components have component tests covering rendering and interactions.

---

## Phase 6: User Story 5 - End-to-End User Flow Tests (Priority: P4)

**Goal**: Ensure complete user journeys work correctly from UI interaction to content generation and display

**Independent Test**: Can be fully tested by simulating user interactions with Playwright: filling out forms, submitting them, waiting for content generation, viewing results, copying content, and downloading files. Tests run against the Next.js app in test mode. This delivers value by ensuring complete user journeys work correctly.

### Tests for User Story 5 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T063 [P] [US5] Create E2E test for ecommerce module flow in apps/web/src/__tests__/e2e/ecommerce.spec.ts
- [ ] T064 [P] [US5] Create E2E test for realestate module flow in apps/web/src/__tests__/e2e/realestate.spec.ts
- [ ] T065 [P] [US5] Create E2E test for pt module flow in apps/web/src/__tests__/e2e/pt.spec.ts

### Implementation for User Story 5

- [ ] T066 [US5] Install Playwright if not already installed: `pnpm add -D @playwright/test`
- [ ] T067 [US5] Create Playwright configuration in apps/web/playwright.config.ts
- [ ] T068 [US5] Implement E2E test for ecommerce module (form → generation → result → copy/download)
- [ ] T069 [US5] Implement E2E test for realestate module (form → generation → result → copy/download)
- [ ] T070 [US5] Implement E2E test for pt module (form → generation → result → copy/download)
- [ ] T071 [US5] Add test cases for error scenarios (missing fields, generation failures)
- [ ] T072 [US5] Add test cases for loading states
- [ ] T073 [US5] Configure cross-browser testing (Chrome, Firefox, Safari)
- [ ] T074 [US5] Configure responsive UI testing at different screen sizes
- [ ] T075 [US5] Verify all E2E tests pass via `npx playwright test`
- [ ] T076 [US5] Verify E2E tests run successfully in at least 2 different browsers

**Checkpoint**: At this point, User Story 5 should be fully functional. All E2E tests pass and cover complete user flows for all three modules.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation

- [ ] T077 [P] Verify all tests follow TDD principles (tests written first, implementation follows)
- [ ] T078 [P] Verify all tests are independent and can run in any order
- [ ] T079 [P] Verify all tests clean up after themselves (no side effects, reset mocks)
- [ ] T080 [P] Verify all tests use consistent naming conventions
- [ ] T081 [P] Verify test coverage reports are generated for all projects
- [ ] T082 [P] Verify Nx caching works correctly for test execution
- [ ] T083 [P] Verify Nx affected testing works correctly
- [ ] T084 [P] Update documentation with test execution instructions
- [ ] T085 [P] Run quickstart.md validation to ensure all examples work
- [ ] T086 Verify test execution time meets targets (< 30s unit, < 2min integration, < 5min E2E)
- [ ] T087 Verify all edge cases identified in spec are covered by tests
- [ ] T088 Verify test failures provide clear error messages

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **User Story 1 (Phase 2)**: Depends on Setup completion - needs test utilities
- **User Story 2 (Phase 3)**: Depends on User Story 1 completion (needs shared-llm test utilities)
- **User Story 3 (Phase 4)**: Depends on User Stories 1-2 completion (needs unit tests stable)
- **User Story 4 (Phase 5)**: Depends on User Story 3 completion (needs API integration tests stable)
- **User Story 5 (Phase 6)**: Depends on User Story 4 completion (needs component tests stable)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P2)**: Can start after Setup - Needs test utilities from Phase 1
- **User Story 2 (P2)**: Can start after User Story 1 - Needs shared-llm test utilities
- **User Story 3 (P3)**: Can start after User Stories 1-2 - Needs unit tests stable
- **User Story 4 (P3)**: Can start after User Story 3 - Needs API integration tests stable
- **User Story 5 (P4)**: Can start after User Story 4 - Needs component tests stable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Core utilities before dependent utilities
- Individual utilities before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All test tasks within a user story marked [P] can run in parallel
- All implementation tasks within a user story marked [P] can run in parallel
- User Stories 1 and 2 can run in parallel after Setup completes

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: User Story 1 (Shared Library Unit Tests)
3. **STOP and VALIDATE**: Test User Story 1 independently
4. Verify shared libraries can be tested independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + User Story 1 → Shared library tests ready
2. Add User Story 2 → Domain module unit tests → Test independently → Deploy/Demo
3. Add User Story 3 → API route integration tests → Test independently → Deploy/Demo
4. Add User Story 4 → Component rendering tests → Test independently → Deploy/Demo
5. Add User Story 5 → E2E tests → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup together
2. Once Setup is done:
   - Developer A: User Story 1 (Shared Library Unit Tests)
   - Developer B: User Story 2 (Domain Module Unit Tests)
3. Once User Stories 1-2 are done:
   - Developer A: User Story 3 (API Route Integration Tests)
   - Developer B: User Story 4 (React Component Rendering Tests)
4. Once User Stories 3-4 are done:
   - Developer A: User Story 5 (E2E Tests)
5. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Total task count: 88 tasks
- Task count per user story:
  - Setup: 10 tasks
  - User Story 1: 17 tasks (12 tests + 5 implementation)
  - User Story 2: 8 tasks (3 tests + 5 implementation)
  - User Story 3: 13 tasks (6 tests + 7 implementation)
  - User Story 4: 14 tasks (7 tests + 7 implementation)
  - User Story 5: 14 tasks (3 tests + 11 implementation)
  - Polish: 12 tasks
