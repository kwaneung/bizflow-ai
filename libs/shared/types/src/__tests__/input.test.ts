import { Input } from '../input';
import { isInput } from '../type-guards';

describe('Input<T>', () => {
  describe('interface structure', () => {
    it('should have required moduleId and data fields', () => {
      const input: Input<{ name: string }> = {
        moduleId: 'test-module',
        data: { name: 'test' },
      };

      expect(input.moduleId).toBe('test-module');
      expect(input.data).toEqual({ name: 'test' });
    });

    it('should have optional metadata field', () => {
      const inputWithMetadata: Input<{ name: string }> = {
        moduleId: 'test-module',
        data: { name: 'test' },
        metadata: {
          userId: 'user-123',
          sessionId: 'session-456',
          timestamp: new Date('2025-01-01'),
        },
      };

      expect(inputWithMetadata.metadata?.userId).toBe('user-123');
      expect(inputWithMetadata.metadata?.sessionId).toBe('session-456');
      expect(inputWithMetadata.metadata?.timestamp).toBeInstanceOf(Date);
    });

    it('should work without metadata', () => {
      const inputWithoutMetadata: Input<{ name: string }> = {
        moduleId: 'test-module',
        data: { name: 'test' },
      };

      expect(inputWithoutMetadata.metadata).toBeUndefined();
    });
  });

  describe('type safety', () => {
    it('should enforce type safety for data field', () => {
      type TestData = { name: string; age: number };
      const input: Input<TestData> = {
        moduleId: 'test-module',
        data: { name: 'John', age: 30 },
      };

      // TypeScript should catch type errors at compile time
      expect(input.data.name).toBe('John');
      expect(input.data.age).toBe(30);
    });

    it('should allow different data types for different modules', () => {
      type Module1Data = { field1: string };
      type Module2Data = { field2: number };

      const input1: Input<Module1Data> = {
        moduleId: 'module-1',
        data: { field1: 'value' },
      };

      const input2: Input<Module2Data> = {
        moduleId: 'module-2',
        data: { field2: 42 },
      };

      expect(input1.data.field1).toBe('value');
      expect(input2.data.field2).toBe(42);
    });
  });
});

describe('isInput type guard', () => {
  it('should return true for valid Input objects', () => {
    const validInput = {
      moduleId: 'test-module',
      data: { name: 'test' },
    };

    expect(isInput(validInput)).toBe(true);
  });

  it('should return false for objects without moduleId', () => {
    const invalidInput = {
      data: { name: 'test' },
    };

    expect(isInput(invalidInput)).toBe(false);
  });

  it('should return false for objects without data', () => {
    const invalidInput = {
      moduleId: 'test-module',
    };

    expect(isInput(invalidInput)).toBe(false);
  });

  it('should return false for null', () => {
    expect(isInput(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isInput(undefined)).toBe(false);
  });

  it('should return false for primitive types', () => {
    expect(isInput('string')).toBe(false);
    expect(isInput(123)).toBe(false);
    expect(isInput(true)).toBe(false);
  });
});

