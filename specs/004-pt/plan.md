# Implementation Plan: PT / Fitness Module

**Branch**: `004-pt` | **Date**: 2025-12-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-pt/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build the PT/Fitness module for BizFlow AI that enables personal trainers and fitness center operators to generate marketing content for their fitness programs. The module accepts program information (name, type, goals, duration, price, features, target customers) and generates comprehensive marketing content including program introductions, exercise effect descriptions, SNS promotional posts, member recruitment ad copy, target customer-focused marketing copy, hashtag recommendations, and price evaluation/recommendation. This module follows the established Input → LLM Processing → Output pattern using shared infrastructure (LLM service, type system, UI components) and maintains consistency with existing ecommerce and realestate modules.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)  
**Primary Dependencies**:

- Next.js 16+ (App Router)
- Nx workspace tools
- Shared LLM service (`@bizflow/shared/llm`)
- Shared type system (`@bizflow/shared/types`)
- Shared UI components (`@bizflow/shared/ui`)
- Supabase client libraries (for prompt template storage)
- LLM API client (OpenAI via shared LLM service)
- React 19+
- Zod (for runtime validation, via shared libraries)

**Storage**:

- Supabase PostgreSQL (for prompt template storage via shared LLM service)
- Supabase Storage (for program images, optional for MVP)
- Environment variables (Vercel) for API keys and configuration

**Testing**:

- Jest (unit tests)
- React Testing Library (component tests)
- Nx test runners

**Target Platform**:

- Web (Next.js applications deployed to Vercel)
- Serverless functions (Vercel Edge Functions for API routes)

**Project Type**: Web application module (part of Nx monorepo)

**Performance Goals**:

- Content generation: < 2 minutes from form submission (as per SC-001)
- LLM API calls: < 5 seconds response time (p95, via shared LLM service)
- UI component rendering: < 100ms initial render
- Form submission processing: < 3 minutes total (as per SC-007)

**Constraints**:

- Must work within Vercel serverless function limits (10s timeout for Hobby, 60s for Pro)
- Must use shared LLM service for all LLM interactions (no direct API calls)
- Must follow existing module patterns (ecommerce, realestate)
- Type safety enforced at compile time (no runtime type errors)
- Must support Korean language content generation

**Scale/Scope**:

- Single domain module (PT/Fitness)
- Depends on 3 shared libraries (types, llm, ui)
- Supports all program types (diet, strength training, yoga, pilates, boxing, crossfit, etc.)
- Supports multiple target customer segments (beginners, intermediate, advanced, female, male, seniors, office workers)
- Generates 7+ content formats per program

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### I. Module-First Architecture ✅

- **Status**: PASS
- **Compliance**: PT module is implemented as an independent module within Nx monorepo. Module follows Input → LLM Processing → Output pattern. Module depends on shared libraries, not vice versa. Module can be built and tested independently.

### II. Shared Component Reusability ✅

- **Status**: PASS
- **Compliance**: PT module uses shared LLM service, shared type system, and shared UI components. No duplication of common functionality. All shared components are consumed from `@bizflow/shared/*` libraries.

### III. Type Safety & TypeScript First ✅

- **Status**: PASS
- **Compliance**: All code will be written in TypeScript with strict mode. Module-specific types defined in `modules/pt/src/types/pt-types.ts`. Shared interfaces from `@bizflow/shared/types`. No `any` types allowed.

### IV. Test-First Development ✅

- **Status**: PASS
- **Compliance**: TDD will be enforced. Module will have unit tests for services, component tests for UI, and integration tests for LLM interactions. Test coverage target: 80%+ for critical paths.

### V. LLM Integration Pattern ✅

- **Status**: PASS
- **Compliance**: Consistent pattern: Input validation → Prompt construction (via shared LLM service) → LLM API call → Response parsing → Output formatting. Rate limiting and error handling at shared LLM service layer. PT-specific prompt templates stored in Supabase.

### VI. Progressive Module Development ✅

- **Status**: PASS
- **Compliance**: PT module (P3) follows after ecommerce (P1) and realestate (P2). Core infrastructure is already built and available. Module uses established patterns from previous modules.

### VII. Nx Monorepo Standards ✅

- **Status**: PASS
- **Compliance**: Module structure follows Nx conventions. Module is an independent Nx project with project.json, package.json, tsconfig files. Build, test, lint commands work at module level.

### Deployment & Infrastructure ✅

- **Status**: PASS
- **Compliance**: Module is part of Next.js application deployed to Vercel. Uses Supabase for prompt template storage. Environment variables managed through Vercel.

### CI/CD Pipeline ✅

- **Status**: PASS
- **Compliance**: Module follows existing CI/CD pipeline. GitHub Actions for CI, Nx Cloud for build caching, Vercel for deployment. All quality gates must pass before deployment.

