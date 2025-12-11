# Research: BizFlow AI Core Infrastructure

**Date**: 2025-12-10  
**Feature**: Core Infrastructure  
**Phase**: 0 - Outline & Research

## Overview

This document consolidates research findings for technology choices, best practices, and integration patterns for the BizFlow AI core infrastructure. All decisions are documented with rationale and alternatives considered.

## Technology Choices

### 1. Nx Monorepo

**Decision**: Use Nx workspace for monorepo management

**Rationale**:

- Nx provides excellent support for TypeScript libraries and Next.js applications
- Built-in dependency graph visualization and management
- Incremental builds with intelligent caching (Nx Cloud integration)
- Supports independent building and testing of shared libraries
- Strong TypeScript support with path mapping and type checking
- Clear separation between apps and libraries aligns with Constitution requirements

**Alternatives Considered**:

- **Turborepo**: Good performance but less mature ecosystem for Next.js
- **pnpm workspaces only**: Lacks build orchestration and dependency graph management
- **Lerna**: More focused on package publishing, less suitable for internal libraries

**Best Practices**:

- Organize libraries by domain (`libs/shared/*`) not by type
- Use Nx project.json for library configuration
- Leverage Nx affected commands for CI/CD efficiency
- Use Nx Cloud for distributed caching

**Integration Pattern**:

- Each shared library is an independent Nx project
- Domain modules depend on shared libraries via TypeScript path mappings
- Nx dependency graph ensures no circular dependencies

---

### 2. Supabase for Backend & Database

**Decision**: Use Supabase for backend services, database, authentication, and storage

**Rationale**:

- PostgreSQL database with real-time capabilities
- Built-in authentication (Supabase Auth)
- File storage (Supabase Storage)
- RESTful API auto-generated from database schema
- Serverless-friendly (works well with Vercel)
- Free tier suitable for MVP development
- TypeScript client libraries available
- Row-level security for data access control

**Alternatives Considered**:

- **Firebase**: More complex pricing, less SQL-friendly
- **PlanetScale**: MySQL-based, no built-in auth/storage
- **Self-hosted PostgreSQL**: Requires infrastructure management
- **Prisma + PostgreSQL**: More setup complexity, no built-in auth

**Best Practices**:

- Use Supabase client libraries for type-safe database access
- Leverage Row Level Security (RLS) for data access control
- Use Supabase Storage for file uploads (product images, etc.)
- Store configuration data (rate limits, prompt templates) in Supabase tables
- Use environment variables for Supabase credentials

**Integration Pattern**:

- Supabase client initialized in shared utilities library
- Database schema defined in Supabase dashboard or migrations
- Type-safe queries using Supabase TypeScript client
- Server-side API routes use Supabase client for database access

---

### 3. Vercel for Deployment

**Decision**: Deploy Next.js applications to Vercel

**Rationale**:

- Seamless Next.js integration (created by Vercel team)
- Serverless functions with automatic scaling
- Edge functions for low-latency API routes
- Built-in CI/CD integration with GitHub
- Environment variable management
- Preview deployments for pull requests
- Free tier suitable for development
- Excellent performance and global CDN

**Alternatives Considered**:

- **AWS Amplify**: More complex setup, AWS-specific
- **Netlify**: Good alternative but less Next.js-optimized
- **Self-hosted**: Requires infrastructure management
- **Railway/Render**: Less integrated with Next.js ecosystem

**Best Practices**:

- Use Vercel environment variables for configuration
- Leverage Edge Functions for API routes requiring low latency
- Use Serverless Functions for LLM API calls (longer timeout)
- Configure build settings in vercel.json
- Use preview deployments for testing

**Integration Pattern**:

- Next.js App Router API routes deployed as serverless functions
- Environment variables configured in Vercel dashboard
- Automatic deployments on git push to main branch
- Nx build output configured for Vercel deployment

---

### 4. LLM API Integration Pattern

