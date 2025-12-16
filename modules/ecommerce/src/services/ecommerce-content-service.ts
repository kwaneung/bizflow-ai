import { LLMService } from '@bizflow/shared/llm';
import type { LLMRequest } from '@bizflow/shared/llm';
import type {
  EcommerceProductInput,
  EcommerceGeneratedContent,
} from '../types/ecommerce-types';

/**
 * Service for generating ecommerce product content using shared LLM service.
 */
export class EcommerceContentService {
  private llmService: LLMService;

  constructor(llmService?: LLMService) {
    this.llmService = llmService || new LLMService();
  }

  /**
   * Generate all content formats for an ecommerce product.
   *
   * @param productInput - Product input data
   * @returns Generated content
   */
  async generateContent(
    productInput: EcommerceProductInput,
  ): Promise<EcommerceGeneratedContent> {
    // Build LLM request for ecommerce module
    const request: LLMRequest = {
      moduleId: 'ecommerce',
      inputData: {
        name: productInput.name,
        description: productInput.description,
        price: productInput.price ?? null,
        category: productInput.category ?? null,
        options: productInput.options ?? [],
        images: productInput.images ?? [],
        metadata: productInput.metadata ?? {},
      },
      // Prompt template ID managed by shared LLM service (Supabase templates or dev fallback)
      promptTemplateId: 'ecommerce-product-content-v1',
      promptTemplateVersion: '1.0.0',
      context: {
        // 가격/카테고리 입력 여부와 상관없이 추천 정보를 포함하도록 명시
        includePriceRecommendation: true,
        includeCategoryRecommendation: true,
      },
    };

    const formattedOutput =
      await this.llmService.process<EcommerceGeneratedContent>(request);

    return this.validateAndFormatOutput(formattedOutput.outputData);
  }

  /**
   * Validate and format LLM output to ensure all required fields are present.
   */
  private validateAndFormatOutput(
    outputData: unknown,
  ): EcommerceGeneratedContent {
    if (!outputData || typeof outputData !== 'object') {
      throw new Error('Invalid LLM output: output data is not an object');
    }

    const data = outputData as Record<string, unknown>;

    const seoProductName = this.extractStringFlexible(
      data,
      ['seoProductName', 'seo_product_name', 'productName', 'title'],
      'SEO product name',
    );

    const summaries = this.extractSummaries(data);
    const detailedDescription = this.extractStringFlexible(
      data,
      [
        'detailedDescription',
        'detailed_description',
        'description',
        'productDescription',
      ],
      'Detailed description',
    );
    const promotionalPosts = this.extractPromotionalPosts(data);
    const hashtags = this.extractHashtags(data);
    const priceInsight = this.extractStringFlexible(
      data,
      ['priceInsight', 'price_insight', 'priceEvaluation', 'price_evaluation'],
      'Price insight',
    );
    const categoryInsight = this.extractStringFlexible(
      data,
      [
        'categoryInsight',
        'category_insight',
        'categoryEvaluation',
        'category_evaluation',
      ],
      'Category insight',
    );

    return {
      seoProductName,
      summaries,
      detailedDescription,
      promotionalPosts,
      hashtags,
      priceInsight,
      categoryInsight,
    };
  }

  private extractSummaries(data: Record<string, unknown>): {
    oneLine: string;
    threeLine: string;
    blog: string;
  } {
    // LLM might put blog at top level or inside summaries - check both
    const summaries =
      data.summaries && typeof data.summaries === 'object'
        ? (data.summaries as Record<string, unknown>)
        : data;

    // For blog, also check top-level data if not found in summaries
    const getBlogSummary = (): string => {
      // First try in summaries object
      if (data.summaries && typeof data.summaries === 'object') {
        const sum = data.summaries as Record<string, unknown>;
        for (const key of ['blog', 'blogSummary', 'blog_summary']) {
          if (typeof sum[key] === 'string' && (sum[key] as string).trim()) {
            return (sum[key] as string).trim();
          }
        }
      }
      // Then check top-level (LLM sometimes puts blog outside summaries)
      for (const key of ['blog', 'blogSummary', 'blog_summary']) {
        if (typeof data[key] === 'string' && (data[key] as string).trim()) {
          return (data[key] as string).trim();
        }
      }
      throw new Error('Invalid LLM output: Blog summary is missing or invalid');
    };

    return {
      oneLine: this.extractStringFlexible(
        summaries,
        ['oneLine', 'oneLineSummary', 'one_line'],
        'One-line summary',
      ),
      threeLine: this.extractStringFlexible(
        summaries,
        ['threeLine', 'threeLineSummary', 'three_line'],
        'Three-line summary',
      ),
      blog: getBlogSummary(),
    };
  }

  private extractPromotionalPosts(data: Record<string, unknown>): {
    instagram: string;
    blog: string;
  } {
    if (data.promotionalPosts && typeof data.promotionalPosts === 'object') {
      const posts = data.promotionalPosts as Record<string, unknown>;
      return {
        instagram: this.extractStringFlexible(
          posts,
          ['instagram', 'instagramPost', 'instagram_post'],
          'Instagram post',
        ),
        blog: this.extractStringFlexible(
          posts,
          ['blog', 'blogPost', 'blog_post'],
          'Blog post',
        ),
      };
    }

    return {
      instagram: this.extractStringFlexible(
        data,
        ['instagramPost', 'instagram', 'instagram_post'],
        'Instagram post',
      ),
      blog: this.extractStringFlexible(
        data,
        ['blogPost', 'blog', 'blog_post'],
        'Blog post',
      ),
    };
  }

  private extractHashtags(data: Record<string, unknown>): string[] {
    if (Array.isArray(data.hashtags)) {
      return data.hashtags.map((tag) => String(tag));
    }

    if (typeof data.hashtags === 'string') {
      return data.hashtags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    }

    return [];
  }

  private extractString(
    data: Record<string, unknown>,
    key: string,
    fieldName: string,
  ): string {
    const value = data[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
    throw new Error(`Invalid LLM output: ${fieldName} is missing or invalid`);
  }

  /**
   * Extract string with multiple possible keys (flexible parsing)
   */
  private extractStringFlexible(
    data: Record<string, unknown>,
    keys: string[],
    fieldName: string,
  ): string {
    for (const key of keys) {
      const value = data[key];
      if (typeof value === 'string' && value.trim().length > 0) {
        return value.trim();
      }
    }

    // Log available keys for debugging
    console.warn(
      `Missing field "${fieldName}". Available keys:`,
      Object.keys(data),
    );
    throw new Error(`Invalid LLM output: ${fieldName} is missing or invalid`);
  }
}
