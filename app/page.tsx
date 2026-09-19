"use client";

import { useCallback, useEffect, useState } from "react";
import type { StockData, TokenItem } from "../lib/robinhood";
import { calculatePnL, calculateScenarioValue, calculateTokens } from "../lib/calculations";
import { ANALYSTS } from "../lib/analysts";
import Matrix from "./components/Matrix";

const SCENARIOS = [-20, -10, 0, 10, 20];
const POLL_MS = 30_000;
const LIST_PREVIEW = 24;
// Set only after you have confirmed the official explorer URL, e.g. "https://<explorer>/token/".
const EXPLORER_TOKEN_URL = "";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const tokensFmt = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 });

const signedUsd = (n: number) =>
  Math.abs(n) < 0.005 ? usd.format(0) : (n > 0 ? "+" : "−") + usd.format(Math.abs(n));
const signedPct = (n: number) =>
  Math.abs(n) < 0.005 ? "0.00%" : (n > 0 ? "+" : "−") + Math.abs(n).toFixed(2) + "%";
const tone = (n: number) => (Math.abs(n) < 0.005 ? "" : n > 0 ? "pos" : "neg");
const arrow = (n: number) => (Math.abs(n) < 0.005 ? "" : n > 0 ? "▲ " : "▼ ");
function parseAmount(s: string) {
  const t = s.replace(/[$,\s]/g, "");
  if (t === "" || !/^\d*\.?\d*$/.test(t) || t === ".") return NaN;
  return parseFloat(t);
}

const CHECKLIST = [
  "How much could you lose without it affecting your rent, food, or bills?",
  "How long could you leave this money invested if the price falls?",
  "Do you understand what a Stock Token is, and what it is not (it is not owning the share itself)?",
  "Have you read the sources behind what you are relying on?",
  "Would you make this decision the same way if you had to wait a week?",
];

