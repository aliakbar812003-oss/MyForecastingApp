import test from 'node:test';
import assert from 'node:assert/strict';

test('market widget uses selected exchange symbol and leaves sample forecasts separate', async () => {
  function element() {
    return { children: [], textContent: '', value: '', listeners: {}, append(child) { this.children.push(child); }, replaceChildren() { this.children = []; }, contains(child) { return this.children.includes(child); }, setAttribute(k,v) { this[k] = v; }, addEventListener(event, fn) { this.listeners[event] = fn; } };
  }
  const nodes = new Map();
  for (const id of ['asset', 'horizon', 'live-title', 'provider-link', 'live-chart', 'price', 'symbol', 'target', 'change', 'chart-title', 'chart']) nodes.set('#' + id, element());
  nodes.get('#asset').value = 'AAPL'; nodes.get('#horizon').value = '7';
  globalThis.document = { querySelector: selector => nodes.get(selector), createElement: element };
  try {
    await import('../public/app.js?widget-test');
    const currentScript = () => nodes.get('#live-chart').children[0].children[1];
    assert.equal(JSON.parse(currentScript().textContent).symbol, 'NASDAQ:AAPL');
    assert.equal(currentScript().src, 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js');
    for (const [asset, symbol] of [['BTC', 'COINBASE:BTCUSD'], ['ETH', 'COINBASE:ETHUSD'], ['SOL', 'COINBASE:SOLUSD'], ['MSFT', 'NASDAQ:MSFT'], ['NVDA', 'NASDAQ:NVDA']]) {
      nodes.get('#asset').value = asset;
      nodes.get('#asset').listeners.change();
      assert.equal(JSON.parse(currentScript().textContent).symbol, symbol);
      assert.equal(nodes.get('#live-chart').children.length, 1);
      assert.match(nodes.get('#symbol').textContent, /Synthetic/);
    }
    currentScript().onerror();
    assert.match(nodes.get('#live-chart').children[0].textContent, /unavailable/);
  } finally { delete globalThis.document; }
});
