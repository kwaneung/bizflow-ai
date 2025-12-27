import { LLMService } from '@bizflow/shared/llm';
import type { LLMRequest } from '@bizflow/shared/llm';
import type {
  PTProgramInput,
  PTGeneratedContent,
  TargetCustomerCopy,
  SNSPosts,
} from '../types/pt-types';

/**
 * Service for generating PT/fitness program content using shared LLM service.
 */
export class PTContentService {
  private llmService: LLMService;

  constructor(llmService?: LLMService) {
    this.llmService = llmService || new LLMService();
  }

  /**
   * Generate all content formats for a PT/fitness program.
   *
   * @param programInput - Program input data
   * @returns Generated content
   */
  async generateContent(
    programInput: PTProgramInput,
  ): Promise<PTGeneratedContent> {
    // Build input data with explicit handling of optional fields
    const inputData: Record<string, unknown> = {
      name: programInput.name,
      programType: programInput.programType,
      goals: programInput.goals,
      duration: programInput.duration ?? null,
      price: programInput.price ?? null,
      features: programInput.features ?? [],
      targetCustomers: programInput.targetCustomers ?? [],
      location: programInput.location ?? null,
      trainerInfo: programInput.trainerInfo ?? null,
      description: programInput.description ?? null,
      images: programInput.images ?? [],
      metadata: programInput.metadata ?? {},
    };

    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('=== PT Input Debug ===');
      console.log('Required fields:');
      console.log('  - name:', programInput.name);
      console.log('  - programType:', programInput.programType);
      console.log('  - goals:', programInput.goals);
      console.log('\nOptional fields provided:');
      if (inputData.duration) {
        console.log('  ✓ duration:', inputData.duration);
      }
      if (inputData.price !== null && inputData.price !== undefined) {
        console.log(
          '  ✓ price:',
          inputData.price,
          '(값이 있으므로 적절성 판단 예정)',
        );
      } else {
        console.log('  ✗ price: (not provided - AI가 추천 제공 예정)');
      }
      if (
        inputData.features &&
        Array.isArray(inputData.features) &&
        (inputData.features as string[]).length > 0
      ) {
        console.log('  ✓ features:', inputData.features);
      }
      if (
        inputData.targetCustomers &&
        Array.isArray(inputData.targetCustomers) &&
        (inputData.targetCustomers as string[]).length > 0
      ) {
        console.log('  ✓ targetCustomers:', inputData.targetCustomers);
      }
      if (inputData.location) {
        console.log('  ✓ location:', inputData.location);
      }
      if (inputData.trainerInfo) {
        console.log('  ✓ trainerInfo:', inputData.trainerInfo);
      }
      if (inputData.description) {
        console.log('  ✓ description:', inputData.description);
      }
      console.log('=== End PT Input Debug ===');
    }

    // Build context
    const context: Record<string, unknown> = {
      includeTargetCustomerCopy:
        Array.isArray(inputData.targetCustomers) &&
        (inputData.targetCustomers as string[]).length > 0,
      includePriceRecommendation: true,
      hasPrice: inputData.price !== null && inputData.price !== undefined,
    };

    // Generate all content types in parallel for better performance
    const [
      programIntroduction,
      exerciseEffects,
      snsPosts,
      recruitmentAdCopy,
      targetCustomerCopy,
      hashtags,
      priceInsight,
    ] = await Promise.all([
      this.generateProgramIntroduction(inputData, context),
      this.generateExerciseEffects(inputData, context),
      this.generateSNSPosts(inputData, context),
      this.generateRecruitmentAdCopy(inputData, context),
      this.generateTargetCustomerCopy(inputData, context),
      this.generateHashtags(inputData, context),
      this.generatePriceInsight(inputData, context),
    ]);

