export function mountWidget(selector, filename, config) {
  const container = document.querySelector(selector);
  container.replaceChildren();
  const widget = document.createElement('div');
  widget.className = 'tradingview-widget-container';
  const mount = document.createElement('div');
  mount.className = 'tradingview-widget-container__widget'; widget.append(mount);
  const script = document.createElement('script');
  script.src = 'https://s3.tradingview.com/external-embedding/' + filename;
  script.type = 'text/javascript'; script.async = true;
  script.textContent = JSON.stringify(config);
  script.onerror = () => {
    if (container.contains(widget)) { widget.textContent = 'Market data unavailable. Open TradingView using the link on this page.'; widget.setAttribute('role', 'status'); }
  };
  widget.append(script); container.append(widget);
}
