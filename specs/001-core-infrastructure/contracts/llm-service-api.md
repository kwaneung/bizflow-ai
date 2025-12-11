# LLM Service API Contract

**Version**: 1.0.0  
**Date**: 2025-12-10  
**Service**: Shared LLM Service

## Overview

This document defines the API contract for the shared LLM service. The service provides a consistent interface for domain modules to interact with LLM APIs.

## Base URL

- **Development**: `/api/llm`
- **Production**: `https://api.bizflow.ai/llm`

## Authentication

All requests require authentication via Supabase Auth token in the Authorization header:

```
Authorization: Bearer <supabase_jwt_token>
```

## Endpoints

### 1. Process LLM Request

Process a module-specific input through LLM and return formatted output.

**Endpoint**: `POST /api/llm/process`

**Request Body**:

```typescript
{
  moduleId: string;           // Domain module identifier (e.g., "ecommerce")
  inputData: object;          // Module-specific input data
  promptTemplateId: string;   // Prompt template identifier
  promptTemplateVersion?: string; // Optional: specific version, defaults to latest active
  context?: object;           // Optional: additional context
  priority?: number;          // Optional: request priority (default: 0)
}
```

**Response** (200 OK):

```typescript
{
  requestId: string; // UUID of the LLM request
  output: {
    // Formatted output
    data: object; // Module-specific output data
    format: string; // Output format: "json" | "text" | "markdown" | "html"
    metadata: {
      requestId: string;
      processingTime: number; // Milliseconds
      model: string; // LLM model used
    }
  }
  status: 'completed';
}
```

**Error Responses**:

- **400 Bad Request**: Invalid input data or missing required fields

  ```typescript
  {
    error: {
      code: 'INVALID_INPUT';
      message: string;
      details: object; // Validation errors
    }
  }
  ```

- **429 Too Many Requests**: Rate limit exceeded

  ```typescript
  {
    error: {
      code: "RATE_LIMIT_EXCEEDED";
      message: string;
      retryAfter: number; // Seconds until retry allowed
      queuePosition?: number; // Position in queue if queued
    };
  }
  ```

- **500 Internal Server Error**: LLM API error or processing failure
  ```typescript
  {
    error: {
      code: "LLM_API_ERROR" | "PROCESSING_ERROR";
      message: string;
      recoverySuggestions: string[];
    };
  }
  ```

---

### 2. Get Request Status

Get the status of an LLM request.

**Endpoint**: `GET /api/llm/requests/:requestId`

**Response** (200 OK):

```typescript
{
  requestId: string;
  status: "pending" | "processing" | "completed" | "failed";
  moduleId: string;
  createdAt: string; // ISO 8601 timestamp
  completedAt?: string; // ISO 8601 timestamp
  output?: object; // Present if status is "completed"
  error?: {
    code: string;
    message: string;
  }; // Present if status is "failed"
}
```

**Error Responses**:

- **404 Not Found**: Request not found
  ```typescript
  {
    error: {
      code: 'REQUEST_NOT_FOUND';
      message: string;
    }
  }
  ```

---

### 3. Cancel Request

Cancel a pending or processing request.

**Endpoint**: `DELETE /api/llm/requests/:requestId`

**Response** (200 OK):

```typescript
{
  requestId: string;
  status: 'cancelled';
  cancelledAt: string; // ISO 8601 timestamp
}
```

**Error Responses**:

- **400 Bad Request**: Request cannot be cancelled (already completed or failed)

  ```typescript
  {
    error: {
      code: 'CANNOT_CANCEL';
      message: string;
    }
  }
  ```

- **404 Not Found**: Request not found

---

### 4. List Requests

List LLM requests for a module (with filtering and pagination).

**Endpoint**: `GET /api/llm/requests`

**Query Parameters**:

- `moduleId` (required): Domain module identifier
- `status` (optional): Filter by status
- `limit` (optional): Number of results (default: 20, max: 100)
- `offset` (optional): Pagination offset (default: 0)
- `sortBy` (optional): Sort field: "createdAt" | "completedAt" (default: "createdAt")
- `sortOrder` (optional): "asc" | "desc" (default: "desc")

**Response** (200 OK):

```typescript
{
  requests: Array<{
    requestId: string;
    status: string;
    moduleId: string;
    createdAt: string;
    completedAt?: string;
  }>;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  }
}
```

---

### 5. Get Rate Limit Status

Get current rate limit status for the authenticated user/module.

**Endpoint**: `GET /api/llm/rate-limit/status`

**Response** (200 OK):

```typescript
{
  provider: string; // LLM provider (e.g., "openai")
  limit: number; // Requests per time window
  window: number; // Time window in seconds
  used: number; // Requests used in current window
  remaining: number; // Requests remaining in current window
  resetAt: string; // ISO 8601 timestamp when window resets
  queueSize?: number; // Current queue size if queue enabled
}
```

---

## Type Definitions

### Error Codes

- `INVALID_INPUT`: Input validation failed
- `INVALID_MODULE`: Module ID not found or invalid
- `INVALID_TEMPLATE`: Prompt template not found or invalid
- `RATE_LIMIT_EXCEEDED`: Rate limit exceeded
- `LLM_API_ERROR`: Error from LLM API provider
- `PROCESSING_ERROR`: Error during processing (parsing, formatting)
- `NETWORK_ERROR`: Network error communicating with LLM API
- `TIMEOUT_ERROR`: Request timeout
- `REQUEST_NOT_FOUND`: Request ID not found
- `CANNOT_CANCEL`: Request cannot be cancelled
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions

---

## Rate Limiting

Rate limiting is applied per LLM API provider account. When rate limits are exceeded:

1. If queue is enabled: Request is queued and processed when capacity is available
2. If queue is disabled: Request is rejected with 429 status

Rate limit headers are included in responses:

- `X-RateLimit-Limit`: Maximum requests per window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Timestamp when window resets

---

## Request/Response Examples

### Example: Process Ecommerce Product Content Request

**Request**:

```json
POST /api/llm/process
{
  "moduleId": "ecommerce",
  "inputData": {
    "productName": "Wireless Bluetooth Headphones",
    "description": "High-quality wireless headphones with noise cancellation",
    "price": 99000,
    "options": ["Black", "White"]
  },
  "promptTemplateId": "ecommerce-product-content",
  "priority": 1
}
```

**Response**:

```json
{
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "output": {
    "data": {
      "seoProductName": "무선 블루투스 헤드폰 - 노이즈 캔슬링",
      "summary1Line": "고품질 무선 블루투스 헤드폰",
      "summary3Line": "노이즈 캔슬링 기능이 있는 고품질 무선 블루투스 헤드폰입니다. 블랙/화이트 색상 선택 가능하며, 99,000원에 판매됩니다.",
      "detailedDescription": "...",
      "instagramPost": "...",
      "blogPost": "...",
      "hashtags": ["#헤드폰", "#블루투스", "#노이즈캔슬링"]
    },
    "format": "json",
    "metadata": {
      "requestId": "550e8400-e29b-41d4-a716-446655440000",
      "processingTime": 3245,
      "model": "gpt-4"
    }
  },
  "status": "completed"
}
```

---

## Versioning

API versioning is handled via URL path:

- Current version: `/api/llm/v1/...`
- Future versions: `/api/llm/v2/...`

Breaking changes require a new version. Non-breaking changes (new optional) are backward compatible.

---

## OpenAPI Specification

Full OpenAPI 3.0 specification available at: `/api/llm/openapi.json`
