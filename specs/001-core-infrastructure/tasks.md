# Tasks: BizFlow AI Core Infrastructure

**Input**: Design documents from `/specs/001-core-infrastructure/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: TDD approach required per Constitution. Tests MUST be written first and fail before implementation.

**Organization**: Tasks are organized by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2], [US3], [US4])
- Include exact file paths in descriptions

## Path Conventions

- **Nx Monorepo**: `libs/shared/{library-name}/src/` for shared libraries
- **Configuration**: Root level files (`nx.json`, `package.json`, `tsconfig.base.json`)
- Paths follow Nx conventions as defined in plan.md

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize Nx workspace and project structure

- [x] T001 Create Nx workspace with pnpm in repository root
- [x] T002 [P] Create nx.json configuration file at nx.json
- [x] T003 [P] Create package.json with pnpm workspace configuration at package.json
- [x] T004 [P] Create tsconfig.base.json with path mappings at tsconfig.base.json
- [x] T005 [P] Create .gitignore file at .gitignore (if not exists)
- [x] T006 [P] Create .env.example file at .env.example with required environment variables
- [x] T007 [P] Create vercel.json configuration at vercel.json
- [x] T008 [P] Create .github/workflows/ci.yml for GitHub Actions CI/CD pipeline
- [x] T009 Initialize Supabase project and configure connection (Setup guide created in supabase/README.md)
- [x] T010 Create database schema migration files in supabase/migrations/

**Checkpoint**: Nx workspace initialized, basic configuration files created

---

## Phase 2: Foundational - Common Type System (Blocking Prerequisites)

**Purpose**: Core type system that ALL user stories depend on. MUST be complete before any other work.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

**Goal**: Domain module developers can use common Input/Output interfaces for type safety

**Independent Test**: Create a test module that imports Input/Output types and verifies type compatibility

### Tests for Foundational Phase

- [x] T011 [P] Create unit test for Input interface in libs/shared/types/src/__tests__/input.test.ts
- [x] T012 [P] Create unit test for Output interface in libs/shared/types/src/__tests__/output.test.ts
- [x] T013 [P] Create unit test for type guards in libs/shared/types/src/__tests__/type-guards.test.ts

### Implementation for Foundational Phase

- [x] T014 [P] Create libs/shared/types library structure with project.json
- [x] T015 [P] Implement Input<T> interface in libs/shared/types/src/input.ts
- [x] T016 [P] Implement Output<T> interface in libs/shared/types/src/output.ts
- [x] T017 [P] Implement common types in libs/shared/types/src/common.ts
- [x] T018 [P] Implement type guards (isInput, isOutput) in libs/shared/types/src/type-guards.ts
- [x] T019 [P] Create index.ts exports in libs/shared/types/src/index.ts
- [x] T020 [P] Create package.json for types library in libs/shared/types/package.json
- [x] T021 Configure TypeScript path mapping for @bizflow/shared/types in tsconfig.base.json

**Checkpoint**: Common type system ready - all user stories can now use Input/Output interfaces

---

## Phase 3: User Story 1 - Domain Module Developer Uses Shared LLM Service (Priority: P1) 🎯 MVP

**Goal**: Domain module developers can integrate LLM functionality using shared LLM service without implementing API calls, error handling, or rate limiting from scratch

**Independent Test**: Create a minimal domain module that uses the shared LLM service to process a simple input and receive a formatted output. Verify the service handles errors gracefully and queues requests when rate limits are reached.

### Tests for User Story 1

- [x] T022 [P] [US1] Create unit test for LLMService.process() in libs/shared/llm/src/__tests__/llm-service.test.ts
- [x] T023 [P] [US1] Create unit test for PromptBuilder in libs/shared/llm/src/__tests__/prompt-builder.test.ts
- [x] T024 [P] [US1] Create unit test for ResponseParser in libs/shared/llm/src/__tests__/response-parser.test.ts
- [x] T025 [P] [US1] Create unit test for RateLimiter in libs/shared/llm/src/__tests__/rate-limiter.test.ts
- [x] T026 [P] [US1] Create unit test for ErrorHandler in libs/shared/llm/src/__tests__/error-handler.test.ts
- [ ] T027 [US1] Create integration test for LLM service flow in libs/shared/llm/src/__tests__/integration/llm-flow.test.ts
- [ ] T028 [US1] Create contract test for LLM API endpoint in libs/shared/llm/src/__tests__/contract/api-contract.test.ts

### Implementation for User Story 1

- [x] T029 [P] [US1] Create libs/shared/llm library structure with project.json
- [x] T030 [P] [US1] Implement LLMRequest type in libs/shared/llm/src/types/llm-types.ts
- [x] T031 [P] [US1] Implement LLMResponse type in libs/shared/llm/src/types/llm-types.ts
- [x] T032 [P] [US1] Implement ErrorContext type in libs/shared/llm/src/types/llm-types.ts
- [x] T033 [P] [US1] Implement PromptBuilder service in libs/shared/llm/src/services/prompt-builder.ts
- [x] T034 [P] [US1] Implement ResponseParser service in libs/shared/llm/src/services/response-parser.ts
- [x] T035 [P] [US1] Implement RateLimiter service in libs/shared/llm/src/services/rate-limiter.ts
- [x] T036 [P] [US1] Implement ErrorHandler utility in libs/shared/llm/src/utils/error-handler.ts
- [x] T037 [US1] Implement LLMService main service in libs/shared/llm/src/services/llm-service.ts (depends on T033-T036)
- [ ] T038 [US1] Create Supabase table for prompt_templates in supabase/migrations/001_prompt_templates.sql
- [ ] T039 [US1] Create Supabase table for rate_limit_configs in supabase/migrations/002_rate_limit_configs.sql
- [ ] T040 [US1] Create Supabase table for llm_requests in supabase/migrations/003_llm_requests.sql
- [ ] T041 [US1] Create Supabase table for llm_responses in supabase/migrations/004_llm_responses.sql
- [ ] T042 [US1] Create Supabase table for formatted_outputs in supabase/migrations/005_formatted_outputs.sql
- [ ] T043 [US1] Create Supabase table for error_contexts in supabase/migrations/006_error_contexts.sql
- [x] T044 [US1] Implement Supabase client integration in libs/shared/llm/src/utils/supabase-client.ts
- [x] T045 [US1] Create Next.js API route for LLM processing in apps/web/src/app/api/llm/process/route.ts
- [x] T046 [US1] Create Next.js API route for request status in apps/web/src/app/api/llm/requests/[requestId]/route.ts
- [x] T047 [US1] Create Next.js API route for rate limit status in apps/web/src/app/api/llm/rate-limit/status/route.ts
- [x] T048 [US1] Create index.ts exports in libs/shared/llm/src/index.ts
- [x] T049 [US1] Create package.json for llm library in libs/shared/llm/package.json
- [x] T050 [US1] Configure TypeScript path mapping for @bizflow/shared/llm in tsconfig.base.json

**Checkpoint**: At this point, User Story 1 should be fully functional. Domain modules can use shared LLM service to process inputs and receive formatted outputs.

---

## Phase 4: User Story 2 - Domain Module Developer Uses Common Type System (Priority: P1)

**Goal**: Domain module developers can define their module's input and output structures using common type interfaces, ensuring type safety and compatibility with shared components

**Independent Test**: Define a domain module's input/output types using the common type system and verify type compatibility with shared components. Verify no type conversion needed.

**Note**: Core type interfaces (Input/Output) were created in Phase 2. This phase completes the type system with schema validation and module registration.

### Tests for User Story 2

- [ ] T051 [P] [US2] Create unit test for Input schema validation in libs/shared/types/src/__tests__/input-schema.test.ts
- [ ] T052 [P] [US2] Create unit test for Output schema validation in libs/shared/types/src/__tests__/output-schema.test.ts
- [ ] T053 [US2] Create integration test for type system with module registration in libs/shared/types/src/__tests__/integration/module-types.test.ts

### Implementation for User Story 2

- [ ] T054 [P] [US2] Create Supabase table for input_schemas in supabase/migrations/007_input_schemas.sql
- [ ] T055 [P] [US2] Create Supabase table for output_schemas in supabase/migrations/008_output_schemas.sql
- [ ] T056 [P] [US2] Implement InputSchema entity type in libs/shared/types/src/schemas/input-schema.ts
- [ ] T057 [P] [US2] Implement OutputSchema entity type in libs/shared/types/src/schemas/output-schema.ts
- [ ] T058 [US2] Implement schema registration service in libs/shared/types/src/services/schema-registry.ts
- [ ] T059 [US2] Implement Zod schema validation utilities in libs/shared/types/src/utils/zod-utils.ts
- [ ] T060 [US2] Create Next.js API route for schema registration in apps/web/src/app/api/schemas/register/route.ts
- [ ] T061 [US2] Update index.ts to export schema types in libs/shared/types/src/index.ts

**Checkpoint**: At this point, User Story 2 should be complete. Domain modules can register their input/output schemas and use them for validation.

---

## Phase 5: User Story 3 - Domain Module Developer Uses Reusable UI Components (Priority: P2)

**Goal**: Domain module developers can use shared UI components (input forms, result displays, save/download) instead of building custom components, ensuring UI consistency

**Independent Test**: Create a domain module UI that uses shared input form and result display components, demonstrating that common UI patterns are reusable and consistent

### Tests for User Story 3

- [ ] T062 [P] [US3] Create unit test for BaseForm component in libs/shared/ui/src/__tests__/components/input-form/base-form.test.tsx
- [ ] T063 [P] [US3] Create unit test for ResultDisplay component in libs/shared/ui/src/__tests__/components/result-display/result-display.test.tsx
- [ ] T064 [P] [US3] Create unit test for SaveDownload component in libs/shared/ui/src/__tests__/components/save-download/save-download.test.tsx
- [ ] T065 [US3] Create integration test for form submission flow in libs/shared/ui/src/__tests__/integration/form-flow.test.tsx

### Implementation for User Story 3

- [ ] T066 [P] [US3] Create libs/shared/ui library structure with project.json
- [ ] T067 [P] [US3] Install React and React DOM dependencies in libs/shared/ui/package.json
- [ ] T068 [P] [US3] Implement BaseForm component in libs/shared/ui/src/components/input-form/base-form.tsx
- [ ] T069 [P] [US3] Implement form validation logic in libs/shared/ui/src/components/input-form/form-validation.ts
- [ ] T070 [P] [US3] Implement error display component in libs/shared/ui/src/components/input-form/error-display.tsx
- [ ] T071 [P] [US3] Implement ResultDisplay component in libs/shared/ui/src/components/result-display/result-display.tsx
- [ ] T072 [P] [US3] Implement format-specific renderers (json, text, markdown, html) in libs/shared/ui/src/components/result-display/formatters/
- [ ] T073 [P] [US3] Implement SaveDownload component in libs/shared/ui/src/components/save-download/save-download.tsx
- [ ] T074 [US3] Implement copy to clipboard functionality in libs/shared/ui/src/components/save-download/copy-utils.ts
- [ ] T075 [US3] Implement file download functionality in libs/shared/ui/src/components/save-download/download-utils.ts
- [ ] T076 [US3] Create index.ts exports in libs/shared/ui/src/index.ts
- [ ] T077 [US3] Create package.json for ui library in libs/shared/ui/package.json
- [ ] T078 [US3] Configure TypeScript path mapping for @bizflow/shared/ui in tsconfig.base.json

**Checkpoint**: At this point, User Story 3 should be complete. Domain modules can use shared UI components for consistent user experience.

---

## Phase 6: User Story 4 - System Administrator Configures Rate Limiting (Priority: P3)

**Goal**: System administrators can configure rate limiting for LLM API calls to prevent exceeding API quotas and manage costs

**Independent Test**: Configure rate limits and verify that requests exceeding the limit are properly queued or rejected. Verify administrators receive warnings when quotas are approached.

### Tests for User Story 4

- [ ] T079 [P] [US4] Create unit test for rate limit configuration in libs/shared/llm/src/__tests__/rate-limit-config.test.ts
- [ ] T080 [US4] Create integration test for rate limit enforcement in libs/shared/llm/src/__tests__/integration/rate-limit-enforcement.test.ts

### Implementation for User Story 4

- [ ] T081 [P] [US4] Create admin UI component for rate limit configuration in apps/web/src/components/admin/rate-limit-config.tsx
- [ ] T082 [US4] Create Next.js API route for rate limit configuration in apps/web/src/app/api/admin/rate-limit/route.ts
- [ ] T083 [US4] Implement rate limit configuration service in libs/shared/llm/src/services/rate-limit-config.ts
- [ ] T084 [US4] Implement quota warning system in libs/shared/llm/src/services/quota-warning.ts
- [ ] T085 [US4] Create Supabase function for quota monitoring in supabase/functions/monitor-quota.sql

**Checkpoint**: At this point, User Story 4 should be complete. Administrators can configure rate limits and receive quota warnings.

---

## Phase 7: Shared Utilities Library

**Purpose**: Common utility functions used across all shared libraries

- [ ] T086 [P] Create libs/shared/utils library structure with project.json
- [ ] T087 [P] Implement data transformation utilities in libs/shared/utils/src/data-transformation.ts
- [ ] T088 [P] Implement formatting utilities in libs/shared/utils/src/formatting.ts
- [ ] T089 [P] Implement error utilities in libs/shared/utils/src/error-utils.ts
- [ ] T090 [P] Create index.ts exports in libs/shared/utils/src/index.ts
- [ ] T091 [P] Create package.json for utils library in libs/shared/utils/package.json
- [ ] T092 [P] Configure TypeScript path mapping for @bizflow/shared/utils in tsconfig.base.json

---

## Phase 8: Shared Forms Library

**Purpose**: Form components and validation utilities

- [ ] T093 [P] Create libs/shared/forms library structure with project.json
- [ ] T094 [P] Implement base form component in libs/shared/forms/src/components/base-form/base-form.tsx
- [ ] T095 [P] Implement validation utilities in libs/shared/forms/src/validators/validators.ts
- [ ] T096 [P] Create index.ts exports in libs/shared/forms/src/index.ts
- [ ] T097 [P] Create package.json for forms library in libs/shared/forms/package.json
- [ ] T098 [P] Configure TypeScript path mapping for @bizflow/shared/forms in tsconfig.base.json

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T099 [P] Create comprehensive documentation in docs/shared-libraries.md
- [ ] T100 [P] Update quickstart.md with actual implementation examples
- [ ] T101 [P] Add JSDoc comments to all public APIs in libs/shared/*/src/
- [ ] T102 [P] Configure ESLint rules for all shared libraries in .eslintrc.json
- [ ] T103 [P] Configure Prettier formatting in .prettierrc.json
- [ ] T104 [P] Set up Nx Cloud integration for build caching
- [ ] T105 [P] Configure Vercel deployment settings in vercel.json
- [ ] T106 [P] Create GitHub Actions workflow for CI/CD in .github/workflows/ci.yml
- [ ] T107 [P] Add environment variable validation in libs/shared/utils/src/env-validation.ts
- [ ] T108 [P] Implement comprehensive logging system in libs/shared/utils/src/logger.ts
- [ ] T109 [P] Add error boundary components in libs/shared/ui/src/components/error-boundary.tsx
- [ ] T110 [P] Create example domain module demonstrating usage in examples/sample-module/
- [ ] T111 Run quickstart.md validation and update if needed
- [ ] T112 [P] Performance optimization: Add request caching in libs/shared/llm/src/services/cache.ts
- [ ] T113 [P] Security hardening: Add input sanitization in libs/shared/utils/src/sanitization.ts
- [ ] T114 [P] Security hardening: Add rate limit headers to API responses

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) - Needs Input/Output types
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) - Completes type system
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2) and User Story 1 (Phase 3) - Uses types and LLM service
- **User Story 4 (Phase 6)**: Depends on User Story 1 (Phase 3) - Configures rate limiting for LLM service
- **Shared Utilities (Phase 7)**: Can start after Foundational (Phase 2) - Independent
- **Shared Forms (Phase 8)**: Can start after Foundational (Phase 2) - Independent
- **Polish (Phase 9)**: Depends on all previous phases being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Independent, completes type system
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) and User Story 1 (Phase 3) - Uses LLM service output
- **User Story 4 (P3)**: Can start after User Story 1 (Phase 3) - Configures rate limiting

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD)
- Types/models before services
- Services before API routes/UI components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- **Setup Phase**: All tasks marked [P] can run in parallel (T002-T010)
- **Foundational Phase**: All implementation tasks marked [P] can run in parallel (T015-T021)
- **User Story 1**: 
  - All test tasks can run in parallel (T022-T028)
  - Type definitions can run in parallel (T030-T032)
  - Service implementations can run in parallel (T033-T036)
  - Database migrations can run sequentially but independently
- **User Story 2**: All tasks marked [P] can run in parallel
- **User Story 3**: All component implementations marked [P] can run in parallel
- **User Story 4**: Configuration tasks can run in parallel
- **Different user stories**: Can be worked on in parallel by different team members after Foundational phase

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task T022: "Create unit test for LLMService.process()"
Task T023: "Create unit test for PromptBuilder"
Task T024: "Create unit test for ResponseParser"
Task T025: "Create unit test for RateLimiter"
Task T026: "Create unit test for ErrorHandler"

# Launch all type definitions together:
Task T030: "Implement LLMRequest type"
Task T031: "Implement LLMResponse type"
Task T032: "Implement ErrorContext type"

# Launch all service implementations together:
Task T033: "Implement PromptBuilder service"
Task T034: "Implement ResponseParser service"
Task T035: "Implement RateLimiter service"
Task T036: "Implement ErrorHandler utility"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Shared LLM Service)
4. Complete Phase 4: User Story 2 (Complete Type System)
5. **STOP and VALIDATE**: Test both stories independently
6. Deploy/demo if ready

**MVP Scope**: Core infrastructure with LLM service and type system. Domain modules can integrate LLM functionality with type safety.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (LLM Service MVP)
3. Add User Story 2 → Test independently → Deploy/Demo (Complete Type System)
4. Add User Story 3 → Test independently → Deploy/Demo (UI Components)
5. Add User Story 4 → Test independently → Deploy/Demo (Rate Limiting Admin)
6. Add Shared Utilities & Forms → Enhance functionality
7. Polish & Cross-Cutting → Production ready

### Parallel Team Strategy

With multiple developers:

1. **Team completes Setup + Foundational together**
2. **Once Foundational is done**:
   - Developer A: User Story 1 (LLM Service)
   - Developer B: User Story 2 (Type System) - Can start immediately after Foundational
   - Developer C: Shared Utilities (Phase 7) - Can start after Foundational
3. **After User Story 1 completes**:
   - Developer A: User Story 3 (UI Components) - Uses LLM service
   - Developer B: User Story 4 (Rate Limiting) - Configures LLM service
   - Developer C: Shared Forms (Phase 8)
4. **Stories complete and integrate independently**

---

## Task Summary

- **Total Tasks**: 114
- **Setup Phase**: 10 tasks
- **Foundational Phase**: 11 tasks (11 tests + implementation)
- **User Story 1**: 29 tasks (7 tests + 22 implementation)
- **User Story 2**: 11 tasks (3 tests + 8 implementation)
- **User Story 3**: 17 tasks (4 tests + 13 implementation)
- **User Story 4**: 7 tasks (2 tests + 5 implementation)
- **Shared Utilities**: 7 tasks
- **Shared Forms**: 6 tasks
- **Polish Phase**: 16 tasks

### Parallel Opportunities Identified

- **Setup**: 8 parallel tasks
- **Foundational**: 7 parallel implementation tasks
- **User Story 1**: 15+ parallel tasks (tests, types, services)
- **User Story 2**: 6 parallel tasks
- **User Story 3**: 10+ parallel component tasks
- **User Story 4**: 3 parallel tasks
- **Polish**: 14 parallel tasks

### Independent Test Criteria

- **Foundational**: Test module imports Input/Output types and verifies compatibility
- **User Story 1**: Minimal domain module uses LLM service, handles errors, queues requests
- **User Story 2**: Domain module registers schemas and uses them for validation
- **User Story 3**: Domain module UI uses shared components, demonstrates consistency
- **User Story 4**: Administrator configures rate limits, verifies enforcement and warnings

### Suggested MVP Scope

**MVP includes**:
- Phase 1: Setup ✅
- Phase 2: Foundational ✅
- Phase 3: User Story 1 (Shared LLM Service) ✅
- Phase 4: User Story 2 (Complete Type System) ✅

**MVP excludes**:
- User Story 3 (UI Components) - Can be added incrementally
- User Story 4 (Rate Limiting Admin) - Can use defaults initially
- Shared Utilities & Forms - Can be added as needed
- Polish phase - Can be done iteratively

**MVP delivers**: Core infrastructure enabling domain modules to integrate LLM functionality with type safety.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All file paths follow Nx monorepo conventions
- TypeScript strict mode enforced throughout
- All shared libraries must be independently buildable and testable

