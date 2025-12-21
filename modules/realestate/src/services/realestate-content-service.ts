import { LLMService } from '@bizflow/shared/llm';
import type { LLMRequest } from '@bizflow/shared/llm';
import type {
  RealEstatePropertyInput,
  RealEstateGeneratedContent,
} from '../types/realestate-types';

/**
 * Service for generating real estate property content using shared LLM service.
 */
export class RealEstateContentService {
  private llmService: LLMService;

  constructor(llmService?: LLMService) {
    this.llmService = llmService || new LLMService();
  }

  /**
   * Generate all content formats for a real estate property.
   *
   * @param propertyInput - Property input data
   * @returns Generated content
   */
  async generateContent(
    propertyInput: RealEstatePropertyInput,
  ): Promise<RealEstateGeneratedContent> {
    // Build input data with explicit handling of optional fields
    // 선택값이 있는 경우에만 포함하고, 없으면 null로 설정
    const inputData: Record<string, unknown> = {
      location: propertyInput.location,
      propertyType: propertyInput.propertyType,
      // 선택값들: 값이 있으면 포함, 없으면 null
      size: propertyInput.size || null,
      price: propertyInput.price ?? null,
      features: propertyInput.features || [],
      description: propertyInput.description || null,
      rooms: propertyInput.rooms ?? null,
      bathrooms: propertyInput.bathrooms ?? null,
      floor: propertyInput.floor || null,
      buildingAge: propertyInput.buildingAge || null,
      images: propertyInput.images || [],
      targetCustomer: propertyInput.targetCustomer || null,
      metadata: propertyInput.metadata || {},
    };

    // Debug logging: Log which optional fields are provided
    if (process.env.NODE_ENV === 'development') {
      console.log('=== Real Estate Input Debug ===');
      console.log('Required fields:');
      console.log('  - location:', propertyInput.location);
      console.log('  - propertyType:', propertyInput.propertyType);
      console.log('\nOptional fields provided:');
      const optionalFields = [
        'size',
        'price',
        'description',
        'rooms',
        'bathrooms',
        'floor',
        'buildingAge',
        'targetCustomer',
      ];
      optionalFields.forEach((field) => {
        const value = inputData[field];
        if (value !== null && value !== undefined && value !== '') {
          console.log(
            `  ✓ ${field}:`,
            value,
            '(값이 있으므로 적절성 판단 예정)',
          );
        } else {
          if (field === 'price') {
            console.log(`  ✗ ${field}: (not provided - AI가 가격 추천 제공 예정)`);
          } else {
            console.log(`  ✗ ${field}: (not provided - 생략 또는 일반적 표현 사용)`);
          }
        }
      });
      if (
        inputData.features &&
        Array.isArray(inputData.features) &&
        inputData.features.length > 0
      ) {
        console.log('  ✓ features:', inputData.features);
      } else {
        console.log('  ✗ features: (not provided)');
      }
      console.log('=== End Real Estate Input Debug ===');
    }

    // Build context to indicate recommendation preferences
    // 가격만 추천/판단이 가능 (나머지는 변경 불가능한 사실 정보)
    const context: Record<string, unknown> = {
      // 타겟 고객 정보 포함 여부
      includeTargetCustomerCopy: !!propertyInput.targetCustomer,
      // 가격 추천/판단만 포함 (가격이 있으면 적절성 판단, 없으면 추천)
      includePriceRecommendation: true,
      // 가격 제공 여부를 명시적으로 전달 (프롬프트가 명확히 구분하도록)
      hasPrice: propertyInput.price !== undefined && propertyInput.price !== null,
    };

    // Build LLM request for real estate module
    const request: LLMRequest = {
      moduleId: 'realestate',
      inputData,
      // Prompt template ID managed by shared LLM service (Supabase templates or dev fallback)
      promptTemplateId: 'realestate-property-content-v1',
      promptTemplateVersion: '1.0.0',
      context,
    };

    const formattedOutput =
      await this.llmService.process<RealEstateGeneratedContent>(request);

    return this.validateAndFormatOutput(formattedOutput.outputData);
  }

  /**
   * Validate and format LLM output to ensure all required fields are present.
   */
  private validateAndFormatOutput(
    outputData: unknown,
  ): RealEstateGeneratedContent {
    if (!outputData || typeof outputData !== 'object') {
      throw new Error('Invalid LLM output: output data is not an object');
    }

    const data = outputData as Record<string, unknown>;

    const portalDescription = this.extractStringFlexible(
      data,
      [
        'portalDescription',
        'portal_description',
        'description',
        'propertyDescription',
      ],
      'Portal description',
    );

    const snsPosts = this.extractSnsPosts(data);
    const marketingCopy = this.extractMarketingCopy(data);
    const locationHighlights = this.extractLocationHighlights(data);
    const uniqueSellingPoints = this.extractUniqueSellingPoints(data);
    const hashtags = this.extractHashtags(data);
    const priceInsight = this.extractStringOptional(data, [
      'priceInsight',
      'price_insight',
      'priceEvaluation',
      'price_evaluation',
    ]);

    return {
      portalDescription,
      snsPosts,
      marketingCopy,
      locationHighlights,
      uniqueSellingPoints,
      hashtags,
      priceInsight,
    };
  }

