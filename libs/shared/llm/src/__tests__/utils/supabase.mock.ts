import type { PromptTemplate } from '../../types/llm-types';

/**
 * Mock Supabase client interface matching the actual SupabaseClient methods.
 */
export interface MockSupabaseClient {
  loadPromptTemplate: jest.Mock<Promise<PromptTemplate | null>>;
  saveLLMRequest: jest.Mock<Promise<string>>;
  updateLLMRequestStatus: jest.Mock<Promise<void>>;
  saveLLMResponse: jest.Mock<Promise<void>>;
  saveFormattedOutput: jest.Mock<Promise<void>>;
  saveErrorContext: jest.Mock<Promise<void>>;
}

/**
 * Create a mock Supabase client with default implementations.
 * Use this factory to create consistent Supabase mocks across tests.
 */
export function createMockSupabaseClient(
  overrides?: Partial<MockSupabaseClient>
): MockSupabaseClient {
  const defaultMock: MockSupabaseClient = {
    loadPromptTemplate: jest.fn().mockResolvedValue({
      id: 'test-template-id',
      moduleId: 'test-module',
      version: '1.0.0',
      name: 'Test Template',
      template: 'Test template content with {{variable}}',
      variables: ['variable'],
      description: 'Test template description',
      isActive: true,
    } as PromptTemplate),

    saveLLMRequest: jest.fn().mockResolvedValue('mock-request-id'),

    updateLLMRequestStatus: jest.fn().mockResolvedValue(undefined),

    saveLLMResponse: jest.fn().mockResolvedValue(undefined),

    saveFormattedOutput: jest.fn().mockResolvedValue(undefined),

    saveErrorContext: jest.fn().mockResolvedValue(undefined),
  };

  return {
    ...defaultMock,
    ...overrides,
  };
}

/**
 * Create a mock PromptTemplate for testing.
 */
export function createMockPromptTemplate(
  overrides?: Partial<PromptTemplate>
): PromptTemplate {
  return {
    id: 'test-template-id',
    moduleId: 'test-module',
    version: '1.0.0',
    name: 'Test Template',
    template: 'Test template content with {{variable}}',
    variables: ['variable'],
    description: 'Test template description',
    isActive: true,
    ...overrides,
  };
}

/**
 * Reset all Supabase mocks.
 * Call this in beforeEach or afterEach to ensure clean test state.
 */
export function resetSupabaseMocks(mockClient: MockSupabaseClient): void {
  Object.values(mockClient).forEach((mock) => {
    if (jest.isMockFunction(mock)) {
      mock.mockClear();
    }
  });
}

/**
 * Jest mock module factory for supabase-client.
 * Use this in jest.mock() calls to mock the entire supabase-client module.
 */
export const mockSupabaseClientModule = {
  supabaseClient: createMockSupabaseClient(),
};

