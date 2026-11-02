# Market Forecast

A dependency-free Node.js starter for exploring stocks and cryptocurrency using **synthetic sample prices**, with a linear trend projection. It does not fetch live prices or provide validated investment forecasts.

## Develop

Requires Node.js 22 or later. No dependency installation or API credentials are needed.

```sh
npm test
npm start
```

The HTTP server uses port 3000 (override with `PORT`). Choose Apple, Microsoft, NVIDIA, Bitcoin, Ethereum, or Solana and a 7-, 14-, or 30-period horizon. Stock periods represent trading sessions; crypto periods represent days. All prices are illustrative USD values.

The model fits ordinary least squares to 60 deterministic observations and extrapolates, flooring negative estimates at zero. No prediction intervals are estimated. Real market data, backtesting, and forecast evaluation remain future work.

## GitHub Pages

In repository Settings → Pages, choose **GitHub Actions** as the source. The Deploy Market Forecast workflow tests the model and publishes only `public/`. Run it from the Actions tab if Pages was enabled after the latest push. A private repository may require a paid GitHub plan for Pages. The site itself will be public unless your plan supports and you configure restricted access.
