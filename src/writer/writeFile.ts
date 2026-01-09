import fs from 'fs'
import path from 'path'

export function writeSingleFile(
  outDir: string,
  fileName: string,
  content: string,
  overwrite = false
) {
  fs.mkdirSync(outDir, { recursive: true })

  const target = path.join(outDir, fileName)

  if (fs.existsSync(target) && !overwrite) {
    console.warn(`⚠️ File already exists: ${fileName}`)
    console.warn(`   Use --overwrite to replace it`)
    return
  }

  fs.writeFileSync(target, content, 'utf-8')
  console.log(`✅ Wrote ${fileName}`)
}
