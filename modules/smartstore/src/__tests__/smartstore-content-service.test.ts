import { SmartStoreContentService } from '../services/smartstore-content-service';
import { LLMService } from '@bizflow/shared/llm';
import type { SmartStoreProductInput } from '../types/smartstore-types';
import type { FormattedOutput } from '@bizflow/shared/llm';

describe('SmartStoreContentService', () => {
  let contentService: SmartStoreContentService;
  let mockLLMService: jest.Mocked<LLMService>;

  beforeEach(() => {
    mockLLMService = {
      process: jest.fn(),
    } as unknown as jest.Mocked<LLMService>;

    contentService = new SmartStoreContentService(mockLLMService);
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
        threeLine: 'Three line\nsummary\nhere',
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
      const mockFormattedOutput: FormattedOutput<typeof mockGeneratedContent> =
        {
          requestId: 'test-request-id',
          moduleId: 'smartstore',
          outputData: mockGeneratedContent,
          status: 'completed',
          createdAt: new Date(),
          processingTime: 1000,
        };

      mockLLMService.process.mockResolvedValue(mockFormattedOutput);

      const result = await contentService.generateContent(mockProductInput);

      expect(mockLLMService.process).toHaveBeenCalledWith(
        expect.objectContaining({
          moduleId: 'smartstore',
          promptTemplateId: 'smartstore-content-generation',
        })
      );
      expect(result).toEqual(mockGeneratedContent);
    });

    it('should handle LLM service errors', async () => {
      mockLLMService.process.mockRejectedValue(
        new Error('LLM service error')
      );

      await expect(
        contentService.generateContent(mockProductInput)
      ).rejects.toThrow('LLM service error');
    });

    it('should validate required fields in output', async () => {
      const invalidOutput: FormattedOutput<Partial<typeof mockGeneratedContent>> =
        {
          requestId: 'test-request-id',
          moduleId: 'smartstore',
          outputData: {
            seoProductName: 'Test',
            // Missing required fields
          } as unknown as typeof mockGeneratedContent,
          status: 'completed',
          createdAt: new Date(),
          processingTime: 1000,
        };

      mockLLMService.process.mockResolvedValue(
        invalidOutput as FormattedOutput<typeof mockGeneratedContent>
      );

      await expect(
        contentService.generateContent(mockProductInput)
      ).rejects.toThrow();
    });
  });
});

