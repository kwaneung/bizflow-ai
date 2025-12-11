import type { Input } from './input';
import type { Output } from './output';

/**
 * Type guard to check if a value is a valid Input object.
 *
 * @param value - The value to check
 * @returns True if the value is a valid Input object
 *
 * @example
 * ```typescript
 * const value: unknown = {
 *   moduleId: 'ecommerce',
 *   data: { productName: 'Product' },
 * };
 *
 * if (isInput(value)) {
 *   // TypeScript narrows type to Input<unknown>
 *   console.log(value.moduleId);
 * }
 * ```
 */
export function isInput<T = unknown>(value: unknown): value is Input<T> {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value !== 'object') {
    return false;
  }

  const obj = value as Record<string, unknown>;

  // Check required fields
  if (typeof obj.moduleId !== 'string') {
    return false;
  }

  if (obj.data === null || obj.data === undefined) {
    return false;
  }

  // Check optional metadata structure if present
  if (obj.metadata !== undefined) {
    if (typeof obj.metadata !== 'object' || obj.metadata === null) {
      return false;
    }

    const metadata = obj.metadata as Record<string, unknown>;

    // Validate optional metadata fields if present
    if (metadata.userId !== undefined && typeof metadata.userId !== 'string') {
      return false;
    }

    if (
      metadata.sessionId !== undefined &&
      typeof metadata.sessionId !== 'string'
    ) {
      return false;
    }

    if (
      metadata.timestamp !== undefined &&
      !(metadata.timestamp instanceof Date)
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Type guard to check if a value is a valid Output object.
 *
 * @param value - The value to check
 * @returns True if the value is a valid Output object
 *
 * @example
 * ```typescript
 * const value: unknown = {
 *   moduleId: 'ecommerce',
 *   data: { result: 'Result' },
 *   format: 'json',
 * };
 *
 * if (isOutput(value)) {
 *   // TypeScript narrows type to Output<unknown>
 *   console.log(value.format);
 * }
 * ```
 */
export function isOutput<T = unknown>(value: unknown): value is Output<T> {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value !== 'object') {
    return false;
  }

  const obj = value as Record<string, unknown>;

  // Check required fields
  if (typeof obj.moduleId !== 'string') {
    return false;
  }

  if (obj.data === null || obj.data === undefined) {
    return false;
  }

  // Check format field
  if (
    obj.format !== 'json' &&
    obj.format !== 'text' &&
    obj.format !== 'markdown' &&
    obj.format !== 'html'
  ) {
    return false;
  }

  // Check optional metadata structure if present
  if (obj.metadata !== undefined) {
    if (typeof obj.metadata !== 'object' || obj.metadata === null) {
      return false;
    }

    const metadata = obj.metadata as Record<string, unknown>;

    // Validate required metadata fields if present
    if (
      metadata.requestId !== undefined &&
      typeof metadata.requestId !== 'string'
    ) {
      return false;
    }

    if (
      metadata.processingTime !== undefined &&
      typeof metadata.processingTime !== 'number'
    ) {
      return false;
    }

    if (metadata.model !== undefined && typeof metadata.model !== 'string') {
      return false;
    }
  }

  return true;
}
