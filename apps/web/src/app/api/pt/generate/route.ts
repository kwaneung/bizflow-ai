import { NextRequest, NextResponse } from 'next/server';
import {
  PTContentService,
  type PTProgramInput,
} from '@bizflow/modules/pt';

/**
 * POST /api/pt/generate
 *
 * Generate program content for a PT/fitness program using LLM.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { programData } = body;

    if (!programData || typeof programData !== 'object') {
      return NextResponse.json(
        { error: 'programData is required and must be an object' },
        { status: 400 },
      );
    }

    // Validate required fields
    if (!programData.name || typeof programData.name !== 'string') {
      return NextResponse.json(
        { error: 'programData.name is required and must be a string' },
        { status: 400 },
      );
    }

    if (
      !programData.programType ||
      typeof programData.programType !== 'string'
    ) {
      return NextResponse.json(
        {
          error: 'programData.programType is required and must be a string',
        },
        { status: 400 },
      );
    }

    if (!programData.goals || typeof programData.goals !== 'string') {
      return NextResponse.json(
        {
          error: 'programData.goals is required and must be a string',
        },
        { status: 400 },
      );
    }

    // Validate optional fields
    if (
      programData.price !== undefined &&
      (typeof programData.price !== 'number' || programData.price < 0)
    ) {
      return NextResponse.json(
        {
          error: 'programData.price must be a positive number if provided',
        },
        { status: 400 },
      );
    }

    if (
      programData.features !== undefined &&
      (!Array.isArray(programData.features) ||
        !programData.features.every((f: unknown) => typeof f === 'string'))
    ) {
      return NextResponse.json(
        {
          error:
            'programData.features must be an array of strings if provided',
        },
        { status: 400 },
      );
    }

    if (
      programData.targetCustomers !== undefined &&
      (!Array.isArray(programData.targetCustomers) ||
        !programData.targetCustomers.every(
          (c: unknown) => typeof c === 'string',
        ))
    ) {
      return NextResponse.json(
        {
          error:
            'programData.targetCustomers must be an array of strings if provided',
        },
        { status: 400 },
      );
    }

    const programInput: PTProgramInput = {
      name: programData.name,
      programType: programData.programType,
      goals: programData.goals,
      duration: programData.duration,
      price: programData.price,
      features: programData.features,
      targetCustomers: programData.targetCustomers,
      location: programData.location,
      trainerInfo: programData.trainerInfo,
      description: programData.description,
      images: programData.images,
      metadata: programData.metadata,
    };

    const service = new PTContentService();
    const content = await service.generateContent(programInput);

    return NextResponse.json(
      {
        success: true,
        content,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('PT content generation error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate PT program content',
      },
      { status: 500 },
    );
  }
}

