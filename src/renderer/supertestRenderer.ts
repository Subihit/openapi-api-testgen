import { ApiTestCase } from '../types/apiTestCase.js'

type NonEmptyArray<T> = [T, ...T[]]

export function renderSupertest(
  testCases: ApiTestCase[]
): string {
  if (testCases.length === 0) {
    return '// No test cases generated'
  }      

  const grouped = groupByEndpoint(testCases)

  const blocks = Object.values(grouped).map(
  (tests) => renderDescribeBlock(tests)
)

  return header() + '\n\n' + blocks.join('\n\n')
}

function header(): string {
  return `/**
 * AUTO-GENERATED FILE — DO NOT EDIT DIRECTLY
 * Generated from OpenAPI examples.
 * You are expected to modify and extend these tests.
 */

import request from 'supertest'
import { app } from '../app' // adjust as needed
`
}

function groupByEndpoint(
  tests: ApiTestCase[]
): Record<string, NonEmptyArray<ApiTestCase>> {
  return tests.reduce((acc, t) => {
    const key = `${t.request.method} ${t.request.path}`
    if (!acc[key]) {
      acc[key] = [t]
    } else {
      acc[key].push(t)
    }
    return acc
  }, {} as Record<string, NonEmptyArray<ApiTestCase>>)
}

function formatJson(value: unknown): string[] {
  return JSON.stringify(value, null, 2).split('\n')
}

function indentBlock(
  lines: string[],
  baseIndent: number
): string[] {
  const pad = ' '.repeat(baseIndent)
  return lines.map((l) => pad + l)
}

function renderDescribeBlock(
  tests: NonEmptyArray<ApiTestCase>
): string {

  const { method, path } = tests[0].request

  const its = tests.map(renderItBlock).join('\n\n')

  return `
describe('${method} ${path}', () => {
${indent(its, 2)}
})
`.trim()
}

function renderItBlock(test: ApiTestCase): string {
  const { request, expected, description, origin } = test

  const lines: string[] = []

  lines.push(`it('${description}', async () => {`)
  lines.push(`  await request(app)`)

  lines.push(
    `    .${request.method.toLowerCase()}('${request.path}')`
  )

  if (request.body !== undefined) {
  lines.push(`    .send(`)

  const jsonLines = formatJson(request.body)
  lines.push(...indentBlock(jsonLines, 10))

  lines.push(`    )`)
 }


  lines.push(`    .expect(${expected.status})`)

if (expected.body !== undefined) {
  lines.push(`    .expect(res => {`)
  lines.push(`      expect(res.body).toMatchObject(`)

  const jsonLines = formatJson(expected.body)
  lines.push(...indentBlock(jsonLines, 12))

  lines.push(`      )`)
  lines.push(`    })`)
}


  lines.push(`})`)

  return [
    origin === 'schema'
      ? `// ⚠️ Generated from schema fallback`
      : `// Generated from OpenAPI example`,
    ...lines
  ]
    .map((l) => '  ' + l)
    .join('\n')
}

function indent(text: string, spaces: number): string {
  const pad = ' '.repeat(spaces)
  return text
    .split('\n')
    .map((line) => pad + line)
    .join('\n')
}

