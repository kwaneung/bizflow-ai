# Tasks: PT / Fitness Module

**Input**: Design documents from `/specs/004-pt/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: TDD approach required per Constitution. Tests MUST be written first and fail before implementation.

**Organization**: Tasks are organized by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2], [US3])
- Include exact file paths in descriptions

## Path Conventions

- **Nx Monorepo**: `modules/pt/` for PT domain module
- **API Routes**: `apps/web/src/app/api/pt/` for Next.js API routes
- **Pages**: `apps/web/src/app/pt/` for Next.js pages
- **Migrations**: `supabase/migrations/` for database migrations
- Paths follow Nx conventions as defined in plan.md

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize Nx module structure and basic configuration

- [x] T001 Create Nx library structure for PT module in modules/pt/
- [x] T002 [P] Create project.json for PT module in modules/pt/project.json
- [x] T003 [P] Create package.json for PT module in modules/pt/package.json
- [x] T004 [P] Create tsconfig.json for PT module in modules/pt/tsconfig.json
- [x] T005 [P] Create tsconfig.lib.json for PT module in modules/pt/tsconfig.lib.json
- [x] T006 [P] Create tsconfig.spec.json for PT module in modules/pt/tsconfig.spec.json
- [x] T007 [P] Create jest.config.ts for PT module in modules/pt/jest.config.ts
- [x] T008 [P] Configure TypeScript path mapping for @bizflow/modules/pt in tsconfig.base.json
- [x] T009 [P] Create src/index.ts module exports in modules/pt/src/index.ts

**Checkpoint**: PT module structure initialized, ready for foundational work

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

**Goal**: PT module prompt templates are stored in Supabase and ready for use

**Independent Test**: Verify prompt templates can be retrieved from Supabase using module_id='pt'

- [x] T010 Create Supabase migration for PT prompt templates in supabase/migrations/006_insert_pt_prompt_templates.sql
- [x] T011 [P] Insert prompt template for program introduction (pt-program-introduction-v1) in supabase/migrations/006_insert_pt_prompt_templates.sql
- [x] T012 [P] Insert prompt template for exercise effects (pt-exercise-effects-v1) in supabase/migrations/006_insert_pt_prompt_templates.sql
- [x] T013 [P] Insert prompt template for SNS posts (pt-sns-posts-v1) in supabase/migrations/006_insert_pt_prompt_templates.sql
- [x] T014 [P] Insert prompt template for recruitment ad copy (pt-recruitment-ad-v1) in supabase/migrations/006_insert_pt_prompt_templates.sql
- [x] T015 [P] Insert prompt template for target customer copy (pt-target-customer-copy-v1) in supabase/migrations/006_insert_pt_prompt_templates.sql
- [x] T016 [P] Insert prompt template for hashtags (pt-hashtags-v1) in supabase/migrations/006_insert_pt_prompt_templates.sql
- [x] T017 [P] Insert prompt template for price insight (pt-price-insight-v1) in supabase/migrations/006_insert_pt_prompt_templates.sql

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Personal Trainer Manually Enters Program Information (Priority: P1) 🎯 MVP

**Goal**: Trainers can manually enter program information and generate all marketing content formats (program introduction, exercise effects, SNS posts, recruitment ad copy, target customer-focused copy, hashtags, price insight)

**Independent Test**: Can be fully tested by manually entering program information (program name, type, goals, duration, price, features, target customers) and verifying that all output formats are generated correctly. This delivers immediate value by automating content generation for fitness programs.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T018 [P] [US1] Create unit test for PTProgramInput type validation in modules/pt/src/__tests__/pt-types.test.ts
- [ ] T019 [P] [US1] Create unit test for PTGeneratedContent type validation in modules/pt/src/__tests__/pt-types.test.ts
- [ ] T020 [P] [US1] Create unit test for PTContentService.generateContent() in modules/pt/src/__tests__/pt-content-service.test.ts
- [ ] T021 [US1] Create integration test for PT content generation flow in modules/pt/src/__tests__/integration/pt-content-flow.test.ts

### Implementation for User Story 1

- [x] T022 [P] [US1] Create PTProgramInput interface in modules/pt/src/types/pt-types.ts
- [x] T023 [P] [US1] Create PTGeneratedContent interface in modules/pt/src/types/pt-types.ts
- [x] T024 [P] [US1] Create PTProgramInput type extending Input<PTProgramInput> in modules/pt/src/types/pt-types.ts
- [x] T025 [P] [US1] Create PTGeneratedContent type extending Output<PTGeneratedContent> in modules/pt/src/types/pt-types.ts
- [x] T026 [US1] Implement PTContentService class in modules/pt/src/services/pt-content-service.ts (depends on T022-T025)
- [x] T027 [US1] Implement generateContent() method in modules/pt/src/services/pt-content-service.ts using shared LLM service
- [x] T028 [US1] Implement prompt construction for program introduction in modules/pt/src/services/pt-content-service.ts
- [x] T029 [US1] Implement prompt construction for exercise effects in modules/pt/src/services/pt-content-service.ts
- [x] T030 [US1] Implement prompt construction for SNS posts in modules/pt/src/services/pt-content-service.ts
- [x] T031 [US1] Implement prompt construction for recruitment ad copy in modules/pt/src/services/pt-content-service.ts
- [x] T032 [US1] Implement prompt construction for target customer copy in modules/pt/src/services/pt-content-service.ts
- [x] T033 [US1] Implement prompt construction for hashtags in modules/pt/src/services/pt-content-service.ts
- [x] T034 [US1] Implement prompt construction for price insight in modules/pt/src/services/pt-content-service.ts
- [x] T035 [US1] Implement response parsing and output formatting in modules/pt/src/services/pt-content-service.ts
- [x] T036 [US1] Add error handling and validation in modules/pt/src/services/pt-content-service.ts
- [x] T037 [US1] Export PT types and service in modules/pt/src/index.ts
- [x] T038 [US1] Create Next.js API route POST /api/pt/generate in apps/web/src/app/api/pt/generate/route.ts
- [x] T039 [US1] Implement request validation in apps/web/src/app/api/pt/generate/route.ts
- [x] T040 [US1] Implement PTContentService integration in apps/web/src/app/api/pt/generate/route.ts
- [x] T041 [US1] Implement response formatting in apps/web/src/app/api/pt/generate/route.ts
- [x] T042 [US1] Add error handling in apps/web/src/app/api/pt/generate/route.ts
- [x] T043 [US1] Create PT input form page in apps/web/src/app/pt/page.tsx
- [x] T044 [US1] Implement program name input field in apps/web/src/app/pt/page.tsx
- [x] T045 [US1] Implement program type input field in apps/web/src/app/pt/page.tsx
- [x] T046 [US1] Implement goals input field in apps/web/src/app/pt/page.tsx
- [x] T047 [US1] Implement duration input field in apps/web/src/app/pt/page.tsx
- [x] T048 [US1] Implement price input field in apps/web/src/app/pt/page.tsx
- [x] T049 [US1] Implement features input field (multi-select) in apps/web/src/app/pt/page.tsx
- [x] T050 [US1] Implement target customers input field (multi-select) in apps/web/src/app/pt/page.tsx
- [x] T051 [US1] Implement trainer info input fields (optional) in apps/web/src/app/pt/page.tsx
- [x] T052 [US1] Implement form validation in apps/web/src/app/pt/page.tsx
- [x] T053 [US1] Implement form submission and API call in apps/web/src/app/pt/page.tsx
- [x] T054 [US1] Implement loading state and error handling in apps/web/src/app/pt/page.tsx
- [x] T055 [US1] Implement navigation to result page with generated content in apps/web/src/app/pt/page.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional. Trainers can enter program information and generate all content formats.

---

## Phase 4: User Story 2 - Personal Trainer Uses Generated Content (Priority: P2)

**Goal**: Trainers can view, copy, download, and customize generated content for different use cases (program page, SNS, recruitment)

**Independent Test**: Can be fully tested by generating content and verifying that trainers can view all formats, copy content to clipboard, download as files, and see content formatted appropriately for each use case (program page, SNS, recruitment). This delivers value by making generated content immediately usable.

### Tests for User Story 2

- [ ] T056 [P] [US2] Create unit test for result page content display in apps/web/src/app/pt/result/__tests__/page.test.tsx
- [ ] T057 [P] [US2] Create unit test for copy to clipboard functionality in apps/web/src/app/pt/result/__tests__/page.test.tsx
- [ ] T058 [P] [US2] Create unit test for download functionality in apps/web/src/app/pt/result/__tests__/page.test.tsx

### Implementation for User Story 2

- [ ] T059 [US2] Create PT result display page in apps/web/src/app/pt/result/page.tsx
- [ ] T060 [US2] Implement content data parsing from URL params in apps/web/src/app/pt/result/page.tsx
- [ ] T061 [US2] Implement program introduction display section in apps/web/src/app/pt/result/page.tsx
- [ ] T062 [US2] Implement exercise effects display section in apps/web/src/app/pt/result/page.tsx
- [ ] T063 [US2] Implement SNS posts display section (Instagram, Facebook) in apps/web/src/app/pt/result/page.tsx
- [ ] T064 [US2] Implement recruitment ad copy display section in apps/web/src/app/pt/result/page.tsx
- [ ] T065 [US2] Implement target customer copy display section (with tabs for different segments) in apps/web/src/app/pt/result/page.tsx
- [ ] T066 [US2] Implement hashtags display section in apps/web/src/app/pt/result/page.tsx
- [ ] T067 [US2] Implement price insight display section in apps/web/src/app/pt/result/page.tsx
- [ ] T068 [US2] Implement copy to clipboard functionality for each content section in apps/web/src/app/pt/result/page.tsx
- [ ] T069 [US2] Implement download as file functionality (JSON, TXT formats) in apps/web/src/app/pt/result/page.tsx
- [ ] T070 [US2] Implement content formatting for program page use case in apps/web/src/app/pt/result/page.tsx
- [ ] T071 [US2] Implement content formatting for SNS use case in apps/web/src/app/pt/result/page.tsx
- [ ] T072 [US2] Implement content formatting for recruitment use case in apps/web/src/app/pt/result/page.tsx
- [ ] T073 [US2] Implement edit/customize functionality for generated content in apps/web/src/app/pt/result/page.tsx
- [ ] T074 [US2] Implement navigation back to input form in apps/web/src/app/pt/result/page.tsx
- [ ] T075 [US2] Add loading states and error handling in apps/web/src/app/pt/result/page.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Trainers can generate content and use it effectively.

---

## Phase 5: User Story 3 - Personal Trainer Saves and Reuses Program Content (Priority: P3)

**Goal**: Trainers can save generated content, view history, and reuse or modify previously generated content

**Independent Test**: Can be fully tested by generating content, saving it, and verifying that saved content can be retrieved, modified, and reused. This delivers value by enabling trainers to build a library of program content.

### Tests for User Story 3

- [ ] T076 [P] [US3] Create unit test for content saving functionality in modules/pt/src/__tests__/pt-content-storage.test.ts
- [ ] T077 [P] [US3] Create unit test for content retrieval functionality in modules/pt/src/__tests__/pt-content-storage.test.ts
- [ ] T078 [US3] Create integration test for content management flow in modules/pt/src/__tests__/integration/pt-content-management.test.ts

### Implementation for User Story 3

- [ ] T079 [US3] Create Supabase migration for saved_program_contents table in supabase/migrations/007_create_saved_program_contents.sql
- [ ] T080 [US3] Create SavedProgramContent entity type in modules/pt/src/types/pt-types.ts
- [ ] T081 [US3] Implement content saving service method in modules/pt/src/services/pt-content-service.ts
- [ ] T082 [US3] Implement content retrieval service method in modules/pt/src/services/pt-content-service.ts
- [ ] T083 [US3] Implement content list/history service method in modules/pt/src/services/pt-content-service.ts
- [ ] T084 [US3] Implement content update service method in modules/pt/src/services/pt-content-service.ts
- [ ] T085 [US3] Implement content delete service method in modules/pt/src/services/pt-content-service.ts
- [ ] T086 [US3] Create Next.js API route POST /api/pt/save in apps/web/src/app/api/pt/save/route.ts
- [ ] T087 [US3] Create Next.js API route GET /api/pt/history in apps/web/src/app/api/pt/history/route.ts
- [ ] T088 [US3] Create Next.js API route GET /api/pt/content/[id] in apps/web/src/app/api/pt/content/[id]/route.ts
- [ ] T089 [US3] Create Next.js API route PUT /api/pt/content/[id] in apps/web/src/app/api/pt/content/[id]/route.ts
- [ ] T090 [US3] Create Next.js API route DELETE /api/pt/content/[id] in apps/web/src/app/api/pt/content/[id]/route.ts
- [ ] T091 [US3] Implement save button in result page in apps/web/src/app/pt/result/page.tsx
- [ ] T092 [US3] Implement history view page in apps/web/src/app/pt/history/page.tsx
- [ ] T093 [US3] Implement saved content list display in apps/web/src/app/pt/history/page.tsx
- [ ] T094 [US3] Implement open saved content functionality in apps/web/src/app/pt/history/page.tsx
- [ ] T095 [US3] Implement edit saved content functionality in apps/web/src/app/pt/history/page.tsx
- [ ] T096 [US3] Implement delete saved content functionality in apps/web/src/app/pt/history/page.tsx
- [ ] T097 [US3] Add navigation link to history page in apps/web/src/app/pt/page.tsx

**Checkpoint**: At this point, all user stories should be independently functional. Trainers can generate, use, save, and manage program content.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T098 [P] Update main page to include PT module card in apps/web/src/app/page.tsx
- [ ] T099 [P] Add PT module navigation link in apps/web/src/app/page.tsx
- [ ] T100 [P] Add comprehensive error messages and user feedback throughout PT module
- [ ] T101 [P] Implement loading skeletons for better UX in apps/web/src/app/pt/page.tsx and apps/web/src/app/pt/result/page.tsx
- [ ] T102 [P] Add input validation error messages in apps/web/src/app/pt/page.tsx
- [ ] T103 [P] Add success notifications for copy/download actions in apps/web/src/app/pt/result/page.tsx
- [ ] T104 [P] Implement responsive design for mobile devices in apps/web/src/app/pt/page.tsx and apps/web/src/app/pt/result/page.tsx
- [ ] T105 [P] Add accessibility features (ARIA labels, keyboard navigation) in PT module pages
- [ ] T106 [P] Code cleanup and refactoring across PT module
- [ ] T107 [P] Performance optimization (lazy loading, code splitting) in PT module pages
- [ ] T108 [P] Additional unit tests for edge cases in modules/pt/src/__tests__/
- [ ] T109 [P] Integration tests for complete user journeys in modules/pt/src/__tests__/integration/
- [ ] T110 [P] Security hardening (input sanitization, rate limiting validation)
- [ ] T111 [P] Run quickstart.md validation to ensure all examples work
- [ ] T112 [P] Documentation updates (README, API docs) in modules/pt/README.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on User Story 1 for content generation
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Depends on User Story 1 for content structure, may integrate with User Story 2

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Types before services
- Services before endpoints
- Endpoints before pages
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, User Story 1 can start
- All tests for a user story marked [P] can run in parallel
- Types within a story marked [P] can run in parallel
- Different API routes can be implemented in parallel (if no shared state)
- UI components can be implemented in parallel (if no shared state)

---

## Parallel Example: User Story 1

```bash
# Launch all type definitions for User Story 1 together:
Task: "Create PTProgramInput interface in modules/pt/src/types/pt-types.ts"
Task: "Create PTGeneratedContent interface in modules/pt/src/types/pt-types.ts"
Task: "Create PTProgramInput type extending Input<PTProgramInput> in modules/pt/src/types/pt-types.ts"
Task: "Create PTGeneratedContent type extending Output<PTGeneratedContent> in modules/pt/src/types/pt-types.ts"

