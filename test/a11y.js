import { createServer } from 'http'
import { createReadStream, existsSync } from 'fs'
import { readdir } from 'fs/promises'
import { join, extname } from 'path'
import pa11y from 'pa11y'
import puppeteer from 'puppeteer'

/** @type {Record<string, string>} */
const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
}

/** @param {string} root */
function startServer(root) {
  return new Promise(resolve => {
    const server = createServer((req, res) => {
      const filePath = join(root, decodeURIComponent(/** @type {string} */ (req.url).split('?')[0]))
      if (!existsSync(filePath)) {
        res.writeHead(404)
        res.end()
        return
      }
      res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream' })
      createReadStream(filePath).pipe(res)
    })
    server.listen(0, '127.0.0.1', () => resolve(server))
  })
}

const root = new URL('..', import.meta.url).pathname
const server = await startServer(root)
const { port } = server.address()

const files = await readdir(join(root, 'examples'), { recursive: true })
const htmlFiles = files.filter(f => f.endsWith('.html'))

const browser = await puppeteer.launch(process.env.CI ? { args: ['--no-sandbox', '--disable-setuid-sandbox'] } : {})
let totalErrors = 0

for (const file of htmlFiles) {
  const url = `http://127.0.0.1:${port}/examples/${file.replaceAll('\\', '/')}`

  for (const scheme of ['light', 'dark']) {
    const page = await browser.newPage()
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: scheme }])
    const { issues } = await pa11y(url, {
      runners: ['axe'],
      standard: 'WCAG2AA',
      browser: /** @type {any} */ (browser),
      page: /** @type {any} */ (page),
    })
    await page.close()

    const errors = issues.filter(i => i.type === 'error')
    const label = `examples/${file} (${scheme})`

    if (errors.length) {
      console.log(`FAIL ${label} (${errors.length})`)
      for (const { code, message, selector } of errors) {
        console.log(`  [${code}] ${message}`)
        console.log(`  ${selector}`)
      }
      totalErrors += errors.length
    } else {
      console.log(`PASS ${label}`)
    }
  }
}

await browser.close()
server.close()

if (totalErrors > 0) {
  console.error(`\n${totalErrors} violation(s) found.`)
  process.exit(1)
}
