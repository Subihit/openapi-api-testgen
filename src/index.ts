import { runCli } from './cli/index.js'
import { parseOpenApiSpec } from './parser/openapiParser.js'
import { normalizeOpenApi } from './parser/openapiParser.js'
import { extractExampleTestCases } from './extractor/exampleExtractor.js'
import { renderSupertest } from './renderer/supertestRenderer.js'

const specPath = process.argv[2]

if (!specPath) {
  console.error('❌ Please provide path to OpenAPI spec')
  console.error('Usage: npx ts-node src/index.ts <openapi.yaml>')
  process.exit(1)
}

// Test step 1
// const api = await parseOpenApiSpec(specPath)

// console.log('✅ OpenAPI spec parsed successfully')
// console.log(`Title: ${api.info.title}`)
// console.log(`Version: ${api.info.version}`)

// Test step 2

const api = await parseOpenApiSpec(specPath)
const normalized = normalizeOpenApi(api)
const tests = extractExampleTestCases(api, normalized.operations)
const output = renderSupertest(tests)

// console.log('\nDiscovered API operations:\n')

// for (const op of normalized.operations) {
//   const id = op.operationId ? ` (${op.operationId})` : ''
//   console.log(`${op.method} ${op.path}${id}`)
// }

// console.log(`\nTotal endpoints: ${normalized.operations.length}\n`)

// console.log(`\nGenerated ${tests.length} test cases:\n`)
// for (const t of tests) {
//   console.log(`- ${t.id}`)
// }


console.log(output)

runCli(specPath).catch((err) => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
