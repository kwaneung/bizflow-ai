import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@bizflow/shared/llm';

/**
 * GET /api/llm/rate-limit/status
 *
 * Get rate limit status for a module.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const moduleId = searchParams.get('moduleId');

    if (!moduleId) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_INPUT',
            message: 'moduleId query parameter is required',
          },
        },
        { status: 400 }
      );
    }

    // Get rate limit configuration from Supabase
    const client = supabaseClient.getClient();
    if (!client) {
      return NextResponse.json(
        {
          error: {
            code: 'SERVICE_UNAVAILABLE',
            message: 'Database service is not available',
          },
        },
        { status: 503 }
      );
    }

    const { data: rateLimitConfig, error } = await client
      .from('rate_limit_configs')
      .select('*')
      .eq('module_id', moduleId)
      .eq('is_active', true)
      .single();

    if (error || !rateLimitConfig) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: `Rate limit configuration for module ${moduleId} not found`,
          },
        },
        { status: 404 }
      );
    }

    // TODO: Get current usage count from rate limiter
    // For now, return configuration only
    return NextResponse.json(
      {
        moduleId: rateLimitConfig.module_id,
        provider: rateLimitConfig.provider,
        limitValue: rateLimitConfig.limit_value,
        windowSeconds: rateLimitConfig.window_seconds,
        strategy: rateLimitConfig.strategy,
        queueEnabled: rateLimitConfig.queue_enabled,
        queueMaxSize: rateLimitConfig.queue_max_size,
        currentUsage: 0, // TODO: Get from rate limiter
        remainingRequests: rateLimitConfig.limit_value, // TODO: Calculate from current usage
        resetAt: new Date(Date.now() + rateLimitConfig.window_seconds * 1000).toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        },
      },
      { status: 500 }
    );
  }
}

