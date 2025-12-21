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

      if (value !== undefined && value !== null && value !== '') {
        // 값이 있으면 치환
        prompt = prompt.replace(
          new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          String(value),
        );
      } else if (!variable.required) {
        // 선택값이 없으면 placeholder를 제거하거나 "정보 없음"으로 대체
        // 템플릿 작성자가 명시적으로 처리할 수 있도록 placeholder는 그대로 두되,
        // 빈 문자열이나 "정보 없음"으로 대체할 수 있는 옵션 제공
        // 현재는 placeholder를 그대로 두지만, 템플릿에서 조건부 처리 가능
        // 예: {{#if size}}크기: {{size}}{{/if}} 형태의 템플릿 문법이 필요할 수 있음
      }
      // 필수 변수는 validateVariables에서 이미 검증됨
    }

    // Add context as template variables (context.* 형태로 접근 가능)
    // 예: {{context.hasPrice}}, {{context.includePriceRecommendation}}
    if (context) {
      for (const [key, value] of Object.entries(context)) {
        const placeholder = `{{context.${key}}}`;
        // boolean, number, string 등은 그대로 치환
        if (
          typeof value === 'boolean' ||
          typeof value === 'number' ||
          typeof value === 'string'
        ) {
          prompt = prompt.replace(
            new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            String(value),
          );
        }
        // object나 array는 JSON으로 변환
        else if (value !== null && value !== undefined) {
          prompt = prompt.replace(
            new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            JSON.stringify(value),
          );
        }
      }

      // Also add context as JSON at the end for LLM to read (backward compatibility)
      const contextStr = JSON.stringify(context);
      prompt = `${prompt}\n\nContext: ${contextStr}`;
    }

    // Debug logging: Log the final prompt and input data in development
    if (process.env.NODE_ENV === 'development') {
      console.log('=== Prompt Builder Debug ===');
      console.log('Template ID:', templateId);
      console.log('Input Data:', JSON.stringify(inputData, null, 2));
      console.log(
        'Context:',
        context ? JSON.stringify(context, null, 2) : 'None',
      );
      console.log('Final Prompt:', prompt);
      console.log('=== End Prompt Builder Debug ===');
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
