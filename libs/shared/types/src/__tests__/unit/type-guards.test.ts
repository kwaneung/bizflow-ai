import { Input, Output } from '../../index';
import { isInput, isOutput } from '../../type-guards';

describe('Type Guards', () => {
  describe('isInput', () => {
    it('should correctly identify Input objects', () => {
      const validInput: Input<{ name: string }> = {
        moduleId: 'test-module',
        data: { name: 'test' },
      };

      expect(isInput(validInput)).toBe(true);
    });

    it('should reject invalid objects', () => {
      expect(isInput({})).toBe(false);
      expect(isInput({ moduleId: 'test' })).toBe(false);
      expect(isInput({ data: {} })).toBe(false);
      expect(isInput(null)).toBe(false);
      expect(isInput(undefined)).toBe(false);
    });

    it('should work with type narrowing', () => {
      const value: unknown = {
        moduleId: 'test-module',
        data: { name: 'test' },
      };

      if (isInput(value)) {
        // TypeScript should narrow type to Input<unknown>
        expect(value.moduleId).toBe('test-module');
        expect(value.data).toBeDefined();
      }
    });

    it('should validate metadata structure when present', () => {
      const inputWithMetadata: Input<{ name: string }> = {
        moduleId: 'test-module',
        data: { name: 'test' },
        metadata: {
          userId: 'user-123',
          sessionId: 'session-456',
          timestamp: new Date(),
        },
      };

      expect(isInput(inputWithMetadata)).toBe(true);
    });

    it('should reject invalid metadata types', () => {
      expect(
        isInput({
          moduleId: 'test',
          data: {},
          metadata: null,
        }),
      ).toBe(false);

      expect(
        isInput({
          moduleId: 'test',
          data: {},
          metadata: 'invalid',
        }),
      ).toBe(false);

      expect(
        isInput({
          moduleId: 'test',
          data: {},
          metadata: {
            userId: 123, // should be string
          },
        }),
      ).toBe(false);

      expect(
        isInput({
          moduleId: 'test',
          data: {},
          metadata: {
            sessionId: 123, // should be string
          },
        }),
      ).toBe(false);

      expect(
        isInput({
          moduleId: 'test',
          data: {},
          metadata: {
            timestamp: 'invalid', // should be Date
          },
        }),
      ).toBe(false);
    });
  });

  describe('isOutput', () => {
    it('should correctly identify Output objects', () => {
      const validOutput: Output<{ result: string }> = {
        moduleId: 'test-module',
        data: { result: 'test' },
        format: 'json',
      };

      expect(isOutput(validOutput)).toBe(true);
    });

    it('should reject invalid objects', () => {
      expect(isOutput({})).toBe(false);
      expect(isOutput({ moduleId: 'test' })).toBe(false);
      expect(isOutput({ data: {}, format: 'json' })).toBe(false);
      expect(isOutput({ moduleId: 'test', data: {} })).toBe(false);
      expect(isOutput(null)).toBe(false);
      expect(isOutput(undefined)).toBe(false);
    });

    it('should validate format field', () => {
      expect(
        isOutput({
          moduleId: 'test',
          data: {},
          format: 'json',
        }),
      ).toBe(true);

      expect(
        isOutput({
          moduleId: 'test',
          data: {},
          format: 'invalid' as any,
        }),
      ).toBe(false);
    });

    it('should work with type narrowing', () => {
      const value: unknown = {
        moduleId: 'test-module',
        data: { result: 'test' },
        format: 'json',
      };

      if (isOutput(value)) {
        // TypeScript should narrow type to Output<unknown>
        expect(value.moduleId).toBe('test-module');
        expect(value.data).toBeDefined();
        expect(value.format).toBe('json');
      }
    });

    it('should validate all format types', () => {
      expect(
        isOutput({
          moduleId: 'test',
          data: {},
          format: 'json',
        }),
      ).toBe(true);

      expect(
        isOutput({
          moduleId: 'test',
          data: {},
          format: 'text',
        }),
      ).toBe(true);

      expect(
        isOutput({
          moduleId: 'test',
          data: {},
          format: 'markdown',
        }),
      ).toBe(true);

      expect(
        isOutput({
          moduleId: 'test',
          data: {},
          format: 'html',
        }),
      ).toBe(true);
    });

    it('should validate metadata structure when present', () => {
      const outputWithMetadata: Output<{ result: string }> = {
        moduleId: 'test-module',
        data: { result: 'test' },
        format: 'json',
        metadata: {
          requestId: 'req-123',
          processingTime: 1500,
          model: 'gpt-4',
        },
      };

      expect(isOutput(outputWithMetadata)).toBe(true);
    });

    it('should reject invalid metadata types', () => {
      expect(
        isOutput({
          moduleId: 'test',
          data: {},
          format: 'json',
          metadata: null,
        }),
      ).toBe(false);

      expect(
        isOutput({
          moduleId: 'test',
          data: {},
          format: 'json',
          metadata: 'invalid',
        }),
      ).toBe(false);

      expect(
        isOutput({
          moduleId: 'test',
          data: {},
          format: 'json',
          metadata: {
            requestId: 123, // should be string
          },
        }),
      ).toBe(false);

      expect(
        isOutput({
          moduleId: 'test',
          data: {},
          format: 'json',
          metadata: {
            processingTime: 'invalid', // should be number
          },
        }),
      ).toBe(false);

      expect(
        isOutput({
          moduleId: 'test',
          data: {},
          format: 'json',
          metadata: {
            model: 123, // should be string
          },
        }),
      ).toBe(false);
    });
  });
});
