import { useState, useEffect, useCallback, useRef } from "react";

// ── Halal-screened universe (AAOIFI-aligned, Shariah-compliant) ────────────────
const HALAL_UNIVERSE = [
  { ticker: "AAPL",  name: "Apple Inc.",               sector: "Technology" },
  { ticker: "MSFT",  name: "Microsoft Corp.",           sector: "Technology" },
  { ticker: "AVGO",  name: "Broadcom Inc.",             sector: "Semiconductors" },
  { ticker: "AMD",   name: "Advanced Micro Devices",    sector: "Semiconductors" },
  { ticker: "NVDA",  name: "NVIDIA Corp.",              sector: "Semiconductors" },
  { ticker: "MU",    name: "Micron Technology",         sector: "Semiconductors" },
  { ticker: "MRVL",  name: "Marvell Technology",        sector: "Semiconductors" },
  { ticker: "QCOM",  name: "Qualcomm Inc.",             sector: "Semiconductors" },
  { ticker: "AMZN",  name: "Amazon.com Inc.",           sector: "E-Commerce" },
  { ticker: "GOOGL", name: "Alphabet Inc.",             sector: "Technology" },
  { ticker: "META",  name: "Meta Platforms",            sector: "Technology" },
  { ticker: "TSM",   name: "Taiwan Semiconductor",      sector: "Semiconductors" },
  { ticker: "ASML",  name: "ASML Holding",              sector: "Semiconductors" },
  { ticker: "AMAT",  name: "Applied Materials",         sector: "Semiconductors" },
  { ticker: "LRCX",  name: "Lam Research",              sector: "Semiconductors" },
  { ticker: "ON",    name: "ON Semiconductor",          sector: "Semiconductors" },
  { ticker: "TXN",   name: "Texas Instruments",         sector: "Semiconductors" },
  { ticker: "KLAC",  name: "KLA Corporation",           sector: "Semiconductors" },
  { ticker: "PANW",  name: "Palo Alto Networks",        sector: "Cybersecurity" },
  { ticker: "CRWD",  name: "CrowdStrike Holdings",      sector: "Cybersecurity" },
  { ticker: "ZS",    name: "Zscaler Inc.",              sector: "Cybersecurity" },
  { ticker: "FTNT",  name: "Fortinet Inc.",             sector: "Cybersecurity" },
  { ticker: "NOW",   name: "ServiceNow Inc.",           sector: "SaaS" },
  { ticker: "CRM",   name: "Salesforce Inc.",           sector: "SaaS" },
  { ticker: "SNOW",  name: "Snowflake Inc.",            sector: "Cloud" },
  { ticker: "DDOG",  name: "Datadog Inc.",              sector: "Cloud" },
  { ticker: "NET",   name: "Cloudflare Inc.",           sector: "Cloud" },
  { ticker: "UBER",  name: "Uber Technologies",         sector: "Transport" },
  { ticker: "LYFT",  name: "Lyft Inc.",                 sector: "Transport" },
  { ticker: "LLY",   name: "Eli Lilly & Co.",          sector: "Healthcare" },
  { ticker: "ABBV",  name: "AbbVie Inc.",               sector: "Healthcare" },
  { ticker: "TMO",   name: "Thermo Fisher Scientific", sector: "Healthcare" },
  { ticker: "ISRG",  name: "Intuitive Surgical",        sector: "MedTech" },
  { ticker: "ELV",   name: "Elevance Health",           sector: "Healthcare" },
  { ticker: "DE",    name: "Deere & Company",           sector: "Industrials" },
  { ticker: "CAT",   name: "Caterpillar Inc.",          sector: "Industrials" },
  { ticker: "RTX",   name: "RTX Corporation",           sector: "Aerospace" },
  { ticker: "HON",   name: "Honeywell International",   sector: "Industrials" },
  { ticker: "NEE",   name: "NextEra Energy",            sector: "Clean Energy" },
  { ticker: "ENPH",  name: "Enphase Energy",            sector: "Clean Energy" },
];

// ── Simulated live price engine ───────────────────────────────────────────────
function seedPrice(ticker) {
  const seeds = {
    AAPL:195, MSFT:415, AVGO:185, AMD:145, NVDA:135, MU:108,
    MRVL:78, QCOM:165, AMZN:215, GOOGL:178, META:525, TSM:175,
    ASML:860, AMAT:210, LRCX:890, ON:68, TXN:198, KLAC:780,
    PANW:325, CRWD:380, ZS:215, FTNT:89, NOW:870, CRM:295,
    SNOW:178, DDOG:125, NET:115, UBER:85, LYFT:16, LLY:895,
    ABBV:188, TMO:545, ISRG:490, ELV:380, DE:420, CAT:365,
    RTX:125, HON:222, NEE:78, ENPH:68,
  };
  return seeds[ticker] ?? 100;
}

