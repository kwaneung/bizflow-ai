<!--
Sync Impact Report:
- Version change: 1.0.1 → 1.0.2
- Modified principles: None
- Added sections: Deployment & Infrastructure, CI/CD Pipeline
- Updated sections: Technology Stack - added deployment platform, backend/DB, CI/CD tools
- Templates requiring updates: None
- Follow-up TODOs: None
-->

# BizFlow AI Constitution

## Core Principles

### I. Module-First Architecture

Every business domain (ecommerce, realestate, pt, etc.) MUST be implemented as an independent, self-contained module within the Nx monorepo. Modules MUST follow the pattern: Input → LLM Processing → Output. Each module MUST be independently testable, deployable, and maintainable. Clear module boundaries required - no cross-module dependencies except through shared libraries.

### II. Shared Component Reusability

Common functionality (input forms, LLM API calls, result displays, save/download features) MUST be extracted into shared libraries within the monorepo. Modules MUST consume shared components rather than duplicating logic. Shared libraries MUST be versioned and follow semantic versioning for breaking changes.

### III. Type Safety & TypeScript First

All code MUST be written in TypeScript with strict type checking enabled. Type definitions MUST be defined before implementation. Shared interfaces and types MUST be defined in shared type libraries. No `any` types allowed without explicit justification and documentation.

### IV. Test-First Development (NON-NEGOTIABLE)

TDD mandatory: Tests written → User approved → Tests fail → Then implement. Red-Green-Refactor cycle strictly enforced. Each module MUST have unit tests, integration tests for LLM interactions, and E2E tests for user flows. Test coverage MUST exceed 80% for critical paths.

### V. LLM Integration Pattern

All LLM interactions MUST follow a consistent pattern: Input validation → Prompt construction → LLM API call → Response parsing → Output formatting. LLM prompts MUST be versioned and stored in configuration. Rate limiting and error handling MUST be implemented at the shared LLM service layer.

### VI. Progressive Module Development

Modules MUST be developed in priority order (P1: ecommerce, P2: realestate, P3: pt). Each module MUST be fully functional and tested before moving to the next priority. MVP scope MUST be defined before implementation begins.

### VII. Nx Monorepo Standards

Project structure MUST follow Nx conventions. Apps and libraries MUST be clearly separated. Build, test, and lint commands MUST work at both workspace and individual project levels. Dependency graph MUST be maintainable and documented.

## Architecture Constraints

### Technology Stack

- **Monorepo**: Nx workspace
- **Package Manager**: pnpm (required for Nx monorepo)
- **Frontend Framework**: Next.js (App Router)
- **UI Component Library**: shadcn/ui (MUST be used for all UI components)
- **React Compiler**: Enabled (Next.js 16+ experimental feature for performance optimization)
- **Language**: TypeScript (strict mode)
- **Deployment Platform**: Vercel
- **Backend & Database**: Supabase
- **CI/CD Pipeline**: GitHub Actions + Nx Cloud + Vercel
- **Module Structure**: `/modules/{module-name}` pattern
- **Shared Libraries**: `/libs/shared/{category}` pattern

### Module Structure Requirements

Each module MUST contain:

- Input schema/interface definitions
- LLM prompt templates
- Output format definitions
- Module-specific UI components (using shared base components)
- Module-specific API routes
- Module-specific tests

### Shared Library Categories

- `libs/shared/ui` - Reusable UI components
- `libs/shared/llm` - LLM integration service
- `libs/shared/forms` - Form components and validation
- `libs/shared/types` - Shared TypeScript types and interfaces
- `libs/shared/utils` - Utility functions

### Deployment & Infrastructure

- **Frontend Deployment**: All Next.js applications MUST be deployed to Vercel
- **Backend Services**: API routes and serverless functions MUST use Supabase for backend services
- **Database**: All data persistence MUST use Supabase database (PostgreSQL)
- **Authentication**: User authentication MUST use Supabase Auth
- **File Storage**: File uploads and storage MUST use Supabase Storage
- **Environment Variables**: All environment-specific configuration MUST be managed through Vercel environment variables

### CI/CD Pipeline

- **Version Control**: GitHub MUST be used for source code management
- **Continuous Integration**: GitHub Actions MUST run tests, linting, and type checking on all pull requests
- **Build Caching**: Nx Cloud MUST be used for distributed build caching and task execution
- **Deployment**: Vercel MUST automatically deploy on merge to main branch (or configured branch)
- **Pipeline Stages**:
  1. GitHub Actions: Run tests, linting, type checking
  2. Nx Cloud: Cache and distribute build tasks
  3. Vercel: Build and deploy Next.js applications
- **Quality Gates**: All CI/CD stages MUST pass before deployment
- **Rollback**: Vercel deployment history MUST be used for rollback capabilities

## Development Workflow

### Module Development Process

1. Define module specification (input/output schemas)
2. Create module structure in `/modules/{module-name}`
3. Implement shared component dependencies first
4. Implement module-specific logic
5. Write tests (TDD cycle)
6. Integration testing with LLM services
7. E2E testing for user flows
8. Documentation and examples

### Code Review Requirements

All PRs MUST verify:

- Constitution compliance
- Type safety (no `any` without justification)
- Test coverage requirements met
- Shared component usage (no duplication)
- Module independence maintained

### Quality Gates

- TypeScript compilation with no errors
- All tests passing (unit, integration, E2E)
- Linting passing (ESLint configured)
- No circular dependencies in dependency graph
- Module can be built and tested independently

## Governance

Constitution supersedes all other practices. Amendments require:

- Documentation of rationale
- Impact assessment on existing modules
- Migration plan if breaking changes
- Version bump following semantic versioning

All PRs/reviews MUST verify compliance with constitution principles. Complexity MUST be justified - simpler alternatives MUST be considered and documented if rejected. Use this constitution as the primary reference for architectural decisions.

### Next.js Configuration

- **React Compiler**: MUST be enabled in `next.config.js` for all Next.js applications
  ```javascript
  experimental: {
    reactCompiler: true,
  }
  ```
- **App Router**: All Next.js applications MUST use App Router (not Pages Router)
- **TypeScript**: Strict mode MUST be enabled

### UI Component Standards

- **Component Library**: shadcn/ui MUST be used for all UI components
- **Styling**: Tailwind CSS MUST be used for styling (shadcn/ui dependency)
- **Component Location**: shadcn/ui components MUST be installed in `apps/web/src/components/ui/`
- **Custom Components**: Module-specific components MUST extend shadcn/ui components, not replace them
- **Accessibility**: All UI components MUST follow shadcn/ui accessibility standards

**Version**: 1.0.4 | **Ratified**: 2025-12-10 | **Last Amended**: 2025-12-11
