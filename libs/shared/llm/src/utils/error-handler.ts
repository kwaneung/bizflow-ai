import type { ErrorContext, ErrorType } from '../types/llm-types';

/**
 * Utility for handling and formatting errors.
 */
export class ErrorHandler {
  /**
   * Handle an error and create an ErrorContext.
   *
   * @param type - Error type
   * @param code - Error code
   * @param error - Original error object
   * @param additionalDetails - Additional error details
   * @returns Error context
   */
  handleError(
    type: ErrorType,
    code: string,
    error: Error | unknown,
    additionalDetails?: Record<string, unknown>
  ): ErrorContext {
    const message =
      error instanceof Error ? error.message : String(error);

    const technicalDetails: Record<string, unknown> = {
      ...additionalDetails,
    };

    if (error instanceof Error && error.stack) {
      technicalDetails.stack = error.stack;
    }

    const recoverySuggestions = this.getRecoverySuggestions(type, code);

    return {
      type,
      code,
      message,
      technicalDetails: Object.keys(technicalDetails).length > 0
        ? technicalDetails
        : undefined,
      recoverySuggestions,
    };
  }

  /**
   * Get recovery suggestions for an error type.
   *
   * @param type - Error type
   * @param code - Error code
   * @returns Array of recovery suggestions
   */
  private getRecoverySuggestions(
    type: ErrorType,
    code: string
  ): string[] {
    const suggestions: Record<ErrorType, string[]> = {
      validation: [
        'Check that all required fields are provided',
        'Verify input data format matches expected schema',
        'Review input validation rules',
      ],
      network: [
        'Check your internet connection',
        'Verify API endpoint is accessible',
        'Retry the request after a short delay',
      ],
      api: [
        'Verify API credentials are correct',
        'Check API service status',
        'Review API documentation for changes',
        'Retry the request',
      ],
      parsing: [
        'Verify response format matches expected structure',
        'Check for malformed JSON or data',
        'Review response parsing logic',
      ],
      formatting: [
        'Verify output format is supported',
        'Check formatting rules',
        'Review output schema',
      ],
      'rate-limit': [
        'Wait before retrying',
        'Reduce request frequency',
        'Check rate limit configuration',
        'Consider upgrading API plan',
      ],
    };

    return suggestions[type] || ['Review error details and retry'];
  }
}

