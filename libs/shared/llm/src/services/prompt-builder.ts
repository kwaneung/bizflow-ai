import type { PromptTemplate } from '../types/llm-types';
import { supabaseClient } from '../utils/supabase-client';

/**
 * Service for building prompts from templates with variable substitution.
 */
export class PromptBuilder {
  /**
   * Build a prompt from a template with variable substitution.
   *
   * @param templateId - Template identifier
   * @param inputData - Input data to substitute into template
   * @param context - Optional context data
   * @param version - Optional template version
   * @returns Formatted prompt string
   */
  async build(
    templateId: string,
    inputData: Record<string, unknown>,
    context?: Record<string, unknown>,
    version?: string,
  ): Promise<string> {
    const template = await this.loadTemplate(templateId, version);

    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    // Validate required variables first
    this.validateVariables(template, inputData);

    // Build prompt with variable substitution
    let prompt = template.template;

    // Simple variable substitution: {{variableName}}
    for (const variable of template.variables) {
      const value = inputData[variable.name];
      const placeholder = `{{${variable.name}}}`;

      if (value !== undefined && value !== null) {
        prompt = prompt.replace(
          new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          String(value),
        );
      }
      // Optional variables can be left as placeholder (not replaced)
    }

    // Add context if provided
    if (context) {
      const contextStr = JSON.stringify(context);
      prompt = `${prompt}\n\nContext: ${contextStr}`;
    }

    return prompt;
  }

  /**
   * Load template from storage (Supabase).
   *
   * @param templateId - Template identifier
   * @param version - Optional template version
   * @returns Prompt template or null if not found
   */
  private async loadTemplate(
    templateId: string,
    version?: string,
  ): Promise<PromptTemplate | null> {
    try {
      return await supabaseClient.loadPromptTemplate(templateId, version);
    } catch (error) {
      console.warn(
        `Failed to load prompt template '${templateId}' from Supabase: ${error}`,
      );
      return null;
    }
  }

  /**
   * Validate that all required variables are present in input data.
   *
   * @param template - Prompt template
   * @param inputData - Input data to validate
   * @throws Error if required variables are missing
   */
  private validateVariables(
    template: PromptTemplate,
    inputData: Record<string, unknown>,
  ): void {
    for (const variable of template.variables) {
      if (variable.required) {
        const value = inputData[variable.name];
        if (value === undefined || value === null) {
          throw new Error(
            `Required variable '${variable.name}' is missing in input data`,
          );
        }
      }
    }
  }
}
