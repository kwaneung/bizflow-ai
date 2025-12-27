# Data Model: PT / Fitness Module

**Date**: 2025-12-11  
**Feature**: PT / Fitness Module  
**Phase**: 1 - Design & Contracts

## Overview

This document defines the data models, entities, and their relationships for the PT/Fitness module. These models support program content generation using the shared LLM service infrastructure.

## Core Entities

### 1. PT Program Input

**Purpose**: Represents input data for PT/fitness program content generation

**Fields**:

- `name`: string (required) - Program name
- `programType`: string (required) - Program type (diet, strength training, yoga, pilates, boxing, crossfit, etc.)
- `goals`: string (required) - Program goals (weight loss, muscle gain, fitness improvement, rehabilitation, body correction, etc.)
- `duration`: string (optional) - Program duration (e.g., "1개월", "3개월", "6개월")
- `price`: number (optional) - Program price/fee
- `features`: string[] (optional) - Program features and characteristics (e.g., "1:1 맞춤", "그룹 레슨", "홈 트레이닝")
- `targetCustomers`: string[] (optional) - Target customers (beginners, intermediate, advanced, female, male, seniors, office workers, etc.)
- `location`: string (optional) - Training location/environment (home, center, online, outdoor)
- `trainerInfo`: object (optional) - Trainer information
  - `experience`: string (optional) - Trainer experience/career
  - `certifications`: string[] (optional) - Trainer certifications
  - `specialty`: string (optional) - Trainer specialty
- `description`: string (optional) - Program description/details
- `images`: string[] (optional) - Program images (URLs or file paths)
- `metadata`: object (optional) - Additional metadata

**Validation Rules**:

- `name` must be non-empty string
- `programType` must be non-empty string
- `goals` must be non-empty string
- `price` must be positive number if provided
- `features` must be array of non-empty strings if provided
- `targetCustomers` must be array of non-empty strings if provided
- `images` must be array of valid URLs or file paths if provided

**TypeScript Interface**:

```typescript
interface PTProgramInput {
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
```

**Relationships**:

- Converted to LLM Request input data (via PTContentService)
- Used to generate PTGeneratedContent

---

### 2. PT Generated Content

**Purpose**: Represents all generated marketing content for a PT/fitness program

**Fields**:

- `programIntroduction`: string (required) - Program introduction description
- `exerciseEffects`: string (required) - Exercise effect descriptions
- `snsPosts`: object (required) - SNS promotional posts
  - `instagram`: string (required) - Instagram promotional post
  - `facebook`: string (required) - Facebook promotional post
- `recruitmentAdCopy`: string (required) - Member recruitment ad copy
- `targetCustomerCopy`: object (required) - Target customer-focused marketing copy
  - `general`: string (required) - General marketing copy
  - `beginners`: string (optional) - Copy for beginners
  - `intermediate`: string (optional) - Copy for intermediate
  - `advanced`: string (optional) - Copy for advanced
  - `female`: string (optional) - Copy for female customers
  - `male`: string (optional) - Copy for male customers
  - `seniors`: string (optional) - Copy for seniors
  - `officeWorkers`: string (optional) - Copy for office workers
- `hashtags`: string[] (required) - Hashtag recommendations
- `priceInsight`: string (optional) - Price evaluation/recommendation

**Validation Rules**:

- All required string fields must be non-empty
- `snsPosts.instagram` and `snsPosts.facebook` must be non-empty
- `targetCustomerCopy.general` must be non-empty
- `hashtags` must be array of non-empty strings
- Optional target customer copy fields generated only when corresponding target customers provided
- `priceInsight` generated when price provided (evaluation) or not provided (recommendation)

**TypeScript Interface**:

