import { bundle, browserslistToTargets } from 'lightningcss'
import browserslist from 'browserslist'
import { writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const dir = dirname(fileURLToPath(import.meta.url))
const targets = browserslistToTargets(browserslist())

const { code } = bundle({
  filename: join(dir, 'src/style.css'),
  minify: true,
  targets,
})

mkdirSync(join(dir, 'dist'), { recursive: true })
writeFileSync(join(dir, 'dist/style.css'), code)
console.log(`dist/style.css — ${code.length} bytes`)