export default function Page() {
  const [data, setData] = useState<StockData | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [amount, setAmount] = useState("");
  const [custom, setCustom] = useState("");
  const [now, setNow] = useState(Date.now());
  const [tokens, setTokens] = useState<TokenItem[] | null>(null);
  const [tokensErr, setTokensErr] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/stock", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || typeof json.price !== "number" || !(json.price > 0)) throw new Error("bad");
      setData(json as StockData);
      setStatus("ready");
    } catch {
      setData(null); // never keep showing a price we could not refresh
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(() => {
      if (!document.hidden) load();
    }, POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch("/api/assets")
      .then((r) => r.json())
      .then((j) => (Array.isArray(j.tokens) ? setTokens(j.tokens) : setTokensErr(true)))
      .catch(() => setTokensErr(true));
  }, []);

  const retry = () => {
    setStatus("loading");
    load();
  };

  const raw = amount.trim();
  const investment = raw === "" ? NaN : parseAmount(raw);
  const invalid = raw !== "" && !(investment > 0 && investment <= 1e12);
  const price = data?.price ?? NaN;
  const tokenQty = calculateTokens(investment, price);
  const hasResult = status === "ready" && isFinite(tokenQty);
  const ageSec = data ? Math.max(0, Math.round((now - Date.parse(data.updatedAt)) / 1000)) : 0;

  const customRaw = custom.trim();
  const customPrice = customRaw === "" ? NaN : parseAmount(customRaw);
  const customInvalid = customRaw !== "" && !(customPrice > 0);

  const live = status === "ready" && data?.isLive;
  const visibleTokens = tokens ? (showAll ? tokens : tokens.slice(0, LIST_PREVIEW)) : [];

  return (
    <>
      <nav className="nav" aria-label="Main">
        <div className="nav-in">
          <a className="logo" href="#top">Stockgent</a>
          <div className="nav-links">
            <a href="#explore">Explore</a>
            <a href="#onchain">Onchain</a>
            <a href="#analysts">Analysts</a>
          </div>
          <span className={"pill-tag" + (live ? "" : " off")}>
            {status === "loading" ? "CONNECTING" : live ? "LIVE" : status === "ready" ? "DEMO" : "OFFLINE"}
          </span>
        </div>
      </nav>

      <div className="wrap" id="top">
        {/* HERO */}
        <section className="hero" aria-label="Stockgent">
          <div className="frame">
            <div className="frame-label">Tokenized stocks, before you trade</div>
            <div className="hero-body">
              <Matrix />
              <div className="hero-content">
                <h1 className="wordmark">Stockgent</h1>
                <p className="tagline">Know your position before you trade.</p>
                <div className="pills">
                  <a className="pill" href="#explore">Explore market</a>
                  <a className="pill ghost" href="#analysts">What analysts say</a>
                  <button className="pill" disabled aria-disabled="true" title="Stockgent does not execute trades">
                    Trade — coming soon
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EXPLORE MARKET */}
        <section className="sec" id="explore">
          <div className="sec-label">EXPLORE MARKET</div>
          <h2>NVDA Stock Token</h2>

          <div className="card" aria-label="Asset">
            <div className="name">NVIDIA Stock Token</div>
            <div className="price" aria-live="polite">
              {status === "loading" && <span className="muted-lg">Loading live price...</span>}
              {status === "error" && <span className="muted-lg">—</span>}
              {status === "ready" && data && usd.format(data.price)}
            </div>
            {status === "ready" && data && data.isLive && (
              <div className="status">
                <span className="dot" /> Live price · Robinhood Stock Token API · Updated {ageSec}s ago
              </div>
            )}
            {status === "ready" && data && !data.isLive && (
              <div className="status">
                <span className="dot demo" />
                <span className="badge">Demo data</span> Not a live price
              </div>
            )}
            {status === "error" && (
              <div className="notice" role="alert">
                Market data unavailable. We couldn&apos;t retrieve the latest price right now.
                <div>
                  <button className="retry" onClick={retry}>Retry</button>
                </div>
              </div>
            )}
          </div>

          <div className="card" id="simulator" aria-label="Position simulator">
            <label className="big" htmlFor="inv">How much are you considering?</label>
            <div className="field">
              <span aria-hidden="true">$</span>
              <input
                id="inv"
                inputMode="decimal"
                autoComplete="off"
                placeholder="5,000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                aria-describedby="inv-err"
              />
            </div>
            <div className="quick">
              {([["$100", 100], ["$500", 500], ["$1K", 1000], ["$5K", 5000]] as [string, number][]).map(([label, v]) => (
                <button key={label} className="q" onClick={() => setAmount(v.toLocaleString("en-US"))}>{label}</button>
              ))}
            </div>
            <div id="inv-err" className="err-text" role="alert">
              {invalid ? "Enter an amount greater than $0." : ""}
            </div>

            {hasResult && (
              <>
                <div className="hint" style={{ marginTop: 14 }}>Estimated position</div>
                <div className="big-num">{tokensFmt.format(tokenQty)} NVDA tokens</div>
                <div className="rows">
                  <div><span>Investment</span><span>{usd.format(investment)}</span></div>
                  <div><span>Token price</span><span>{usd.format(price)}</span></div>
                </div>
                <div className="formula">tokens = investment ÷ price</div>
              </>
            )}
            {status === "ready" && raw === "" && (
              <p className="hint" style={{ margin: "14px 0 0" }}>
                Enter an amount to see how many tokens it buys and what the position could be worth.
              </p>
            )}
          </div>

          {hasResult && (
            <div className="card" aria-label="Reality check">
              <h2 style={{ fontSize: 18 }}>Reality check</h2>
              <p className="hint" style={{ margin: "-6px 0 10px" }}>Illustrative scenarios — not forecasts.</p>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Move</th>
                    <th scope="col">Price</th>
                    <th scope="col">Position</th>
                    <th scope="col">P&amp;L</th>
                  </tr>
                </thead>
                <tbody>
                  {SCENARIOS.map((p) => {
                    const sp = price * (1 + p / 100);
                    const value = calculateScenarioValue(tokenQty, sp);
                    const pnl = calculatePnL(value, investment);
                    return (
                      <tr key={p}>
                        <td>{p === 0 ? "Current" : (p > 0 ? "+" : "−") + Math.abs(p) + "%"}</td>
                        <td>{usd.format(sp)}</td>
                        <td>{usd.format(value)}</td>
                        <td className={"pnl " + tone(pnl)}>{arrow(pnl)}{signedUsd(pnl)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div style={{ marginTop: 18 }}>
                <label className="big" htmlFor="cust">Try a price</label>
                <div className="field sm">
                  <span aria-hidden="true">$</span>
                  <input
                    id="cust"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="250"
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                  />
                </div>
                <div className="err-text" role="alert">
                  {customInvalid ? "Enter a valid price greater than $0." : ""}
                </div>
                {customPrice > 0 && (() => {
                  const v = calculateScenarioValue(tokenQty, customPrice);
                  const d = calculatePnL(v, investment);
                  const dp = (d / investment) * 100;
                  return (
                    <div className="two">
                      <div><div className="k">At {usd.format(customPrice)}</div><div className="v">{usd.format(v)}</div></div>
                      <div>
                        <div className="k">P&amp;L</div>
                        <div className={"v " + tone(d)}>{arrow(d)}{signedUsd(d)} <span className="hint">({signedPct(dp)})</span></div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </section>

        {/* ONCHAIN */}
        <section className="sec" id="onchain">
          <div className="sec-label">ONCHAIN</div>
          <h2>Where this token lives</h2>
          <div className="card">
            <p style={{ marginTop: 0 }}>
              The NVDA Stock Token is an ERC-20 token on Robinhood Chain. It gives price exposure to NVDA. It is not
              ownership of the underlying share.
            </p>
            <div className="rows">
              <div><span>Asset</span><span>NVDA Stock Token</span></div>
              <div><span>Network</span><span>Robinhood Chain (chain ID 4663)</span></div>
              <div><span>Standard</span><span>ERC-20</span></div>
              <div><span>Price source</span><span>Robinhood Stock Token API</span></div>
              <div>
                <span>Contract</span>
                <span>
                  {data?.contract ? (
                    EXPLORER_TOKEN_URL ? (
                      <a href={EXPLORER_TOKEN_URL + data.contract} target="_blank" rel="noopener noreferrer">{data.contract}</a>
                    ) : (
                      data.contract
                    )
                  ) : (
                    "—"
                  )}
                </span>
              </div>
            </div>
            <div className="formula">
              Token price = mid-point of bid/ask × the token&apos;s current multiplier, refreshed at most every 15 seconds.
              If the feed fails, no price is shown.
            </div>
          </div>
        </section>

        {/* ANALYSTS */}
        <section className="sec" id="analysts">
          <div className="sec-label">WHAT ANALYSTS SAY</div>
          <h2>Analyst &amp; market view</h2>
          <div className="card">
            <p className="hint" style={{ marginTop: 0 }}>Documented opinions from named sources. Not Stockgent recommendations.</p>
            {ANALYSTS.length === 0 ? (
              <div className="warn-box">No sourced analyst views yet.</div>
            ) : (
              ANALYSTS.map((a, i) => (
                <div className="analyst" key={i}>
                  <div className="org">{a.organization} <span className="hint">· {a.date}</span></div>
                  {typeof a.target === "number" && <div>Target: <b>{usd.format(a.target)}</b></div>}
                  <div>{a.view}</div>
                  {a.reasoning && <div className="hint">{a.reasoning}</div>}
                  <a href={a.url} target="_blank" rel="noopener noreferrer">View source →</a>
                </div>
              ))
            )}
          </div>
        </section>

        {/* EXPLORE LISTS */}
        <section className="sec" id="lists">
          <div className="sec-label">EXPLORE LISTS</div>
          <h2>Stock Tokens on Robinhood Chain</h2>
          <div className="card">
            <p className="hint" style={{ marginTop: 0 }}>
              A factual A–Z list of the tokens Robinhood currently lists. It is not ranked and is not a recommendation.
              The simulator supports NVDA only for now.
            </p>
            {tokens === null && !tokensErr && <div className="hint">Loading tokens…</div>}
            {tokensErr && <div className="err-text">Token list temporarily unavailable.</div>}
            {tokens && (
              <>
                <div className="hint">{tokens.length} tokens</div>
                <div className="chips">
                  {visibleTokens.map((t) =>
                    t.symbol === "NVDA" ? (
                      <a key={t.symbol} className="chip on" href="#simulator" title={t.name}>{t.symbol}</a>
                    ) : (
                      <span key={t.symbol} className="chip" title={t.name}>{t.symbol}</span>
                    )
                  )}
                </div>
                {tokens.length > LIST_PREVIEW && (
                  <button className="linkbtn" onClick={() => setShowAll((s) => !s)}>
                    {showAll ? "Show fewer" : `Show all ${tokens.length}`}
                  </button>
                )}
              </>
            )}
          </div>
        </section>

        {/* CHECKLIST */}
        <section className="sec" id="checklist">
          <div className="sec-label">BEFORE YOU INVEST</div>
          <h2>Questions to ask yourself</h2>
          <div className="card">
            <ol className="check">
              {CHECKLIST.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ol>
            <p className="hint" style={{ marginBottom: 0 }}>There are no right answers here. The decision is yours.</p>
          </div>
        </section>

        <footer>
          <div><b>Stockgent</b> · Tokenized-stock position intelligence</div>
          <div>Informational tools only. Not investment advice. Scenarios are illustrative and are not forecasts.</div>
        </footer>
      </div>
    </>
  );
}
