import { bundleAsync, browserslistToTargets } from 'lightningcss'
import browserslist from 'browserslist'
import { writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import { dirname, join, resolve } from 'path'

const dir = dirname(fileURLToPath(import.meta.url))
const targets = browserslistToTargets(browserslist())
const require = createRequire(import.meta.url)

const { code } = await bundleAsync({
  filename: join(dir, 'src/style.css'),
  minify: true,
  targets,
  drafts: { customMedia: true },
  resolver: {
    resolve(specifier, from) {
      if (!specifier.startsWith('.') && !specifier.startsWith('/')) {
        return require.resolve(specifier, { paths: [dirname(from)] })
      }
      return resolve(dirname(from), specifier)
    },
  },
})

mkdirSync(join(dir, 'dist'), { recursive: true })
writeFileSync(join(dir, 'dist/style.css'), code)
console.log(`dist/style.css — ${code.length} bytes`)
