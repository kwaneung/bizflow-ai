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
    // Build LLM request for real estate module
    const request: LLMRequest = {
      moduleId: 'realestate',
      inputData: {
        location: propertyInput.location,
        propertyType: propertyInput.propertyType,
        size: propertyInput.size ?? null,
        price: propertyInput.price ?? null,
        features: propertyInput.features ?? [],
        description: propertyInput.description ?? null,
        rooms: propertyInput.rooms ?? null,
        bathrooms: propertyInput.bathrooms ?? null,
        floor: propertyInput.floor ?? null,
        buildingAge: propertyInput.buildingAge ?? null,
        images: propertyInput.images ?? [],
        targetCustomer: propertyInput.targetCustomer ?? null,
        metadata: propertyInput.metadata ?? {},
      },
      // Prompt template ID managed by shared LLM service (Supabase templates or dev fallback)
      promptTemplateId: 'realestate-property-content-v1',
      promptTemplateVersion: '1.0.0',
      context: {
        // 타겟 고객 정보 포함 여부
        includeTargetCustomerCopy: !!propertyInput.targetCustomer,
      },
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

    return {
      portalDescription,
      snsPosts,
      marketingCopy,
      locationHighlights,
      uniqueSellingPoints,
      hashtags,
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
        firstTimeBuyers: this.extractStringOptional(
          copy,
          ['firstTimeBuyers', 'first_time_buyers', 'firstTime'],
        ),
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