    return {
      programIntroduction,
      exerciseEffects,
      snsPosts,
      recruitmentAdCopy,
      targetCustomerCopy,
      hashtags,
      priceInsight: priceInsight || undefined,
    };
  }

  /**
   * Generate program introduction
   */
  private async generateProgramIntroduction(
    inputData: Record<string, unknown>,
    context: Record<string, unknown>,
  ): Promise<string> {
    const request: LLMRequest = {
      moduleId: 'pt',
      inputData,
      promptTemplateId: 'pt-program-introduction-v1',
      promptTemplateVersion: '1.0.0',
      context,
    };

    const formattedOutput = await this.llmService.process<string>(request);
    return this.extractString(
      formattedOutput.outputData,
      'Program introduction',
    );
  }

  /**
   * Generate exercise effects
   */
  private async generateExerciseEffects(
    inputData: Record<string, unknown>,
    context: Record<string, unknown>,
  ): Promise<string> {
    const request: LLMRequest = {
      moduleId: 'pt',
      inputData,
      promptTemplateId: 'pt-exercise-effects-v1',
      promptTemplateVersion: '1.0.0',
      context,
    };

    const formattedOutput = await this.llmService.process<string>(request);
    return this.extractString(formattedOutput.outputData, 'Exercise effects');
  }

  /**
   * Generate SNS posts
   */
  private async generateSNSPosts(
    inputData: Record<string, unknown>,
    context: Record<string, unknown>,
  ): Promise<SNSPosts> {
    const request: LLMRequest = {
      moduleId: 'pt',
      inputData,
      promptTemplateId: 'pt-sns-posts-v1',
      promptTemplateVersion: '1.0.0',
      context,
    };

    const formattedOutput = await this.llmService.process<SNSPosts>(request);
    const data = formattedOutput.outputData;

    if (!data || typeof data !== 'object') {
      throw new Error('Invalid LLM output: SNS posts data is not an object');
    }

    const posts = data as unknown as Record<string, unknown>;

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

  /**
   * Generate recruitment ad copy
   */
  private async generateRecruitmentAdCopy(
    inputData: Record<string, unknown>,
    context: Record<string, unknown>,
  ): Promise<string> {
    const request: LLMRequest = {
      moduleId: 'pt',
      inputData,
      promptTemplateId: 'pt-recruitment-ad-v1',
      promptTemplateVersion: '1.0.0',
      context,
    };

    const formattedOutput = await this.llmService.process<string>(request);
    return this.extractString(
      formattedOutput.outputData,
      'Recruitment ad copy',
    );
  }

  /**
   * Generate target customer copy
   */
  private async generateTargetCustomerCopy(
    inputData: Record<string, unknown>,
    context: Record<string, unknown>,
  ): Promise<TargetCustomerCopy> {
    const request: LLMRequest = {
      moduleId: 'pt',
      inputData,
      promptTemplateId: 'pt-target-customer-copy-v1',
      promptTemplateVersion: '1.0.0',
      context,
    };

    const formattedOutput =
      await this.llmService.process<TargetCustomerCopy>(request);
    const data = formattedOutput.outputData;

    if (!data || typeof data !== 'object') {
      throw new Error(
        'Invalid LLM output: Target customer copy data is not an object',
      );
    }

    const copy = data as unknown as Record<string, unknown>;

    const result: TargetCustomerCopy = {
      general: this.extractStringFlexible(
        copy,
        ['general', 'generalCopy', 'general_copy'],
        'General marketing copy',
      ),
    };

    // Extract optional target customer segments
    const targetCustomers = inputData.targetCustomers as string[] | undefined;
    if (targetCustomers && Array.isArray(targetCustomers)) {
      if (
        targetCustomers.includes('초보자') ||
        targetCustomers.includes('beginners')
      ) {
        result.beginners = this.extractStringOptional(copy, [
          'beginners',
          'beginnersCopy',
          'beginners_copy',
        ]);
      }
      if (
        targetCustomers.includes('중급자') ||
        targetCustomers.includes('intermediate')
      ) {
        result.intermediate = this.extractStringOptional(copy, [
          'intermediate',
          'intermediateCopy',
          'intermediate_copy',
        ]);
      }
      if (
        targetCustomers.includes('고급자') ||
        targetCustomers.includes('advanced')
      ) {
        result.advanced = this.extractStringOptional(copy, [
          'advanced',
          'advancedCopy',
          'advanced_copy',
        ]);
      }
      if (
        targetCustomers.includes('여성') ||
        targetCustomers.includes('female')
      ) {
        result.female = this.extractStringOptional(copy, [
          'female',
          'femaleCopy',
          'female_copy',
        ]);
      }
      if (
        targetCustomers.includes('남성') ||
        targetCustomers.includes('male')
      ) {
        result.male = this.extractStringOptional(copy, [
          'male',
          'maleCopy',
          'male_copy',
        ]);
      }
      if (
        targetCustomers.includes('시니어') ||
        targetCustomers.includes('seniors')
      ) {
        result.seniors = this.extractStringOptional(copy, [
          'seniors',
          'seniorsCopy',
          'seniors_copy',
        ]);
      }
      if (
        targetCustomers.includes('직장인') ||
        targetCustomers.includes('office workers')
      ) {
        result.officeWorkers = this.extractStringOptional(copy, [
          'officeWorkers',
          'office_workers',
          'officeWorkersCopy',
        ]);
      }
    }

    return result;
  }

  /**
   * Generate hashtags
   */
  private async generateHashtags(
    inputData: Record<string, unknown>,
    context: Record<string, unknown>,
  ): Promise<string[]> {
    const request: LLMRequest = {
      moduleId: 'pt',
      inputData,
      promptTemplateId: 'pt-hashtags-v1',
      promptTemplateVersion: '1.0.0',
      context,
    };

    const formattedOutput = await this.llmService.process<unknown>(request);
    const data: unknown = formattedOutput.outputData;

    if (Array.isArray(data)) {
      return data.map((tag) => String(tag));
    }

    if (typeof data === 'string') {
      return data
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0);
    }

    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      if (Array.isArray(obj.hashtags)) {
        return obj.hashtags.map((tag) => String(tag));
      }
    }

    return [];
  }

  /**
   * Generate price insight
   */
  private async generatePriceInsight(
    inputData: Record<string, unknown>,
    context: Record<string, unknown>,
  ): Promise<string | null> {
    const request: LLMRequest = {
      moduleId: 'pt',
      inputData,
      promptTemplateId: 'pt-price-insight-v1',
      promptTemplateVersion: '1.0.0',
      context,
    };

    const formattedOutput = await this.llmService.process<string>(request);
    const result = this.extractStringOptional(formattedOutput.outputData, [
      'priceInsight',
      'price_insight',
      'priceEvaluation',
      'price_evaluation',
    ]);
    return result || null;
  }

  /**
   * Extract string value from LLM output
   * Handles both JSON objects and plain text responses
   */
  private extractString(data: unknown, fieldName: string): string {
    // Handle plain text response wrapped by ResponseParser
    if (
      data &&
      typeof data === 'object' &&
      '_parsedAsText' in data &&
      (data as { _parsedAsText?: boolean })._parsedAsText === true
    ) {
      const content = (data as { content?: string }).content;
      if (typeof content === 'string' && content.trim().length > 0) {
        return content.trim();
      }
    }

    // Handle direct string response
    if (typeof data === 'string' && data.trim().length > 0) {
      return data.trim();
    }

    // Handle object with the field name
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      const value = obj[fieldName];
      if (typeof value === 'string' && value.trim().length > 0) {
        return value.trim();
      }
    }

    throw new Error(`Invalid LLM output: ${fieldName} is missing or invalid`);
  }

  /**
   * Extract string with multiple possible keys (flexible parsing)
   * Handles both JSON objects and plain text responses
   */
  private extractStringFlexible(
    data: unknown,
    keys: string[],
    fieldName: string,
  ): string {
    // Handle plain text response wrapped by ResponseParser
    if (
      data &&
      typeof data === 'object' &&
      '_parsedAsText' in data &&
      (data as { _parsedAsText?: boolean })._parsedAsText === true
    ) {
      const content = (data as { content?: string }).content;
      if (typeof content === 'string' && content.trim().length > 0) {
        return content.trim();
      }
    }

    // Handle object with multiple possible keys
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      for (const key of keys) {
        const value = obj[key];
        if (typeof value === 'string' && value.trim().length > 0) {
          return value.trim();
        }
      }
    }

    // Handle direct string response
    if (typeof data === 'string' && data.trim().length > 0) {
      return data.trim();
    }

    console.warn(
      `Missing field "${fieldName}". Available keys:`,
      data && typeof data === 'object'
        ? Object.keys(data as Record<string, unknown>)
        : 'N/A',
    );
    throw new Error(`Invalid LLM output: ${fieldName} is missing or invalid`);
  }

  /**
   * Extract optional string value
   */
  private extractStringOptional(
    data: unknown,
    keys: string[],
  ): string | undefined {
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      for (const key of keys) {
        const value = obj[key];
        if (typeof value === 'string' && value.trim().length > 0) {
          return value.trim();
        }
      }
    }

    if (typeof data === 'string' && data.trim().length > 0) {
      return data.trim();
    }

    return undefined;
  }
}
