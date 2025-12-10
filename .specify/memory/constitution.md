<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.0.1
- Modified principles: None
- Added sections: None
- Updated sections: Technology Stack - added pnpm package manager
- Templates requiring updates: None
- Follow-up TODOs: None
-->

# BizFlow AI Constitution

## Core Principles

### I. Module-First Architecture

Every business domain (smartstore, realestate, pt, etc.) MUST be implemented as an independent, self-contained module within the Nx monorepo. Modules MUST follow the pattern: Input → LLM Processing → Output. Each module MUST be independently testable, deployable, and maintainable. Clear module boundaries required - no cross-module dependencies except through shared libraries.

### II. Shared Component Reusability

Common functionality (input forms, LLM API calls, result displays, save/download features) MUST be extracted into shared libraries within the monorepo. Modules MUST consume shared components rather than duplicating logic. Shared libraries MUST be versioned and follow semantic versioning for breaking changes.

### III. Type Safety & TypeScript First

All code MUST be written in TypeScript with strict type checking enabled. Type definitions MUST be defined before implementation. Shared interfaces and types MUST be defined in shared type libraries. No `any` types allowed without explicit justification and documentation.

### IV. Test-First Development (NON-NEGOTIABLE)

TDD mandatory: Tests written → User approved → Tests fail → Then implement. Red-Green-Refactor cycle strictly enforced. Each module MUST have unit tests, integration tests for LLM interactions, and E2E tests for user flows. Test coverage MUST exceed 80% for critical paths.

### V. LLM Integration Pattern

All LLM interactions MUST follow a consistent pattern: Input validation → Prompt construction → LLM API call → Response parsing → Output formatting. LLM prompts MUST be versioned and stored in configuration. Rate limiting and error handling MUST be implemented at the shared LLM service layer.

### VI. Progressive Module Development

Modules MUST be developed in priority order (P1: smartstore, P2: realestate, P3: pt). Each module MUST be fully functional and tested before moving to the next priority. MVP scope MUST be defined before implementation begins.

### VII. Nx Monorepo Standards

Project structure MUST follow Nx conventions. Apps and libraries MUST be clearly separated. Build, test, and lint commands MUST work at both workspace and individual project levels. Dependency graph MUST be maintainable and documented.

## Architecture Constraints

### Technology Stack

- **Monorepo**: Nx workspace
- **Package Manager**: pnpm (required for Nx monorepo)
- **Frontend Framework**: Next.js (App Router)
- **Language**: TypeScript (strict mode)
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

**Version**: 1.0.1 | **Ratified**: 2025-12-10 | **Last Amended**: 2025-12-10
