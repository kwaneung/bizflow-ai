import { NextRequest } from 'next/server';
import type { NextResponse } from 'next/server';

/**
 * Test helpers for Next.js API route testing.
 * 
 * Use these helpers to create mock requests and test API route handlers.
 */

/**
 * Create a mock NextRequest for testing.
 */
export function createMockRequest(
  options: {
    method?: string;
    url?: string;
    body?: unknown;
    headers?: Record<string, string>;
    searchParams?: Record<string, string>;
  } = {}
): NextRequest {
  const {
    method = 'GET',
    url = 'http://localhost:3000/api/test',
    body,
    headers = {},
    searchParams = {},
  } = options;

  // Build URL with search params
  const urlObj = new URL(url);
  Object.entries(searchParams).forEach(([key, value]) => {
    urlObj.searchParams.set(key, value);
  });

  const requestInit: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    requestInit.body = JSON.stringify(body);
  }

  return new NextRequest(urlObj.toString(), requestInit);
}

/**
 * Create a mock NextRequest with JSON body for POST/PUT requests.
 */
export function createMockJsonRequest(
  body: unknown,
  options: {
    method?: string;
    url?: string;
    headers?: Record<string, string>;
  } = {}
): NextRequest {
  return createMockRequest({
    method: options.method || 'POST',
    url: options.url || 'http://localhost:3000/api/test',
    body,
    headers: options.headers,
  });
}

/**
 * Extract JSON body from NextResponse for testing.
 */
export async function getResponseJson(
  response: NextResponse
): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Assert that a response has the expected status code.
 */
export function expectStatus(
  response: NextResponse,
  expectedStatus: number
): void {
  expect(response.status).toBe(expectedStatus);
}

/**
 * Assert that a response has the expected JSON body.
 */
export async function expectJsonBody(
  response: NextResponse,
  expectedBody: unknown
): Promise<void> {
  const body = await getResponseJson(response);
  expect(body).toEqual(expectedBody);
}

/**
 * Assert that a response has an error structure.
 */
export async function expectErrorResponse(
  response: NextResponse,
  expectedStatus: number,
  expectedErrorCode?: string
): Promise<void> {
  expectStatus(response, expectedStatus);
  const body = await getResponseJson(response);
  expect(body).toHaveProperty('error');
  if (expectedErrorCode) {
    expect((body as { error: { code?: string } }).error?.code).toBe(
      expectedErrorCode
    );
  }
}

/**
 * Assert that a response has a success structure.
 */
export async function expectSuccessResponse(
  response: NextResponse,
  expectedStatus: number = 200
): Promise<void> {
  expectStatus(response, expectedStatus);
  const body = await getResponseJson(response);
  expect(body).toHaveProperty('success');
  expect((body as { success?: boolean }).success).toBe(true);
}

/**
 * Helper to test API route handlers.
 * 
 * @example
 * ```ts
 * const request = createMockJsonRequest({ productData: {...} });
 * const response = await POST(request);
 * await expectSuccessResponse(response);
 * ```
 */
export async function testApiRoute(
  handler: (request: NextRequest) => Promise<NextResponse>,
  request: NextRequest
): Promise<NextResponse> {
  return handler(request);
}

/**
 * Create mock route params for dynamic routes.
 */
export function createMockParams(
  params: Record<string, string>
): Promise<Record<string, string>> {
  return Promise.resolve(params);
}

