import { bundleAsync, browserslistToTargets } from 'lightningcss'
import browserslist from 'browserslist'
import { writeFileSync, mkdirSync, readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'

const dir = dirname(fileURLToPath(import.meta.url))
const targets = browserslistToTargets(browserslist())

const { code } = await bundleAsync({
  filename: join(dir, 'src/style.css'),
  minify: true,
  targets,
  drafts: { customMedia: true },
  resolver: {
    resolve(specifier, from) {
      if (specifier.startsWith('http://') || specifier.startsWith('https://')) {
        return specifier
      }
      return resolve(dirname(from), specifier)
    },
    async read(filePath) {
      if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
        const response = await fetch(filePath)
        return response.text()
      }
      return readFileSync(filePath, 'utf8')
    },
  },
})

mkdirSync(join(dir, 'dist'), { recursive: true })
writeFileSync(join(dir, 'dist/style.css'), code)
console.log(`dist/style.css — ${code.length} bytes`)
