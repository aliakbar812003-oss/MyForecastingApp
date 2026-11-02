# Market Forecast

A stock and crypto dashboard with embedded TradingView market charts. The catalog includes 20 US stocks, 25 European stocks, and six Coinbase USD crypto pairs. Charts, quote statistics, and technical analysis follow the selected exchange symbol. TradingView controls quote availability and exchange delays. No API keys are exposed or required.

The collapsible forecast demo uses **synthetic sample prices**, independently of the market widget. It does not provide forecasts from real price history or validated investment predictions.

## Develop

Requires Node.js 22 or later. No dependency installation or API credentials are needed.

```sh
npm test
npm start
```

The HTTP server uses port 3000 (override with `PORT`). Choose an asset on the dashboard or browse the searchable US/Europe and crypto directories. The separate sample forecast supports 7-, 14-, or 30-period horizons. Stock periods represent trading sessions; crypto periods represent days. Prices in the forecast demo are illustrative USD values. The main chart shows provider market data.

The model fits ordinary least squares to 60 deterministic observations and extrapolates, flooring negative estimates at zero. No prediction intervals are estimated. Connecting the forecast model to historical market data, backtesting, and forecast evaluation remain future work.

The market chart requires browser access to TradingView (`s3.tradingview.com` and its widget services). Content blockers or provider restrictions can prevent loading; the app includes an external TradingView link as a fallback. Loading the embed connects the browser to TradingView.

## GitHub Pages

In repository Settings → Pages, choose **GitHub Actions** as the source. The Deploy Market Forecast workflow tests the model and publishes only `public/`. Run it from the Actions tab if Pages was enabled after the latest push. A private repository may require a paid GitHub plan for Pages. The site itself will be public unless your plan supports and you configure restricted access.

## Pages

- Dashboard (`/`): market chart, quote statistics, technical analysis, and collapsed sample forecast.
- US & Europe (`stocks.html`): search by company/ticker/exchange and filter by market.
- Crypto (`crypto.html`): searchable crypto directory.
- How it works (`methodology.html`): data sources, currencies, delays, and model limitations.

Directory links select the asset on the dashboard via `?asset=TICKER`. UK chart prices are typically in GBX; the synthetic demo explicitly uses GBP. Widget coverage and statistics availability vary by exchange.

## Research tools

- **Buy/Sell signals** (`signals.html`): TradingView moving-average and oscillator summaries for the selected asset and timeframe (hourly, four-hour, daily, weekly, monthly). These are technical classifications, not validated return predictions or personalised trade instructions.
- **Market news** (`news.html`): TradingView timeline for stocks, crypto, or one exchange symbol. Provider coverage and timestamps apply.
- **Watchlist** (`watchlist.html`): save assets in local browser storage, with links to charts, signals, and news. No cross-device sync or trading integration. Clear browser storage to remove your saved list.

Live third-party content is loaded in the visitor's browser. Automated tests verify widget configuration, routing, catalog selections, watchlist persistence, and model math; they do not verify third-party quote accuracy or news coverage.
