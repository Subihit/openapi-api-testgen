import { runCli } from './cli/index.js'
import { parseOpenApiSpec } from './parser/openapiParser.js'

const specPath = process.argv[2]

if (!specPath) {
  console.error('❌ Please provide path to OpenAPI spec')
  console.error('Usage: npx ts-node src/index.ts <openapi.yaml>')
  process.exit(1)
}

// const api = await parseOpenApiSpec(specPath)

// console.log('✅ OpenAPI spec parsed successfully')
// console.log(`Title: ${api.info.title}`)
// console.log(`Version: ${api.info.version}`)

runCli(specPath).catch((err) => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
