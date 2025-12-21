import type { Input, Output } from '@bizflow/shared/types';

/**
 * Real Estate Module Input Types
 */

/**
 * Property information for real estate content generation
 */
export interface RealEstatePropertyInput {
  /**
   * Property location (address, district, city)
   */
  location: string;

  /**
   * Property type (apartment, house, office, etc.)
   */
  propertyType: string;

  /**
   * Property size (square meters or pyeong)
   */
  size?: string;

  /**
   * Property price (optional)
   */
  price?: number;

  /**
   * Property features and characteristics
   */
  features?: string[];

  /**
   * Property description
   */
  description?: string;

  /**
   * Number of rooms/bedrooms
   */
  rooms?: number;

  /**
   * Number of bathrooms
   */
  bathrooms?: number;

  /**
   * Floor number
   */
  floor?: string;

  /**
   * Building age or construction year
   */
  buildingAge?: string;

  /**
   * Property images (URLs or file paths)
   */
  images?: string[];

  /**
   * Target customer segment (first-time buyers, investors, families, etc.)
   */
  targetCustomer?: string;

  /**
   * Additional metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * Input for Real Estate module
 */
export interface RealEstateInput extends Input<RealEstatePropertyInput> {
  /**
   * Module identifier
   */
  moduleId: 'realestate';

  /**
   * Manual property data
   */
  propertyData?: RealEstatePropertyInput;
}

/**
 * Real Estate Module Output Types
 */

/**
 * Generated content for real estate property
 */
export interface RealEstateGeneratedContent {
  /**
   * Property description optimized for real estate portals
   */
  portalDescription: string;

  /**
   * SNS promotional posts
   */
  snsPosts: {
    /**
     * Instagram promotional post
     */
    instagram: string;

    /**
     * Facebook promotional post
     */
    facebook: string;
  };

  /**
   * Target customer-focused marketing copy
   */
  marketingCopy: {
    /**
     * Marketing copy for first-time buyers
     */
    firstTimeBuyers?: string;

    /**
     * Marketing copy for investors
     */
    investors?: string;

    /**
     * Marketing copy for families
     */
    families?: string;

    /**
     * General marketing copy
     */
    general: string;
  };

  /**
   * Location-specific highlights and features
   */
  locationHighlights: {
    /**
     * Transportation accessibility highlights
     */
    transportation?: string;

    /**
     * Nearby amenities and facilities
     */
    amenities?: string;

    /**
     * Neighborhood characteristics
     */
    neighborhood?: string;

    /**
     * General location advantages
     */
    general: string;
  };

  /**
   * Property strengths and unique selling points
   */
  uniqueSellingPoints: string[];

  /**
   * Hashtag recommendations for SNS
   */
  hashtags: string[];

  /**
   * Price insight - evaluation if price is provided, recommendation if not
   */
  priceInsight?: string;
}

/**
 * Output for Real Estate module
 */
export interface RealEstateOutput extends Output<RealEstateGeneratedContent> {
  /**
   * Module identifier
   */
  moduleId: 'realestate';

  /**
   * Generated content
   */
  outputData: RealEstateGeneratedContent;
}
