import { catalog } from './catalog.js';
import { readWatchlist, toggleWatchlist } from './watchlist.js';
export function sidebarAssets(query, market, saved = []) {
  const term = query.trim().toLocaleLowerCase();
  return Object.entries(catalog).filter(([ticker,item]) => {
    const matches = market === 'all' || item.assetClass === market || (market === 'Crypto' && item.assetClass === 'crypto') || (market === 'US' && item.assetClass === 'stock' && item.region === 'US') || (market === 'Europe' && item.assetClass === 'stock' && !['US','Crypto'].includes(item.region)) || (market === 'saved' && saved.includes(ticker));
    return matches && `${ticker} ${item.name} ${item.symbol}`.toLocaleLowerCase().includes(term);
  });
}
if (typeof document !== 'undefined' && document.querySelector('#sidebar-assets')) {
  const list = document.querySelector('#sidebar-assets'), search = document.querySelector('#sidebar-search'), filter = document.querySelector('#sidebar-filter'), asset = document.querySelector('#asset'), save = document.querySelector('#save-asset'), status = document.querySelector('#sidebar-status');
  function saved() { try { return readWatchlist(window.localStorage); } catch { return []; } }
  function render() {
    const watchlist = saved(), results = sidebarAssets(search.value, filter.value, watchlist);
    list.replaceChildren();
    for (const [ticker,item] of results) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'market-row'; button.setAttribute('aria-pressed', String(ticker === asset.value));
      const identity = document.createElement('span'), symbol = document.createElement('b'), name = document.createElement('span'), exchange = document.createElement('span');
      symbol.textContent = ticker; name.textContent = item.name; name.className = 'market-company'; identity.append(symbol,name); exchange.textContent = item.symbol.split(':')[0]; exchange.className = 'market-exchange'; button.append(identity,exchange);
      button.addEventListener('click', () => { asset.value = ticker; asset.dispatchEvent(new Event('change')); }); list.append(button);
    }
    status.textContent = results.length ? `${results.length} assets · select a symbol to open its chart` : filter.value === 'saved' ? 'No saved assets match. Save a symbol using the ☆ button above the chart.' : 'No matching assets. Try another company or symbol.';
    save.textContent = watchlist.includes(asset.value) ? '★ Saved' : '☆ Save'; save.setAttribute('aria-pressed',String(watchlist.includes(asset.value)));
    document.querySelector('#asset-signals').href = './signals.html?asset=' + encodeURIComponent(asset.value);
    document.querySelector('#asset-news').href = './news.html?asset=' + encodeURIComponent(asset.value);
    const url = new URL(window.location.href); url.searchParams.set('asset',asset.value); window.history.replaceState(null,'',url);
  }
  save.addEventListener('click', () => { try { toggleWatchlist(window.localStorage,asset.value); render(); } catch { status.textContent = 'Cannot save this asset: browser storage is unavailable.'; } });
  search.addEventListener('input',render); filter.addEventListener('change',render); asset.addEventListener('change',render); window.addEventListener('storage',render); render();
}
