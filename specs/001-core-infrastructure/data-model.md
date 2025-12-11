# Data Model: BizFlow AI Core Infrastructure

**Date**: 2025-12-10  
**Feature**: Core Infrastructure  
**Phase**: 1 - Design & Contracts

## Overview

This document defines the data models, entities, and their relationships for the core infrastructure. These models support shared LLM service, type system, and configuration management.

## Core Entities

### 1. LLM Request

**Purpose**: Represents a request to the LLM service from a domain module

**Fields**:

- `id`: string (UUID) - Unique request identifier
- `moduleId`: string - Domain module identifier (e.g., "ecommerce", "realestate", "pt")
- `inputData`: object - Module-specific input data (validated against Input schema)
- `promptTemplateId`: string - Identifier for the prompt template to use
- `promptTemplateVersion`: string - Version of the prompt template (semantic versioning)
- `context`: object (optional) - Additional context for the request
- `createdAt`: timestamp - Request creation time
- `status`: enum - Request status: "pending", "processing", "completed", "failed"
- `priority`: number (optional) - Request priority for queue management

**Validation Rules**:

- `moduleId` must be a valid domain module identifier
- `inputData` must match the module's Input schema (validated at runtime with Zod)
- `promptTemplateId` must exist in prompt template registry
- `promptTemplateVersion` must follow semantic versioning format

**Relationships**:

- Belongs to a domain module (via `moduleId`)
- References a Prompt Template (via `promptTemplateId` and `promptTemplateVersion`)
- Has one LLM Response (1:1)
- Has zero or more Error Contexts (1:many)

**State Transitions**:

```
pending → processing → completed
pending → processing → failed
```

---

### 2. LLM Response

**Purpose**: Represents the raw response from the LLM API

**Fields**:

- `id`: string (UUID) - Unique response identifier
- `requestId`: string (UUID) - Reference to LLM Request (foreign key)
- `rawContent`: string - Raw response content from LLM API
- `metadata`: object - Response metadata (model used, tokens, latency, etc.)
- `createdAt`: timestamp - Response creation time
- `parsed`: boolean - Whether response has been parsed
- `formatted`: boolean - Whether response has been formatted

**Validation Rules**:

- `requestId` must reference a valid LLM Request
- `rawContent` must not be empty
- `metadata` must include: model, tokensUsed, latencyMs

**Relationships**:

- Belongs to one LLM Request (many:1)
- Has one Formatted Output (1:1)

**State Transitions**:

```
created → parsed → formatted
```

---

### 3. Formatted Output

**Purpose**: Represents the processed output after parsing and formatting, ready for display

**Fields**:

- `id`: string (UUID) - Unique output identifier
- `responseId`: string (UUID) - Reference to LLM Response (foreign key)
- `moduleId`: string - Domain module identifier
- `outputData`: object - Module-specific output data (validated against Output schema)
- `format`: enum - Output format: "json", "text", "markdown", "html"
- `createdAt`: timestamp - Output creation time
- `version`: string - Output schema version

**Validation Rules**:

- `responseId` must reference a valid LLM Response
- `outputData` must match the module's Output schema (validated at runtime)
- `format` must be supported by the module

**Relationships**:

- Belongs to one LLM Response (many:1)
- Belongs to a domain module (via `moduleId`)

---

### 4. Input Schema

**Purpose**: Defines the structure and validation rules for module-specific input data

**Fields**:

- `id`: string (UUID) - Unique schema identifier
- `moduleId`: string - Domain module identifier
- `version`: string - Schema version (semantic versioning)
- `schema`: object - Zod schema definition (JSON representation)
- `description`: string - Human-readable description of the schema
- `createdAt`: timestamp - Schema creation time
- `isActive`: boolean - Whether this schema version is currently active

**Validation Rules**:

- `moduleId` must be a valid domain module identifier
- `version` must follow semantic versioning format
- `schema` must be a valid Zod schema JSON representation
- Only one schema per module can be `isActive: true` at a time

**Relationships**:

- Belongs to a domain module (via `moduleId`)
- Used by LLM Requests (via validation)

**State Transitions**:

```
draft → active → deprecated
```

---

### 5. Output Schema

**Purpose**: Defines the structure and formatting rules for module-specific output data

**Fields**:

- `id`: string (UUID) - Unique schema identifier
- `moduleId`: string - Domain module identifier
- `version`: string - Schema version (semantic versioning)
- `schema`: object - Zod schema definition (JSON representation)
- `description`: string - Human-readable description of the schema
- `createdAt`: timestamp - Schema creation time
- `isActive`: boolean - Whether this schema version is currently active

**Validation Rules**:

- `moduleId` must be a valid domain module identifier
- `version` must follow semantic versioning format
- `schema` must be a valid Zod schema JSON representation
- Only one schema per module can be `isActive: true` at a time

**Relationships**:

- Belongs to a domain module (via `moduleId`)
- Used by Formatted Output (via validation)

**State Transitions**:

```
draft → active → deprecated
```

---

### 6. Prompt Template

**Purpose**: Defines the template used to construct LLM prompts

**Fields**:

- `id`: string (UUID) - Unique template identifier
- `moduleId`: string - Domain module identifier
- `version`: string - Template version (semantic versioning)
- `name`: string - Human-readable template name
- `template`: string - Prompt template with placeholders (e.g., "Generate content for {{productName}}")
- `variables`: array - List of required variables in the template
- `description`: string - Human-readable description
- `createdAt`: timestamp - Template creation time
- `updatedAt`: timestamp - Template last update time
- `isActive`: boolean - Whether this template version is currently active

