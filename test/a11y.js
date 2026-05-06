import { createServer } from 'http';
import { createReadStream, existsSync } from 'fs';
import { readdir } from 'fs/promises';
import { join, extname } from 'path';
import pa11y from 'pa11y';

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
};

function startServer(root) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const filePath = join(root, decodeURIComponent(req.url.split('?')[0]));
      if (!existsSync(filePath)) {
        res.writeHead(404);
        res.end();
        return;
      }
      res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream' });
      createReadStream(filePath).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

const root = new URL('..', import.meta.url).pathname;
const server = await startServer(root);
const { port } = server.address();

const files = await readdir(join(root, 'examples'), { recursive: true });
const htmlFiles = files.filter((f) => f.endsWith('.html'));

let totalErrors = 0;

for (const file of htmlFiles) {
  const url = `http://127.0.0.1:${port}/examples/${file.replaceAll('\\', '/')}`;
  const { issues } = await pa11y(url, { runners: ['axe'], standard: 'WCAG2AA' });
  const errors = issues.filter((i) => i.type === 'error');

  if (errors.length) {
    console.log(`FAIL examples/${file} (${errors.length})`);
    for (const { code, message, selector } of errors) {
      console.log(`  [${code}] ${message}`);
      console.log(`  ${selector}`);
    }
    totalErrors += errors.length;
  } else {
    console.log(`PASS examples/${file}`);
  }
}

server.close();

if (totalErrors > 0) {
  console.error(`\n${totalErrors} violation(s) found.`);
  process.exit(1);
}
