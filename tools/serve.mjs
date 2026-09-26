// Tiny zero-dependency static server for local play-testing.
//   npm run dev          → http://localhost:8080 plus a Wi-Fi address to open on your phone
//   PORT=3000 npm run dev
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8'};

export function startServer(port = Number(process.env.PORT) || 8080) {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(ROOT, p);
    if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404, {'Content-Type': 'text/plain'}).end('Not found'); return; }
      res.writeHead(200, {'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store'});
      res.end(data);
    });
  });
  return new Promise(resolve => server.listen(port, '0.0.0.0', () => resolve(server)));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const port = Number(process.env.PORT) || 8080;
  await startServer(port);
  const lan = Object.values(os.networkInterfaces()).flat().filter(i => i && i.family === 'IPv4' && !i.internal).map(i => i.address);
  console.log(`\n  Akhbaar Rush is running:\n    This computer:  http://localhost:${port}`);
  for (const ip of lan) console.log(`    Your phone:     http://${ip}:${port}   (same Wi-Fi)`);
  console.log('\n  Turn the phone sideways. Ctrl+C to stop.\n');
}
