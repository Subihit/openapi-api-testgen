#!/usr/bin/env node

import { run } from './index.js'

run(process.argv).catch((err) => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
