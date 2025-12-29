import type {
  EcommerceInput,
  EcommerceOutput,
  EcommerceProductInput,
  EcommerceGeneratedContent,
} from '../../types/ecommerce-types';

/**
 * Test fixtures for Ecommerce module.
 * 
 * Use these fixtures to create consistent test data across all ecommerce tests.
 */

/**
 * Create a valid EcommerceProductInput for testing.
 */
export function createEcommerceProductInput(
  overrides?: Partial<EcommerceProductInput>
): EcommerceProductInput {
  return {
    name: 'Test Product',
    description: 'This is a test product description',
    price: 29.99,
    category: 'Electronics',
    options: [
      { name: 'Color', values: ['Red', 'Blue', 'Green'] },
      { name: 'Size', values: ['S', 'M', 'L'] },
    ],
    images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    metadata: { brand: 'TestBrand', sku: 'TEST-001' },
    ...overrides,
  };
}

/**
 * Create a valid EcommerceInput for testing (manual source).
 */
export function createEcommerceInput(
  overrides?: Partial<EcommerceInput>
): EcommerceInput {
  return {
    moduleId: 'ecommerce',
    source: 'manual',
    productData: createEcommerceProductInput(),
    ...overrides,
  };
}

/**
 * Create a valid EcommerceInput for testing (URL source).
 */
export function createEcommerceInputFromUrl(
  overrides?: Partial<EcommerceInput>
): EcommerceInput {
  return {
    moduleId: 'ecommerce',
    source: 'url',
    url: 'https://example.com/product/test-product',
    ...overrides,
  };
}

/**
 * Create a valid EcommerceGeneratedContent for testing.
 */
export function createEcommerceGeneratedContent(
  overrides?: Partial<EcommerceGeneratedContent>
): EcommerceGeneratedContent {
  return {
    seoProductName: 'Test Product - Premium Quality Electronics',
    summaries: {
      oneLine: 'Premium quality test product with excellent features',
      threeLine: 'This is a premium quality test product.\nIt features excellent build quality and modern design.\nPerfect for everyday use and special occasions.',
      blog: 'Introducing our latest test product - a premium quality item designed for modern consumers. This product combines style and functionality, making it perfect for a wide range of applications.',
    },
    detailedDescription: 'This is a comprehensive detailed description of the test product. It includes all the key features, benefits, and specifications that customers would want to know about.',
    promotionalPosts: {
      instagram: '✨ New arrival! Check out our amazing test product ✨\n\n#TestProduct #NewArrival #Electronics',
      blog: 'Discover the amazing features of our new test product. Learn why it\'s the perfect choice for your needs.',
    },
    hashtags: ['#TestProduct', '#Electronics', '#NewArrival', '#Premium'],
    priceInsight: 'Based on market analysis, this product is competitively priced and offers excellent value for money.',
    categoryInsight: 'This product fits best in the Electronics category, with potential cross-listing in Home & Garden.',
    ...overrides,
  };
}

/**
 * Create a valid EcommerceOutput for testing.
 */
export function createEcommerceOutput(
  overrides?: Partial<EcommerceOutput>
): EcommerceOutput {
  return {
    requestId: 'test-request-id',
    moduleId: 'ecommerce',
    outputData: createEcommerceGeneratedContent(),
    format: 'json',
    metadata: {
      processingTime: 1500,
      model: 'gpt-4',
    },
    ...overrides,
  };
}

/**
 * Create an invalid EcommerceInput (missing required fields).
 */
export function createInvalidEcommerceInput(): Partial<EcommerceInput> {
  return {
    moduleId: 'ecommerce',
    source: 'manual',
    // Missing productData
  };
}

/**
 * Create a minimal valid EcommerceInput (only required fields).
 */
export function createMinimalEcommerceInput(): EcommerceInput {
  return {
    moduleId: 'ecommerce',
    source: 'manual',
    productData: {
      name: 'Minimal Product',
      description: 'Minimal description',
    },
  };
}

