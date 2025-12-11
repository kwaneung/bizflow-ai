/**
 * Common types used across the shared type system.
 */

/**
 * Error types that can occur during LLM processing
 */
export type ErrorType =
  | 'validation'
  | 'network'
  | 'api'
  | 'parsing'
  | 'formatting'
  | 'rate-limit';

/**
 * Request status for LLM requests
 */
export type RequestStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * Output format types
 */
export type OutputFormat = 'json' | 'text' | 'markdown' | 'html';

/**
 * Error context for debugging and user feedback
 */
export interface ErrorContext {
  /**
   * Type of error that occurred
   */
  type: ErrorType;

  /**
   * Error code for programmatic handling
   */
  code: string;

  /**
   * Human-readable error message
   */
  message: string;

  /**
   * Technical details for debugging (optional)
   */
  technicalDetails?: Record<string, unknown>;

  /**
   * Suggested recovery actions
   */
  recoverySuggestions: string[];
}

/**
 * LLM Request type for service calls
 */
export interface LLMRequest {
  /**
   * Domain module identifier
   */
  moduleId: string;

  /**
   * Module-specific input data (validated against Input schema)
   */
  inputData: unknown;

  /**
   * Identifier for the prompt template to use
   */
  promptTemplateId: string;

  /**
   * Version of the prompt template (semantic versioning)
   */
  promptTemplateVersion?: string;

  /**
   * Additional context for the request
   */
  context?: Record<string, unknown>;

  /**
   * Request priority for queue management
   */
  priority?: number;
}

/**
 * LLM Response type from service
 */
export interface LLMResponse {
  /**
   * Request identifier
   */
  requestId: string;

  /**
   * Raw response content from LLM API
   */
  rawContent: string;

  /**
   * Response metadata
   */
  metadata: {
    /**
     * LLM model used
     */
    model: string;

    /**
     * Number of tokens used
     */
    tokensUsed: number;

    /**
     * Latency in milliseconds
     */
    latencyMs: number;
  };
}

/**
 * Formatted output after processing
 */
export interface FormattedOutput<T> {
  /**
   * Request identifier
   */
  requestId: string;

  /**
   * Domain module identifier
   */
  moduleId: string;

  /**
   * Module-specific output data (validated against Output schema)
   */
  outputData: T;

  /**
   * Output format
   */
  format: OutputFormat;

  /**
   * Processing metadata
   */
  metadata: {
    /**
     * Request identifier
     */
    requestId: string;

    /**
     * Processing time in milliseconds
     */
    processingTime: number;

    /**
     * LLM model used
     */
    model: string;
  };
}

