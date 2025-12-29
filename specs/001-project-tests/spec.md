# Feature Specification: BizFlow AI Comprehensive Test Suite

**Feature Branch**: `001-project-tests`  
**Created**: 2025-12-11  
**Status**: Draft  
**Input**: User description: "BizFlow AI 전체 프로젝트에 대한 종합 테스트 스펙을 작성해줘.

프로젝트는 Nx 모노레포 구조로 되어있고, 다음 구성요소들을 테스트해야 해:

1. 도메인 모듈 테스트 (3개 모듈)
   - ecommerce 모듈: EcommerceContentService 단위 테스트, API 통합 테스트
   - realestate 모듈: RealEstateContentService 단위 테스트, API 통합 테스트
   - pt 모듈: PTContentService 단위 테스트, API 통합 테스트
     각 모듈은 독립적으로 테스트 가능해야 하고, nx test <module-name> 명령어로 실행 가능해야 해

2. 공통 Nx 라이브러리 테스트 (3개 라이브러리)
   - libs/shared/types: 타입 시스템, Input/Output 제네릭, 타입 가드 함수 테스트
   - libs/shared/llm: LLMService, PromptBuilder, ResponseParser, RateLimiter, ErrorHandler 테스트
   - libs/shared/ui: shadcn/ui 기반 공통 UI 컴포넌트 테스트 (React Testing Library 사용)
     각 라이브러리는 nx test <library-name> 명령어로 실행 가능해야 해

3. 웹 애플리케이션 테스트 (apps/web)
   - Next.js API Routes 통합 테스트: /api/ecommerce/generate, /api/realestate/generate, /api/pt/generate, /api/llm/\* 엔드포인트들
   - Next.js 페이지 컴포넌트 렌더링 테스트: 홈페이지, 각 모듈의 입력 페이지, 결과 페이지 (React Testing Library 사용)
   - API와 페이지 간 통합 플로우 테스트

4. E2E 테스트 (Playwright)
   - 전체 사용자 플로우: 각 모듈(ecommerce, realestate, pt)별로 폼 입력 → 콘텐츠 생성 → 결과 확인 → 복사/다운로드
   - 크로스 브라우저 테스트
   - 반응형 UI 테스트

5. 공통 테스트 인프라
   - 각 라이브러리/모듈 내부에 테스트 유틸리티 배치: 독립적인 단위 테스트 지원
   - libs/shared/llm/src/**tests**/utils/: LLMService 모킹 유틸리티, Supabase 모킹 유틸리티
   - modules/\*/src/**tests**/utils/: 각 모듈별 테스트 픽스처 (mock data)
   - apps/web/src/**tests**/utils/: API 라우트 테스트 헬퍼, 컴포넌트 테스트 헬퍼, 공통 assertion 헬퍼

Nx 모노레포 특성을 최대한 활용해야 해:

- 프로젝트별 독립적인 테스트 실행 (nx test <project-name>)
- Nx 캐싱을 통한 효율적인 테스트 실행
- affected 테스트 실행 (변경된 프로젝트만 테스트)
- 병렬 테스트 실행
- 공통 테스트 설정과 유틸리티 재사용

테스트 전략:

- 단위 테스트: 각 모듈/라이브러리의 핵심 로직 (Jest)
- 통합 테스트: API 라우트와 서비스 레이어 통합 (Jest)
- 컴포넌트 테스트: React 컴포넌트 렌더링 및 상호작용 (React Testing Library)
- E2E 테스트: 전체 사용자 플로우 (Playwright)

TDD 원칙을 따라야 하고, 각 테스트는 독립적으로 실행 가능해야 하며, 80% 이상의 코드 커버리지를 목표로 해야 해."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Shared Library Unit Tests (Priority: P2)

A developer wants to ensure that shared libraries (types, llm, ui) work correctly in isolation. They write unit tests for type system functions, LLM service components, and UI components. Each library can be tested independently using `nx test <library-name>` command. Test utilities are placed within each library's `__tests__/utils/` directory for independent testing.

**Why this priority**: Shared libraries are used by all modules, so their correctness is critical. Unit tests ensure that type guards, LLM service components, and UI components work as expected. These tests must pass before modules can reliably use the shared infrastructure. They run fast and catch regressions early. Test utilities are co-located with tests to maintain independence and avoid circular dependencies.

