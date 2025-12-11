import type { Input, Output } from '@bizflow/shared/types';

/**
 * SmartStore Module Input Types
 */

/**
 * Product information extracted from SmartStore URL or manual entry
 */
export interface SmartStoreProductInput {
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
 * Input for SmartStore module
 */
export interface SmartStoreInput extends Input<SmartStoreProductInput> {
  /**
   * Module identifier
   */
  moduleId: 'smartstore';

  /**
   * Input source: 'url' for SmartStore URL, 'manual' for manual entry
   */
  source: 'url' | 'manual';

  /**
   * SmartStore product URL (if source is 'url')
   */
  url?: string;

  /**
   * Manual product data (if source is 'manual')
   */
  productData?: SmartStoreProductInput;
}

/**
 * SmartStore Module Output Types
 */

/**
 * Generated content for SmartStore product
 */
export interface SmartStoreGeneratedContent {
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
 * Output for SmartStore module
 */
export interface SmartStoreOutput extends Output<SmartStoreGeneratedContent> {
  /**
   * Module identifier
   */
  moduleId: 'smartstore';

  /**
   * Generated content
   */
  outputData: SmartStoreGeneratedContent;
}

/**
 * Crawled product data from SmartStore URL
 */
export interface CrawledProductData {
  /**
   * Success status
   */
  success: boolean;

  /**
   * Extracted product information
   */
  product?: SmartStoreProductInput;

  /**
   * Error message if crawling failed
   */
  error?: string;

  /**
   * Crawling metadata
   */
  metadata?: {
    crawledAt: Date;
    url: string;
    responseTime: number;
  };
}