```typescript
interface PTGeneratedContent {
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

**Relationships**:

- Generated from PTProgramInput (via LLM processing)
- Displayed in result page
- Can be copied/downloaded by users

---

### 3. PT Module Input (extends shared Input<T>)

**Purpose**: Wraps PTProgramInput with module metadata

**Fields**:

- `moduleId`: "pt" (required) - Module identifier
- `programData`: PTProgramInput (optional) - Program input data

**TypeScript Interface**:

```typescript
interface PTInput extends Input<PTProgramInput> {
  moduleId: 'pt';
  programData?: PTProgramInput;
}
```

---

### 4. PT Module Output (extends shared Output<T>)

**Purpose**: Wraps PTGeneratedContent with module metadata

**Fields**:

- `moduleId`: "pt" (required) - Module identifier
- `outputData`: PTGeneratedContent (required) - Generated content

**TypeScript Interface**:

```typescript
interface PTOutput extends Output<PTGeneratedContent> {
  moduleId: 'pt';
  outputData: PTGeneratedContent;
}
```

---

## Data Flow

### Content Generation Flow

```
1. User Input (PT Program Input)
   ↓
2. PTContentService.generateContent()
   ├─ Validates input
   ├─ Builds LLM Request
   └─ Calls LLMService.process()
   ↓
3. Shared LLM Service
   ├─ Loads prompt template from Supabase
   ├─ Builds prompt with input data
   ├─ Calls OpenAI API
   ├─ Parses response
   └─ Returns FormattedOutput<PTGeneratedContent>
   ↓
4. PTContentService
   ├─ Validates output
   ├─ Formats output
   └─ Returns PTGeneratedContent
   ↓
5. API Route (/api/pt/generate)
   ├─ Receives PTGeneratedContent
   └─ Returns JSON response
   ↓
6. Frontend (Result Page)
   ├─ Displays all content formats
   ├─ Enables copy/download
   └─ Shows organized tabs
```

---

## Validation Rules

### Input Validation

- **Required Fields**: name, programType, goals
- **Optional Fields**: All other fields are optional
- **Type Validation**:
  - `name`: non-empty string
  - `programType`: non-empty string
  - `goals`: non-empty string
  - `price`: positive number if provided
  - `features`: array of non-empty strings if provided
  - `targetCustomers`: array of non-empty strings if provided

### Output Validation

- **Required Fields**: programIntroduction, exerciseEffects, snsPosts (instagram, facebook), recruitmentAdCopy, targetCustomerCopy.general, hashtags
- **Optional Fields**: targetCustomerCopy segment-specific fields, priceInsight
- **Content Quality**:
  - All string fields must be non-empty and meaningful
  - Hashtags must be relevant to program type and goals
  - Target customer copy must be appropriate for each segment

---

## State Management

### Request States

- **Pending**: Request created, waiting for processing
- **Processing**: LLM service processing request
- **Completed**: Content generated successfully
- **Failed**: Error occurred during processing

### Error States

- **Validation Error**: Input validation failed
- **LLM API Error**: LLM API call failed
- **Parsing Error**: Response parsing failed
- **Formatting Error**: Output formatting failed

---

## Relationships with Shared Infrastructure

### LLM Service

- PT module uses shared `LLMService` from `@bizflow/shared/llm`
- Prompt template stored in Supabase (`pt-program-content-v1`)
- Rate limiting handled by shared service
- Error handling via shared `ErrorHandler`

### Type System

- PT types extend shared `Input<T>` and `Output<T>` interfaces
- Type safety enforced at compile time
- Runtime validation via Zod (if implemented)

### UI Components

- Uses shared form components for input
- Uses shared result display components
- Customizes for PT-specific fields

---

## Database Schema (Supabase)

### Prompt Templates Table

- Stores PT-specific prompt template
- Template ID: `pt-program-content-v1`
- Module ID: `pt`
- Version: `1.0.0`

### LLM Requests Table

- Logs all PT module LLM requests
- Links to prompt template
- Tracks request status

### Formatted Outputs Table

- Stores generated PT content
- Links to LLM request
- Module ID: `pt`

---

## Data Transformation

### Input Transformation

- Optional fields converted to null if not provided
- Arrays initialized as empty arrays if not provided
- Context object built for LLM request (includes target customer flags, price flags)

### Output Transformation

- LLM response parsed and validated
- Flexible field extraction (handles various key names)
- Optional fields extracted only if present
- Target customer copy generated based on provided target customers

---

## Notes

- All data models follow existing patterns from ecommerce and realestate modules
- Type safety maintained through TypeScript interfaces
- Validation rules ensure data quality
- Error handling follows shared infrastructure patterns

