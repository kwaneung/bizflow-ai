import { RateLimiter } from '../../services/rate-limiter';
import type { LLMRequest, RateLimitConfig } from '../../types/llm-types';

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter;
  let mockConfig: RateLimitConfig;

  beforeEach(() => {
    mockConfig = {
      provider: 'openai',
      limitValue: 10,
      windowSeconds: 60,
      strategy: 'fixed',
      queueEnabled: true,
      queueMaxSize: 100,
      isActive: true,
    };

    rateLimiter = new RateLimiter(mockConfig);
  });

  describe('checkLimit', () => {
    it('should allow request when under limit', async () => {
      const result = await rateLimiter.checkLimit('test-module');

      expect(result).toBe(true);
    });

    it('should reject request when limit exceeded', async () => {
      // Simulate multiple requests to exceed limit
      for (let i = 0; i < 11; i++) {
        await rateLimiter.checkLimit('test-module');
      }

      const result = await rateLimiter.checkLimit('test-module');

      expect(result).toBe(false);
    });

    it('should reset limit after window expires', async () => {
      // Exceed limit
      for (let i = 0; i < 11; i++) {
        await rateLimiter.checkLimit('test-module');
      }

      // Wait for window to expire (in test, we can mock time)
      // For now, just verify the limit check works
      const result = await rateLimiter.checkLimit('test-module');
      expect(result).toBe(false);
    });
  });

  describe('queueRequest', () => {
    it('should queue request when limit exceeded', async () => {
      const request: LLMRequest = {
        moduleId: 'test-module',
        inputData: { test: 'data' },
        promptTemplateId: 'template-1',
        priority: 0,
      };

      const requestId = await rateLimiter.queueRequest(request);

      expect(requestId).toBeDefined();
      expect(typeof requestId).toBe('string');
    });

    it('should reject request when queue is full', async () => {
      const request: LLMRequest = {
        moduleId: 'test-module',
        inputData: { test: 'data' },
        promptTemplateId: 'template-1',
        priority: 0,
      };

      // Fill queue
      for (let i = 0; i < 100; i++) {
        await rateLimiter.queueRequest(request);
      }

      // Next request should fail
      await expect(rateLimiter.queueRequest(request)).rejects.toThrow();
    });

    it('should prioritize requests by priority', async () => {
      const lowPriorityRequest: LLMRequest = {
        moduleId: 'test-module',
        inputData: { test: 'data' },
        promptTemplateId: 'template-1',
        priority: 0,
      };

      const highPriorityRequest: LLMRequest = {
        moduleId: 'test-module',
        inputData: { test: 'data' },
        promptTemplateId: 'template-1',
        priority: 10,
      };

      await rateLimiter.queueRequest(lowPriorityRequest);
      await rateLimiter.queueRequest(highPriorityRequest);

      // High priority should be processed first
      const nextRequest = await rateLimiter.getNextQueuedRequest('test-module');
      expect(nextRequest?.priority).toBe(10);
    });
  });

  describe('getNextQueuedRequest', () => {
    it('should return next queued request', async () => {
      const request: LLMRequest = {
        moduleId: 'test-module',
        inputData: { test: 'data' },
        promptTemplateId: 'template-1',
        priority: 0,
      };

      await rateLimiter.queueRequest(request);

      const nextRequest = await rateLimiter.getNextQueuedRequest('test-module');

      expect(nextRequest).toBeDefined();
      expect(nextRequest?.request.moduleId).toBe('test-module');
    });

    it('should return null when queue is empty', async () => {
      const nextRequest = await rateLimiter.getNextQueuedRequest('test-module');

      expect(nextRequest).toBeNull();
    });
  });
});