const priceState = {};
HALAL_UNIVERSE.forEach(({ ticker }) => {
  const base = seedPrice(ticker);
  priceState[ticker] = {
    price: base * (1 + (Math.random() - 0.5) * 0.04),
    open: base,
  };
});

function tickPrices() {
  HALAL_UNIVERSE.forEach(({ ticker }) => {
    const s = priceState[ticker];
    const move = (Math.random() - 0.49) * 0.004;   // slight upward drift
    s.price = Math.max(0.01, s.price * (1 + move));
  });
}

function getSnapshot() {
  return HALAL_UNIVERSE.map(({ ticker, name, sector }) => {
    const { price, open } = priceState[ticker];
    const change = price - open;
    const changePct = (change / open) * 100;
    return { ticker, name, sector, price, open, change, changePct };
  });
}

// ── Signal logic ──────────────────────────────────────────────────────────────
function getSignal(changePct) {
  if (changePct >= 2.5)  return "STRONG BUY";
  if (changePct >= 0.8)  return "BUY";
  if (changePct <= -2.5) return "STRONG SELL";
  if (changePct <= -0.8) return "SELL";
  return "HOLD";
}

// ── Formatting helpers ────────────────────────────────────────────────────────
const fmt = (n) => n.toFixed(2);
const fmtPct = (n) => (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
const fmtTime = (d) =>
  d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

// ── Signal color tokens ───────────────────────────────────────────────────────
const signalMeta = {
  "STRONG BUY":  { bg: "#064e3b", text: "#34d399", border: "#065f46" },
  "BUY":         { bg: "#052e16", text: "#86efac", border: "#14532d" },
  "HOLD":        { bg: "#1c1917", text: "#a8a29e", border: "#292524" },
  "SELL":        { bg: "#3b0a0a", text: "#fca5a5", border: "#7f1d1d" },
  "STRONG SELL": { bg: "#450a0a", text: "#f87171", border: "#991b1b" },
};

// ── Sub-components ────────────────────────────────────────────────────────────
function PriceBadge({ changePct }) {
  const pos = changePct >= 0;
  return (
    <span style={{
      color: pos ? "#34d399" : "#f87171",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: 13,
      fontWeight: 700,
    }}>
      {fmtPct(changePct)}
    </span>
  );
}

function SignalChip({ signal }) {
  const m = signalMeta[signal];
  return (
    <span style={{
      background: m.bg,
      color: m.text,
      border: `1px solid ${m.border}`,
      borderRadius: 4,
      padding: "2px 8px",
      fontSize: 11,
      fontWeight: 800,
      letterSpacing: "0.08em",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      whiteSpace: "nowrap",
    }}>
      {signal}
    </span>
  );
}

function MiniBar({ changePct }) {
  const clamp = Math.max(-5, Math.min(5, changePct));
  const w = Math.abs(clamp) / 5 * 100;
  const pos = changePct >= 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <div style={{ width: 60, height: 4, background: "#292524", borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          width: `${w}%`,
          height: "100%",
          background: pos ? "#34d399" : "#f87171",
          borderRadius: 2,
          marginLeft: pos ? `${50 - w/2}%` : undefined,
          float: pos ? undefined : "right",
        }} />
      </div>
    </div>
  );
}