  private extractSnsPosts(data: Record<string, unknown>): {
    instagram: string;
    facebook: string;
  } {
    if (data.snsPosts && typeof data.snsPosts === 'object') {
      const posts = data.snsPosts as Record<string, unknown>;
      return {
        instagram: this.extractStringFlexible(
          posts,
          ['instagram', 'instagramPost', 'instagram_post'],
          'Instagram post',
        ),
        facebook: this.extractStringFlexible(
          posts,
          ['facebook', 'facebookPost', 'facebook_post'],
          'Facebook post',
        ),
      };
    }

    return {
      instagram: this.extractStringFlexible(
        data,
        ['instagramPost', 'instagram', 'instagram_post'],
        'Instagram post',
      ),
      facebook: this.extractStringFlexible(
        data,
        ['facebookPost', 'facebook', 'facebook_post'],
        'Facebook post',
      ),
    };
  }

  private extractMarketingCopy(data: Record<string, unknown>): {
    firstTimeBuyers?: string;
    investors?: string;
    families?: string;
    general: string;
  } {
    if (data.marketingCopy && typeof data.marketingCopy === 'object') {
      const copy = data.marketingCopy as Record<string, unknown>;
      return {
        firstTimeBuyers: this.extractStringOptional(copy, [
          'firstTimeBuyers',
          'first_time_buyers',
          'firstTime',
        ]),
        investors: this.extractStringOptional(copy, [
          'investors',
          'investor',
          'investment',
        ]),
        families: this.extractStringOptional(copy, [
          'families',
          'family',
          'familyFriendly',
        ]),
        general: this.extractStringFlexible(
          copy,
          ['general', 'default', 'standard'],
          'General marketing copy',
        ),
      };
    }

    return {
      general: this.extractStringFlexible(
        data,
        ['marketingCopy', 'marketing_copy', 'marketing'],
        'General marketing copy',
      ),
    };
  }

  private extractLocationHighlights(data: Record<string, unknown>): {
    transportation?: string;
    amenities?: string;
    neighborhood?: string;
    general: string;
  } {
    if (
      data.locationHighlights &&
      typeof data.locationHighlights === 'object'
    ) {
      const highlights = data.locationHighlights as Record<string, unknown>;
      return {
        transportation: this.extractStringOptional(highlights, [
          'transportation',
          'transit',
          'accessibility',
        ]),
        amenities: this.extractStringOptional(highlights, [
          'amenities',
          'facilities',
          'nearby',
        ]),
        neighborhood: this.extractStringOptional(highlights, [
          'neighborhood',
          'area',
          'district',
        ]),
        general: this.extractStringFlexible(
          highlights,
          ['general', 'default', 'overview'],
          'General location highlights',
        ),
      };
    }

    return {
      general: this.extractStringFlexible(
        data,
        ['locationHighlights', 'location_highlights', 'location'],
        'General location highlights',
      ),
    };
  }

  private extractUniqueSellingPoints(data: Record<string, unknown>): string[] {
    if (Array.isArray(data.uniqueSellingPoints)) {
      return data.uniqueSellingPoints.map((point) => String(point));
    }

    if (Array.isArray(data.uniqueSellingPoints)) {
      return data.uniqueSellingPoints.map((point) => String(point));
    }

    if (typeof data.uniqueSellingPoints === 'string') {
      return data.uniqueSellingPoints
        .split(',')
        .map((point) => point.trim())
        .filter((point) => point.length > 0);
    }

    // Fallback: try to extract from other fields
    const sellingPoints: string[] = [];
    if (typeof data.strengths === 'string') {
      sellingPoints.push(data.strengths);
    }
    if (Array.isArray(data.strengths)) {
      sellingPoints.push(...data.strengths.map((s) => String(s)));
    }

    return sellingPoints.length > 0 ? sellingPoints : [];
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

  /**
   * Extract optional string field
   */
  private extractStringOptional(
    data: Record<string, unknown>,
    keys: string[],
  ): string | undefined {
    for (const key of keys) {
      const value = data[key];
      if (typeof value === 'string' && value.trim().length > 0) {
        return value.trim();
      }
    }
    return undefined;
  }
}
