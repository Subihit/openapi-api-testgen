import { parseOpenApiSpec } from '../parser/openapiParser.js'
import { normalizeOpenApi } from '../parser/openapiParser.js'

export async function runCli(specPath: string) {
  const api = await parseOpenApiSpec(specPath)
  const normalized = normalizeOpenApi(api)

  console.log('\nDiscovered API operations:\n')

  for (const op of normalized.operations) {
    console.log(`${op.method} ${op.path}`)
  }

  console.log(`\nTotal endpoints: ${normalized.operations.length}\n`)
}
