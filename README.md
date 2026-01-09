# openapi-api-testgen

Generate deterministic, editable Supertest API test boilerplate from OpenAPI specifications.

---

## Problem

Teams often already have OpenAPI specifications, but still end up:

- Writing repetitive API tests manually
- Duplicating request and response examples from the spec
- Struggling to keep tests in sync with API contracts

Existing tools typically:
- Execute tests at runtime (contract testing, fuzzing), or
- Focus on negative and security testing

They do not generate **owned, editable API test code** that teams can commit and extend.

---

## What this tool does

`openapi-api-testgen` bridges that gap.

It:

- Parses an OpenAPI v3 specification
- Extracts example-based API test cases
- Generates Supertest-based API tests
- Produces deterministic, human-editable output
- Writes tests to disk (no runtime dependency on this tool)

The generated tests are intended to be a **starting point**, not a black box.

---

## What it does NOT do

This is intentional:

- No end-to-end or user-journey testing
- No fuzzing or security testing
- No test execution
- No AI-generated test logic
- No runtime contract validation

This tool focuses purely on **test generation**, not orchestration.

---

## Installation

```bash
npm install -D openapi-api-testgen
```

## Usage

```bash
openapi-testgen <openapi-spec> --out <output-dir>
```

## Example

```bash
openapi-testgen api.yaml --out tests/api
```

## Options

|Option           |     	Description                   |
|-----------------|---------------------------------------|
|--out <dir>	  |   Output directory for generated tests|
|--overwrite	  |  Overwrite existing generated file.   |


## Output

The tool generates a single TypeScript test file:

```bash
tests/api/
└── api.generated.test.ts
```

Each API endpoint becomes a describe() block, with one or more it() tests derived from OpenAPI examples.

## Example output

```markdown
```typescript
describe('POST /users', () => {
  it('POST /users – validUser (201)', async () => {
    await request(app)
      .post('/users')
      .send({ email: 'test@test.com', age: 30 })
      .expect(201)
  })
})
```

The generated file is:

- Valid Supertest code
- Intended to be edited and extended
- Safe to commit to your repository

## Design principles

Deterministic by default
Same OpenAPI input always produces the same output.

Code generation, not execution
You own the tests. This tool does not run them.

Separation of concerns
Parsing, extraction, rendering, and writing are cleanly separated.

Human-first output
Generated code is meant to be read, reviewed, and modified.

## Roadmap

- Schema-based fallback when examples are missing
- Richer documentation comments in generated tests
- Optional coverage and analysis reporting

## Philosophy

OpenAPI already describes your API.
This tool helps turn that description into test code you can own.

## License

MIT