**Independent Test**: Can be fully tested by writing unit tests for each library's exported functions and components. Tests run via `nx test shared-types`, `nx test shared-llm`, or `nx test shared-ui` commands. Test utilities (mocks, fixtures) are placed within each library's test directory. This delivers immediate value by ensuring shared infrastructure reliability.

**Acceptance Scenarios**:

1. **Given** shared-types library, **When** type guard functions are tested, **Then** they correctly validate Input/Output types and generic interfaces
2. **Given** shared-llm library, **When** LLMService, PromptBuilder, ResponseParser, RateLimiter, and ErrorHandler are tested using test utilities from `libs/shared/llm/src/__tests__/utils/`, **Then** each component works correctly in isolation and tests pass via `nx test shared-llm`
3. **Given** shared-ui library, **When** UI components are tested with React Testing Library, **Then** components render correctly, handle user interactions, and maintain accessibility standards
4. **Given** invalid inputs to shared library functions, **When** functions are called, **Then** appropriate errors are thrown or validation fails gracefully

---

---

### User Story 2 - Domain Module Unit Tests (Priority: P2)

A developer wants to ensure that each domain module's core service logic works correctly in isolation. They write unit tests for EcommerceContentService, RealEstateContentService, and PTContentService. Each module can be tested independently using `nx test <module-name>` command. Modules use test utilities from `libs/shared/llm/src/__tests__/utils/` for mocking LLMService, and each module has its own test fixtures in `modules/<module>/src/__tests__/utils/`.

**Why this priority**: Unit tests are the foundation of test coverage for business logic. They test individual service methods in isolation, making it easy to identify and fix bugs quickly. Each module must be independently testable to maintain module boundaries and enable parallel development. These tests run fast and provide immediate feedback during development.

**Independent Test**: Can be fully tested by mocking LLMService using test utilities from `libs/shared/llm/src/__tests__/utils/` and testing each service method independently. Tests run via `nx test ecommerce`, `nx test realestate`, or `nx test pt` commands, leveraging Nx's caching and parallel execution. This delivers immediate value by ensuring core business logic correctness for each domain.

**Acceptance Scenarios**:

1. **Given** EcommerceContentService with mocked LLMService from `libs/shared/llm/src/__tests__/utils/`, **When** `generateContent()` is called with valid input from `modules/ecommerce/src/__tests__/utils/fixtures.ts`, **Then** all content types are generated correctly and tests pass via `nx test ecommerce`
2. **Given** RealEstateContentService with mocked LLMService, **When** `generateContent()` is called with valid input from `modules/realestate/src/__tests__/utils/fixtures.ts`, **Then** all content types are generated correctly and tests pass via `nx test realestate`
3. **Given** PTContentService with mocked LLMService, **When** `generateContent()` is called with valid input from `modules/pt/src/__tests__/utils/fixtures.ts`, **Then** all content types are generated correctly and tests pass via `nx test pt`
4. **Given** invalid or malformed LLM responses, **When** service methods process them, **Then** appropriate errors are thrown with clear error messages
5. **Given** optional fields are provided or missing, **When** services generate content, **Then** context is built correctly based on provided fields

---

### User Story 3 - API Route Integration Tests (Priority: P3)

A developer wants to ensure that Next.js API routes work correctly with service layers and shared infrastructure. They write integration tests that test the full flow from HTTP request to response, including input validation, error handling, and LLM service integration. Tests run at the app level to verify Next.js API route integration.

**Why this priority**: Integration tests verify that API routes, services, and shared libraries work together correctly. They catch issues that unit tests miss, such as request/response format mismatches, middleware issues, and error propagation. While important, they can be written after unit tests are stable since they depend on both API routes and services working correctly.

**Independent Test**: Can be fully tested by making HTTP requests to API endpoints (`/api/ecommerce/generate`, `/api/realestate/generate`, `/api/pt/generate`, `/api/llm/*`) with various input scenarios and verifying responses. Tests use shared testing utilities for API route testing and mock Supabase/OpenAI services. This delivers value by ensuring the API contract is maintained.

**Acceptance Scenarios**:

