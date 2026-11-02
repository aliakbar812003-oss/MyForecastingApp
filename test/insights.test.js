import test from 'node:test';
import assert from 'node:assert/strict';
import { newsConfig, signalConfig } from '../public/insights.js';
import { readWatchlist, toggleWatchlist } from '../public/watchlist.js';
test('news switches between stock, crypto, and exact exchange symbol', () => {
  assert.equal(newsConfig('stocks').market, 'stock');
  assert.equal(newsConfig('crypto').market, 'crypto');
  assert.equal(newsConfig('asset', 'SAP').symbol, 'XETR:SAP');
  assert.equal(newsConfig('asset', 'BTC').feedMode, 'symbol');
  assert.throws(() => newsConfig('asset', 'UNKNOWN'));
  assert.throws(() => newsConfig('invalid'));
});
test('signals use selected exchange and timeframe and reject invalid input', () => {
  assert.equal(signalConfig('SHEL', '1W').symbol, 'LSE:SHEL');
  assert.equal(signalConfig('BTC', '4h').interval, '4h');
  assert.throws(() => signalConfig('UNKNOWN', '1D'));
  assert.throws(() => signalConfig('BTC', 'invalid'));
});
test('watchlist persists additions, removes duplicates and handles corrupt storage', () => {
  let value = null;
  const storage = { getItem: () => value, setItem: (_key, data) => { value = data; } };
  assert.deepEqual(toggleWatchlist(storage, 'BTC'), ['BTC']);
  assert.deepEqual(toggleWatchlist(storage, 'SAP'), ['BTC','SAP']);
  assert.deepEqual(readWatchlist(storage), ['BTC','SAP']);
  assert.deepEqual(toggleWatchlist(storage, 'BTC'), ['SAP']);
  value = '["SAP","SAP","invalid",null]'; assert.deepEqual(readWatchlist(storage), ['SAP']);
  value = '{broken'; assert.deepEqual(readWatchlist(storage), []);
  assert.throws(() => toggleWatchlist(storage, 'INVALID'));
  assert.deepEqual(readWatchlist({ getItem() { throw Error('disabled'); } }), []);
});
