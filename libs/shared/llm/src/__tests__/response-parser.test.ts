import { ResponseParser } from '../services/response-parser';

describe('ResponseParser', () => {
  let responseParser: ResponseParser;

  beforeEach(() => {
    responseParser = new ResponseParser();
  });

  describe('parse', () => {
    it('should parse JSON response', async () => {
      const rawResponse = JSON.stringify({
        result: 'test',
        data: { key: 'value' },
      });

      const result = await responseParser.parse(rawResponse, 'json');

      expect(result).toEqual({
        result: 'test',
        data: { key: 'value' },
      });
    });

    it('should parse text response', async () => {
      const rawResponse = 'Simple text response';

      const result = await responseParser.parse(rawResponse, 'text');

      expect(result).toBe('Simple text response');
    });

    it('should parse markdown response', async () => {
      const rawResponse = '# Title\n\nContent here';

      const result = await responseParser.parse(rawResponse, 'markdown');

      expect(result).toBe(rawResponse);
    });

    it('should parse HTML response', async () => {
      const rawResponse = '<h1>Title</h1><p>Content</p>';

      const result = await responseParser.parse(rawResponse, 'html');

      expect(result).toBe(rawResponse);
    });

    it('should handle invalid JSON gracefully', async () => {
      const invalidJson = '{ invalid json }';

      await expect(
        responseParser.parse(invalidJson, 'json')
      ).rejects.toThrow();
    });

    it('should handle empty response', async () => {
      const emptyResponse = '';

      await expect(
        responseParser.parse(emptyResponse, 'text')
      ).rejects.toThrow();
    });

    it('should validate parsed data against schema if provided', async () => {
      const rawResponse = JSON.stringify({ name: 'test', age: 30 });
      const schema = {
        name: 'string',
        age: 'number',
      };

      const result = await responseParser.parse(rawResponse, 'json', schema);

      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('age');
    });
  });
});

