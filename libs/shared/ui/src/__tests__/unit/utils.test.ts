import { cn } from '../../lib/utils';

describe('cn utility', () => {
  describe('class merging', () => {
    it('should merge multiple class names', () => {
      const result = cn('foo', 'bar', 'baz');
      expect(result).toBe('foo bar baz');
    });

    it('should handle conditional classes', () => {
      const result = cn('foo', false && 'bar', 'baz');
      expect(result).toBe('foo baz');
    });

    it('should handle undefined and null values', () => {
      const result = cn('foo', undefined, null, 'bar');
      expect(result).toBe('foo bar');
    });

    it('should handle empty strings', () => {
      const result = cn('foo', '', 'bar');
      expect(result).toBe('foo bar');
    });
  });

  describe('tailwind class merging', () => {
    it('should merge conflicting tailwind classes correctly', () => {
      const result = cn('px-2 py-1', 'px-4');
      expect(result).toBe('py-1 px-4');
    });

    it('should handle hover and focus variants', () => {
      const result = cn('hover:bg-blue-500', 'hover:bg-red-500');
      expect(result).toBe('hover:bg-red-500');
    });

    it('should preserve non-conflicting classes', () => {
      const result = cn('text-sm font-bold', 'text-lg');
      expect(result).toBe('font-bold text-lg');
    });
  });

  describe('object and array inputs', () => {
    it('should handle object inputs', () => {
      const result = cn({
        foo: true,
        bar: false,
        baz: true,
      });
      expect(result).toBe('foo baz');
    });

    it('should handle array inputs', () => {
      const result = cn(['foo', 'bar'], 'baz');
      expect(result).toBe('foo bar baz');
    });

    it('should handle mixed inputs', () => {
      const result = cn('base', { active: true, disabled: false }, ['foo', 'bar']);
      expect(result).toBe('base active foo bar');
    });
  });

  describe('edge cases', () => {
    it('should handle no arguments', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('should handle only falsy values', () => {
      const result = cn(false, null, undefined, '');
      expect(result).toBe('');
    });

    it('should handle complex tailwind utilities', () => {
      const result = cn(
        'rounded-md border border-input bg-background',
        'focus-visible:outline-none focus-visible:ring-2'
      );
      expect(result).toBe(
        'rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-2'
      );
    });
  });
});
