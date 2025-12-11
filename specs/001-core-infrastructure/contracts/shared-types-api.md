# Shared Types API Contract

**Version**: 1.0.0  
**Date**: 2025-12-10  
**Service**: Shared Type System

## Overview

This document defines the TypeScript type interfaces exported by the shared types library (`libs/shared/types`). These types ensure type safety across all domain modules.

## Core Interfaces

### Input<T>

Generic interface for module-specific input data.

```typescript
interface Input<T> {
  moduleId: string;
  data: T;
  metadata?: {
    userId?: string;
    sessionId?: string;
    timestamp?: Date;
  };
}
```

**Usage**:

```typescript
import { Input } from '@bizflow/shared/types';

type EcommerceInput = Input<{
  productName: string;
  description: string;
  price: number;
  options: string[];
}>;
```

---

### Output<T>

Generic interface for module-specific output data.

```typescript
interface Output<T> {
  moduleId: string;
  data: T;
  format: 'json' | 'text' | 'markdown' | 'html';
  metadata?: {
    requestId: string;
    processingTime: number;
    model: string;
  };
}
```

**Usage**:

```typescript
import { Output } from '@bizflow/shared/types';

type EcommerceOutput = Output<{
  seoProductName: string;
  summary1Line: string;
  summary3Line: string;
  detailedDescription: string;
  instagramPost: string;
  blogPost: string;
  hashtags: string[];
}>;
```

---

### LLMRequest

Type for LLM service request.

```typescript
interface LLMRequest {
  moduleId: string;
  inputData: unknown; // Validated against module's Input schema
  promptTemplateId: string;
  promptTemplateVersion?: string;
  context?: Record<string, unknown>;
  priority?: number;
}
```

---

### LLMResponse

Type for LLM service response.

```typescript
interface LLMResponse {
  requestId: string;
  rawContent: string;
  metadata: {
    model: string;
    tokensUsed: number;
    latencyMs: number;
  };
}
```

---

### FormattedOutput<T>

Type for formatted output.

```typescript
interface FormattedOutput<T> {
  requestId: string;
  moduleId: string;
  outputData: T; // Validated against module's Output schema
  format: 'json' | 'text' | 'markdown' | 'html';
  metadata: {
    requestId: string;
    processingTime: number;
    model: string;
  };
}
```

---

### ErrorContext

Type for error information.

```typescript
interface ErrorContext {
  type:
    | 'validation'
    | 'network'
    | 'api'
    | 'parsing'
    | 'formatting'
    | 'rate-limit';
  code: string;
  message: string;
  technicalDetails?: Record<string, unknown>;
  recoverySuggestions: string[];
}
```

---

## Type Guards

### isInput<T>

Type guard to check if value is a valid Input.

```typescript
function isInput<T>(value: unknown): value is Input<T>;
```

---

### isOutput<T>

Type guard to check if value is a valid Output.

```typescript
function isOutput<T>(value: unknown): value is Output<T>;
```

---

## Utility Types

### ModuleInput<TModule>

Extract input type for a module.

```typescript
type ModuleInput<TModule extends string> = TModule extends 'ecommerce'
  ? EcommerceInput
  : TModule extends 'realestate'
    ? RealEstateInput
    : TModule extends 'pt'
      ? PTInput
      : never;
```

---

### ModuleOutput<TModule>

Extract output type for a module.

```typescript
type ModuleOutput<TModule extends string> = TModule extends 'ecommerce'
  ? EcommerceOutput
  : TModule extends 'realestate'
    ? RealEstateOutput
    : TModule extends 'pt'
      ? PTOutput
      : never;
```

---

## Export Structure

```typescript
// libs/shared/types/src/index.ts

export type {
  Input,
  Output,
  LLMRequest,
  LLMResponse,
  FormattedOutput,
  ErrorContext,
};
export { isInput, isOutput };
export type { ModuleInput, ModuleOutput };
```

---

## Usage in Domain Modules

Domain modules import and use these types:

```typescript
// modules/ecommerce/src/types.ts
import { Input, Output } from '@bizflow/shared/types';

export interface EcommerceProductInput {
  productName: string;
  description: string;
  price: number;
  options: string[];
}

export interface EcommerceProductOutput {
  seoProductName: string;
  summary1Line: string;
  summary3Line: string;
  detailedDescription: string;
  instagramPost: string;
  blogPost: string;
  hashtags: string[];
}

export type EcommerceInput = Input<EcommerceProductInput>;
export type EcommerceOutput = Output<EcommerceProductOutput>;
```

---

## Type Safety Guarantees

1. **Compile-time**: TypeScript ensures type compatibility
2. **Runtime**: Zod schemas validate data at runtime
3. **Schema Generation**: TypeScript types generated from Zod schemas ensure consistency
