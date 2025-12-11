import * as cheerio from 'cheerio';
import type { CrawledProductData, SmartStoreProductInput } from '../types/smartstore-types';

/**
 * Service for crawling Naver SmartStore product pages.
 */
export class SmartStoreCrawler {
  /**
   * Crawl a SmartStore product URL and extract product information.
   *
   * @param url - SmartStore product URL
   * @returns Crawled product data
   */
  async crawlProduct(url: string): Promise<CrawledProductData> {
    const startTime = Date.now();

    try {
      // Validate URL
      if (!this.isValidSmartStoreUrl(url)) {
        return {
          success: false,
          error: 'Invalid SmartStore URL. Please provide a valid Naver SmartStore product URL.',
        };
      }

      // Fetch the page
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Failed to fetch product page: ${response.statusText}`,
        };
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract product information
      const product = this.extractProductData($, url);

      if (!product) {
        return {
          success: false,
          error: 'Could not extract product information from the page.',
        };
      }

      return {
        success: true,
        product,
        metadata: {
          crawledAt: new Date(),
          url,
          responseTime: Date.now() - startTime,
        },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error occurred while crawling',
      };
    }
  }

  /**
   * Validate if URL is a valid SmartStore product URL.
   *
   * @param url - URL to validate
   * @returns True if valid SmartStore URL
   */
  private isValidSmartStoreUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return (
        urlObj.hostname.includes('smartstore.naver.com') ||
        urlObj.hostname.includes('shopping.naver.com')
      );
    } catch {
      return false;
    }
  }

  /**
   * Extract product data from HTML using Cheerio.
   *
   * @param $ - Cheerio instance
   * @param url - Original URL
   * @returns Extracted product data or null
   */
  private extractProductData(
    $: cheerio.CheerioAPI,
    url: string
  ): SmartStoreProductInput | null {
    // Try multiple selectors for product name
    const name =
      $('meta[property="og:title"]').attr('content') ||
      $('h1.product_title').text() ||
      $('.product_title').text() ||
      $('h1').first().text() ||
      '';

    // Try multiple selectors for product description
    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('.product_description').text() ||
      $('.description').text() ||
      '';

    // Extract images
    const images: string[] = [];
    $('img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src && !images.includes(src)) {
        images.push(src);
      }
    });

    // Extract price (if available)
    const priceText =
      $('.price').text() ||
      $('[class*="price"]').first().text() ||
      '';
    const price = this.parsePrice(priceText);

    if (!name || !description) {
      return null;
    }

    return {
      name: name.trim(),
      description: description.trim(),
      images: images.length > 0 ? images : undefined,
      price: price,
      metadata: {
        sourceUrl: url,
        crawledAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Parse price from text.
   *
   * @param priceText - Price text
   * @returns Parsed price or undefined
   */
  private parsePrice(priceText: string): number | undefined {
    const cleaned = priceText.replace(/[^\d]/g, '');
    const price = parseInt(cleaned, 10);
    return isNaN(price) ? undefined : price;
  }
}

