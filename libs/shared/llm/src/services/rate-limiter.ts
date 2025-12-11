import type { LLMRequest, RateLimitConfig, QueuedRequest } from '../types/llm-types';
import { randomUUID } from 'crypto';

/**
 * Service for rate limiting LLM API requests.
 */
export class RateLimiter {
  private config: RateLimitConfig;
  private requestCounts: Map<string, { count: number; resetAt: Date }> = new Map();
  private queues: Map<string, QueuedRequest[]> = new Map();

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Check if a request can be processed (within rate limit).
   *
   * @param moduleId - Domain module identifier
   * @returns True if request can be processed, false if rate limit exceeded
   */
  async checkLimit(moduleId: string): Promise<boolean> {
    const key = `${moduleId}:${this.config.provider}`;
    const now = new Date();
    const record = this.requestCounts.get(key);

    if (!record || now >= record.resetAt) {
      // Reset or initialize
      this.requestCounts.set(key, {
        count: 1,
        resetAt: new Date(now.getTime() + this.config.windowSeconds * 1000),
      });
      return true;
    }

    if (record.count >= this.config.limitValue) {
      return false;
    }

    record.count++;
    return true;
  }

  /**
   * Queue a request when rate limit is exceeded.
   *
   * @param request - LLM request to queue
   * @returns Request ID
   * @throws Error if queue is full
   */
  async queueRequest(request: LLMRequest): Promise<string> {
    if (!this.config.queueEnabled) {
      throw new Error('Queue is not enabled');
    }

    const queue = this.queues.get(request.moduleId) || [];

    if (
      this.config.queueMaxSize &&
      queue.length >= this.config.queueMaxSize
    ) {
      throw new Error('Queue is full');
    }

    const requestId = randomUUID();
    const queuedRequest: QueuedRequest = {
      requestId,
      priority: request.priority || 0,
      queuedAt: new Date(),
      request,
    };

    queue.push(queuedRequest);
    // Sort by priority (higher priority first)
    queue.sort((a, b) => b.priority - a.priority);

    this.queues.set(request.moduleId, queue);

    return requestId;
  }

  /**
   * Get next queued request for a module.
   *
   * @param moduleId - Domain module identifier
   * @returns Next queued request or null if queue is empty
   */
  async getNextQueuedRequest(moduleId: string): Promise<QueuedRequest | null> {
    const queue = this.queues.get(moduleId) || [];

    if (queue.length === 0) {
      return null;
    }

    // Return highest priority request (already sorted)
    return queue.shift() || null;
  }

  /**
   * Update rate limit configuration.
   *
   * @param config - New rate limit configuration
   */
  updateConfig(config: RateLimitConfig): void {
    this.config = config;
  }
}