# Launch all prompt construction methods together (after service class exists):
Task: "Implement prompt construction for program introduction in modules/pt/src/services/pt-content-service.ts"
Task: "Implement prompt construction for exercise effects in modules/pt/src/services/pt-content-service.ts"
Task: "Implement prompt construction for SNS posts in modules/pt/src/services/pt-content-service.ts"
Task: "Implement prompt construction for recruitment ad copy in modules/pt/src/services/pt-content-service.ts"
Task: "Implement prompt construction for target customer copy in modules/pt/src/services/pt-content-service.ts"
Task: "Implement prompt construction for hashtags in modules/pt/src/services/pt-content-service.ts"
Task: "Implement prompt construction for price insight in modules/pt/src/services/pt-content-service.ts"

# Launch all form input fields together:
Task: "Implement program name input field in apps/web/src/app/pt/page.tsx"
Task: "Implement program type input field in apps/web/src/app/pt/page.tsx"
Task: "Implement goals input field in apps/web/src/app/pt/page.tsx"
Task: "Implement duration input field in apps/web/src/app/pt/page.tsx"
Task: "Implement price input field in apps/web/src/app/pt/page.tsx"
Task: "Implement features input field (multi-select) in apps/web/src/app/pt/page.tsx"
Task: "Implement target customers input field (multi-select) in apps/web/src/app/pt/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (types, service, API, input page)
   - Developer B: Prepares User Story 2 (result page structure)
   - Developer C: Prepares User Story 3 (database schema, storage service)
3. After User Story 1 completes:
   - Developer A: Moves to User Story 2
   - Developer B: Implements User Story 2 features
   - Developer C: Implements User Story 3 features
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All file paths are absolute or relative to repository root
- Follow existing patterns from ecommerce and realestate modules
- Use shared UI components from @bizflow/shared/ui
- Use shared LLM service from @bizflow/shared/llm
- Use shared types from @bizflow/shared/types

