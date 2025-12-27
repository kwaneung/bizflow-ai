# Quick Start Guide: PT / Fitness Module

**Date**: 2025-12-11  
**Feature**: PT / Fitness Module  
**Phase**: 1 - Design & Contracts

## Overview

This guide provides quick start instructions for developers to implement and use the PT/Fitness module. The module follows the same patterns as ecommerce and realestate modules, reusing shared infrastructure.

## Prerequisites

- Nx workspace initialized
- Core infrastructure built (shared libraries: types, llm, ui)
- TypeScript 5.x with strict mode
- pnpm package manager
- Access to Supabase project
- LLM API credentials (OpenAI)
- Prompt template created in Supabase (`pt-program-content-v1`)

## Installation

### 1. Module Structure

The PT module is already created in `modules/pt/`. Verify the structure:

```text
modules/pt/
├── src/
│   ├── types/
│   │   └── pt-types.ts
│   ├── services/
│   │   ├── pt-content-service.ts
│   │   └── index.ts
│   └── index.ts
├── project.json
├── package.json
└── tsconfig.json
```

### 2. Dependencies

The module depends on shared libraries (already configured):

```json
{
  "dependencies": {
    "@bizflow/shared/types": "*",
    "@bizflow/shared/llm": "*"
  }
}
```

### 3. TypeScript Path Mapping

Ensure path mapping is configured in `tsconfig.base.json`:

```json
{
  "paths": {
    "@bizflow/modules/pt": ["modules/pt/src/index.ts"]
  }
}
```

## Basic Usage

### Step 1: Define PT Types

Types are already defined in `modules/pt/src/types/pt-types.ts`:

```typescript
import type { Input, Output } from '@bizflow/shared/types';

export interface PTProgramInput {
  name: string;
  programType: string;
  goals: string;
  duration?: string;
  price?: number;
  features?: string[];
  targetCustomers?: string[];
  location?: string;
  trainerInfo?: {
    experience?: string;
    certifications?: string[];
    specialty?: string;
  };
  description?: string;
  images?: string[];
  metadata?: Record<string, unknown>;
}

export interface PTGeneratedContent {
  programIntroduction: string;
  exerciseEffects: string;
  snsPosts: {
    instagram: string;
    facebook: string;
  };
  recruitmentAdCopy: string;
  targetCustomerCopy: {
    general: string;
    beginners?: string;
    intermediate?: string;
    advanced?: string;
    female?: string;
    male?: string;
    seniors?: string;
    officeWorkers?: string;
  };
  hashtags: string[];
  priceInsight?: string;
}
```

### Step 2: Use PTContentService

```typescript
import { PTContentService } from '@bizflow/modules/pt';
import type { PTProgramInput } from '@bizflow/modules/pt';

// Create service instance
const ptService = new PTContentService();

// Prepare program input
const programInput: PTProgramInput = {
  name: '3개월 다이어트 프로그램',
  programType: '다이어트',
  goals: '체중 감량, 체형 교정',
  duration: '3개월',
  price: 200000,
  features: ['1:1 맞춤', '식단 관리'],
  targetCustomers: ['여성', '초보자'],
  location: '센터',
};

// Generate content
const content = await ptService.generateContent(programInput);

// Use generated content
console.log(content.programIntroduction);
console.log(content.snsPosts.instagram);
console.log(content.targetCustomerCopy.female);
```

### Step 3: Create API Route

Create `apps/web/src/app/api/pt/generate/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import {
  PTContentService,
  type PTProgramInput,
} from '@bizflow/modules/pt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { programData } = body;

    // Validate required fields
    if (!programData.name || !programData.programType || !programData.goals) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const programInput: PTProgramInput = {
      name: programData.name,
      programType: programData.programType,
      goals: programData.goals,
      // ... other fields
    };

    const contentService = new PTContentService();
    const generatedContent = await contentService.generateContent(programInput);

    return NextResponse.json({
      success: true,
      content: generatedContent,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
```

