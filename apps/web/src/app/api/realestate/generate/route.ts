import { NextRequest, NextResponse } from 'next/server';
import {
  RealEstateContentService,
  type RealEstatePropertyInput,
} from '@bizflow/modules/realestate';

/**
 * POST /api/realestate/generate
 *
 * Generate property content for a real estate property using LLM.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyData } = body;

    if (!propertyData || typeof propertyData !== 'object') {
      return NextResponse.json(
        { error: 'propertyData is required and must be an object' },
        { status: 400 },
      );
    }

    // Validate required fields
    if (!propertyData.location || typeof propertyData.location !== 'string') {
      return NextResponse.json(
        { error: 'propertyData.location is required and must be a string' },
        { status: 400 },
      );
    }

    if (
      !propertyData.propertyType ||
      typeof propertyData.propertyType !== 'string'
    ) {
      return NextResponse.json(
        {
          error:
            'propertyData.propertyType is required and must be a string',
        },
        { status: 400 },
      );
    }

    const propertyInput: RealEstatePropertyInput = {
      location: propertyData.location,
      propertyType: propertyData.propertyType,
      size: propertyData.size,
      price: propertyData.price,
      features: propertyData.features,
      description: propertyData.description,
      rooms: propertyData.rooms,
      bathrooms: propertyData.bathrooms,
      floor: propertyData.floor,
      buildingAge: propertyData.buildingAge,
      images: propertyData.images,
      targetCustomer: propertyData.targetCustomer,
      metadata: propertyData.metadata,
    };

    const contentService = new RealEstateContentService();
    const generatedContent =
      await contentService.generateContent(propertyInput);

    return NextResponse.json({
      success: true,
      content: generatedContent,
    });
  } catch (error) {
    console.error('Error generating real estate content:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error occurred while generating content',
      },
      { status: 500 },
    );
  }
}

