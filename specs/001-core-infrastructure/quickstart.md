# Quick Start Guide: BizFlow AI Core Infrastructure

**Date**: 2025-12-10  
**Feature**: Core Infrastructure  
**Phase**: 1 - Design & Contracts

## Overview

This guide provides quick start instructions for developers to integrate and use the core infrastructure shared libraries in their domain modules.

## Prerequisites

- Nx workspace initialized
- TypeScript 5.x with strict mode
- pnpm package manager
- Access to Supabase project
- LLM API credentials (OpenAI, Anthropic, etc.)

## Installation

### 1. Install Shared Libraries

Shared libraries are already part of the monorepo. Import them in your domain module:

```typescript
// In your domain module's package.json or tsconfig.json
import { Input, Output } from '@bizflow/shared/types';
import { LLMService } from '@bizflow/shared/llm';
import { BaseForm, ResultDisplay } from '@bizflow/shared/ui';
```

### 2. Configure Environment Variables

Set up environment variables in Vercel dashboard or `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# LLM API
OPENAI_API_KEY=your_openai_api_key
# or
ANTHROPIC_API_KEY=your_anthropic_api_key

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS_PER_MINUTE=60
```

## Basic Usage

### Step 1: Define Your Module's Input/Output Types

```typescript
// modules/smartstore/src/types.ts
import { Input, Output } from '@bizflow/shared/types';

export interface ProductInput {
  productName: string;
  description: string;
  price: number;
  options: string[];
}

export interface ProductOutput {
  seoProductName: string;
  summary1Line: string;
  summary3Line: string;
  detailedDescription: string;
  instagramPost: string;
  blogPost: string;
  hashtags: string[];
}

export type SmartStoreInput = Input<ProductInput>;
export type SmartStoreOutput = Output<ProductOutput>;
```

### Step 2: Create Zod Schemas for Validation

```typescript
// modules/smartstore/src/schemas.ts
import { z } from 'zod';

export const productInputSchema = z.object({
  productName: z.string().min(1),
  description: z.string().min(10),
  price: z.number().positive(),
  options: z.array(z.string()).min(1),
});

export const productOutputSchema = z.object({
  seoProductName: z.string(),
  summary1Line: z.string(),
  summary3Line: z.string(),
  detailedDescription: z.string(),
  instagramPost: z.string(),
  blogPost: z.string(),
  hashtags: z.array(z.string()),
});
```

### Step 3: Use Shared LLM Service

```typescript
// modules/smartstore/src/services/product-content.service.ts
import { LLMService } from '@bizflow/shared/llm';
import { SmartStoreInput, SmartStoreOutput } from '../types';
import { productInputSchema, productOutputSchema } from '../schemas';

export class ProductContentService {
  private llmService: LLMService;

  constructor() {
    this.llmService = new LLMService();
  }

  async generateContent(input: SmartStoreInput): Promise<SmartStoreOutput> {
    // Validate input
    const validatedInput = productInputSchema.parse(input.data);

    // Process through LLM service
    const response = await this.llmService.process({
      moduleId: 'smartstore',
      inputData: validatedInput,
      promptTemplateId: 'smartstore-product-content',
      promptTemplateVersion: '1.0.0',
    });

    // Validate output
    const validatedOutput = productOutputSchema.parse(response.output.data);

    return {
      moduleId: 'smartstore',
      data: validatedOutput,
      format: 'json',
      metadata: response.output.metadata,
    };
  }
}
```

### Step 4: Create API Route

```typescript
// modules/smartstore/src/app/api/generate-content/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ProductContentService } from '../../services/product-content.service';
import { SmartStoreInput } from '../../types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input: SmartStoreInput = body;

    const service = new ProductContentService();
    const output = await service.generateContent(input);

    return NextResponse.json(output);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
```

### Step 5: Use Shared UI Components

```typescript
// modules/smartstore/src/components/product-form.tsx
'use client';

import { BaseForm } from '@bizflow/shared/ui';
import { useState } from 'react';

export function ProductForm() {
  const [result, setResult] = useState(null);

  const handleSubmit = async (formData: FormData) => {
    const response = await fetch('/api/generate-content', {
      method: 'POST',
      body: JSON.stringify({
        moduleId: 'smartstore',
        data: {
          productName: formData.get('productName'),
          description: formData.get('description'),
          price: Number(formData.get('price')),
          options: formData.get('options')?.split(','),
        },
      }),
    });

    const output = await response.json();
    setResult(output);
  };

  return (
    <div>
      <BaseForm onSubmit={handleSubmit}>
        {/* Your form fields */}
      </BaseForm>
      {result && <ResultDisplay data={result.data} format={result.format} />}
    </div>
  );
}
```

## Testing

### Unit Test Example

```typescript
// modules/smartstore/src/services/product-content.service.spec.ts
import { ProductContentService } from './product-content.service';
import { SmartStoreInput } from '../types';

describe('ProductContentService', () => {
  let service: ProductContentService;

  beforeEach(() => {
    service = new ProductContentService();
  });

  it('should generate content for valid input', async () => {
    const input: SmartStoreInput = {
      moduleId: 'smartstore',
      data: {
        productName: 'Test Product',
        description: 'A test product description',
        price: 10000,
        options: ['Option 1', 'Option 2'],
      },
    };

    const output = await service.generateContent(input);

    expect(output.moduleId).toBe('smartstore');
    expect(output.data.seoProductName).toBeDefined();
    expect(output.data.hashtags).toBeInstanceOf(Array);
  });
});
```

## Common Patterns

### Error Handling

```typescript
import { ErrorContext } from '@bizflow/shared/types';

try {
  const output = await llmService.process(request);
} catch (error) {
  if (error instanceof ErrorContext) {
    // Handle specific error types
    switch (error.type) {
      case 'rate-limit':
        // Show retry message
        break;
      case 'validation':
        // Show validation errors
        break;
      default:
        // Show generic error
    }
  }
}
```

### Rate Limit Handling

```typescript
import { LLMService } from '@bizflow/shared/llm';

const llmService = new LLMService();

// Check rate limit status
const status = await llmService.getRateLimitStatus();
if (status.remaining === 0) {
  // Show queue position or wait message
  console.log(`Queue position: ${status.queueSize}`);
  console.log(`Reset at: ${status.resetAt}`);
}
```

## Next Steps

1. **Create Prompt Templates**: Define your module's prompt templates in Supabase
2. **Register Schemas**: Register your input/output schemas in the shared type system
3. **Configure Rate Limits**: Set up rate limiting for your LLM provider
4. **Write Tests**: Add unit and integration tests for your module
5. **Deploy**: Deploy your module to Vercel

## Resources

- [LLM Service API Contract](./contracts/llm-service-api.md)
- [Shared Types API Contract](./contracts/shared-types-api.md)
- [Data Model Documentation](./data-model.md)
- [Research & Best Practices](./research.md)

## Support

For questions or issues:
1. Check the documentation in `specs/001-core-infrastructure/`
2. Review the Constitution for architectural principles
3. Consult the research document for best practices

