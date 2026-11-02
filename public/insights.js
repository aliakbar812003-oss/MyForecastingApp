import { catalog } from './catalog.js';
import { mountWidget } from './widgets.js';
export function newsConfig(scope, ticker = 'AAPL') {
  if (!['stocks', 'crypto', 'asset'].includes(scope)) throw new Error('Unknown news scope');
  if (scope === 'asset' && !Object.hasOwn(catalog, ticker)) throw new Error('Unknown asset');
  return { ...(scope === 'asset' ? { feedMode: 'symbol', symbol: catalog[ticker].symbol } : { feedMode: 'market', market: scope === 'crypto' ? 'crypto' : 'stock' }), colorTheme: 'dark', isTransparent: true, displayMode: 'regular', width: '100%', height: 650, locale: 'en' };
}
export function signalConfig(ticker, interval) {
  if (!Object.hasOwn(catalog, ticker) || !['1h', '4h', '1D', '1W', '1M'].includes(interval)) throw new Error('Invalid analysis selection');
  return { symbol: catalog[ticker].symbol, interval, width: '100%', height: 450, showIntervalTabs: true, displayMode: 'multiple', locale: 'en', colorTheme: 'dark', isTransparent: true };
}
if (typeof document !== 'undefined' && document.querySelector('#insights-asset')) {
  const asset = document.querySelector('#insights-asset'), timeframe = document.querySelector('#timeframe'), scope = document.querySelector('#news-scope');
  for (const [ticker, item] of Object.entries(catalog)) { const option = document.createElement('option'); option.value = ticker; option.textContent = item.name + ' · ' + ticker + ' · ' + item.region; asset.append(option); }
  const requested = new URLSearchParams(window.location.search).get('asset');
  if (Object.hasOwn(catalog, requested)) { asset.value = requested; if(scope) scope.value = 'asset'; }
  function render() {
    const selected = catalog[asset.value];
    document.querySelector('#insights-link').href = 'https://www.tradingview.com/chart/?symbol=' + encodeURIComponent(selected.symbol);
    document.querySelector('#selection-summary').textContent = selected.name + ' · ' + selected.symbol;
    if (timeframe) mountWidget('#signals-widget', 'embed-widget-technical-analysis.js', signalConfig(asset.value, timeframe.value));
    if (scope) {
      asset.disabled = scope.value !== 'asset';
      if (scope.value !== 'asset') {
        document.querySelector('#selection-summary').textContent = scope.value === 'crypto' ? 'Crypto market headlines' : 'Stock market headlines';
        document.querySelector('#insights-link').href = 'https://www.tradingview.com/news/';
      }
      mountWidget('#news-widget', 'embed-widget-timeline.js', newsConfig(scope.value, asset.value));
    }
  }
  asset.addEventListener('change', render); timeframe?.addEventListener('change', render); scope?.addEventListener('change', render); render();
}