**Overall Status**: ✅ ALL GATES PASSED - Ready to proceed with implementation planning.

### Post-Design Constitution Check

_Re-evaluated after Phase 1 design completion_

All gates remain PASSED after design phase:

- **Module-First Architecture**: ✅ Design maintains clear separation with shared libraries
- **Shared Component Reusability**: ✅ All components properly organized, uses shared libraries
- **Type Safety**: ✅ Type system designed with TypeScript strict mode
- **Test-First Development**: ✅ Testing strategy defined with Jest and RTL
- **LLM Integration Pattern**: ✅ Consistent pattern using shared LLM service
- **Progressive Module Development**: ✅ Follows established patterns from ecommerce/realestate
- **Nx Monorepo Standards**: ✅ Structure follows Nx conventions
- **Deployment & Infrastructure**: ✅ Vercel + Supabase integration follows existing pattern
- **CI/CD Pipeline**: ✅ Follows existing pipeline configuration

**Overall Status**: ✅ ALL GATES PASSED - Design phase complete, ready for task generation.

## Project Structure

### Documentation (this feature)

```text
specs/004-pt/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── pt-module-api.md # PT module API contract
├── checklists/          # Quality checklists
│   └── requirements.md  # Specification quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
modules/pt/              # PT/Fitness domain module
├── src/
│   ├── types/
│   │   └── pt-types.ts  # PT-specific types (PTProgramInput, PTGeneratedContent)
│   ├── services/
│   │   ├── pt-content-service.ts  # Main service for content generation
│   │   └── index.ts
│   └── index.ts         # Module exports
├── __tests__/           # Unit tests
│   ├── pt-content-service.test.ts
│   └── pt-types.test.ts
├── project.json         # Nx project configuration
├── package.json         # Module package.json
├── tsconfig.json        # TypeScript configuration
├── tsconfig.lib.json    # Library build configuration
├── tsconfig.spec.json   # Test configuration
└── jest.config.ts       # Jest configuration

apps/web/src/app/
├── api/
│   └── pt/
│       └── generate/
│           └── route.ts  # POST /api/pt/generate endpoint
├── pt/
│   ├── page.tsx         # PT input form page
│   └── result/
│       └── page.tsx      # PT result display page

supabase/migrations/
└── 006_insert_pt_prompt_templates.sql  # PT prompt template migration
```

**Structure Decision**: PT module follows the same structure as ecommerce and realestate modules. Module is an independent Nx library in `modules/pt/` that depends on shared libraries. API routes and pages are added to `apps/web/` following existing patterns. Prompt templates are stored in Supabase via migration.

## Complexity Tracking

> **No Constitution violations identified. All principles are followed.**

No violations to justify. The structure follows existing module patterns (ecommerce, realestate) and Nx best practices. All shared components are reused, no duplication.

---

## Phase Completion Report

### Phase 0: Research ✅ COMPLETE

**Generated Artifacts**:

- `research.md` - Technology choices, best practices, and integration patterns documented

**Key Decisions**:

- Reuse existing shared infrastructure (LLM service, types, UI components)
- Follow established module patterns from ecommerce and realestate modules
- Use Supabase for prompt template storage (consistent with other modules)
- Support Korean language content generation (consistent with other modules)
- Target customer segmentation approach (similar to realestate module)
- Price evaluation/recommendation pattern (similar to ecommerce module)
- Program type-specific content generation (unique to PT module)

**Research Findings**:

- All technology choices align with existing infrastructure
- No new dependencies required
- Prompt template design follows established patterns
- Target customer segmentation strategy validated
- Price evaluation approach confirmed

### Phase 1: Design & Contracts ✅ COMPLETE

**Generated Artifacts**:

- `data-model.md` - Entity definitions, relationships, and data flow
- `contracts/pt-module-api.md` - PT module API contract
- `quickstart.md` - Developer quick start guide
- Agent context updated (`.cursor/rules/specify-rules.mdc`)

**Key Design Elements**:

- 2 core entities defined (PTProgramInput, PTGeneratedContent)
- RESTful API contract for PT module (`POST /api/pt/generate`)
- Type-safe interfaces extending shared Input/Output types
- Comprehensive data model with validation rules
- Target customer copy structure (beginners, intermediate, advanced, female, male, seniors, office workers)
- Program type-specific content generation
- Developer-friendly quick start guide

**Design Validation**:

- All entities follow existing module patterns
- API contract consistent with ecommerce/realestate modules
- Data flow matches shared LLM service integration pattern
- Type safety maintained throughout

### Next Steps

Ready for `/speckit.tasks` command to generate actionable task list for implementation.
