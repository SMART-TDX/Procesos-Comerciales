'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const handler = require('../api/jorge');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 4177);
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.pdf': 'application/pdf', '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };

function apiResponse(nodeResponse) {
  nodeResponse.status = function (code) { this.statusCode = code; return this; };
  nodeResponse.json = function (value) { this.end(JSON.stringify(value)); };
  return nodeResponse;
}

http.createServer((request, response) => {
  const requestUrl = new URL(request.url, `http://localhost:${port}`);
  if (requestUrl.pathname === '/api/jorge') {
    let body = '';
    request.on('data', (chunk) => { body += chunk; if (body.length > 100000) request.destroy(); });
    request.on('end', () => {
      try { request.body = body ? JSON.parse(body) : {}; } catch (error) { request.body = {}; }
      handler(request, apiResponse(response));
    });
    return;
  }
  const relative = requestUrl.pathname === '/' ? 'asistente-tmk.html' : decodeURIComponent(requestUrl.pathname.replace(/^\//, ''));
  const filePath = path.resolve(root, relative);
  if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    response.statusCode = 404; response.end('Not found'); return;
  }
  response.setHeader('Content-Type', mime[path.extname(filePath).toLowerCase()] || 'application/octet-stream');
  fs.createReadStream(filePath).pipe(response);
}).listen(port, '127.0.0.1', () => console.log(`Jorge test server http://127.0.0.1:${port}`));
