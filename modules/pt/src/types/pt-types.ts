import type { Input, Output } from '@bizflow/shared/types';

/**
 * PT / Fitness Module Input Types
 */

/**
 * Trainer information
 */
export interface TrainerInfo {
  /**
   * Trainer experience/career
   */
  experience?: string;

  /**
   * Trainer certifications
   */
  certifications?: string[];

  /**
   * Trainer specialty
   */
  specialty?: string;
}

/**
 * Program information for PT/fitness content generation
 */
export interface PTProgramInput {
  /**
   * Program name
   */
  name: string;

  /**
   * Program type (diet, strength training, yoga, pilates, boxing, crossfit, etc.)
   */
  programType: string;

  /**
   * Program goals (weight loss, muscle gain, fitness improvement, rehabilitation, body correction, etc.)
   */
  goals: string;

  /**
   * Program duration (e.g., "1개월", "3개월", "6개월")
   */
  duration?: string;

  /**
   * Program price/fee
   */
  price?: number;

  /**
   * Program features and characteristics (e.g., "1:1 맞춤", "그룹 레슨", "홈 트레이닝")
   */
  features?: string[];

  /**
   * Target customers (beginners, intermediate, advanced, female, male, seniors, office workers, etc.)
   */
  targetCustomers?: string[];

  /**
   * Training location/environment (home, center, online, outdoor)
   */
  location?: string;

  /**
   * Trainer information
   */
  trainerInfo?: TrainerInfo;

  /**
   * Program description/details
   */
  description?: string;

  /**
   * Program images (URLs or file paths)
   */
  images?: string[];

  /**
   * Additional metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * Input for PT module
 */
export interface PTInput extends Input<PTProgramInput> {
  /**
   * Module identifier
   */
  moduleId: 'pt';

  /**
   * Program data
   */
  programData?: PTProgramInput;
}

/**
 * PT / Fitness Module Output Types
 */

/**
 * Target customer-focused marketing copy
 */
export interface TargetCustomerCopy {
  /**
   * General marketing copy
   */
  general: string;

  /**
   * Copy for beginners
   */
  beginners?: string;

  /**
   * Copy for intermediate
   */
  intermediate?: string;

  /**
   * Copy for advanced
   */
  advanced?: string;

  /**
   * Copy for female customers
   */
  female?: string;

  /**
   * Copy for male customers
   */
  male?: string;

  /**
   * Copy for seniors
   */
  seniors?: string;

  /**
   * Copy for office workers
   */
  officeWorkers?: string;
}

/**
 * SNS promotional posts
 */
export interface SNSPosts {
  /**
   * Instagram promotional post
   */
  instagram: string;

  /**
   * Facebook promotional post
   */
  facebook: string;
}

/**
 * Generated content for PT/fitness program
 */
export interface PTGeneratedContent {
  /**
   * Program introduction description
   */
  programIntroduction: string;

  /**
   * Exercise effect descriptions
   */
  exerciseEffects: string;

  /**
   * SNS promotional posts
   */
  snsPosts: SNSPosts;

  /**
   * Member recruitment ad copy
   */
  recruitmentAdCopy: string;

  /**
   * Target customer-focused marketing copy
   */
  targetCustomerCopy: TargetCustomerCopy;

  /**
   * Hashtag recommendations
   */
  hashtags: string[];

  /**
   * Price evaluation/recommendation
   */
  priceInsight?: string;
}

/**
 * Output for PT module
 */
export interface PTOutput extends Output<PTGeneratedContent> {
  /**
   * Module identifier
   */
  moduleId: 'pt';

  /**
   * Generated content
   */
  outputData: PTGeneratedContent;
}

