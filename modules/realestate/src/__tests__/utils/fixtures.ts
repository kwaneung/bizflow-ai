import type {
  RealEstateInput,
  RealEstateOutput,
  RealEstatePropertyInput,
  RealEstateGeneratedContent,
} from '../../types/realestate-types';

/**
 * Test fixtures for Realestate module.
 * 
 * Use these fixtures to create consistent test data across all realestate tests.
 */

/**
 * Create a valid RealEstatePropertyInput for testing.
 */
export function createRealEstatePropertyInput(
  overrides?: Partial<RealEstatePropertyInput>
): RealEstatePropertyInput {
  return {
    location: '123 Test Street, Gangnam-gu, Seoul',
    propertyType: 'Apartment',
    size: '84㎡ (25평)',
    price: 500000000,
    features: ['Parking', 'Elevator', 'Balcony', 'Security'],
    description: 'Modern apartment in prime location',
    rooms: 3,
    bathrooms: 2,
    floor: '15/20',
    buildingAge: '5 years',
    images: ['https://example.com/property1.jpg', 'https://example.com/property2.jpg'],
    targetCustomer: 'Families',
    metadata: { buildingName: 'Test Tower', managementFee: 150000 },
    ...overrides,
  };
}

/**
 * Create a valid RealEstateInput for testing.
 */
export function createRealEstateInput(
  overrides?: Partial<RealEstateInput>
): RealEstateInput {
  return {
    moduleId: 'realestate',
    propertyData: createRealEstatePropertyInput(),
    ...overrides,
  };
}

/**
 * Create a valid RealEstateGeneratedContent for testing.
 */
export function createRealEstateGeneratedContent(
  overrides?: Partial<RealEstateGeneratedContent>
): RealEstateGeneratedContent {
  return {
    portalDescription: 'Prime location apartment in Gangnam-gu. Modern design with excellent amenities. Perfect for families seeking comfort and convenience.',
    snsPosts: {
      instagram: '🏠 Beautiful apartment in Gangnam! Perfect location, modern design. DM for details! 🏠\n\n#RealEstate #Gangnam #Apartment',
      facebook: 'Check out this amazing apartment in Gangnam! Great location, modern amenities, perfect for families.',
    },
    marketingCopy: {
      firstTimeBuyers: 'Perfect starter home in a safe, family-friendly neighborhood with excellent schools nearby.',
      investors: 'High rental yield potential in prime location with strong capital appreciation prospects.',
      families: 'Spacious 3-bedroom apartment ideal for growing families. Close to schools, parks, and shopping centers.',
      general: 'Modern apartment in prime Gangnam location. Excellent investment opportunity with strong rental demand.',
    },
    locationHighlights: {
      transportation: '5-minute walk to subway station. Direct access to major business districts.',
      amenities: 'Nearby shopping malls, restaurants, cafes, and entertainment venues.',
      neighborhood: 'Safe, family-friendly neighborhood with excellent schools and parks.',
      general: 'Prime location in Gangnam-gu with excellent connectivity and amenities.',
    },
    uniqueSellingPoints: [
      'Modern design and high-quality finishes',
      'Excellent location with great transportation links',
      'Family-friendly neighborhood with good schools',
      'Strong investment potential',
    ],
    hashtags: ['#RealEstate', '#Gangnam', '#Apartment', '#Seoul', '#Investment'],
    priceInsight: 'Competitively priced for the area. Good value considering location, size, and amenities.',
    ...overrides,
  };
}

/**
 * Create a valid RealEstateOutput for testing.
 */
export function createRealEstateOutput(
  overrides?: Partial<RealEstateOutput>
): RealEstateOutput {
  return {
    requestId: 'test-request-id',
    moduleId: 'realestate',
    outputData: createRealEstateGeneratedContent(),
    format: 'json',
    metadata: {
      processingTime: 1800,
      model: 'gpt-4',
    },
    ...overrides,
  };
}

/**
 * Create an invalid RealEstateInput (missing required fields).
 */
export function createInvalidRealEstateInput(): Partial<RealEstateInput> {
  return {
    moduleId: 'realestate',
    // Missing propertyData
  };
}

/**
 * Create a minimal valid RealEstateInput (only required fields).
 */
export function createMinimalRealEstateInput(): RealEstateInput {
  return {
    moduleId: 'realestate',
    propertyData: {
      location: 'Test Location',
      propertyType: 'Apartment',
    },
  };
}