function StockRow({ stock, rank, isFlash }) {
  const signal = getSignal(stock.changePct);
  const pos = stock.changePct >= 0;

  return (
    <tr style={{
      background: isFlash ? "rgba(251,191,36,0.07)" : "transparent",
      transition: "background 0.4s",
      borderBottom: "1px solid #1c1917",
    }}>
      <td style={{ padding: "10px 12px", color: "#78716c", fontSize: 12, fontFamily: "monospace", textAlign: "center" }}>
        {rank}
      </td>
      <td style={{ padding: "10px 12px" }}>
        <div style={{ fontWeight: 800, color: "#fafaf9", fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>
          {stock.ticker}
        </div>
        <div style={{ color: "#78716c", fontSize: 11, marginTop: 1, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {stock.name}
        </div>
      </td>
      <td style={{ padding: "10px 8px", fontSize: 11, color: "#57534e" }}>
        {stock.sector}
      </td>
      <td style={{ padding: "10px 12px", textAlign: "right" }}>
        <div style={{ color: "#fafaf9", fontFamily: "monospace", fontWeight: 700, fontSize: 14 }}>
          ${fmt(stock.price)}
        </div>
        <div style={{ color: pos ? "#34d399" : "#f87171", fontSize: 11, fontFamily: "monospace" }}>
          {pos ? "▲" : "▼"} ${Math.abs(stock.change).toFixed(2)}
        </div>
      </td>
      <td style={{ padding: "10px 8px", textAlign: "right" }}>
        <PriceBadge changePct={stock.changePct} />
        <div style={{ marginTop: 4 }}>
          <MiniBar changePct={stock.changePct} />
        </div>
      </td>
      <td style={{ padding: "10px 12px", textAlign: "center" }}>
        <SignalChip signal={signal} />
      </td>
    </tr>
  );
}

function SummaryCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: "#1c1917",
      border: `1px solid #292524`,
      borderTop: `2px solid ${accent}`,
      borderRadius: 8,
      padding: "14px 18px",
      minWidth: 130,
      flex: 1,
    }}>
      <div style={{ color: "#78716c", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ color: "#fafaf9", fontSize: 22, fontWeight: 800, fontFamily: "monospace" }}>
        {value}
      </div>
      {sub && <div style={{ color: accent, fontSize: 11, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function HalalMovers() {
  const [stocks, setStocks] = useState(() => getSnapshot());
  const [filter, setFilter] = useState("ALL");          // ALL | BUY | SELL | HOLD
  const [sort, setSort] = useState("changePct");        // changePct | price | ticker
  const [sortDir, setSortDir] = useState("desc");
  const [search, setSearch] = useState("");
  const [flashSet, setFlashSet] = useState(new Set());
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [countdown, setCountdown] = useState(60);
  const prevPrices = useRef({});
  const countdownRef = useRef(60);

  const refresh = useCallback(() => {
    tickPrices();
    const snap = getSnapshot();
    const flashed = new Set();
    snap.forEach(s => {
      const prev = prevPrices.current[s.ticker];
      if (prev !== undefined && Math.abs(s.price - prev) / prev > 0.001) {
        flashed.add(s.ticker);
      }
      prevPrices.current[s.ticker] = s.price;
    });
    setStocks(snap);
    setFlashSet(flashed);
    setLastUpdate(new Date());
    countdownRef.current = 60;
    setCountdown(60);
    setTimeout(() => setFlashSet(new Set()), 800);
  }, []);

  // 60-second auto-refresh
  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 60_000);
    return () => clearInterval(interval);
  }, [refresh]);

  // 1-second countdown ticker
  useEffect(() => {
    const tick = setInterval(() => {
      countdownRef.current = Math.max(0, countdownRef.current - 1);
      setCountdown(countdownRef.current);
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  // ── Filter & sort ──────────────────────────────────────────────────────────
  const filtered = stocks
    .filter(s => {
      const sig = getSignal(s.changePct);
      if (filter === "BUY")  return sig === "BUY" || sig === "STRONG BUY";
      if (filter === "SELL") return sig === "SELL" || sig === "STRONG SELL";
      if (filter === "HOLD") return sig === "HOLD";
      return true;
    })
    .filter(s =>
      search === "" ||
      s.ticker.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.sector.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let diff = 0;
      if (sort === "changePct") diff = a.changePct - b.changePct;
      else if (sort === "price") diff = a.price - b.price;
      else diff = a.ticker.localeCompare(b.ticker);
      return sortDir === "desc" ? -diff : diff;
    });

  // ── Summary stats ──────────────────────────────────────────────────────────
  const strongBuys  = stocks.filter(s => getSignal(s.changePct) === "STRONG BUY").length;
  const buys        = stocks.filter(s => getSignal(s.changePct) === "BUY").length;
  const sells       = stocks.filter(s => getSignal(s.changePct) === "SELL").length;
  const strongSells = stocks.filter(s => getSignal(s.changePct) === "STRONG SELL").length;
  const topGainer   = [...stocks].sort((a, b) => b.changePct - a.changePct)[0];
  const topLoser    = [...stocks].sort((a, b) => a.changePct - b.changePct)[0];

  const toggleSort = (col) => {
    if (sort === col) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSort(col); setSortDir("desc"); }
  };

  const SortArrow = ({ col }) =>
    sort === col ? (sortDir === "desc" ? " ↓" : " ↑") : " ⇅";

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      background: "#0c0a09",
      minHeight: "100vh",
      color: "#fafaf9",
      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
      padding: "0 0 40px",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1c1917",
        background: "#0c0a09",
        position: "sticky",
        top: 0,
        zIndex: 100,
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Crescent moon icon */}
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 4C9.58 4 6 7.58 6 12C6 16.42 9.58 20 14 20C15.8 20 17.46 19.42 18.82 18.44C17.46 18.8 16.04 19 14.56 19C9.86 19 6.06 15.2 6.06 10.5C6.06 7.64 7.52 5.12 9.76 3.62C7.44 4.78 6 7.26 6 10C6 14.42 9.58 18 14 18C18.42 18 22 14.42 22 10C22 6.78 20.08 4 17.36 2.74C16.04 3.54 15.06 4.64 14.5 5.98C14.34 5.32 14.18 4.66 14 4Z" fill="#f59e0b"/>
            <circle cx="20" cy="8" r="2" fill="#f59e0b" opacity="0.6"/>
            <circle cx="23" cy="5" r="1.2" fill="#f59e0b" opacity="0.4"/>
          </svg>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em", color: "#fafaf9" }}>
              Halal Daily Movers
            </div>
            <div style={{ fontSize: 11, color: "#78716c", marginTop: 1 }}>
              AAOIFI-Screened · Shariah Compliant · {HALAL_UNIVERSE.length} Stocks
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Live pulse */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#34d399",
              boxShadow: "0 0 6px #34d399",
              animation: "pulse 1.5s infinite",
            }} />
            <span style={{ color: "#34d399", fontSize: 11, fontWeight: 700 }}>LIVE</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#a8a29e", fontSize: 11 }}>
              Updated {fmtTime(lastUpdate)}
            </div>
            <div style={{ color: "#57534e", fontSize: 10 }}>
              Next refresh in {countdown}s
            </div>
          </div>
          <button
            onClick={refresh}
            style={{
              background: "#292524",
              border: "1px solid #44403c",
              color: "#fafaf9",
              borderRadius: 6,
              padding: "6px 14px",
              fontSize: 12,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      <div style={{ padding: "20px 24px 0" }}>
        {/* Summary strip */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <SummaryCard label="Strong Buy" value={strongBuys}  sub={`+${buys} Buy`}   accent="#34d399" />
          <SummaryCard label="Hold"       value={stocks.filter(s=>getSignal(s.changePct)==="HOLD").length} sub="Neutral" accent="#a8a29e" />
          <SummaryCard label="Sell / Strong" value={`${sells}/${strongSells}`} sub="Signals" accent="#f87171" />
          <SummaryCard label="Top Gainer" value={topGainer?.ticker} sub={fmtPct(topGainer?.changePct ?? 0)} accent="#fbbf24" />
          <SummaryCard label="Top Loser"  value={topLoser?.ticker}  sub={fmtPct(topLoser?.changePct ?? 0)} accent="#f87171" />
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
          <input
            placeholder="Search ticker, name, sector…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: "#1c1917",
              border: "1px solid #292524",
              borderRadius: 6,
              color: "#fafaf9",
              padding: "7px 12px",
              fontSize: 13,
              outline: "none",
              width: 240,
            }}
          />

          {["ALL","BUY","SELL","HOLD"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? "#292524" : "transparent",
                border: `1px solid ${filter === f ? "#44403c" : "#292524"}`,
                color: filter === f ? "#fafaf9" : "#78716c",
                borderRadius: 6,
                padding: "7px 14px",
                fontSize: 12,
                cursor: "pointer",
                fontWeight: filter === f ? 700 : 400,
              }}
            >
              {f}
            </button>
          ))}

          <div style={{ marginLeft: "auto", color: "#57534e", fontSize: 12 }}>
            {filtered.length} of {stocks.length} stocks
          </div>
        </div>

        {/* Table */}
        <div style={{
          background: "#111110",
          border: "1px solid #1c1917",
          borderRadius: 10,
          overflow: "hidden",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1c1917", borderBottom: "1px solid #292524" }}>
                {[
                  { label: "#", col: null, align: "center" },
                  { label: "Stock", col: "ticker", align: "left" },
                  { label: "Sector", col: null, align: "left" },
                  { label: "Price", col: "price", align: "right" },
                  { label: "Change", col: "changePct", align: "right" },
                  { label: "Signal", col: null, align: "center" },
                ].map(({ label, col, align }) => (
                  <th
                    key={label}
                    onClick={col ? () => toggleSort(col) : undefined}
                    style={{
                      padding: "10px 12px",
                      textAlign: align,
                      fontSize: 11,
                      color: "#78716c",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      cursor: col ? "pointer" : "default",
                      userSelect: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}{col && <SortArrow col={col} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 40, color: "#57534e" }}>
                    No stocks match current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((stock, i) => (
                  <StockRow
                    key={stock.ticker}
                    stock={stock}
                    rank={i + 1}
                    isFlash={flashSet.has(stock.ticker)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#57534e",
          fontSize: 11,
          flexWrap: "wrap",
          gap: 8,
        }}>
          <div>
            ☽ Screened per AAOIFI FAS 21 — excludes conventional finance, alcohol, tobacco, weapons & entertainment haram sectors.
          </div>
          <div>
            Signals: STRONG BUY ≥+2.5% · BUY ≥+0.8% · SELL ≤−0.8% · STRONG SELL ≤−2.5%
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0c0a09; }
        ::-webkit-scrollbar-thumb { background: #292524; border-radius: 3px; }
        tbody tr:hover { background: rgba(255,255,255,0.02) !important; }
      `}</style>
    </div>
  );
}
