import { LLMService } from '../../services/llm-service';
import { PromptBuilder } from '../../services/prompt-builder';
import { ResponseParser } from '../../services/response-parser';
import { RateLimiter } from '../../services/rate-limiter';
import { ErrorHandler } from '../../utils/error-handler';
import { supabaseClient } from '../../utils/supabase-client';
import type { LLMRequest } from '../../types/llm-types';

// Mock fetch globally
global.fetch = jest.fn();

// Mock Supabase client
jest.mock('../../utils/supabase-client', () => ({
  supabaseClient: {
    saveLLMRequest: jest.fn().mockResolvedValue('request-id'),
    updateLLMRequestStatus: jest.fn().mockResolvedValue(undefined),
    saveLLMResponse: jest.fn().mockResolvedValue(undefined),
    saveFormattedOutput: jest.fn().mockResolvedValue(undefined),
    saveErrorContext: jest.fn().mockResolvedValue(undefined),
    loadPromptTemplate: jest.fn(),
  },
}));

describe('LLMService', () => {
  let llmService: LLMService;
  let mockPromptBuilder: jest.Mocked<PromptBuilder>;
  let mockResponseParser: jest.Mocked<ResponseParser>;
  let mockRateLimiter: jest.Mocked<RateLimiter>;
  let mockErrorHandler: jest.Mocked<ErrorHandler>;

  beforeEach(() => {
    // Set environment variables
    process.env.OPENAI_API_KEY = 'test-api-key';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

    // Reset all mocks
    jest.clearAllMocks();

    // Setup Supabase client mocks
    (supabaseClient.saveLLMRequest as jest.Mock).mockResolvedValue('request-id');
    (supabaseClient.updateLLMRequestStatus as jest.Mock).mockResolvedValue(undefined);
    (supabaseClient.saveLLMResponse as jest.Mock).mockResolvedValue(undefined);
    (supabaseClient.saveFormattedOutput as jest.Mock).mockResolvedValue(undefined);
    (supabaseClient.saveErrorContext as jest.Mock).mockResolvedValue(undefined);

    mockPromptBuilder = {
      build: jest.fn(),
    } as unknown as jest.Mocked<PromptBuilder>;

    mockResponseParser = {
      parse: jest.fn(),
    } as unknown as jest.Mocked<ResponseParser>;

    mockRateLimiter = {
      checkLimit: jest.fn(),
      queueRequest: jest.fn(),
    } as unknown as jest.Mocked<RateLimiter>;

    mockErrorHandler = {
      handleError: jest.fn(),
    } as unknown as jest.Mocked<ErrorHandler>;

    llmService = new LLMService(
      mockPromptBuilder,
      mockResponseParser,
      mockRateLimiter,
      mockErrorHandler
    );
  });

  describe('process', () => {
    const mockRequest: LLMRequest = {
      moduleId: 'test-module',
      inputData: { name: 'test' },
      promptTemplateId: 'test-template',
      priority: 0,
    };

    it('should process a valid request successfully', async () => {
      const mockPrompt = 'Formatted prompt';
      const mockRawResponse = '{"result": "parsed"}';
      const mockParsedData = { result: 'parsed' };

      mockRateLimiter.checkLimit.mockResolvedValue(true);
      mockPromptBuilder.build.mockResolvedValue(mockPrompt);
      
      // Mock fetch for LLM API call
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: mockRawResponse,
              },
            },
          ],
        }),
      });

      mockResponseParser.parse.mockResolvedValue(mockParsedData);

      const result = await llmService.process(mockRequest);

      expect(mockRateLimiter.checkLimit).toHaveBeenCalledWith('test-module');
      expect(mockPromptBuilder.build).toHaveBeenCalledWith(
        'test-template',
        mockRequest.inputData,
        mockRequest.context,
        mockRequest.promptTemplateVersion
      );
      expect(result).toBeDefined();
      expect(result.outputData).toEqual(mockParsedData);
    });

    it('should handle rate limit exceeded', async () => {
      mockRateLimiter.checkLimit.mockResolvedValue(false);
      mockRateLimiter.queueRequest.mockResolvedValue('queued-request-id');

      await expect(llmService.process(mockRequest)).rejects.toThrow();

      expect(mockRateLimiter.queueRequest).toHaveBeenCalledWith(mockRequest);
    });

    it('should handle LLM API errors', async () => {
      mockRateLimiter.checkLimit.mockResolvedValue(true);
      mockPromptBuilder.build.mockResolvedValue('prompt');
      
      // Mock fetch to return error
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        statusText: 'API Error',
      });

      mockErrorHandler.handleError.mockReturnValue({
        type: 'api',
        code: 'LLM_API_ERROR',
        message: 'API Error',
        recoverySuggestions: ['Retry request'],
      });

      await expect(llmService.process(mockRequest)).rejects.toThrow();
    });

    it('should validate input data', async () => {
      const invalidRequest = {
        ...mockRequest,
        inputData: null,
      } as unknown as LLMRequest;

      await expect(llmService.process(invalidRequest)).rejects.toThrow();
    });
  });
});

