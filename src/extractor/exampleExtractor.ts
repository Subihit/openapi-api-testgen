import { OpenAPIV3 } from 'openapi-types'
import { NormalizedOperation } from '../types/normalizedSpec.js'
import { ApiTestCase } from '../types/apiTestCase.js'

export function extractExampleTestCases(
  api: OpenAPIV3.Document,
  operations: NormalizedOperation[]
): ApiTestCase[] {
  const testCases: ApiTestCase[] = []

  for (const op of operations) {
    const casesForOp = extractForOperation(api, op)
    testCases.push(...casesForOp)
  }

  function extractForOperation(
  api: OpenAPIV3.Document,
  op: NormalizedOperation
): ApiTestCase[] {
  const pathItem = api.paths?.[op.path]
  if (!pathItem) return []

  const operation =
    pathItem[op.method.toLowerCase() as keyof OpenAPIV3.PathItemObject]

  if (!operation || !isOperationObject(operation)) return []

  const requestExamples = extractRequestBodyExamples(operation)
  const responseExamples = extractResponseExamples(operation)

  // v1 rule: if no request examples AND no response examples → skip
  if (requestExamples.length === 0 && responseExamples.length === 0) {
    return []
  }

  const response = selectPrimaryResponse(responseExamples)
  if (!response) return []

  return requestExamples.map((req) =>
    buildTestCase(op, req, response)
  )
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

interface NamedExample {
  name: string
  value: unknown
}

function extractRequestBodyExamples(
  operation: OpenAPIV3.OperationObject
): NamedExample[] {
  const content = operation.requestBody &&
    'content' in operation.requestBody
      ? operation.requestBody.content
      : undefined

  const json = content?.['application/json']
  if (!json) return []

  if (json.examples) {
    return Object.entries(json.examples).map(([name, ex]) => ({
      name,
      value: (ex as OpenAPIV3.ExampleObject).value
    }))
  }

  if (json.example) {
    return [{ name: 'example', value: json.example }]
  }

  return []
}

interface ResponseExample {
  status: number
  name: string
  value?: unknown
}

function extractResponseExamples(
  operation: OpenAPIV3.OperationObject
): ResponseExample[] {
  const results: ResponseExample[] = []

  for (const [status, response] of Object.entries(
    operation.responses
  )) {
    if (status === 'default') continue
    if (!('content' in response)) continue

    const json = response.content?.['application/json']
    if (!json) {
      results.push({
        status: Number(status),
        name: 'no-body'
      })
      continue
    }

    if (json.examples) {
      for (const [name, ex] of Object.entries(json.examples)) {
        results.push({
          status: Number(status),
          name,
          value: (ex as OpenAPIV3.ExampleObject).value
        })
      }
    } else if (json.example) {
      results.push({
        status: Number(status),
        name: 'example',
        value: json.example
      })
    } else {
      results.push({
        status: Number(status),
        name: 'no-body'
      })
    }
  }

  return results
}

function selectPrimaryResponse(
  responses: ResponseExample[]
): ResponseExample | undefined {
  if (responses.length === 0) return undefined

  const sorted = [...responses].sort((a, b) => a.status - b.status)

  const success = sorted.find(
    (r) => r.status >= 200 && r.status < 300
  )

  return success ?? sorted[0]
}

function buildTestCase(
  op: NormalizedOperation,
  request: NamedExample,
  response: ResponseExample
): ApiTestCase {
  const id = `${op.method.toLowerCase()}-${sanitizePath(
    op.path
  )}-${request.name}-${response.status}`

  return {
    id,
    description: `${op.method} ${op.path} – ${request.name} (${response.status})`,
    origin: 'example',

    request: {
      method: op.method,
      path: op.path,
      body: request.value
    },

    expected: {
      status: response.status,
      body: response.value
    }
  }
}

function sanitizePath(path: string): string {
  return path
    .replace(/[{}]/g, '')
    .replace(/\//g, '-')
    .replace(/^-/, '')
}


  return testCases
}
