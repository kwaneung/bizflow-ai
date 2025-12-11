import type {
  ErrorContext,
  LLMRequest,
  LLMResponse,
  FormattedOutput,
  ErrorType,
  RequestStatus,
} from '@bizflow/shared/types';

/**
 * Re-export types from shared/types for convenience
 */
export type {
  ErrorContext,
  LLMRequest,
  LLMResponse,
  FormattedOutput,
  ErrorType,
  RequestStatus,
};

/**
 * LLM Provider types
 */
export type LLMProvider = 'openai' | 'anthropic' | 'custom';

/**
 * Rate limiting strategy types
 */
export type RateLimitStrategy = 'fixed' | 'token-bucket' | 'sliding-window';

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  /**
   * LLM API provider
   */
  provider: LLMProvider;

  /**
   * Maximum requests per time window
   */
  limitValue: number;

  /**
   * Time window in seconds
   */
  windowSeconds: number;

  /**
   * Rate limiting strategy
   */
  strategy: RateLimitStrategy;

  /**
   * Whether to queue requests when limit is reached
   */
  queueEnabled: boolean;

  /**
   * Maximum queue size (if queueEnabled is true)
   */
  queueMaxSize?: number;

  /**
   * Whether this configuration is active
   */
  isActive: boolean;
}

/**
 * Prompt template structure
 */
export interface PromptTemplate {
  /**
   * Template identifier
   */
  id: string;

  /**
   * Domain module identifier
   */
  moduleId: string;

  /**
   * Template version
   */
  version: string;

  /**
   * Template name
   */
  name: string;

  /**
   * Template content with variable placeholders
   */
  template: string;

  /**
   * Variable definitions
   */
  variables: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    required: boolean;
    description?: string;
  }>;

  /**
   * Template description
   */
  description?: string;

  /**
   * Whether this template is active
   */
  isActive: boolean;
}

/**
 * LLM API request options
 */
export interface LLMAPIOptions {
  /**
   * API endpoint URL
   */
  endpoint: string;

  /**
   * API key
   */
  apiKey: string;

  /**
   * Request timeout in milliseconds
   */
  timeout?: number;

  /**
   * Maximum retries
   */
  maxRetries?: number;
}

/**
 * Queued request information
 */
export interface QueuedRequest {
  /**
   * Request identifier
   */
  requestId: string;

  /**
   * Request priority
   */
  priority: number;

  /**
   * Timestamp when request was queued
   */
  queuedAt: Date;

  /**
   * Request data
   */
  request: LLMRequest;
}

