import { NextRequest, NextResponse } from 'next/server';
import {
  EcommerceContentService,
  type EcommerceProductInput,
} from '@bizflow/modules/ecommerce';

/**
 * POST /api/ecommerce/generate
 *
 * Generate product content for an ecommerce product using LLM.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productData } = body;

    if (!productData || typeof productData !== 'object') {
      return NextResponse.json(
        { error: 'productData is required and must be an object' },
        { status: 400 },
      );
    }

    // Validate required fields
    if (!productData.name || typeof productData.name !== 'string') {
      return NextResponse.json(
        { error: 'productData.name is required and must be a string' },
        { status: 400 },
      );
    }

    if (
      !productData.description ||
      typeof productData.description !== 'string'
    ) {
      return NextResponse.json(
        {
          error: 'productData.description is required and must be a string',
        },
        { status: 400 },
      );
    }

    const productInput: EcommerceProductInput = {
      name: productData.name,
      description: productData.description,
      options: productData.options,
      images: productData.images,
      price: productData.price,
      category: productData.category,
      metadata: productData.metadata,
    };

    const contentService = new EcommerceContentService();
    const generatedContent = await contentService.generateContent(productInput);

    return NextResponse.json({
      success: true,
      content: generatedContent,
    });
  } catch (error) {
    console.error('Error generating ecommerce content:', error);
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