1. **Given** a valid request sent to `/api/ecommerce/generate`, **When** the API route processes the request, **Then** it returns 200 status with generated content in the correct format
2. **Given** a valid request sent to `/api/realestate/generate`, **When** the API route processes the request, **Then** it returns 200 status with generated content in the correct format
3. **Given** a valid request sent to `/api/pt/generate`, **When** the API route processes the request, **Then** it returns 200 status with generated content in the correct format
4. **Given** invalid or missing required fields, **When** API routes receive requests, **Then** they return 400 status with clear error messages
5. **Given** LLM service failure, **When** API routes process requests, **Then** they return 500 status with appropriate error handling
6. **Given** rate limiting is triggered, **When** API routes process requests, **Then** they return 429 status with retry information

---

### User Story 4 - React Component Rendering Tests (Priority: P3)

A developer wants to ensure that Next.js page components render correctly and handle user interactions. They write component tests using React Testing Library for home page, module input pages, and result pages. Tests verify rendering, form interactions, and navigation.

**Why this priority**: Component tests ensure that UI components work correctly and provide good user experience. They catch rendering issues, interaction problems, and accessibility violations. While important, they can be written after API integration tests since they depend on pages being functional.

**Independent Test**: Can be fully tested by rendering components with React Testing Library, simulating user interactions (form inputs, button clicks), and verifying rendered output and behavior. Tests run via `nx test web` command. This delivers value by ensuring UI correctness and user experience quality.

**Acceptance Scenarios**:

1. **Given** the home page component, **When** it is rendered, **Then** all module cards are displayed correctly with proper links and status indicators
2. **Given** an ecommerce input page, **When** it is rendered and form is filled, **Then** form validation works correctly and submission triggers navigation
3. **Given** a realestate input page, **When** it is rendered and form is filled, **Then** form validation works correctly and submission triggers navigation
4. **Given** a pt input page, **When** it is rendered and form is filled, **Then** form validation works correctly and submission triggers navigation
5. **Given** a result page with generated content, **When** it is rendered, **Then** all content types are displayed correctly with copy and download buttons
6. **Given** copy or download buttons, **When** they are clicked, **Then** content is copied to clipboard or downloaded as file correctly

---

### User Story 5 - End-to-End User Flow Tests (Priority: P4)

A developer wants to ensure that complete user journeys work correctly from UI interaction to content generation and display. They write E2E tests using Playwright that test the full flow: form submission, content generation, result viewing, copy/download functionality for all three modules.

**Why this priority**: E2E tests verify the complete user experience and catch integration issues between frontend, API routes, and services. They ensure that UI components, API routes, and business logic work together correctly. While important for confidence, they are slower to run and should be written after unit, integration, and component tests are stable.

**Independent Test**: Can be fully tested by simulating user interactions with Playwright: filling out forms, submitting them, waiting for content generation, viewing results, copying content, and downloading files. Tests run against the Next.js app in test mode. This delivers value by ensuring complete user journeys work correctly.

**Acceptance Scenarios**:

1. **Given** a user navigates to ecommerce page, **When** they fill out the form and submit, **Then** they are redirected to result page with generated content displayed
2. **Given** a user navigates to realestate page, **When** they fill out the form and submit, **Then** they are redirected to result page with generated content displayed
3. **Given** a user navigates to pt page, **When** they fill out the form and submit, **Then** they are redirected to result page with generated content displayed
4. **Given** generated content is displayed, **When** a user clicks copy button, **Then** the content is copied to clipboard successfully
5. **Given** generated content is displayed, **When** a user clicks download button, **Then** a file is downloaded with the correct content format
6. **Given** required fields are missing, **When** a user attempts to submit the form, **Then** validation errors are displayed and form is not submitted
7. **Given** content generation is in progress, **When** a user views the page, **Then** loading state is displayed appropriately
8. **Given** content generation fails, **When** a user views the result page, **Then** error message is displayed with retry option

---

### Edge Cases

