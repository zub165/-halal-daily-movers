# CRRT Calculators

Clinical reference calculators for Continuous Renal Replacement Therapy (CVVH / CVVHD / CVVHDF).

**Version 2.2.0** — CRRT Calculators + separate Halal Daily Movers page. Educational / protocol-support tool only. Not a medical device.

## Apps in this repo
| URL path | App |
|----------|-----|
| `/` (`index.html`) | CRRT Calculators hub |
| `/halal.html` | **Halal Daily Movers** (separate AAOIFI stock screener) |

Live Halal page: `https://zub165.github.io/-halal-daily-movers/halal.html`

## Calculators (separate HTML pages)
| Page | Purpose |
|------|---------|
| `index.html` | CRRT hub |
| `halal.html` | Halal Daily Movers (separate) |
| `dose.html` | Dose = effluent ÷ weight |
| `effluent.html` | Modality effluent + dose |
| `filtration.html` | Filtration fraction |
| `dilution.html` | Dilution-corrected dose |
| `citrate.html` | Citrate rate & Ca ratio |
| `fluid.html` | Net fluid balance |
| `history.html` | Saved calculations |
| `privacy.html` | Privacy policy + delete/export |

## Hybrid storage
- **Local:** `localStorage` (`crrt_calculations_v1`)
- **Backend:** SQLite via Express API on **port 3851**
- Schema matches frontend records: `id`, `type`, `inputs` (JSON), `results` (JSON), `label`, `created_at`, `updated_at`

## Ports
| Service | Port |
|---------|------|
| Vite web | **5174** |
| API / SQLite | **3851** |
| Vite preview | **4174** |

## Local development
```bash
npm install
npm run dev
```
- App: http://127.0.0.1:5174/-halal-daily-movers/
- API health: http://127.0.0.1:3851/api/health

```bash
npm test
npm run build
```

## Privacy & deletion
Privacy page supports JSON export and permanent wipe of local + backend data (App Store / Play Store readiness).

## Deploy (GitHub Pages)
Workflow builds static pages to `dist/`. Backend is optional for production static hosting (local-only mode).

Live path base: `/-halal-daily-movers/`

## Disclaimer
Verify all prescriptions against institutional CRRT protocols. Do not enter PHI.
