# ☽ Halal Daily Movers

> Shariah-compliant stock screener with real-time signals. AAOIFI-aligned.

## Features
- 40 AAOIFI-screened halal stocks (semiconductors, tech, healthcare, clean energy)
- Auto-refreshes every 60 seconds with live price simulation
- BUY / SELL / STRONG signals based on intraday % change
- Filter by signal, sort by price or change, full-text search
- Dark Islamic aesthetic with crescent moon motif

## Signal Logic
| Signal | Threshold |
|--------|-----------|
| STRONG BUY | ≥ +2.5% |
| BUY | ≥ +0.8% |
| HOLD | −0.8% to +0.8% |
| SELL | ≤ −0.8% |
| STRONG SELL | ≤ −2.5% |

## Deploy to GitHub Pages

### One-time setup
1. Create a new GitHub repo named `halal-daily-movers`
2. Edit `vite.config.js` — set `base` to `'/<your-repo-name>/'`
3. In repo Settings → Pages → set Source to **GitHub Actions**

### Push code
```bash
git init
git remote add origin https://github.com/<YOUR_USERNAME>/halal-daily-movers.git
git add .
git commit -m "🌙 Initial deploy: Halal Daily Movers"
git push -u origin main
```

The GitHub Actions workflow auto-builds and deploys on every push to `main`.
Live URL: `https://<YOUR_USERNAME>.github.io/halal-daily-movers/`

## Local Development
```bash
npm install
npm run dev
```

## Real Data Integration
To connect live prices, replace the `tickPrices()` / `getSnapshot()` functions with calls to:
- **Yahoo Finance** (unofficial): `https://query1.finance.yahoo.com/v8/finance/chart/AAPL`
- **Alpha Vantage** (free tier): `https://www.alphavantage.co/`
- **Polygon.io** (real-time, paid): `https://polygon.io/`

## Halal Screening
Stocks are pre-screened per AAOIFI FAS 21 standards, excluding:
- Conventional banking / finance / insurance
- Alcohol, tobacco, pork-related
- Weapons & defense
- Entertainment haram sectors (adult content, gambling)

---
*Built for SadaqaWorks / Malik's halal investing toolkit*