### Step 4: Create UI Pages

Create input page `apps/web/src/app/pt/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Label, Textarea } from '@bizflow/shared/ui';
import type { PTProgramInput } from '@bizflow/modules/pt';

export default function PTPage() {
  const router = useRouter();
  const [programData, setProgramData] = useState<PTProgramInput>({
    name: '',
    programType: '',
    goals: '',
  });

  const handleSubmit = async () => {
    const response = await fetch('/api/pt/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ programData }),
    });

    const result = await response.json();
    router.push(`/pt/result?data=${encodeURIComponent(JSON.stringify(result.content))}`);
  };

  return (
    <div>
      {/* Form implementation */}
    </div>
  );
}
```

## Testing

### Unit Tests

Create `modules/pt/__tests__/pt-content-service.test.ts`:

```typescript
import { PTContentService } from '../src/services/pt-content-service';
import type { PTProgramInput } from '../src/types/pt-types';

describe('PTContentService', () => {
  it('should generate content for valid input', async () => {
    const service = new PTContentService();
    const input: PTProgramInput = {
      name: 'Test Program',
      programType: '다이어트',
      goals: '체중 감량',
    };

    const content = await service.generateContent(input);

    expect(content.programIntroduction).toBeDefined();
    expect(content.exerciseEffects).toBeDefined();
    expect(content.snsPosts.instagram).toBeDefined();
    expect(content.snsPosts.facebook).toBeDefined();
    expect(content.recruitmentAdCopy).toBeDefined();
    expect(content.targetCustomerCopy.general).toBeDefined();
    expect(content.hashtags).toBeInstanceOf(Array);
  });
});
```

## Prompt Template Setup

### Create Prompt Template in Supabase

Run migration `supabase/migrations/006_insert_pt_prompt_templates.sql`:

```sql
INSERT INTO prompt_templates (
  id, module_id, version, name, template, variables, description, is_active
) VALUES (
  'pt-program-content-v1',
  'pt',
  '1.0.0',
  'PT Program Content Generation',
  '...',  -- Prompt template text
  '["name", "programType", "goals", ...]'::jsonb,
  'PT/Fitness program content generation template',
  true
);
```

## Common Patterns

### Handling Optional Fields

```typescript
// Optional fields are handled gracefully
const input: PTProgramInput = {
  name: 'Program',
  programType: '다이어트',
  goals: '체중 감량',
  // Optional fields can be omitted
};

// Service handles null/undefined gracefully
const content = await service.generateContent(input);
```

### Target Customer Copy

```typescript
// Target customer copy is generated only when target customers provided
const inputWithTargets: PTProgramInput = {
  name: 'Program',
  programType: '다이어트',
  goals: '체중 감량',
  targetCustomers: ['여성', '초보자'],
};

const content = await service.generateContent(inputWithTargets);
// content.targetCustomerCopy.female and .beginners will be present
```

### Price Evaluation

```typescript
// Price insight generated whether price provided or not
const inputWithPrice: PTProgramInput = {
  name: 'Program',
  programType: '다이어트',
  goals: '체중 감량',
  price: 200000,  // Price provided → evaluation
};

const inputWithoutPrice: PTProgramInput = {
  name: 'Program',
  programType: '다이어트',
  goals: '체중 감량',
  // No price → recommendation
};
```

## Troubleshooting

### Common Issues

1. **Module not found**: Ensure TypeScript path mapping is configured
2. **LLM service error**: Check OpenAI API key and Supabase connection
3. **Prompt template not found**: Run Supabase migration for prompt templates
4. **Type errors**: Ensure all required fields are provided

### Debug Mode

Enable debug logging in development:

```typescript
// Service logs input debug info in development mode
// Check console for "=== PT Input Debug ===" messages
```

## Next Steps

- Implement UI components for input form
- Create result display page
- Add unit tests
- Integrate with existing app routing