**Validation Rules**:

- `moduleId` must be a valid domain module identifier
- `version` must follow semantic versioning format
- `template` must not be empty
- `variables` must match placeholders in template
- Only one template per module+name can be `isActive: true` at a time

**Relationships**:

- Belongs to a domain module (via `moduleId`)
- Used by LLM Requests (via `promptTemplateId`)

**State Transitions**:

```
draft → active → deprecated
```

---

### 7. Rate Limit Configuration

**Purpose**: Defines rate limiting rules for LLM API calls

**Fields**:

- `id`: string (UUID) - Unique configuration identifier
- `provider`: string - LLM API provider (e.g., "openai", "anthropic")
- `limit`: number - Maximum requests per time window
- `window`: number - Time window in seconds (e.g., 60 for per-minute)
- `strategy`: enum - Rate limiting strategy: "fixed", "token-bucket", "sliding-window"
- `queueEnabled`: boolean - Whether to queue requests when limit reached
- `queueMaxSize`: number (optional) - Maximum queue size
- `isActive`: boolean - Whether this configuration is active
- `createdAt`: timestamp - Configuration creation time
- `updatedAt`: timestamp - Configuration last update time

**Validation Rules**:

- `limit` must be positive integer
- `window` must be positive integer
- `queueMaxSize` must be positive if `queueEnabled` is true

**Relationships**:

- Used by LLM Service for rate limiting

**State Transitions**:

```
draft → active → inactive
```

---

### 8. Error Context

**Purpose**: Contains error information for debugging and user feedback

**Fields**:

- `id`: string (UUID) - Unique error identifier
- `requestId`: string (UUID) - Reference to LLM Request (optional, if error occurred during request)
- `type`: enum - Error type: "validation", "network", "api", "parsing", "formatting", "rate-limit"
- `code`: string - Error code for programmatic handling
- `message`: string - Human-readable error message
- `technicalDetails`: object (optional) - Technical details for debugging
- `recoverySuggestions`: array - Suggested recovery actions
- `occurredAt`: timestamp - Error occurrence time
- `resolved`: boolean - Whether error has been resolved

**Validation Rules**:

- `type` must be a valid error type
- `message` must not be empty
- `code` must follow error code format (e.g., "LLM_API_TIMEOUT")

**Relationships**:

- Belongs to zero or one LLM Request (optional, many:1)

**State Transitions**:

```
created → resolved
```

---

## Shared Type Interfaces

### Input<T>

**Purpose**: Generic interface for module-specific input data

**Type Definition**:

```typescript
interface Input<T> {
  moduleId: string;
  data: T; // Module-specific input data
  metadata?: {
    userId?: string;
    sessionId?: string;
    timestamp?: Date;
  };
}
```

**Validation**: Validated against module's Input Schema using Zod

---

### Output<T>

**Purpose**: Generic interface for module-specific output data

**Type Definition**:

```typescript
interface Output<T> {
  moduleId: string;
  data: T; // Module-specific output data
  format: 'json' | 'text' | 'markdown' | 'html';
  metadata?: {
    requestId: string;
    processingTime: number;
    model: string;
  };
}
```

**Validation**: Validated against module's Output Schema using Zod

---

## Database Schema (Supabase)

### Tables

1. **llm_requests** - Stores LLM request records
2. **llm_responses** - Stores LLM response records
3. **formatted_outputs** - Stores formatted output records
4. **input_schemas** - Stores input schema definitions
5. **output_schemas** - Stores output schema definitions
6. **prompt_templates** - Stores prompt template definitions
7. **rate_limit_configs** - Stores rate limiting configurations
8. **error_contexts** - Stores error records

### Relationships

- `llm_responses.request_id` → `llm_requests.id` (foreign key)
- `formatted_outputs.response_id` → `llm_responses.id` (foreign key)
- `error_contexts.request_id` → `llm_requests.id` (foreign key, nullable)

### Indexes

- `llm_requests.module_id` - For filtering by module
- `llm_requests.status` - For querying pending/processing requests
- `llm_requests.created_at` - For time-based queries
- `prompt_templates.module_id, name, version` - For template lookup
- `rate_limit_configs.provider, is_active` - For active config lookup

---

## Data Flow

```
Domain Module Input
  ↓
Input Schema Validation (Zod)
  ↓
LLM Request Created
  ↓
Prompt Template Retrieved
  ↓
Prompt Constructed
  ↓
Rate Limit Check
  ↓
LLM API Call
  ↓
LLM Response Created
  ↓
Response Parsing
  ↓
Output Schema Validation (Zod)
  ↓
Formatted Output Created
  ↓
Domain Module Output
```

---

## Validation Strategy

1. **Input Validation**: Zod schemas defined in Input Schema entities
2. **Output Validation**: Zod schemas defined in Output Schema entities
3. **Runtime Validation**: All data validated at service boundaries
4. **Type Safety**: TypeScript types generated from Zod schemas
5. **Compile-time Validation**: TypeScript ensures type compatibility

---

## Summary

The data model supports:

- Multi-module architecture with shared infrastructure
- Versioned schemas and templates
- Rate limiting and queue management
- Comprehensive error tracking
- Type-safe data flow from input to output
- Flexible prompt template system
- Audit trail through request/response tracking
