import { NextRequest, NextResponse } from 'next/server';
import { LLMService } from '@bizflow/shared/llm';
import type { LLMRequest } from '@bizflow/shared/llm';

/**
 * POST /api/llm/process
 *
 * Process a module-specific input through LLM and return formatted output.
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.moduleId || !body.inputData || !body.promptTemplateId) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_INPUT',
            message: 'Missing required fields: moduleId, inputData, promptTemplateId',
            details: {
              moduleId: body.moduleId ? undefined : 'required',
              inputData: body.inputData ? undefined : 'required',
              promptTemplateId: body.promptTemplateId ? undefined : 'required',
            },
          },
        },
        { status: 400 }
      );
    }

    // Construct LLM request
    const llmRequest: LLMRequest = {
      moduleId: body.moduleId,
      inputData: body.inputData,
      promptTemplateId: body.promptTemplateId,
      promptTemplateVersion: body.promptTemplateVersion,
      context: body.context,
      priority: body.priority || 0,
    };

    // Initialize LLM service
    const llmService = new LLMService();

    // Process request
    const result = await llmService.process(llmRequest);

    // Return success response
    return NextResponse.json(
      {
        requestId: result.requestId,
        output: {
          data: result.outputData,
          format: result.format,
          metadata: result.metadata,
        },
        status: 'completed',
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle rate limit errors
    if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
      const retryAfter = 60; // Default retry after 60 seconds
      return NextResponse.json(
        {
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: error.message,
            retryAfter,
          },
        },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }

    // Handle validation errors
    if (error instanceof Error && error.message.includes('required')) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_INPUT',
            message: error.message,
            details: {},
          },
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        error: {
          code: 'LLM_API_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          recoverySuggestions: [
            'Verify your input data format',
            'Check API service status',
            'Retry the request after a short delay',
          ],
        },
      },
      { status: 500 }
    );
  }
}

