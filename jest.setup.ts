// Global test setup for Jest
// This file is used to configure global test environment

// Mock ReadableStream for Node.js environment (required for fetch API)
if (typeof ReadableStream === 'undefined') {
  global.ReadableStream = class ReadableStream {
    constructor() {
      // Mock implementation
    }
  } as unknown as typeof ReadableStream;
}

