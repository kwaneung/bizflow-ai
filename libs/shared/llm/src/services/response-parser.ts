import type { OutputFormat } from '@bizflow/shared/types';

/**
 * Service for parsing LLM API responses into structured data.
 */
export class ResponseParser {
  /**
   * Parse raw LLM response into structured data.
   *
   * @param rawContent - Raw response content from LLM API
   * @param format - Expected output format
   * @param schema - Optional schema for validation
   * @returns Parsed data
   */
  async parse(
    rawContent: string,
    format: OutputFormat,
    schema?: Record<string, unknown>
  ): Promise<unknown> {
    if (!rawContent || rawContent.trim().length === 0) {
      throw new Error('Empty response content cannot be parsed');
    }

    switch (format) {
      case 'json':
        return this.parseJson(rawContent, schema);

      case 'text':
        return rawContent;

      case 'markdown':
        return rawContent;

      case 'html':
        return rawContent;

      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Parse JSON response.
   *
   * @param rawContent - Raw JSON string
   * @param schema - Optional schema for validation
   * @returns Parsed JSON object
   */
  private parseJson(
    rawContent: string,
    schema?: Record<string, unknown>
  ): unknown {
    try {
      const parsed = JSON.parse(rawContent);

      // TODO: Validate against schema if provided
      if (schema) {
        // Schema validation would go here
      }

      return parsed;
    } catch (error) {
      throw new Error(
        `Failed to parse JSON response: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

