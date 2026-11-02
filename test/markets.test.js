import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { catalog } from '../public/catalog.js';
import { filterAssets } from '../public/markets.js';
test('directory filters US, Europe, and crypto without overlap', () => {
  assert.equal(filterAssets('stocks', '', 'US').length, 20);
  assert.equal(filterAssets('stocks', '', 'Europe').length, 25);
  assert.equal(filterAssets('crypto').length, 6);
  assert.equal(filterAssets('stocks', '  SAP  ')[0][1].symbol, 'XETR:SAP');
  assert.equal(filterAssets('stocks', '', 'UK').length, 5);
  assert.equal(filterAssets('stocks', 'does-not-exist').length, 0);
});
test('every catalog asset appears in the dashboard and all page links exist', async () => {
  const html = await readFile('public/index.html', 'utf8');
  for (const key of Object.keys(catalog)) assert.ok(html.includes(`value="${key}"`), key);
  for (const page of ['index.html', 'stocks.html', 'crypto.html', 'methodology.html', 'signals.html', 'news.html', 'watchlist.html']) {
    const content = await readFile('public/' + page, 'utf8');
    for (const link of ['stocks.html', 'crypto.html', 'methodology.html', 'signals.html', 'news.html', 'watchlist.html']) assert.ok(content.includes(`href="./${link}"`));
  }
});
