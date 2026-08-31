// dev-server.js — mimics the Vercel rewrite:
//   real files/folders (pages/, data/, themes/) are served as-is;
//   anything else falls back to root index.html (so path-based
//   theme routing like /pink-romantic works, same as production).
//
// Usage:  node dev-server.js [port]
// Then visit e.g. http://demo.localhost:8000/pink-romantic

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PORT = process.argv[2] || 8000;

const MIME = {
  '.html': 'text/html', '.js': 'application/javascript', '.mjs': 'application/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2'
};

function send(res, status, filePath) {
  const ext = path.extname(filePath);
  res.writeHead(status, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
}

http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  let filePath = path.join(ROOT, urlPath);

  // Try exact file
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return send(res, 200, filePath);
  }

  // Try directory -> index.html (e.g. /pages -> pages/index.html)
  const indexInDir = path.join(filePath, 'index.html');
  if (fs.existsSync(indexInDir)) {
    return send(res, 200, indexInDir);
  }

  // Fallback: root index.html (SPA-style), for things like /pink-romantic
  const rootIndex = path.join(ROOT, 'index.html');
  console.log(`[fallback] ${req.url} -> /index.html`);
  return send(res, 200, rootIndex);
}).listen(PORT, () => {
  console.log(`Dev server running at http://localhost:${PORT}`);
  console.log(`Try: http://demo.localhost:${PORT}/pink-romantic`);
});
