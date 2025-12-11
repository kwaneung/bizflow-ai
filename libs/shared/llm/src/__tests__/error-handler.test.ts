import { ErrorHandler } from '../utils/error-handler';
import type { ErrorContext, ErrorType } from '../types/llm-types';

describe('ErrorHandler', () => {
  let errorHandler: ErrorHandler;

  beforeEach(() => {
    errorHandler = new ErrorHandler();
  });

  describe('handleError', () => {
    it('should handle validation errors', () => {
      const error = new Error('Invalid input data');
      const errorContext = errorHandler.handleError(
        'validation',
        'INVALID_INPUT',
        error
      );

      expect(errorContext.type).toBe('validation');
      expect(errorContext.code).toBe('INVALID_INPUT');
      expect(errorContext.message).toContain('Invalid input data');
      expect(errorContext.recoverySuggestions).toBeInstanceOf(Array);
    });

    it('should handle network errors', () => {
      const error = new Error('Network timeout');
      const errorContext = errorHandler.handleError(
        'network',
        'NETWORK_TIMEOUT',
        error
      );

      expect(errorContext.type).toBe('network');
      expect(errorContext.code).toBe('NETWORK_TIMEOUT');
      expect(errorContext.recoverySuggestions).toContain(
        'Check your internet connection'
      );
    });

    it('should handle API errors', () => {
      const error = new Error('API rate limit exceeded');
      const errorContext = errorHandler.handleError('api', 'API_ERROR', error);

      expect(errorContext.type).toBe('api');
      expect(errorContext.code).toBe('API_ERROR');
      expect(errorContext.recoverySuggestions).toBeInstanceOf(Array);
    });

    it('should handle parsing errors', () => {
      const error = new Error('Failed to parse response');
      const errorContext = errorHandler.handleError(
        'parsing',
        'PARSE_ERROR',
        error
      );

      expect(errorContext.type).toBe('parsing');
      expect(errorContext.code).toBe('PARSE_ERROR');
    });

    it('should handle rate limit errors', () => {
      const error = new Error('Rate limit exceeded');
      const errorContext = errorHandler.handleError(
        'rate-limit',
        'RATE_LIMIT_EXCEEDED',
        error
      );

      expect(errorContext.type).toBe('rate-limit');
      expect(errorContext.code).toBe('RATE_LIMIT_EXCEEDED');
      expect(errorContext.recoverySuggestions).toContain('Wait before retrying');
    });

    it('should include technical details for debugging', () => {
      const error = new Error('Test error');
      error.stack = 'Error stack trace';

      const errorContext = errorHandler.handleError(
        'api',
        'API_ERROR',
        error
      );

      expect(errorContext.technicalDetails).toBeDefined();
      expect(errorContext.technicalDetails?.stack).toBe('Error stack trace');
    });

    it('should provide appropriate recovery suggestions for each error type', () => {
      const errorTypes: ErrorType[] = [
        'validation',
        'network',
        'api',
        'parsing',
        'formatting',
        'rate-limit',
      ];

      errorTypes.forEach((type) => {
        const error = new Error('Test error');
        const errorContext = errorHandler.handleError(
          type,
          'TEST_ERROR',
          error
        );

        expect(errorContext.recoverySuggestions.length).toBeGreaterThan(0);
      });
    });
  });
});

