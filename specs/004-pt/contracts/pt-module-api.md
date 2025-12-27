# API Contract: PT / Fitness Module

**Date**: 2025-12-11  
**Feature**: PT / Fitness Module  
**Phase**: 1 - Design & Contracts

## Overview

This document defines the API contract for the PT/Fitness module. The module exposes a single endpoint for generating program content using the shared LLM service infrastructure.

## Endpoints

### POST /api/pt/generate

**Description**: Generate marketing content for a PT/fitness program

**Request**:

```typescript
{
  programData: {
    name: string;                    // Required: Program name
    programType: string;             // Required: Program type (diet, strength training, yoga, etc.)
    goals: string;                   // Required: Program goals
    duration?: string;                // Optional: Program duration
    price?: number;                  // Optional: Program price/fee
    features?: string[];             // Optional: Program features
    targetCustomers?: string[];     // Optional: Target customers
    location?: string;               // Optional: Training location
    trainerInfo?: {                  // Optional: Trainer information
      experience?: string;
      certifications?: string[];
      specialty?: string;
    };
    description?: string;            // Optional: Program description
    images?: string[];              // Optional: Program images
    metadata?: object;               // Optional: Additional metadata
  };
}
```

**Response** (200 OK):

```typescript
{
  success: true;
  content: {
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
  };
}
```

**Error Responses**:

- `400 Bad Request`: Invalid input data
  ```typescript
  {
    error: string;  // Error message describing validation failure
  }
  ```

- `500 Internal Server Error`: Content generation failed
  ```typescript
  {
    error: string;  // Error message describing failure
  }
  ```

**Validation Rules**:

- `programData.name` must be non-empty string
- `programData.programType` must be non-empty string
- `programData.goals` must be non-empty string
- `programData.price` must be positive number if provided
- `programData.features` must be array of non-empty strings if provided
- `programData.targetCustomers` must be array of non-empty strings if provided

**Example Request**:

```json
{
  "programData": {
    "name": "3개월 다이어트 프로그램",
    "programType": "다이어트",
    "goals": "체중 감량, 체형 교정",
    "duration": "3개월",
    "price": 200000,
    "features": ["1:1 맞춤", "식단 관리"],
    "targetCustomers": ["여성", "초보자"],
    "location": "센터",
    "description": "개인 맞춤형 다이어트 프로그램"
  }
}
```

**Example Response**:

```json
{
  "success": true,
  "content": {
    "programIntroduction": "3개월 다이어트 프로그램은...",
    "exerciseEffects": "이 프로그램을 통해...",
    "snsPosts": {
      "instagram": "🔥 3개월 다이어트 프로그램...",
      "facebook": "안녕하세요. 3개월 다이어트 프로그램을 소개합니다..."
    },
    "recruitmentAdCopy": "지금 바로 시작하세요!...",
    "targetCustomerCopy": {
      "general": "이 프로그램은...",
      "beginners": "운동 초보자도 부담 없이...",
      "female": "여성분들을 위한 맞춤형..."
    },
    "hashtags": ["#다이어트", "#체중감량", "#피트니스"],
    "priceInsight": "제공된 가격은 시장 대비 적정한 수준입니다..."
  }
}
```

---

## Integration with Shared LLM Service

The PT module uses the shared LLM service via internal service call:

```typescript
// Internal service call (not exposed as API)
PTContentService.generateContent(programInput: PTProgramInput)
  → LLMService.process<PTGeneratedContent>(llmRequest: LLMRequest)
    → OpenAI API
      → PTGeneratedContent
```

**LLM Request Structure**:

```typescript
{
  moduleId: 'pt',
  inputData: {
    name: string;
    programType: string;
    goals: string;
    duration: string | null;
    price: number | null;
    features: string[];
    targetCustomers: string[];
    location: string | null;
    trainerInfo: object | null;
    description: string | null;
    images: string[];
    metadata: object;
  },
  promptTemplateId: 'pt-program-content-v1',
  promptTemplateVersion: '1.0.0',
  context: {
    includeTargetCustomerCopy: boolean;
    includePriceRecommendation: boolean;
    hasPrice: boolean;
  }
}
```

---

## Error Handling

### Validation Errors

- **Missing Required Field**: Returns 400 with specific field name
- **Invalid Field Type**: Returns 400 with field name and expected type
- **Invalid Field Value**: Returns 400 with field name and validation rule

### Processing Errors

- **LLM API Error**: Returns 500 with generic error message (detailed error logged server-side)
- **Parsing Error**: Returns 500 with error message
- **Rate Limit Error**: Returns 429 (handled by shared LLM service)

---

## Rate Limiting

Rate limiting is handled by the shared LLM service. The PT module inherits the same rate limits as other modules.

---

## Versioning

- Current version: `1.0.0`
- API versioning: Not implemented (future enhancement)
- Breaking changes: Will require new endpoint version

---

## Notes

- API follows RESTful conventions
- All responses are JSON
- Error responses follow consistent format
- Input validation performed before LLM processing
- Output validation performed after LLM processing

