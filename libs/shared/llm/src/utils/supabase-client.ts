import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { PromptTemplate } from '../types/llm-types';
import type { Database } from '../../../../supabase/types';

/**
 * Supabase client singleton for LLM service.
 */
class SupabaseClient {
  private client: SupabaseClient<Database> | null = null;

  /**
   * Get or create Supabase client instance.
   *
   * @returns Supabase client
   */
  getClient() {
    if (this.client) {
      return this.client;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // In test environment, allow missing env vars (will be mocked)
    if (process.env.NODE_ENV === 'test') {
      if (!supabaseUrl || !supabaseAnonKey) {
        // Return a mock client in test environment
        return null as any;
      }
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Supabase environment variables are not set. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY',
      );
    }

    this.client = createClient<Database>(supabaseUrl, supabaseAnonKey);
    return this.client;
  }

  /**
   * Load prompt template from Supabase.
   *
   * @param templateId - Template identifier
   * @param version - Optional template version (defaults to latest active)
   * @returns Prompt template or null if not found
   */
  async loadPromptTemplate(
    templateId: string,
    version?: string,
  ): Promise<PromptTemplate | null> {
    const client = this.getClient();
    if (!client) {
      // In test environment, return null to allow fallback
      return null;
    }

    let query = client
      .from('prompt_templates')
      .select('*')
      .eq('id', templateId)
      .eq('is_active', true);

    if (version) {
      query = query.eq('version', version);
    } else {
      // Get latest version
      query = query.order('version', { ascending: false }).limit(1);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw new Error(`Failed to load prompt template: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    // Transform database row to PromptTemplate type
    return {
      id: data.id,
      moduleId: data.module_id,
      version: data.version,
      name: data.name,
      template: data.template,
      variables: data.variables || [],
      description: data.description || undefined,
      isActive: data.is_active,
    };
  }

  /**
   * Save LLM request to Supabase.
   *
   * @param requestId - Request identifier
   * @param moduleId - Domain module identifier
   * @param inputData - Input data
   * @param promptTemplateId - Prompt template identifier
   * @returns Saved request ID
   */
  async saveLLMRequest(
    requestId: string,
    moduleId: string,
    inputData: unknown,
    promptTemplateId: string,
  ): Promise<string> {
    const client = this.getClient();
    if (!client) {
      // In test environment, return mock ID
      return requestId;
    }

    const { data, error } = await client
      .from('llm_requests')
      .insert({
        id: requestId,
        module_id: moduleId,
        input_data: inputData,
        prompt_template_id: promptTemplateId,
        status: 'pending',
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to save LLM request: ${error.message}`);
    }

    return data.id;
  }

  /**
   * Update LLM request status.
   *
   * @param requestId - Request identifier
   * @param status - New status
   */
  async updateLLMRequestStatus(
    requestId: string,
    status: 'pending' | 'processing' | 'completed' | 'failed',
  ): Promise<void> {
    const client = this.getClient();
    if (!client) {
      // In test environment, skip DB operation
      return;
    }

    const { error } = await client
      .from('llm_requests')
      .update({ status })
      .eq('id', requestId);

    if (error) {
      throw new Error(`Failed to update LLM request status: ${error.message}`);
    }
  }

  /**
   * Save LLM response to Supabase.
   *
   * @param requestId - Request identifier
   * @param rawContent - Raw response content
   * @param metadata - Response metadata
   */
  async saveLLMResponse(
    requestId: string,
    rawContent: string,
    metadata: {
      model: string;
      tokensUsed: number;
      latencyMs: number;
    },
  ): Promise<void> {
    const client = this.getClient();
    if (!client) {
      // In test environment, skip DB operation
      return;
    }

    const { error } = await client.from('llm_responses').insert({
      request_id: requestId,
      raw_content: rawContent,
      model: metadata.model,
      tokens_used: metadata.tokensUsed,
      latency_ms: metadata.latencyMs,
    });

    if (error) {
      throw new Error(`Failed to save LLM response: ${error.message}`);
    }
  }

  /**
   * Save formatted output to Supabase.
   *
   * @param requestId - Request identifier
   * @param moduleId - Domain module identifier
   * @param outputData - Formatted output data
   * @param format - Output format
   * @param metadata - Processing metadata
   */
  async saveFormattedOutput(
    requestId: string,
    moduleId: string,
    outputData: unknown,
    format: string,
    metadata: {
      processingTime: number;
      model: string;
    },
  ): Promise<void> {
    const client = this.getClient();
    if (!client) {
      // In test environment, skip DB operation
      return;
    }

    const { error } = await client.from('formatted_outputs').insert({
      request_id: requestId,
      module_id: moduleId,
      output_data: outputData,
      format,
      processing_time_ms: metadata.processingTime,
      model: metadata.model,
    });

    if (error) {
      throw new Error(`Failed to save formatted output: ${error.message}`);
    }
  }

  /**
   * Save error context to Supabase.
   *
   * @param requestId - Request identifier
   * @param errorContext - Error context
   */
  async saveErrorContext(
    requestId: string,
    errorContext: {
      type: string;
      code: string;
      message: string;
      technicalDetails?: Record<string, unknown>;
      recoverySuggestions: string[];
    },
  ): Promise<void> {
    const client = this.getClient();
    if (!client) {
      // In test environment, skip DB operation
      return;
    }

    const { error } = await client.from('error_contexts').insert({
      request_id: requestId,
      error_type: errorContext.type,
      error_code: errorContext.code,
      error_message: errorContext.message,
      technical_details: errorContext.technicalDetails || null,
      recovery_suggestions: errorContext.recoverySuggestions,
    });

    if (error) {
      throw new Error(`Failed to save error context: ${error.message}`);
    }
  }
}

// Export singleton instance
export const supabaseClient = new SupabaseClient();
