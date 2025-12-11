import OpenAI from 'openai';
import type {
  SmartStoreProductInput,
  SmartStoreGeneratedContent,
} from '../types/smartstore-types';

/**
 * Service for generating SmartStore product content using LLM.
 */
export class SmartStoreContentService {
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY || '';

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    this.client = new OpenAI({ apiKey });
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
    const prompt = this.buildPrompt(productInput);

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional marketing content writer specializing in Korean e-commerce products. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content || '{}';
    
    // Log raw response for debugging
    console.log('LLM Response:', content);
    
    const parsedContent = JSON.parse(content);

    return this.validateAndFormatOutput(parsedContent);
  }

  /**
   * Build prompt for content generation.
   */
  private buildPrompt(productInput: SmartStoreProductInput): string {
    const priceInfo = productInput.price
      ? `가격: ${productInput.price.toLocaleString()}원`
      : '';
    const categoryInfo = productInput.category
      ? `카테고리: ${productInput.category}`
      : '';

    return `당신은 네이버 스마트스토어 상품 마케팅 콘텐츠 전문가입니다.

다음 상품 정보를 바탕으로 SEO 최적화된 마케팅 콘텐츠를 생성해주세요.

## 상품 정보
- 상품명: ${productInput.name}
- 상품 설명: ${productInput.description}
${priceInfo ? `- ${priceInfo}` : ''}
${categoryInfo ? `- ${categoryInfo}` : ''}

## 생성해야 할 콘텐츠

다음 JSON 형식으로 응답해주세요:

{
  "seoProductName": "SEO 최적화된 상품명 (검색에 잘 노출되도록, 핵심 키워드 포함)",
  "summaries": {
    "oneLine": "한 줄 요약 (50자 이내, 핵심 특징)",
    "threeLine": "세 줄 요약 (각 줄은 핵심 장점 하나씩)",
    "blog": "블로그용 요약 (200-300자, 상세하고 설득력 있게)"
  },
  "detailedDescription": "상세 페이지용 설명 (500-800자, 구매를 유도하는 상세한 설명)",
  "promotionalPosts": {
    "instagram": "인스타그램 홍보글 (이모지 포함, 해시태그 없이, 150-200자)",
    "blog": "블로그 홍보글 (SEO 친화적, 400-600자)"
  },
  "hashtags": ["#해시태그1", "#해시태그2", "..."] // 10-15개의 관련 해시태그
}

모든 콘텐츠는 한국어로 작성하고, 한국 시장에 최적화해주세요.`;
  }

  /**
   * Validate and format LLM output to ensure all required fields are present.
   */
  private validateAndFormatOutput(
    outputData: unknown
  ): SmartStoreGeneratedContent {
    if (!outputData || typeof outputData !== 'object') {
      throw new Error('Invalid LLM output: output data is not an object');
    }

    const data = outputData as Record<string, unknown>;

    const seoProductName = this.extractStringFlexible(
      data,
      ['seoProductName', 'seo_product_name', 'productName', 'title'],
      'SEO product name'
    );

    const summaries = this.extractSummaries(data);
    const detailedDescription = this.extractStringFlexible(
      data,
      ['detailedDescription', 'detailed_description', 'description', 'productDescription'],
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

  private extractSummaries(data: Record<string, unknown>): {
    oneLine: string;
    threeLine: string;
    blog: string;
  } {
    // LLM might put blog at top level or inside summaries - check both
    const summaries = (data.summaries && typeof data.summaries === 'object')
      ? data.summaries as Record<string, unknown>
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
      oneLine: this.extractStringFlexible(summaries, ['oneLine', 'oneLineSummary', 'one_line'], 'One-line summary'),
      threeLine: this.extractStringFlexible(summaries, ['threeLine', 'threeLineSummary', 'three_line'], 'Three-line summary'),
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
        instagram: this.extractStringFlexible(posts, ['instagram', 'instagramPost', 'instagram_post'], 'Instagram post'),
        blog: this.extractStringFlexible(posts, ['blog', 'blogPost', 'blog_post'], 'Blog post'),
      };
    }

    return {
      instagram: this.extractStringFlexible(data, ['instagramPost', 'instagram', 'instagram_post'], 'Instagram post'),
      blog: this.extractStringFlexible(data, ['blogPost', 'blog', 'blog_post'], 'Blog post'),
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
    fieldName: string
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
    fieldName: string
  ): string {
    for (const key of keys) {
      const value = data[key];
      if (typeof value === 'string' && value.trim().length > 0) {
        return value.trim();
      }
    }
    
    // Log available keys for debugging
    console.warn(`Missing field "${fieldName}". Available keys:`, Object.keys(data));
    throw new Error(`Invalid LLM output: ${fieldName} is missing or invalid`);
  }
}
