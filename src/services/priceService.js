const STORAGE_KEY = "halal-movers-price-cache";
const HISTORY_KEY = "halal-movers-price-history";

export const priceState = {};
export const priceHistory = {};

function readCache() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(priceState));
    localStorage.setItem(HISTORY_KEY, JSON.stringify(priceHistory));
  } catch {
    // quota or private mode — ignore
  }
}

function seedPrice(ticker) {
  const seeds = {
    AAPL: 195, MSFT: 415, AVGO: 185, AMD: 145, NVDA: 135, MU: 108,
    MRVL: 78, QCOM: 165, AMZN: 215, GOOGL: 178, META: 525, TSM: 175,
    ASML: 860, AMAT: 210, LRCX: 890, ON: 68, TXN: 198, KLAC: 780,
    PANW: 325, CRWD: 380, ZS: 215, FTNT: 89, NOW: 870, CRM: 295,
    SNOW: 178, DDOG: 125, NET: 115, UBER: 85, LYFT: 16, LLY: 895,
    ABBV: 188, TMO: 545, ISRG: 490, ELV: 380, DE: 420, CAT: 365,
    RTX: 125, HON: 222, NEE: 78, ENPH: 68,
  };
  return seeds[ticker] ?? 100;
}

export function initPriceState(tickers) {
  const cached = readCache();
  tickers.forEach((ticker) => {
    if (cached?.[ticker]) {
      priceState[ticker] = { ...cached[ticker] };
    } else {
      const base = seedPrice(ticker);
      priceState[ticker] = {
        price: base,
        open: base,
        source: "seed",
      };
    }

    try {
      const histRaw = localStorage.getItem(HISTORY_KEY);
      const histCache = histRaw ? JSON.parse(histRaw) : null;
      priceHistory[ticker] = histCache?.[ticker] ?? [
        { t: 0, p: priceState[ticker].price },
      ];
    } catch {
      priceHistory[ticker] = [{ t: 0, p: priceState[ticker].price }];
    }
  });
}

function pushHistory(ticker, price) {
  const hist = priceHistory[ticker] ?? [];
  const lastT = hist.length ? hist[hist.length - 1].t : 0;
  hist.push({ t: lastT + 1, p: price });
  if (hist.length > 60) hist.shift();
  priceHistory[ticker] = hist;
}

function applyQuote(ticker, { price, open, source }) {
  if (!price || price <= 0) return false;
  const resolvedOpen = open > 0 ? open : price;
  priceState[ticker] = { price, open: resolvedOpen, source };
  pushHistory(ticker, price);
  return true;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function yahooSparkUrl(symbols) {
  const query = encodeURIComponent(symbols.join(","));
  return `https://query1.finance.yahoo.com/v7/finance/spark?symbols=${query}&range=1d&interval=5m`;
}

function resolveFetchUrl(targetUrl) {
  const customProxy = import.meta.env.VITE_PRICE_PROXY_URL?.trim();
  if (customProxy) {
    return customProxy.replace("{url}", encodeURIComponent(targetUrl));
  }
  if (import.meta.env.DEV) {
    const path = targetUrl.replace("https://query1.finance.yahoo.com", "");
    return `/api/yahoo${path}`;
  }
  return `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
}

function chunkArray(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

async function fetchYahooQuotes(tickers) {
  const quotes = {};
  const batches = chunkArray(tickers, 20);

  for (const batch of batches) {
    const url = yahooSparkUrl(batch);
    const data = await fetchJson(resolveFetchUrl(url));
    const results = data?.spark?.result ?? [];

    results.forEach((row) => {
      const meta = row?.response?.[0]?.meta;
      const price = meta?.regularMarketPrice;
      const open = meta?.regularMarketOpen ?? meta?.chartPreviousClose ?? meta?.previousClose ?? price;
      if (row.symbol && price) {
        quotes[row.symbol] = { price, open, source: "yahoo" };
      }
    });
  }

  return quotes;
}

async function fetchAlphaVantageQuote(ticker, apiKey) {
  const url =
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`;
  const data = await fetchJson(url);
  const q = data?.["Global Quote"];
  if (!q?.["05. price"]) return null;

  const price = parseFloat(q["05. price"]);
  const open = parseFloat(q["02. open"]) || price;
  return { price, open, source: "alphavantage" };
}

async function fetchAlphaVantageQuotes(tickers, apiKey) {
  const quotes = {};
  // Free tier: 5 req/min — stagger one ticker per refresh batch slice
  const batch = tickers.slice(0, 5);
  for (const ticker of batch) {
    const quote = await fetchAlphaVantageQuote(ticker, apiKey);
    if (quote) quotes[ticker] = quote;
    await new Promise((r) => setTimeout(r, 250));
  }
  return quotes;
}

async function fetchPolygonQuotes(tickers, apiKey) {
  const symbols = tickers.map((t) => `T.${t}`).join(",");
  const url =
    `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?tickers=${symbols}&apiKey=${apiKey}`;
  const data = await fetchJson(url);
  const quotes = {};

  (data?.tickers ?? []).forEach((t) => {
    const ticker = t.ticker?.replace(/^T\./, "");
    const day = t.day ?? t.prevDay;
    const price = t.lastTrade?.p ?? day?.c;
    const open = day?.o ?? price;
    if (ticker && price) quotes[ticker] = { price, open, source: "polygon" };
  });

  return quotes;
}

function simulateTick(tickers) {
  const quotes = {};
  tickers.forEach((ticker) => {
    const s = priceState[ticker] ?? { price: seedPrice(ticker), open: seedPrice(ticker) };
    const move = (Math.random() - 0.49) * 0.004;
    const price = Math.max(0.01, s.price * (1 + move));
    quotes[ticker] = { price, open: s.open, source: "simulated" };
  });
  return quotes;
}

async function fetchQuotes(tickers) {
  const provider = (import.meta.env.VITE_PRICE_PROVIDER || "yahoo").toLowerCase();
  const alphaKey = import.meta.env.VITE_ALPHA_VANTAGE_KEY?.trim();
  const polygonKey = import.meta.env.VITE_POLYGON_KEY?.trim();

  if (provider === "polygon" && polygonKey) {
    return fetchPolygonQuotes(tickers, polygonKey);
  }
  if (provider === "alphavantage" && alphaKey) {
    return fetchAlphaVantageQuotes(tickers, alphaKey);
  }
  if (provider === "simulated") {
    return simulateTick(tickers);
  }

  try {
    return await fetchYahooQuotes(tickers);
  } catch (yahooErr) {
    if (alphaKey) {
      return fetchAlphaVantageQuotes(tickers, alphaKey);
    }
    if (polygonKey) {
      return fetchPolygonQuotes(tickers, polygonKey);
    }
    throw yahooErr;
  }
}

export async function refreshPrices(tickers) {
  const quotes = await fetchQuotes(tickers);
  let updated = 0;

  tickers.forEach((ticker) => {
    const quote = quotes[ticker];
    if (quote && applyQuote(ticker, quote)) updated += 1;
  });

  if (updated > 0) writeCache();

  return {
    updated,
    total: tickers.length,
    source: Object.values(quotes)[0]?.source ?? "unknown",
  };
}

export function getSnapshot(universe) {
  return universe.map(({ ticker, name, sector }) => {
    const { price, open } = priceState[ticker] ?? { price: 0, open: 0 };
    const change = price - open;
    const changePct = open ? (change / open) * 100 : 0;
    return { ticker, name, sector, price, open, change, changePct };
  });
}

export function getPriceSource() {
  const first = Object.values(priceState).find((s) => s?.source);
  return first?.source ?? "seed";
}
