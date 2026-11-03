import test from 'node:test';
import assert from 'node:assert/strict';
import { sidebarAssets } from '../public/dashboard.js';
test('workspace filters support exchange search and saved assets', () => {
  assert.equal(sidebarAssets('', 'all').length,87);
  assert.equal(sidebarAssets('', 'Europe').length,25);
  assert.equal(sidebarAssets('', 'US').length,20);
  assert.equal(sidebarAssets('', 'Crypto').length,6);
  assert.deepEqual(sidebarAssets('', 'saved', ['SAP','BTC']).map(([ticker])=>ticker), ['SAP','BTC']);
  assert.equal(sidebarAssets(' coinbase ', 'all').length,6);
  assert.equal(sidebarAssets('Bitcoin', 'saved', ['SAP']).length,0);
});

test('workspace filters include funds, commodities, and forex with independent watchlists', () => {
  assert.equal(sidebarAssets('', 'etf').length,20);
  assert.equal(sidebarAssets('', 'commodity').length,10);
  assert.equal(sidebarAssets('', 'forex').length,6);
  assert.equal(sidebarAssets('bond', 'etf').length,4);
  assert.deepEqual(sidebarAssets('', 'saved', ['SPY','GOLD','EURUSD']).map(([ticker])=>ticker),['SPY','GOLD','EURUSD']);
});
