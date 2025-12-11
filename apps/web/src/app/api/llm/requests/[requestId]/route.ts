import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@bizflow/shared/llm';

/**
 * GET /api/llm/requests/[requestId]
 *
 * Get the status and details of an LLM request.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params;

    if (!requestId) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_INPUT',
            message: 'Request ID is required',
          },
        },
        { status: 400 }
      );
    }

    // Get request from Supabase
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

    const { data: requestData, error: requestError } = await client
      .from('llm_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (requestError || !requestData) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: `Request with ID ${requestId} not found`,
          },
        },
        { status: 404 }
      );
    }

    // Get formatted output if request is completed
    let formattedOutput = null;
    if (requestData.status === 'completed') {
      const { data: outputData } = await client
        .from('formatted_outputs')
        .select('*')
        .eq('request_id', requestId)
        .single();

      if (outputData) {
        formattedOutput = {
          data: outputData.output_data,
          format: outputData.format,
          metadata: {
            requestId: outputData.request_id,
            processingTime: outputData.processing_time_ms,
            model: outputData.model,
          },
        };
      }
    }

    // Get error context if request failed
    let errorContext = null;
    if (requestData.status === 'failed') {
      const { data: errorData } = await client
        .from('error_contexts')
        .select('*')
        .eq('request_id', requestId)
        .single();

      if (errorData) {
        errorContext = {
          type: errorData.error_type,
          code: errorData.error_code,
          message: errorData.error_message,
          technicalDetails: errorData.technical_details,
          recoverySuggestions: errorData.recovery_suggestions,
        };
      }
    }

    return NextResponse.json(
      {
        requestId: requestData.id,
        status: requestData.status,
        moduleId: requestData.module_id,
        promptTemplateId: requestData.prompt_template_id,
        createdAt: requestData.created_at,
        updatedAt: requestData.updated_at,
        output: formattedOutput,
        error: errorContext,
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

