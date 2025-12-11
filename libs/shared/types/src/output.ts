/**
 * Generic interface for module-specific output data.
 *
 * @template T - The type of the module-specific output data
 *
 * @example
 * ```typescript
 * type SmartStoreOutput = Output<{
 *   seoProductName: string;
 *   summary1Line: string;
 *   detailedDescription: string;
 * }>;
 *
 * const output: SmartStoreOutput = {
 *   moduleId: 'smartstore',
 *   data: {
 *     seoProductName: 'SEO Optimized Name',
 *     summary1Line: 'One line summary',
 *     detailedDescription: 'Detailed description',
 *   },
 *   format: 'json',
 * };
 * ```
 */
export interface Output<T> {
  /**
   * Domain module identifier (e.g., "smartstore", "realestate", "pt")
   */
  moduleId: string;

  /**
   * Module-specific output data
   */
  data: T;

  /**
   * Output format type
   */
  format: 'json' | 'text' | 'markdown' | 'html';

  /**
   * Optional metadata for tracking and processing information
   */
  metadata?: {
    /**
     * Request identifier that generated this output
     */
    requestId: string;

    /**
     * Processing time in milliseconds
     */
    processingTime: number;

    /**
     * LLM model used to generate this output
     */
    model: string;
  };
}

