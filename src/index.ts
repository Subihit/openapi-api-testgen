import { runCli } from './cli/index.js'
import { parseOpenApiSpec } from './parser/openapiParser.js'
import { normalizeOpenApi } from './parser/openapiParser.js'
import { extractExampleTestCases } from './extractor/exampleExtractor.js'
import { renderSupertest } from './renderer/supertestRenderer.js'
import { writeSingleFile } from './writer/writeFile.js'

export async function run(argv: string[]) {
  const specPath = argv[2]

  const outIndex = argv.indexOf('--out')
  const outDir = outIndex !== -1 ? argv[outIndex + 1] : undefined

  const overwrite = argv.includes('--overwrite')

  if (!specPath || !outDir) {
    printUsage()
    process.exit(1)
  }

  const api = await parseOpenApiSpec(specPath)
  const normalized = normalizeOpenApi(api)
  const tests = extractExampleTestCases(api, normalized.operations)

  const output = renderSupertest(tests)

  writeSingleFile(
    outDir,
    'api.generated.test.ts',
    output,
    overwrite
  )
}

function printUsage() {
  console.log(`
Usage:
  openapi-testgen <spec-path> --out <dir> [--overwrite]

Example:
  openapi-testgen api.yaml --out tests/api
`)
}