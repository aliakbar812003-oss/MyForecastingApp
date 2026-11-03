import test from 'node:test';
import assert from 'node:assert/strict';

test('market widget uses selected exchange symbol and leaves sample forecasts separate', async () => {
  function element() {
    return { children: [], textContent: '', value: '', listeners: {}, append(child) { this.children.push(child); }, replaceChildren() { this.children = []; }, contains(child) { return this.children.includes(child); }, setAttribute(k,v) { this[k] = v; }, addEventListener(event, fn) { this.listeners[event] = fn; } };
  }
  const nodes = new Map();
  for (const id of ['asset', 'horizon', 'live-title', 'provider-link', 'live-chart', 'price', 'symbol', 'target', 'change', 'chart-title', 'chart', 'market-meta', 'quote-data', 'technical-data', 'chart-interval', 'market-tape', 'dashboard-news']) nodes.set('#' + id, element());
  nodes.get('#asset').value = 'AAPL'; nodes.get('#horizon').value = '7'; nodes.get('#chart-interval').value = 'D';
  globalThis.window = { location: { search: '?asset=INVALID' } };
  globalThis.document = { querySelector: selector => nodes.get(selector), createElement: element };
  try {
    await import('../public/app.js?widget-test');
    const currentScript = () => nodes.get('#live-chart').children[0].children[1];
    assert.equal(JSON.parse(currentScript().textContent).symbol, 'NASDAQ:AAPL');
    assert.equal(currentScript().src, 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js');
    for (const [asset, symbol] of [['SPY', 'AMEX:SPY'], ['SXR8', 'XETR:SXR8'], ['GOLD', 'COMEX:GC1!'], ['WTI', 'NYMEX:CL1!'], ['EURUSD', 'FX:EURUSD'], ['USDJPY', 'FX:USDJPY'], ['ASML', 'EURONEXT:ASML'], ['SAP', 'XETR:SAP'], ['SHEL', 'LSE:SHEL'], ['NOVN', 'SIX:NOVN'], ['NOVO_B', 'OMXCOP:NOVO_B'], ['BTC', 'COINBASE:BTCUSD'], ['ETH', 'COINBASE:ETHUSD'], ['SOL', 'COINBASE:SOLUSD'], ['MSFT', 'NASDAQ:MSFT'], ['NVDA', 'NASDAQ:NVDA']]) {
      nodes.get('#asset').value = asset;
      nodes.get('#asset').listeners.change();
      assert.equal(JSON.parse(currentScript().textContent).symbol, symbol);
      assert.equal(nodes.get('#live-chart').children.length, 1);
      for (const id of ['#quote-data', '#technical-data']) assert.equal(JSON.parse(nodes.get(id).children[0].children[1].textContent).symbol, symbol);
      if (asset === 'SAP') assert.match(nodes.get('#symbol').textContent, /EUR/);
      if (asset === 'SHEL') { assert.match(nodes.get('#symbol').textContent, /GBP/); assert.match(nodes.get('#market-meta').textContent, /GBX/); }
      assert.match(nodes.get('#symbol').textContent, /Synthetic/);
    }
    nodes.get('#chart-interval').value = 'W';
    nodes.get('#chart-interval').listeners.change();
    assert.equal(JSON.parse(currentScript().textContent).interval, 'W');
    assert.equal(JSON.parse(nodes.get('#dashboard-news').children[0].children[1].textContent).symbol, 'NASDAQ:NVDA');
    assert.equal(JSON.parse(nodes.get('#market-tape').children[0].children[1].textContent).symbols.length, 7);
    currentScript().onerror();
    assert.match(nodes.get('#live-chart').children[0].textContent, /unavailable/);
  } finally { delete globalThis.document; delete globalThis.window; }
});
