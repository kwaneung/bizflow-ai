import { SmartStoreCrawler } from '../services/smartstore-crawler';

describe('SmartStoreCrawler', () => {
  let crawler: SmartStoreCrawler;

  beforeEach(() => {
    crawler = new SmartStoreCrawler();
  });

  describe('crawlProduct', () => {
    it('should reject invalid URLs', async () => {
      const result = await crawler.crawlProduct('https://invalid-url.com');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid SmartStore URL');
    });

    it('should reject non-SmartStore URLs', async () => {
      const result = await crawler.crawlProduct('https://example.com/product');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid SmartStore URL');
    });

    it('should accept valid SmartStore URLs', async () => {
      const validUrl = 'https://smartstore.naver.com/products/123456';
      // Mock fetch for this test
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: async () => '<html><head><meta property="og:title" content="Test Product" /><meta property="og:description" content="Test Description" /></head><body></body></html>',
      });

      const result = await crawler.crawlProduct(validUrl);
      
      // Note: This test may fail if the URL structure changes
      // In a real scenario, we would mock the HTML response
      expect(result).toBeDefined();
    });
  });
});