- What happens when LLM returns malformed JSON that cannot be parsed?
- How does system handle network timeouts during LLM API calls?
- What happens when Supabase is unavailable for prompt template retrieval?
- How does system handle concurrent requests with rate limiting?
- What happens when optional fields contain special characters or very long text?
- How does system handle empty arrays or null values in optional fields?
- What happens when API routes receive malformed request bodies?
- How does system handle very large generated content responses?
- What happens when user navigates away during content generation?
- How does system handle browser back/forward navigation on result pages?
- What happens when React components receive invalid props?
- How does system handle missing or broken shared library dependencies?
- What happens when E2E tests run in different browsers (Chrome, Firefox, Safari)?
- How does system handle responsive UI breakpoints in E2E tests?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Test utilities MUST be placed within each library/module's `__tests__/utils/` directory for independent testing
- **FR-002**: `libs/shared/llm/src/__tests__/utils/` MUST provide LLMService mocking utilities and Supabase mocking utilities
- **FR-003**: `apps/web/src/__tests__/utils/` MUST provide API route test helpers, component test helpers, and assertion helpers for integration and E2E tests
- **FR-004**: Each module (`modules/ecommerce`, `modules/realestate`, `modules/pt`) MUST have test fixtures in `src/__tests__/utils/fixtures.ts` for module-specific test data
- **FR-005**: Modules MUST use test utilities from `libs/shared/llm/src/__tests__/utils/` when mocking LLMService for unit tests. This requirement applies to all unit tests that need to mock LLMService, including domain module unit tests.
- **FR-006**: Each domain module (ecommerce, realestate, pt) MUST have unit tests for its ContentService with 80%+ code coverage
- **FR-007**: Each domain module MUST be testable independently via `nx test <module-name>` command
- **FR-009**: Each shared library (types, llm, ui) MUST have unit tests for all exported functions and components. "All exported functions and components" means 100% of publicly exported items from each library's main entry point.
- **FR-010**: Each shared library MUST be testable independently via `nx test <library-name>` command
- **FR-011**: Shared-types library tests MUST cover type guard functions, Input/Output generics, and type validation
- **FR-012**: Shared-llm library tests MUST cover LLMService, PromptBuilder, ResponseParser, RateLimiter, and ErrorHandler
- **FR-013**: Shared-ui library tests MUST use React Testing Library and cover component rendering and interactions
- **FR-014**: Web application MUST have integration tests for all API routes (`/api/ecommerce/generate`, `/api/realestate/generate`, `/api/pt/generate`, `/api/llm/*`)
- **FR-015**: Web application API route tests MUST verify input validation, error handling, and response formatting
- **FR-016**: Web application MUST have component tests for all page components (home, input pages, result pages) using React Testing Library
- **FR-017**: Web application component tests MUST verify rendering, form interactions, and navigation
- **FR-018**: E2E tests MUST be written using Playwright and test complete user flows for all three modules
- **FR-019**: E2E tests MUST verify form submission, content generation, result viewing, copy, and download functionality
- **FR-020**: E2E tests MUST support cross-browser testing (Chrome, Firefox, Safari)
- **FR-021**: E2E tests MUST verify responsive UI behavior at different screen sizes
- **FR-022**: All tests MUST follow TDD principles (write tests first, then implement/fix)
- **FR-023**: All tests MUST be independent and can run in any order
- **FR-024**: All tests MUST clean up after themselves (no side effects, reset mocks)
- **FR-025**: All tests MUST use consistent naming conventions (describe/it blocks, test file naming). Test files MUST use `.test.ts` or `.test.tsx` extension. Test files MUST be named after the file they test (e.g., `llm-service.test.ts` for `llm-service.ts`). Describe blocks MUST use descriptive names matching the component/function being tested. It blocks MUST use "should" format (e.g., "should process valid request successfully").
- **FR-026**: All tests MUST include both happy path and error scenarios
- **FR-027**: Nx test execution MUST support project-level testing (`nx test <project-name>`)
- **FR-028**: Nx test execution MUST leverage caching for efficient test runs
- **FR-029**: Nx test execution MUST support affected testing (only test changed projects)
- **FR-030**: Nx test execution MUST support parallel test execution for independent projects
- **FR-031**: Test coverage MUST achieve 80%+ for critical paths in all modules and libraries. Critical paths include: all ContentService methods, all exported library functions/components, all API route handlers, and all page component render methods.
- **FR-032**: Test execution time MUST be under 30 seconds per project for unit tests, under 2 minutes total for integration tests, under 5 minutes total for E2E tests

