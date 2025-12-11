/**
 * Shared LLM Service
 *
 * This library provides a shared LLM service for processing module-specific inputs
 * through LLM APIs with rate limiting, error handling, and response parsing.
 *
 * @module @bizflow/shared/llm
 */

// Services
export { LLMService } from './services/llm-service';
export { PromptBuilder } from './services/prompt-builder';
export { ResponseParser } from './services/response-parser';
export { RateLimiter } from './services/rate-limiter';

// Utilities
export { ErrorHandler } from './utils/error-handler';

// Types
export type {
  LLMRequest,
  LLMResponse,
  FormattedOutput,
  ErrorContext,
  ErrorType,
  RequestStatus,
  RateLimitConfig,
  PromptTemplate,
  LLMAPIOptions,
  QueuedRequest,
  LLMProvider,
  RateLimitStrategy,
} from './types/llm-types';

