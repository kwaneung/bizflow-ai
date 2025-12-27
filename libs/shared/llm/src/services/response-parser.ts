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
    schema?: Record<string, unknown>,
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
   * Handles various response formats:
   * - Pure JSON strings
   * - JSON wrapped in markdown code blocks
   * - JSON with single quotes (converts to double quotes)
   * - Plain text responses (wraps in object)
   *
   * @param rawContent - Raw JSON string
   * @param schema - Optional schema for validation
   * @returns Parsed JSON object
   */
  private parseJson(
    rawContent: string,
    schema?: Record<string, unknown>,
  ): unknown {
    if (!rawContent || rawContent.trim().length === 0) {
      throw new Error('Empty response content cannot be parsed as JSON');
    }

    let cleanedContent = rawContent.trim();

    // Step 1: Remove markdown code blocks if present
    // Matches ```json ... ``` or ``` ... ```
    const codeBlockRegex = /^```(?:json)?\s*\n?(.*?)\n?```$/s;
    const codeBlockMatch = cleanedContent.match(codeBlockRegex);
    if (codeBlockMatch) {
      cleanedContent = codeBlockMatch[1].trim();
    }

    // Step 2: Try to extract JSON from text if it's wrapped in explanation
    // Look for JSON object/array patterns
    const jsonObjectRegex = /\{[\s\S]*\}/;
    const jsonArrayRegex = /\[[\s\S]*\]/;

    let jsonMatch = cleanedContent.match(jsonObjectRegex);
    if (!jsonMatch) {
      jsonMatch = cleanedContent.match(jsonArrayRegex);
    }

    if (jsonMatch && jsonMatch[0] !== cleanedContent) {
      // JSON is embedded in text, extract it
      cleanedContent = jsonMatch[0];
    }

    // Step 3: Try parsing as-is first
    try {
      const parsed = JSON.parse(cleanedContent);

      // TODO: Validate against schema if provided
      if (schema) {
        // Schema validation would go here
      }

      return parsed;
    } catch (firstError) {
      // Step 4: If parsing fails, try to fix common issues
      try {
        // Replace single quotes with double quotes (simple approach)
        // This is a basic fix and may not work for all cases
        let fixedContent = cleanedContent
          // Replace single quotes around keys and string values
          .replace(/'(\w+)':/g, '"$1":') // Keys: 'key': -> "key":
          .replace(/: '([^']*)'/g, ': "$1"') // String values: : 'value' -> : "value"
          // Handle edge cases
          .replace(/'/g, '"'); // Remaining single quotes

        const parsed = JSON.parse(fixedContent);

        if (schema) {
          // Schema validation would go here
        }

        return parsed;
      } catch (secondError) {
        // Step 5: If still fails, check if it's plain text and wrap it
        // This handles cases where LLM returns plain text instead of JSON
        if (!cleanedContent.includes('{') && !cleanedContent.includes('[')) {
          // Plain text response - wrap it in an object
          return {
            content: cleanedContent,
            _parsedAsText: true,
          };
        }

        // Final error with helpful message
        const errorMessage =
          firstError instanceof Error
            ? firstError.message
            : 'Unknown parsing error';

        throw new Error(
          `Failed to parse JSON response: ${errorMessage}. ` +
            `Response preview: "${cleanedContent.substring(0, 100)}...". ` +
            `Verify response format matches expected structure, ` +
            `Check for malformed JSON or data, ` +
            `Review response parsing logic`,
        );
      }
    }
  }
}
