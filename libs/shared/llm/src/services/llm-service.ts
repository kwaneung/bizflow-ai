import { PromptBuilder } from './prompt-builder';
import { ResponseParser } from './response-parser';
import { RateLimiter } from './rate-limiter';
import { ErrorHandler } from '../utils/error-handler';
import type {
  LLMRequest,
  LLMResponse,
  FormattedOutput,
  RateLimitConfig,
  ErrorType,
} from '../types/llm-types';
import type { OutputFormat } from '@bizflow/shared/types';
import { randomUUID } from 'crypto';

/**
 * Main LLM service for processing module-specific inputs through LLM APIs.
 */
export class LLMService {
  private promptBuilder: PromptBuilder;
  private responseParser: ResponseParser;
  private rateLimiter: RateLimiter;
  private errorHandler: ErrorHandler;
  private apiKey: string;
  private apiEndpoint: string;

  constructor(
    promptBuilder?: PromptBuilder,
    responseParser?: ResponseParser,
    rateLimiter?: RateLimiter,
    errorHandler?: ErrorHandler
  ) {
    this.promptBuilder =
      promptBuilder || new PromptBuilder();
    this.responseParser =
      responseParser || new ResponseParser();
    this.rateLimiter =
      rateLimiter ||
      new RateLimiter({
        provider: 'openai',
        limitValue: 60,
        windowSeconds: 60,
        strategy: 'fixed',
        queueEnabled: true,
        queueMaxSize: 100,
        isActive: true,
      });
    this.errorHandler = errorHandler || new ErrorHandler();

    // Initialize API configuration from environment variables
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.apiEndpoint = 'https://api.openai.com/v1/chat/completions';

    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
  }

  /**
   * Process an LLM request and return formatted output.
   *
   * @param request - LLM request
   * @returns Formatted output
   */
  async process<T = unknown>(
    request: LLMRequest
  ): Promise<FormattedOutput<T>> {
    const requestId = randomUUID();
    const startTime = Date.now();

    try {
      // Validate input
      this.validateRequest(request);

      // Check rate limit
      const canProcess = await this.rateLimiter.checkLimit(request.moduleId);
      if (!canProcess) {
        if (this.rateLimiter) {
          const queuedRequestId = await this.rateLimiter.queueRequest(request);
          throw new Error(
            `Rate limit exceeded. Request queued with ID: ${queuedRequestId}`
          );
        }
        throw new Error('Rate limit exceeded');
      }

      // Build prompt
      const prompt = await this.promptBuilder.build(
        request.promptTemplateId,
        request.inputData as Record<string, unknown>,
        request.context
      );

      // Call LLM API
      const rawResponse = await this.callLLMAPI(prompt);

      // Parse response
      const parsedData = await this.responseParser.parse(
        rawResponse,
        'json' // Default format, can be made configurable
      );

      const processingTime = Date.now() - startTime;

      // Return formatted output
      return {
        requestId,
        moduleId: request.moduleId,
        outputData: parsedData as T,
        format: 'json' as OutputFormat,
        metadata: {
          requestId,
          processingTime,
          model: 'gpt-4', // TODO: Get from API response
        },
      };
    } catch (error) {
      const errorContext = this.errorHandler.handleError(
        this.determineErrorType(error),
        this.determineErrorCode(error),
        error
      );

      throw new Error(
        `LLM processing failed: ${errorContext.message}. ${errorContext.recoverySuggestions.join(', ')}`
      );
    }
  }

  /**
   * Validate LLM request.
   *
   * @param request - LLM request to validate
   * @throws Error if request is invalid
   */
  private validateRequest(request: LLMRequest): void {
    if (!request.moduleId) {
      throw new Error('moduleId is required');
    }

    if (!request.inputData) {
      throw new Error('inputData is required');
    }

    if (!request.promptTemplateId) {
      throw new Error('promptTemplateId is required');
    }
  }

  /**
   * Call LLM API with prompt.
   *
   * @param prompt - Formatted prompt
   * @returns Raw response from LLM API
   */
  private async callLLMAPI(prompt: string): Promise<string> {
    // TODO: Implement actual OpenAI API call
    // For now, return mock response
    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.statusText}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return data.choices?.[0]?.message?.content || '';
  }

  /**
   * Determine error type from error object.
   *
   * @param error - Error object
   * @returns Error type
   */
  private determineErrorType(error: unknown): ErrorType {
    if (error instanceof Error) {
      if (error.message.includes('validation') || error.message.includes('invalid')) {
        return 'validation';
      }
      if (error.message.includes('network') || error.message.includes('timeout')) {
        return 'network';
      }
      if (error.message.includes('rate limit')) {
        return 'rate-limit';
      }
      if (error.message.includes('parse')) {
        return 'parsing';
      }
    }
    return 'api';
  }

  /**
   * Determine error code from error object.
   *
   * @param error - Error object
   * @returns Error code
   */
  private determineErrorCode(error: unknown): string {
    if (error instanceof Error) {
      if (error.message.includes('validation')) {
        return 'VALIDATION_ERROR';
      }
      if (error.message.includes('rate limit')) {
        return 'RATE_LIMIT_EXCEEDED';
      }
      if (error.message.includes('network')) {
        return 'NETWORK_ERROR';
      }
    }
    return 'LLM_API_ERROR';
  }
}

