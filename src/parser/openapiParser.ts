import SwaggerParser from '@apidevtools/swagger-parser'
import { OpenAPIV3 } from 'openapi-types'
import { NormalizedSpec } from '../types/normalizedSpec.js'
import { NormalizedOperation } from '../types/normalizedSpec.js'

export function normalizeOpenApi(
  api: OpenAPIV3.Document
): NormalizedSpec {
  const operations: NormalizedSpec['operations'] = []

  for (const path in api.paths) {
    const pathItem = api.paths[path]

    if (!pathItem) continue

    const methods = Object.keys(pathItem) as Array<
      keyof OpenAPIV3.PathItemObject
    >

    for (const method of methods) {
      if (method === 'parameters') continue

      const operation = pathItem[method] as OpenAPIV3.OperationObject | undefined

      if (!operation) continue

      const normalizedOp: NormalizedOperation = {
        method: method.toUpperCase(),
        path
}

if (operation.operationId !== undefined) {
  normalizedOp.operationId = operation.operationId
}

operations.push(normalizedOp)


    }
  }

  return { operations }
}


export async function parseOpenApiSpec(
  specPath: string
): Promise<OpenAPIV3.Document> {
  try {
    const api = await SwaggerParser.dereference(specPath)

    // Optional but recommended
    await SwaggerParser.validate(api)

    return api as OpenAPIV3.Document
  } catch (error: any) {
    throw new Error(`Failed to parse OpenAPI spec: ${error.message}`)
  }
}
