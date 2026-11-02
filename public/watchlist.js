import { catalog } from './catalog.js';
const key = 'market-forecast-watchlist-v1';
export function readWatchlist(storage) {
  try {
    const saved = JSON.parse(storage.getItem(key) || '[]');
    return Array.isArray(saved) ? [...new Set(saved.filter(ticker => typeof ticker === 'string' && Object.hasOwn(catalog, ticker)))] : [];
  } catch { return []; }
}
export function toggleWatchlist(storage, ticker) {
  if (!Object.hasOwn(catalog, ticker)) throw new Error('Unknown asset');
  const saved = readWatchlist(storage);
  const next = saved.includes(ticker) ? saved.filter(value => value !== ticker) : [...saved, ticker];
  storage.setItem(key, JSON.stringify(next)); return next;
}
if (typeof document !== 'undefined' && document.querySelector('#watchlist-assets')) {
  const list = document.querySelector('#watchlist-assets'), message = document.querySelector('#watchlist-status');
  function render() {
    list.replaceChildren();
    let storage;
    try { storage = window.localStorage; } catch { message.textContent = 'Browser storage is unavailable. Enable it to save a watchlist.'; return; }
    const saved = readWatchlist(storage);
    message.textContent = saved.length ? `${saved.length} saved assets · stored only in this browser` : 'Your watchlist is empty. Add an asset below to get started.';
    for (const ticker of saved) {
      const item = catalog[ticker], card = document.createElement('article');
      const title = document.createElement('h2'); title.textContent = item.name + ' · ' + ticker; card.append(title);
      const description = document.createElement('p'); description.textContent = item.region + ' · ' + item.symbol; card.append(description);
      for (const [page, text] of [['./', 'Chart'], ['./signals.html', 'Signals'], ['./news.html', 'News']]) {
        const link = document.createElement('a'); link.href = page + '?asset=' + encodeURIComponent(ticker); link.textContent = text; card.append(link);
      }
      const button = document.createElement('button'); button.textContent = 'Remove'; button.setAttribute('aria-label', 'Remove ' + item.name);
      button.addEventListener('click', () => { try { toggleWatchlist(storage, ticker); render(); } catch { message.textContent = 'Unable to save changes. Check browser storage permissions.'; } }); card.append(button); list.append(card);
    }
  }
  const select = document.querySelector('#watchlist-select');
  for (const [ticker,item] of Object.entries(catalog)) { const option = document.createElement('option'); option.value = ticker; option.textContent = item.name + ' · ' + ticker; select.append(option); }
  document.querySelector('#watchlist-add').addEventListener('click', () => {
    try {
      const storage = window.localStorage;
      if (!readWatchlist(storage).includes(select.value)) toggleWatchlist(storage, select.value);
      render();
    } catch { message.textContent = 'Unable to save your watchlist. Check browser storage permissions.'; }
  });
  window.addEventListener('storage', render); render();
}
