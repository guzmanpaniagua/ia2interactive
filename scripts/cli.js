import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const command = args[0];
const rootDir = process.cwd();

async function main() {
  const { build } = await import(path.join(__dirname, '..', 'packages', 'core', 'dist', 'build.js'));

  if (command === 'build' && args[1]) {
    const courseDir = path.resolve(args[1]);
    const outputDir = args[2] ? path.resolve(args[2]) : path.join(rootDir, 'dist');
    const result = build({ inputDir: courseDir, outputDir });
    if (result.errors.length > 0) {
      console.error('Errors:', result.errors);
      process.exit(1);
    }
    console.log(`✅ Built ${result.pages.length} pages to ${result.outputDir}`);
  } else if (command === 'serve' && args[1]) {
    const courseDir = path.resolve(args[1]);
    const outputDir = args[2] ? path.resolve(args[2]) : path.join(rootDir, 'dist');
    const result = build({ inputDir: courseDir, outputDir });
    if (result.errors.length > 0) {
      console.error('Errors:', result.errors);
      process.exit(1);
    }
    console.log(`✅ Built ${result.pages.length} pages to ${result.outputDir}`);

    const port = parseInt(args[3] || '3000', 10);
    const { createServer } = await import('http');
    const { readFileSync, existsSync } = await import('fs');
    const mimeTypes = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };

    createServer((req, res) => {
      let filePath = path.join(outputDir, req.url === '/' ? 'index.html' : req.url);
      if (!existsSync(filePath)) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(filePath);
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(readFileSync(filePath));
    }).listen(port, () => {
      console.log(`🌐 Serving at http://localhost:${port}`);
    });
  } else {
    console.log('Uso: node scripts/cli.js build <carpeta-del-curso> [output-dir]');
    console.log('     node scripts/cli.js serve <carpeta-del-curso> [output-dir] [port]');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
