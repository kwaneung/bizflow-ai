import { SmartStoreContentService } from '../services/smartstore-content-service';
import type { SmartStoreProductInput } from '../types/smartstore-types';

// Mock OpenAI
jest.mock('openai', () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn(),
        },
      },
    })),
  };
});

describe('SmartStoreContentService', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, OPENAI_API_KEY: 'test-api-key' };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw error if OPENAI_API_KEY is not set', () => {
      process.env.OPENAI_API_KEY = '';

      expect(() => new SmartStoreContentService()).toThrow(
        'OPENAI_API_KEY environment variable is not set',
      );
    });

    it('should create instance when API key is set', () => {
      process.env.OPENAI_API_KEY = 'test-api-key';

      const service = new SmartStoreContentService();
      expect(service).toBeInstanceOf(SmartStoreContentService);
    });
  });

  describe('generateContent', () => {
    const mockProductInput: SmartStoreProductInput = {
      name: 'Test Product',
      description: 'This is a test product description',
      price: 10000,
      category: 'Electronics',
    };

    const mockGeneratedContent = {
      seoProductName: 'SEO Test Product',
      summaries: {
        oneLine: 'One line summary',
        threeLine: 'Three line summary here',
        blog: 'Blog format summary with more details',
      },
      detailedDescription: 'Detailed product description',
      promotionalPosts: {
        instagram: 'Instagram post',
        blog: 'Blog post',
      },
      hashtags: ['#test', '#product'],
    };

    it('should generate content successfully', async () => {
      // Get the mocked OpenAI class
      const OpenAI = require('openai').default;
      const mockCreate = jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify(mockGeneratedContent),
            },
          },
        ],
      });

      OpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      }));

      const service = new SmartStoreContentService();
      const result = await service.generateContent(mockProductInput);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4o-mini',
          messages: expect.arrayContaining([
            expect.objectContaining({ role: 'system' }),
            expect.objectContaining({ role: 'user' }),
          ]),
        }),
      );
      expect(result.seoProductName).toBe(mockGeneratedContent.seoProductName);
    });

    it('should handle API errors', async () => {
      const OpenAI = require('openai').default;
      OpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: jest.fn().mockRejectedValue(new Error('API Error')),
          },
        },
      }));

      const service = new SmartStoreContentService();

      await expect(service.generateContent(mockProductInput)).rejects.toThrow(
        'API Error',
      );
    });

    it('should handle invalid JSON response', async () => {
      const OpenAI = require('openai').default;
      OpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue({
              choices: [
                {
                  message: {
                    content: 'invalid json',
                  },
                },
              ],
            }),
          },
        },
      }));

      const service = new SmartStoreContentService();

      await expect(service.generateContent(mockProductInput)).rejects.toThrow();
    });
  });
});
