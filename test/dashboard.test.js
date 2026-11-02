import test from 'node:test';
import assert from 'node:assert/strict';
import { sidebarAssets } from '../public/dashboard.js';
test('workspace filters support exchange search and saved assets', () => {
  assert.equal(sidebarAssets('', 'all').length,51);
  assert.equal(sidebarAssets('', 'Europe').length,25);
  assert.equal(sidebarAssets('', 'US').length,20);
  assert.equal(sidebarAssets('', 'Crypto').length,6);
  assert.deepEqual(sidebarAssets('', 'saved', ['SAP','BTC']).map(([ticker])=>ticker), ['SAP','BTC']);
  assert.equal(sidebarAssets(' coinbase ', 'all').length,6);
  assert.equal(sidebarAssets('Bitcoin', 'saved', ['SAP']).length,0);
});
