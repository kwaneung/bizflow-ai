import { Output } from '../output';
import { isOutput } from '../type-guards';

describe('Output<T>', () => {
  describe('interface structure', () => {
    it('should have required moduleId, data, and format fields', () => {
      const output: Output<{ result: string }> = {
        moduleId: 'test-module',
        data: { result: 'test result' },
        format: 'json',
      };

      expect(output.moduleId).toBe('test-module');
      expect(output.data).toEqual({ result: 'test result' });
      expect(output.format).toBe('json');
    });

    it('should support all format types', () => {
      const formats: Array<'json' | 'text' | 'markdown' | 'html'> = [
        'json',
        'text',
        'markdown',
        'html',
      ];

      formats.forEach((format) => {
        const output: Output<{ result: string }> = {
          moduleId: 'test-module',
          data: { result: 'test' },
          format,
        };

        expect(output.format).toBe(format);
      });
    });

    it('should have optional metadata field', () => {
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

      expect(outputWithMetadata.metadata?.requestId).toBe('req-123');
      expect(outputWithMetadata.metadata?.processingTime).toBe(1500);
      expect(outputWithMetadata.metadata?.model).toBe('gpt-4');
    });

    it('should work without metadata', () => {
      const outputWithoutMetadata: Output<{ result: string }> = {
        moduleId: 'test-module',
        data: { result: 'test' },
        format: 'json',
      };

      expect(outputWithoutMetadata.metadata).toBeUndefined();
    });
  });

  describe('type safety', () => {
    it('should enforce type safety for data field', () => {
      type TestData = { title: string; content: string };
      const output: Output<TestData> = {
        moduleId: 'test-module',
        data: { title: 'Title', content: 'Content' },
        format: 'markdown',
      };

      expect(output.data.title).toBe('Title');
      expect(output.data.content).toBe('Content');
    });

    it('should allow different data types for different modules', () => {
      type Module1Data = { field1: string };
      type Module2Data = { field2: number };

      const output1: Output<Module1Data> = {
        moduleId: 'module-1',
        data: { field1: 'value' },
        format: 'json',
      };

      const output2: Output<Module2Data> = {
        moduleId: 'module-2',
        data: { field2: 42 },
        format: 'text',
      };

      expect(output1.data.field1).toBe('value');
      expect(output2.data.field2).toBe(42);
    });
  });
});

describe('isOutput type guard', () => {
  it('should return true for valid Output objects', () => {
    const validOutput = {
      moduleId: 'test-module',
      data: { result: 'test' },
      format: 'json' as const,
    };

    expect(isOutput(validOutput)).toBe(true);
  });

  it('should return false for objects without moduleId', () => {
    const invalidOutput = {
      data: { result: 'test' },
      format: 'json' as const,
    };

    expect(isOutput(invalidOutput)).toBe(false);
  });

  it('should return false for objects without data', () => {
    const invalidOutput = {
      moduleId: 'test-module',
      format: 'json' as const,
    };

    expect(isOutput(invalidOutput)).toBe(false);
  });

  it('should return false for objects without format', () => {
    const invalidOutput = {
      moduleId: 'test-module',
      data: { result: 'test' },
    };

    expect(isOutput(invalidOutput)).toBe(false);
  });

  it('should return false for invalid format values', () => {
    const invalidOutput = {
      moduleId: 'test-module',
      data: { result: 'test' },
      format: 'invalid-format' as any,
    };

    expect(isOutput(invalidOutput)).toBe(false);
  });

  it('should return false for null', () => {
    expect(isOutput(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isOutput(undefined)).toBe(false);
  });

  it('should return false for primitive types', () => {
    expect(isOutput('string')).toBe(false);
    expect(isOutput(123)).toBe(false);
    expect(isOutput(true)).toBe(false);
  });
});

