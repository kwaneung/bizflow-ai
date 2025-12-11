import { Input, Output } from '../index';
import { isInput, isOutput } from '../type-guards';

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
        })
      ).toBe(true);

      expect(
        isOutput({
          moduleId: 'test',
          data: {},
          format: 'invalid' as any,
        })
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
  });
});

