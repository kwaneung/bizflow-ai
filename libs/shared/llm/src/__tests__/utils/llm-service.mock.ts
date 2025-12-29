import { LLMService } from '../../services/llm-service';
import { PromptBuilder } from '../../services/prompt-builder';
import { ResponseParser } from '../../services/response-parser';
import { RateLimiter } from '../../services/rate-limiter';
import { ErrorHandler } from '../../utils/error-handler';
import type { LLMRequest, FormattedOutput } from '../../types/llm-types';

/**
 * Mock factory for creating LLMService instances with mocked dependencies.
 * Use this factory in tests to create LLMService instances with controlled behavior.
 */
export function createMockLLMService(options?: {
  promptBuilder?: Partial<PromptBuilder>;
  responseParser?: Partial<ResponseParser>;
  rateLimiter?: Partial<RateLimiter>;
  errorHandler?: Partial<ErrorHandler>;
}): LLMService {
  const mockPromptBuilder = {
    build: jest.fn().mockResolvedValue('mock-prompt'),
    ...options?.promptBuilder,
  } as unknown as PromptBuilder;

  const mockResponseParser = {
    parse: jest.fn().mockResolvedValue({ result: 'parsed' }),
    ...options?.responseParser,
  } as unknown as ResponseParser;

  const mockRateLimiter = {
    checkLimit: jest.fn().mockResolvedValue(true),
    queueRequest: jest.fn().mockResolvedValue('queued-request-id'),
    ...options?.rateLimiter,
  } as unknown as RateLimiter;

  const mockErrorHandler = {
    handleError: jest.fn(),
    ...options?.errorHandler,
  } as unknown as ErrorHandler;

  return new LLMService(
    mockPromptBuilder,
    mockResponseParser,
    mockRateLimiter,
    mockErrorHandler
  );
}

/**
 * Helper to create a mock LLMRequest for testing.
 */
export function createMockLLMRequest(
  overrides?: Partial<LLMRequest>
): LLMRequest {
  return {
    moduleId: 'test-module',
    inputData: { test: 'data' },
    promptTemplateId: 'test-template',
    context: {},
    ...overrides,
  };
}

/**
 * Helper to create a mock FormattedOutput for testing.
 */
export function createMockFormattedOutput<T = unknown>(
  overrides?: Partial<FormattedOutput<T>>
): FormattedOutput<T> {
  return {
    requestId: 'test-request-id',
    moduleId: 'test-module',
    outputData: { result: 'test' } as T,
    format: 'json',
    metadata: {
      processingTime: 100,
      model: 'gpt-4',
    },
    ...overrides,
  };
}

/**
 * Reset all mocks in the LLMService mock factory.
 * Call this in beforeEach or afterEach to ensure clean test state.
 */
export function resetLLMServiceMocks(): void {
  jest.clearAllMocks();
}

