import { catalog, assetClasses } from './catalog.js';
export function filterAssets(kind, query = '', region = 'all') {
  const term = query.trim().toLocaleLowerCase();
  return Object.entries(catalog).filter(([ticker, item]) => {
    const expectedClass = kind === 'stocks' ? 'stock' : kind;
    return item.assetClass === expectedClass
      && (region === 'all' || item.region === region || (region === 'Europe' && !['US', 'Crypto', 'Global', 'FX'].includes(item.region)))
      && `${ticker} ${item.name} ${item.region} ${item.symbol} ${assetClasses[item.assetClass]}`.toLocaleLowerCase().includes(term);
  });
}
if (typeof document !== 'undefined') {
  const kind = document.querySelector('script[data-kind]').dataset.kind;
  const search = document.querySelector('#search'), region = document.querySelector('#region');
  function render() {
    const results = filterAssets(kind, search.value, region?.value || 'all');
    const rows = document.querySelector('#asset-rows'); rows.replaceChildren();
    for (const [ticker, item] of results) {
      const row = document.createElement('tr');
      for (const value of [item.name, ticker, item.region, item.symbol.split(':')[0], assetClasses[item.assetClass], item.quoteUnit || (item.region === 'UK' ? 'GBX / share' : item.currency)]) {
        const cell = document.createElement('td'); cell.textContent = value; row.append(cell);
      }
      const cell = document.createElement('td'), link = document.createElement('a');
      link.href = './?asset=' + encodeURIComponent(ticker); link.textContent = 'View chart →';
      link.setAttribute('aria-label', 'View ' + item.name + ' chart'); cell.append(link); row.append(cell); rows.append(row);
    }
    document.querySelector('#result-count').textContent = results.length ? `${results.length} assets found` : 'No matching assets. Try another search or market.';
  }
  search.addEventListener('input', render); region?.addEventListener('change', render); render();
}
