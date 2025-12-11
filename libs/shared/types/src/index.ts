/**
 * Shared Type System
 *
 * This library provides common TypeScript types and interfaces for the BizFlow AI platform.
 * All domain modules should use these types to ensure type safety and consistency.
 *
 * @module @bizflow/shared/types
 */

// Core interfaces
export type { Input } from './input';
export type { Output } from './output';

// Common types
export type {
  ErrorType,
  RequestStatus,
  OutputFormat,
  ErrorContext,
  LLMRequest,
  LLMResponse,
  FormattedOutput,
} from './common';

// Type guards
export { isInput, isOutput } from './type-guards';

