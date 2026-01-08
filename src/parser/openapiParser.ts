import SwaggerParser from '@apidevtools/swagger-parser'
import { OpenAPIV3 } from 'openapi-types'
import {
  NormalizedSpec,
  NormalizedOperation,
  HttpMethod
} from '../types/normalizedSpec.js'

const HTTP_METHODS: HttpMethod[] = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS',
  'HEAD'
]

export async function parseOpenApiSpec(
  specPath: string
): Promise<OpenAPIV3.Document> {
  try {
    // Validate using the file path
    await SwaggerParser.validate(specPath)

    // Then dereference
    const api = await SwaggerParser.dereference(specPath)

    return api as OpenAPIV3.Document
  } catch (error: any) {
    throw new Error(`Failed to parse OpenAPI spec: ${error.message}`)
  }
}

function isOperationObject(
  value: unknown
): value is OpenAPIV3.OperationObject {
  return (
    typeof value === 'object' &&
    value !== null &&
    'responses' in value
  )
}

export function normalizeOpenApi(
  api: OpenAPIV3.Document
): NormalizedSpec {
  const operations: NormalizedOperation[] = []

  for (const path in api.paths) {
    const pathItem = api.paths[path]
    if (!pathItem) continue

    for (const method of HTTP_METHODS) {
      const candidate =
        pathItem[method.toLowerCase() as keyof OpenAPIV3.PathItemObject]

      if (!isOperationObject(candidate)) continue

      const normalizedOp: NormalizedOperation = {
        method,
        path
      }

      if (candidate.operationId) {
        normalizedOp.operationId = candidate.operationId
      }

      operations.push(normalizedOp)
    }
  }

  return { operations }
}
