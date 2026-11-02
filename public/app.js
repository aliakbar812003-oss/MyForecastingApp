export function project(values, horizon) {
  const n = values.length;
  const meanX = (n - 1) / 2;
  const meanY = values.reduce((a, b) => a + b, 0) / n;
  let numerator = 0, denominator = 0;
  values.forEach((y, x) => { numerator += (x - meanX) * (y - meanY); denominator += (x - meanX) ** 2; });
  const slope = numerator / denominator;
  return Array.from({ length: horizon }, (_, i) => Math.max(0, meanY + slope * (n + i - meanX)));
}
export function sample(base, seed) {
  return Array.from({ length: 60 }, (_, i) => base * (1 + i * 0.0014 + Math.sin(i * 0.45 + seed) * 0.025 + Math.cos(i * 1.1 + seed) * 0.008));
}
if (typeof document !== 'undefined') {
  const assets = { AAPL: [190, 1], MSFT: [410, 2], NVDA: [120, 3], BTC: [65000, 4], ETH: [3200, 5], SOL: [140, 6] };
  const marketSymbols = { AAPL: 'NASDAQ:AAPL', MSFT: 'NASDAQ:MSFT', NVDA: 'NASDAQ:NVDA', BTC: 'COINBASE:BTCUSD', ETH: 'COINBASE:ETHUSD', SOL: 'COINBASE:SOLUSD' };
  function renderMarket() {
    const symbol = marketSymbols[asset.value];
    document.querySelector('#live-title').textContent = asset.value + ' · Market chart';
    document.querySelector('#provider-link').href = 'https://www.tradingview.com/chart/?symbol=' + encodeURIComponent(symbol);
    const container = document.querySelector('#live-chart');
    container.replaceChildren();
    const widget = document.createElement('div');
    widget.className = 'tradingview-widget-container';
    const mount = document.createElement('div');
    mount.className = 'tradingview-widget-container__widget';
    widget.append(mount);
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.textContent = JSON.stringify({ autosize: true, symbol, interval: 'D', timezone: 'Etc/UTC', theme: 'dark', style: '1', locale: 'en', allow_symbol_change: false, calendar: false, support_host: 'https://www.tradingview.com' });
    script.onerror = () => {
      if (container.contains(widget)) {
        widget.textContent = 'Market chart unavailable. Open TradingView using the link above.';
        widget.setAttribute('role', 'status');
      }
    };
    widget.append(script);
    container.append(widget);
  }
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
  const asset = document.querySelector('#asset'), horizon = document.querySelector('#horizon');
  function render() {
    const history = sample(...assets[asset.value]), future = project(history, Number(horizon.value));
    const latest = history.at(-1), target = future.at(-1), change = (target / latest - 1) * 100;
    document.querySelector('#price').textContent = money.format(latest);
    document.querySelector('#symbol').textContent = asset.value + ' · USD · Synthetic';
    document.querySelector('#target').textContent = money.format(target);
    document.querySelector('#change').textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)}% over ${horizon.value} periods`;
    document.querySelector('#chart-title').textContent = asset.value + ' · Price outlook';
    const all = [...history, ...future], low = Math.min(...all) * 0.98, high = Math.max(...all) * 1.02;
    const x = i => 85 + i / (all.length - 1) * 790, y = v => 275 - (v - low) / (high - low) * 240;
    const path = (values, offset) => values.map((v, i) => `${i ? 'L' : 'M'}${x(i + offset).toFixed(2)},${y(v).toFixed(2)}`).join(' ');
    const grid = Array.from({ length: 5 }, (_, i) => { const value = low + (high - low) * i / 4; return `<line x1="85" x2="875" y1="${y(value)}" y2="${y(value)}" class="grid"/><text x="75" y="${y(value) + 4}" text-anchor="end">${money.format(value)}</text>`; }).join('');
    document.querySelector('#chart').innerHTML = `<desc id="chart-description">${asset.value}: 60 synthetic observations and ${future.length} projected periods, ending at ${money.format(target)}.</desc>${grid}<line class="divider" x1="${x(59)}" x2="${x(59)}" y1="25" y2="280"/><path class="history" d="${path(history, 0)}"/><path class="projection" d="${path([latest, ...future], 59)}"/><text x="85" y="310">1</text><text x="${x(59)}" y="310" text-anchor="middle">60 · forecast begins</text><text x="875" y="310" text-anchor="end">${all.length}</text>`;
  }
  asset.addEventListener('change', () => { renderMarket(); render(); }); horizon.addEventListener('change', render); renderMarket(); render();
}
