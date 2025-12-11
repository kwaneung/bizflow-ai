/**
 * Ecommerce Module
 *
 * This module provides product content generation for online shopping mall operators.
 *
 * @module @bizflow/modules/ecommerce
 */

// Types
export type {
  EcommerceInput,
  EcommerceOutput,
  EcommerceProductInput,
  EcommerceGeneratedContent,
} from './types/ecommerce-types';

// Services
export { EcommerceContentService } from './services';
