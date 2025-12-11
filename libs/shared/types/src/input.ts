/**
 * Generic interface for module-specific input data.
 *
 * @template T - The type of the module-specific input data
 *
 * @example
 * ```typescript
 * type EcommerceInput = Input<{
 *   productName: string;
 *   description: string;
 *   price: number;
 * }>;
 *
 * const input: EcommerceInput = {
 *   moduleId: 'ecommerce',
 *   data: {
 *     productName: 'Product Name',
 *     description: 'Product Description',
 *     price: 10000,
 *   },
 * };
 * ```
 */
export interface Input<T> {
  /**
   * Domain module identifier (e.g., "ecommerce", "realestate", "pt")
   */
  moduleId: string;

  /**
   * Module-specific input data
   */
  data: T;

  /**
   * Optional metadata for tracking and context
   */
  metadata?: {
    /**
     * User identifier who created this input
     */
    userId?: string;

    /**
     * Session identifier for tracking user sessions
     */
    sessionId?: string;

    /**
     * Timestamp when the input was created
     */
    timestamp?: Date;
  };
}
