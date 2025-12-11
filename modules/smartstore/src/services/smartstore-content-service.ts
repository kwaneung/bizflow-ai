import { LLMService } from '@bizflow/shared/llm';
import type { LLMRequest } from '@bizflow/shared/llm';
import type {
  SmartStoreProductInput,
  SmartStoreGeneratedContent,
} from '../types/smartstore-types';

/**
 * Service for generating SmartStore product content using LLM.
 */
export class SmartStoreContentService {
  private llmService: LLMService;

  constructor(llmService?: LLMService) {
    this.llmService = llmService || new LLMService();
  }

  /**
   * Generate all content formats for a SmartStore product.
   *
   * @param productInput - Product input data
   * @returns Generated content
   */
  async generateContent(
    productInput: SmartStoreProductInput
  ): Promise<SmartStoreGeneratedContent> {
    // Prepare input data for LLM
    const inputData = this.prepareInputData(productInput);

    // Create LLM request
    const request: LLMRequest = {
      moduleId: 'smartstore',
      inputData,
      promptTemplateId: 'smartstore-content-generation',
      priority: 0,
      context: {
        language: 'ko',
        market: 'korea',
      },
    };

    // Process through LLM
    const result = await this.llmService.process<SmartStoreGeneratedContent>(
      request
    );

    // Validate and return generated content
    return this.validateAndFormatOutput(result.outputData);
  }

  /**
   * Prepare input data for LLM processing.
   *
   * @param productInput - Product input
   * @returns Formatted input data
   */
  private prepareInputData(
    productInput: SmartStoreProductInput
  ): Record<string, unknown> {
    return {
      productName: productInput.name,
      productDescription: productInput.description,
      productOptions: productInput.options
        ? JSON.stringify(productInput.options)
        : undefined,
      productPrice: productInput.price,
      productCategory: productInput.category,
      productImages: productInput.images
        ? productInput.images.join(', ')
        : undefined,
      metadata: productInput.metadata
        ? JSON.stringify(productInput.metadata)
        : undefined,
    };
  }

  /**
   * Validate and format LLM output to ensure all required fields are present.
   *
   * @param outputData - Raw output from LLM
   * @returns Validated and formatted content
   */
  private validateAndFormatOutput(
    outputData: unknown
  ): SmartStoreGeneratedContent {
    // Type guard to check if output has required structure
    if (!outputData || typeof outputData !== 'object') {
      throw new Error('Invalid LLM output: output data is not an object');
    }

    const data = outputData as Record<string, unknown>;

    // Validate and extract required fields
    const seoProductName = this.extractString(
      data,
      'seoProductName',
      'SEO product name'
    );

    const summaries = this.extractSummaries(data);
    const detailedDescription = this.extractString(
      data,
      'detailedDescription',
      'Detailed description'
    );
    const promotionalPosts = this.extractPromotionalPosts(data);
    const hashtags = this.extractHashtags(data);

    return {
      seoProductName,
      summaries,
      detailedDescription,
      promotionalPosts,
      hashtags,
    };
  }

  /**
   * Extract summaries from output data.
   *
   * @param data - Output data
   * @returns Summaries object
   */
  private extractSummaries(data: Record<string, unknown>): {
    oneLine: string;
    threeLine: string;
    blog: string;
  } {
    // Try to extract from nested summaries object
    if (data.summaries && typeof data.summaries === 'object') {
      const summaries = data.summaries as Record<string, unknown>;
      return {
        oneLine: this.extractString(summaries, 'oneLine', 'One-line summary'),
        threeLine: this.extractString(
          summaries,
          'threeLine',
          'Three-line summary'
        ),
        blog: this.extractString(summaries, 'blog', 'Blog summary'),
      };
    }

    // Fallback: extract individual fields
    return {
      oneLine: this.extractString(data, 'oneLineSummary', 'One-line summary'),
      threeLine: this.extractString(
        data,
        'threeLineSummary',
        'Three-line summary'
      ),
      blog: this.extractString(data, 'blogSummary', 'Blog summary'),
    };
  }

  /**
   * Extract promotional posts from output data.
   *
   * @param data - Output data
   * @returns Promotional posts object
   */
  private extractPromotionalPosts(data: Record<string, unknown>): {
    instagram: string;
    blog: string;
  } {
    // Try to extract from nested promotionalPosts object
    if (data.promotionalPosts && typeof data.promotionalPosts === 'object') {
      const posts = data.promotionalPosts as Record<string, unknown>;
      return {
        instagram: this.extractString(
          posts,
          'instagram',
          'Instagram post'
        ),
        blog: this.extractString(posts, 'blog', 'Blog post'),
      };
    }

    // Fallback: extract individual fields
    return {
      instagram: this.extractString(
        data,
        'instagramPost',
        'Instagram post'
      ),
      blog: this.extractString(data, 'blogPost', 'Blog post'),
    };
  }

  /**
   * Extract hashtags from output data.
   *
   * @param data - Output data
   * @returns Array of hashtags
   */
  private extractHashtags(data: Record<string, unknown>): string[] {
    if (Array.isArray(data.hashtags)) {
      return data.hashtags.map((tag) => String(tag));
    }

    if (typeof data.hashtags === 'string') {
      // Split comma-separated hashtags
      return data.hashtags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    }

    // Fallback: return empty array
    return [];
  }

  /**
   * Extract string value from data object with fallback.
   *
   * @param data - Data object
   * @param key - Key to extract
   * @param fieldName - Human-readable field name for error messages
   * @returns Extracted string value
   */
  private extractString(
    data: Record<string, unknown>,
    key: string,
    fieldName: string
  ): string {
    const value = data[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
    throw new Error(`Invalid LLM output: ${fieldName} is missing or invalid`);
  }
}