**Decision**: Use shared LLM service with consistent pattern: Input validation → Prompt construction → API call → Response parsing → Output formatting

**Rationale**:

- Consistent pattern ensures maintainability across modules
- Centralized error handling and rate limiting
- Versioned prompt templates enable A/B testing
- Response parsing handles various LLM output formats
- Rate limiting prevents API quota exhaustion

**LLM Provider Options**:

- **OpenAI GPT-4/GPT-3.5**: Most mature, good Korean support
- **Anthropic Claude**: Strong reasoning, good for complex prompts
- **Google Gemini**: Cost-effective, good multilingual support
- **Local LLM**: Privacy-focused but requires infrastructure

**Best Practices**:

- Abstract LLM provider behind shared service interface
- Support multiple providers for flexibility
- Implement retry logic with exponential backoff
- Cache prompt templates in Supabase
- Log all LLM requests for monitoring and cost tracking
- Use streaming for long responses (future enhancement)

**Integration Pattern**:

- Shared LLM service in `libs/shared/llm`
- Module-specific prompt templates stored in Supabase
- Rate limiting implemented at service layer
- Error handling with user-friendly messages

---

### 5. TypeScript Strict Mode

**Decision**: Use TypeScript with strict mode enabled

**Rationale**:

- Catches type errors at compile time (Constitution requirement)
- Shared type system ensures consistency across modules
- Better IDE support and autocomplete
- Prevents runtime type errors
- Enables tree-shaking for smaller bundle sizes

**Best Practices**:

- Define shared types in `libs/shared/types`
- Use Zod for runtime validation (complements TypeScript)
- No `any` types without explicit justification
- Use type guards for runtime type checking
- Leverage TypeScript discriminated unions for state management

**Integration Pattern**:

- Base TypeScript config in `tsconfig.base.json`
- Each library extends base config
- Path mappings for shared library imports
- Strict type checking enforced in CI/CD

---

### 6. Rate Limiting Strategy

**Decision**: Implement rate limiting at shared LLM service layer with queue support

**Rationale**:

- Prevents API quota exhaustion
- Ensures fair resource usage across modules
- Queue support prevents request loss
- Centralized configuration enables easy adjustment

**Implementation Options**:

- **In-memory rate limiter**: Simple, works for single instance
- **Redis-based rate limiter**: Distributed, works across instances
- **Supabase-based rate limiter**: Uses existing infrastructure

**Best Practices**:

