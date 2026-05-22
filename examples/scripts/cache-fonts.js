// @ts-check
import { writeFileSync, mkdirSync, rmSync } from 'fs'

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap'

rmSync('examples/vendor/fonts', { recursive: true, force: true })
mkdirSync('examples/vendor/fonts')

const css = await fetch(FONTS_URL, { headers: { 'User-Agent': UA } }).then(r => r.text())

const urls = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g)].map(m => m[1])

await Promise.all(
  urls.map(async url => {
    const buf = await fetch(url).then(r => r.arrayBuffer())
    writeFileSync(`examples/vendor/fonts/${url.split('/').pop()}`, Buffer.from(buf))
  }),
)

writeFileSync(
  'examples/vendor/montserrat.css',
  css.replace(/url\(https:\/\/fonts\.gstatic\.com\/[^)]*\/([^/)]+)\)/g, 'url(fonts/$1)'),
)
