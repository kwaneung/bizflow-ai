import type { Input, Output } from '@bizflow/shared/types';

/**
 * Ecommerce Module Input Types
 */

/**
 * Product information for ecommerce content generation
 */
export interface EcommerceProductInput {
  /**
   * Product name
   */
  name: string;

  /**
   * Product description
   */
  description: string;

  /**
   * Product options/variations
   */
  options?: Array<{
    name: string;
    values: string[];
  }>;

  /**
   * Product images (URLs or file paths)
   */
  images?: string[];

  /**
   * Product price (optional)
   */
  price?: number;

  /**
   * Product category (optional)
   */
  category?: string;

  /**
   * Additional metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * Input for Ecommerce module
 */
export interface EcommerceInput extends Input<EcommerceProductInput> {
  /**
   * Module identifier
   */
  moduleId: 'ecommerce';

  /**
   * Input source: 'url' for product URL, 'manual' for manual entry
   */
  source: 'url' | 'manual';

  /**
   * Product URL (if source is 'url')
   */
  url?: string;

  /**
   * Manual product data (if source is 'manual')
   */
  productData?: EcommerceProductInput;
}

/**
 * Ecommerce Module Output Types
 */

/**
 * Generated content for ecommerce product
 */
export interface EcommerceGeneratedContent {
  /**
   * SEO-optimized product name
   */
  seoProductName: string;

  /**
   * Product summaries in different formats
   */
  summaries: {
    /**
     * One-line summary
     */
    oneLine: string;

    /**
     * Three-line summary
     */
    threeLine: string;

    /**
     * Blog format summary
     */
    blog: string;
  };

  /**
   * Detailed product page description
   */
  detailedDescription: string;

  /**
   * Promotional posts
   */
  promotionalPosts: {
    /**
     * Instagram promotional post
     */
    instagram: string;

    /**
     * Blog promotional post
     */
    blog: string;
  };

  /**
   * Hashtag recommendations
   */
  hashtags: string[];
}

/**
 * Output for Ecommerce module
 */
export interface EcommerceOutput extends Output<EcommerceGeneratedContent> {
  /**
   * Module identifier
   */
  moduleId: 'ecommerce';

  /**
   * Generated content
   */
  outputData: EcommerceGeneratedContent;
}
