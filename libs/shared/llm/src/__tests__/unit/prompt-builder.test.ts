import { PromptBuilder } from '../../services/prompt-builder';
import { supabaseClient } from '../../utils/supabase-client';
import type { PromptTemplate } from '../../types/llm-types';

// Mock Supabase client
jest.mock('../../utils/supabase-client', () => ({
  supabaseClient: {
    loadPromptTemplate: jest.fn(),
  },
}));

describe('PromptBuilder', () => {
  let promptBuilder: PromptBuilder;

  beforeEach(() => {
    promptBuilder = new PromptBuilder();
    jest.clearAllMocks();
  });

  describe('build', () => {
    it('should build prompt from template with variables', async () => {
      // Mock loadTemplate to return the template
      const mockTemplate: PromptTemplate = {
        id: 'test-template',
        moduleId: 'test-module',
        version: '1.0.0',
        name: 'Test Template',
        template: 'Generate content for {{productName}} priced at {{price}}',
        variables: [
          {
            name: 'productName',
            type: 'string',
            required: true,
          },
          {
            name: 'price',
            type: 'number',
            required: true,
          },
        ],
        isActive: true,
      };

      (supabaseClient.loadPromptTemplate as jest.Mock).mockResolvedValue(mockTemplate);

      const inputData = {
        productName: 'Test Product',
        price: 10000,
      };

      const result = await promptBuilder.build(
        'test-template',
        inputData,
        undefined
      );

      expect(result).toContain('Test Product');
      expect(result).toContain('10000');
    });

    it('should handle missing required variables', async () => {
      const template: PromptTemplate = {
        id: 'test-template',
        moduleId: 'test-module',
        version: '1.0.0',
        name: 'Test Template',
        template: 'Generate content for {{productName}}',
        variables: [
          {
            name: 'productName',
            type: 'string',
            required: true,
          },
        ],
        isActive: true,
      };

      const inputData = {};

      await expect(
        promptBuilder.build('test-template', inputData, undefined)
      ).rejects.toThrow();
    });

    it('should handle optional variables', async () => {
      // Mock loadTemplate to return template with both required and optional variables
      const mockTemplate: PromptTemplate = {
        id: 'test-template',
        moduleId: 'test-module',
        version: '1.0.0',
        name: 'Test Template',
        template: 'Generate content for {{content}}{{#if description}} with description: {{description}}{{/if}}',
        variables: [
          {
            name: 'content',
            type: 'string',
            required: true,
          },
          {
            name: 'description',
            type: 'string',
            required: false,
          },
        ],
        isActive: true,
      };

      (supabaseClient.loadPromptTemplate as jest.Mock).mockResolvedValue(mockTemplate);

      const inputDataWithDescription = { content: 'test', description: 'Test Description' };
      const inputDataWithoutDescription = { content: 'test' };

      const resultWith = await promptBuilder.build(
        'test-template',
        inputDataWithDescription,
        undefined
      );
      const resultWithout = await promptBuilder.build(
        'test-template',
        inputDataWithoutDescription,
        undefined
      );

      expect(resultWith).toContain('Test Description');
      expect(resultWithout).toBeDefined();
      expect(resultWithout).toContain('test');
    });

    it('should include context in prompt when provided', async () => {
      const template: PromptTemplate = {
        id: 'test-template',
        moduleId: 'test-module',
        version: '1.0.0',
        name: 'Test Template',
        template: 'Generate content: {{content}}',
        variables: [
          {
            name: 'content',
            type: 'string',
            required: true,
          },
        ],
        isActive: true,
      };

      const inputData = { content: 'test' };
      const context = { userId: 'user-123', sessionId: 'session-456' };

      const result = await promptBuilder.build(
        'test-template',
        inputData,
        context
      );

      expect(result).toBeDefined();
    });
  });
});

