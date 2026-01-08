import { HttpMethod } from './normalizedSpec.js'

export interface ApiTestCase {
  /**
   * Stable unique identifier
   * Used for snapshots, filenames, diffing
   */
  id: string

  /**
   * Human-readable description
   */
  description: string


  origin: 'example' | 'schema'

  /**
   * HTTP request details
   */
  request: ApiRequest

  /**
   * Expected outcome
   */
  expected: ApiExpectation
}

export interface ApiRequest {
  method: HttpMethod
  path: string

  /**
   * Path parameters: /users/{id}
   */
  pathParams?: Record<string, string | number>

  /**
   * Query parameters
   */
  queryParams?: Record<string, string | number | boolean>

  /**
   * Headers (excluding auth for now)
   */
  headers?: Record<string, string>

  /**
   * Request body (POST / PUT / PATCH)
   * Sourced from OpenAPI request body schema or examples
   */
  body?: unknown
}

export interface ApiExpectation {
  /**
   * Expected HTTP status code
   */
  status: number

  /**
   * Expected response body
   * Sourced from OpenAPI response examples
   */
  body?: unknown
}

enum TestCaseOrigin {
  EXAMPLE = 'example',
  SCHEMA = 'schema'
}


