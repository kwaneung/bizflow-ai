import { NextRequest, NextResponse } from 'next/server';
import { SmartStoreCrawler } from '@bizflow/modules/smartstore';

/**
 * POST /api/smartstore/crawl
 *
 * Crawl a Naver SmartStore product URL and extract product information.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required and must be a string' },
        { status: 400 }
      );
    }

    const crawler = new SmartStoreCrawler();
    const result = await crawler.crawlProduct(url);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error || 'Failed to crawl product',
          success: false,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      product: result.product,
      metadata: result.metadata,
    });
  } catch (error) {
    console.error('Error crawling SmartStore product:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error occurred while crawling',
      },
      { status: 500 }
    );
  }
}