### Key Entities _(include if feature involves data)_

- **Test Suite**: Collection of test files organized by test type (unit, integration, component, E2E) within Nx project structure
- **Test Utilities**: Helper functions and mocks placed within each library/module's `__tests__/utils/` directory for independent testing
- **LLM Test Utilities** (`libs/shared/llm/src/__tests__/utils/`): LLMService mocking utilities and Supabase mocking utilities for testing LLM-related functionality
- **Module Test Fixtures** (`modules/*/src/__tests__/utils/fixtures.ts`): Module-specific test data (valid/invalid inputs, expected outputs) for each domain module
- **Web Test Utilities** (`apps/web/src/__tests__/utils/`): API route test helpers, component test helpers, and assertion helpers for integration and E2E tests
- **Nx Test Targets**: Project-level test execution targets configured in `project.json` for each module, library, and app
- **Test Configuration**: Jest and Playwright configuration files that leverage Nx's test execution capabilities
- **Test Coverage Reports**: Code coverage metrics generated by Jest for each project, aggregated at workspace level

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Test utilities are created in appropriate locations: `libs/shared/llm/src/__tests__/utils/` (LLMService mocks, Supabase mocks), `modules/*/src/__tests__/utils/` (module fixtures), `apps/web/src/__tests__/utils/` (API route helpers, component helpers, assertion helpers)
- **SC-002**: All three domain modules (ecommerce, realestate, pt) achieve 80%+ code coverage for their ContentService classes (measured via `nx test <module-name> --coverage`)
- **SC-003**: All three shared libraries (types, llm, ui) achieve 80%+ code coverage for their exported functions and components
- **SC-004**: All unit tests pass consistently (100% pass rate) when run via `nx test <project-name>` for each project
- **SC-005**: All API route integration tests pass and verify all scenarios (valid/invalid requests, errors) for all endpoints
- **SC-006**: All React component tests pass and verify rendering, interactions, and accessibility for all page components
- **SC-007**: All E2E tests pass and cover complete user flows for all three modules (ecommerce, realestate, pt)
- **SC-008**: Test execution time is under 30 seconds for unit tests per project, under 2 minutes for integration tests, under 5 minutes for E2E tests
- **SC-009**: Tests can run independently without external dependencies (mocked services, no database/API calls)
- **SC-010**: Test failures provide clear error messages indicating what failed and why
- **SC-011**: All edge cases identified in spec are covered by tests
- **SC-012**: Tests can be run at project level (`nx test <project-name>`) and workspace level (`nx test`) successfully
- **SC-013**: Nx caching works correctly for test execution (tests are cached when unchanged, invalidated when changed)
- **SC-014**: Nx affected testing works correctly (only changed projects are tested when using `nx affected:test`)
- **SC-015**: All tests follow TDD workflow (tests written first, implementation follows, tests pass after implementation)
- **SC-016**: Test coverage reports are generated and accessible for all projects
- **SC-017**: E2E tests run successfully in at least 2 different browsers (Chrome and Firefox, or Chrome and Safari)

## Dependencies

- **Existing Modules**: Tests depend on existing module implementations (ecommerce, realestate, pt)
- **Existing Shared Libraries**: Tests depend on existing shared libraries (types, llm, ui) for type definitions and service interfaces
- **Nx Workspace**: Tests leverage Nx's test execution, caching, and project structure
- **Jest**: Unit and integration test framework (already configured in Nx workspace)
- **React Testing Library**: Component testing utilities (already in dependencies)
- **Playwright**: E2E test framework (needs to be added if not present)
- **Test Utilities**: Test utilities to be created within each library/module's `__tests__/utils/` directory for independent testing

## Assumptions

- Nx workspace is properly configured with Jest and test execution targets
- Playwright can be added to the workspace if not already present
- Test utilities can be placed within each library/module's test directory structure
- Test execution via Nx commands (`nx test <project>`) works correctly
- Mock services can simulate LLM and Supabase behavior without actual API calls
- Test data fixtures can be stored in each module's `__tests__/utils/` directory for module-specific testing
- Existing module and library implementations are stable and won't change significantly during test writing
- All projects have proper `project.json` configuration with test targets
- Nx caching and affected testing features are available and working