- Configure rate limits per API provider account
- Use token bucket algorithm for smooth rate limiting
- Queue requests when limit reached (don't reject immediately)
- Log rate limit events for monitoring
- Provide clear error messages when rate limited

**Integration Pattern**:

- Rate limiter in `libs/shared/llm` service
- Configuration stored in Supabase or environment variables
- Queue implementation using async/await patterns
- Rate limit status exposed to administrators

---

### 7. Error Handling Strategy

**Decision**: Implement comprehensive error handling with user-friendly messages and recovery mechanisms

**Rationale**:

- User experience prioritized over technical details
- Graceful degradation when LLM API fails
- Clear error messages help developers debug
- Recovery mechanisms prevent complete failure

**Best Practices**:

- Categorize errors (network, API, validation, parsing)
- Provide actionable error messages
- Implement retry logic for transient failures
- Log errors with context for debugging
- Fallback to cached responses when available

**Integration Pattern**:

- Error handler in `libs/shared/utils`
- Error types defined in `libs/shared/types`
- Error boundaries in React components
- Centralized error logging to Supabase or external service

---

### 8. Testing Strategy

**Decision**: Use Jest for unit tests, React Testing Library for components, Playwright for E2E

**Rationale**:

- Jest: Industry standard for TypeScript/JavaScript
- React Testing Library: Best practice for React component testing
- Playwright: Modern E2E testing with good Next.js support
- Nx test runners: Integrated with monorepo workflow

**Best Practices**:

- TDD approach (tests written before implementation)
- 80%+ test coverage for critical paths
- Mock LLM API calls in tests
- Integration tests for shared library interactions
- E2E tests for complete user flows

**Integration Pattern**:

- Test files co-located with source code
- Shared test utilities in `libs/shared/utils`
- Mock LLM service for testing
- Nx affected:test for efficient test execution

---

## Architecture Patterns

### Shared Library Structure

**Pattern**: Independent Nx projects with clear exports

**Structure**:

```
libs/shared/{library-name}/
├── src/
│   ├── index.ts          # Public API exports
│   └── [implementation]
├── project.json          # Nx project configuration
└── package.json          # Package metadata
```

**Best Practices**:

- Single entry point (index.ts) for clean imports
- Internal implementation hidden from consumers
- Versioned independently (semantic versioning)
- Tree-shakeable exports

---

### Module-to-Shared-Library Dependency

**Pattern**: Domain modules depend on shared libraries, never vice versa

**Dependency Flow**:

```
modules/ecommerce → libs/shared/llm
                  → libs/shared/types
                  → libs/shared/ui
                  → libs/shared/forms
                  → libs/shared/utils
```

**Best Practices**:

- No circular dependencies (enforced by Nx)
- Shared libraries have no knowledge of domain modules
- Type interfaces defined in shared/types
- Clear API boundaries

---

### LLM Service Pattern

**Pattern**: Input → Validation → Prompt → API Call → Parse → Format → Output

**Flow**:

1. Input validation (Zod schemas)
2. Prompt template retrieval (Supabase)
3. Prompt construction (template + input data)
4. LLM API call (with rate limiting)
5. Response parsing (handle various formats)
6. Output formatting (module-specific)
7. Error handling (at each step)

**Best Practices**:

- Each step is independently testable
- Error handling at each boundary
- Logging for debugging and monitoring
- Retry logic for transient failures

---

## Integration Patterns

### Supabase + Next.js Integration

**Pattern**: Server-side API routes use Supabase client

**Implementation**:

- Supabase client created in shared utilities
- Environment variables for credentials
- Server-side only (credentials not exposed to client)
- Type-safe database queries

**Best Practices**:

- Initialize Supabase client once, reuse
- Use Row Level Security for data access
- Type-safe queries with TypeScript
- Handle connection errors gracefully

---

### Vercel + Nx Integration

**Pattern**: Nx builds Next.js apps, Vercel deploys

**Implementation**:

- Nx builds affected apps
- Build output configured for Vercel
- Vercel detects Next.js and deploys automatically
- Environment variables in Vercel dashboard

**Best Practices**:

- Use Nx affected:build for efficiency
- Configure build settings in vercel.json
- Use Vercel environment variables
- Leverage preview deployments

---

### CI/CD Pipeline Integration

**Pattern**: GitHub Actions → Nx Cloud → Vercel

**Flow**:

1. GitHub Actions triggers on PR/push
2. Run tests, linting, type checking
3. Nx Cloud caches and distributes builds
4. Build affected projects
5. Vercel deploys on merge to main

**Best Practices**:

- Use Nx affected commands
- Cache dependencies (pnpm)
- Parallel test execution
- Quality gates before deployment

---

## Research Summary

All technology choices have been researched and documented with rationale. Key decisions:

1. **Nx Monorepo**: Best fit for TypeScript/Next.js monorepo with shared libraries
2. **Supabase**: Comprehensive backend solution with PostgreSQL, auth, storage
3. **Vercel**: Optimal Next.js deployment platform with excellent DX
4. **LLM Service Pattern**: Consistent, maintainable, testable
5. **TypeScript Strict**: Type safety at compile time
6. **Rate Limiting**: Centralized, configurable, queue-supported
7. **Error Handling**: User-friendly, recoverable, debuggable
8. **Testing**: Comprehensive TDD approach with multiple test types

All patterns follow Constitution principles and enable the core infrastructure to support multiple domain modules effectively.
