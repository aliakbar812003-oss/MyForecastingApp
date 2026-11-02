import http from 'node:http';
import { readFile } from 'node:fs/promises';
const routes = { '/': ['index.html', 'text/html'], '/app.js': ['app.js', 'text/javascript'], '/style.css': ['style.css', 'text/css'] };
for (const file of ['stocks.html', 'crypto.html', 'methodology.html', 'markets.js', 'catalog.js', 'signals.html', 'news.html', 'watchlist.html', 'widgets.js', 'watchlist.js', 'insights.js', 'dashboard.js', 'dashboard.css']) routes['/' + file] = [file, file.endsWith('.html') ? 'text/html' : file.endsWith('.css') ? 'text/css' : 'text/javascript'];
http.createServer(async (req, res) => {
  const route = routes[new URL(req.url, 'http://localhost').pathname];
  if (!route) { res.writeHead(404); res.end('Not found'); return; }
  try { res.writeHead(200, { 'Content-Type': route[1] + '; charset=utf-8', 'X-Content-Type-Options': 'nosniff' }); res.end(await readFile(new URL('./public/' + route[0], import.meta.url))); }
  catch { res.writeHead(500); res.end('Unable to load application'); }
}).listen(Number(process.env.PORT || 3000), '0.0.0.0', () => console.log('Market Forecast running on port ' + (process.env.PORT || 3000)));
