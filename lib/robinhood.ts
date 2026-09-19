// Server-side adapter for the official Robinhood Stock Token REST API.
// Docs: https://docs.robinhood.com/chain/stock-token-apis/
//
// /prices/{symbol} returns the RAW underlying-equity bid/ask (not multiplier-adjusted).
// /assets returns currentMultiplier. Token-equivalent price = underlying price x currentMultiplier.

const BASE = "https://api.robinhood.com/rhj";
const SYMBOL = "NVDA";
const CHAIN_ID = 4663;

export type StockData = {
  symbol: string;
  name: string;
  price: number;
  isLive: boolean;
  updatedAt: string;
  contract?: string;
};

export type TokenItem = { symbol: string; name: string };

type Deployment = { chainId?: number; contractAddress?: string };
type Asset = {
  tokenSymbol?: string;
  tokenName?: string;
  currentMultiplier?: string;
  deployments?: Deployment[];
};
type Quote = { bid?: string; ask?: string; generatedAt?: string };

async function getJson(path: string): Promise<any> {
  const res = await fetch(BASE + path, {
    cache: "no-store",
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Robinhood ${path} responded ${res.status}`);
  return res.json();
}

export async function fetchNvda(): Promise<StockData> {
  const [assetsRes, pricesRes] = await Promise.all([
    getJson("/assets"),
    getJson(`/prices/${SYMBOL}`),
  ]);

  const asset: Asset | undefined = (assetsRes.assets ?? []).find(
    (a: Asset) => a.tokenSymbol === SYMBOL
  );
  if (!asset) throw new Error(`${SYMBOL} not found in /assets`);

  const quote: Quote = pricesRes.quotes?.[0] ?? pricesRes;
  const bid = Number(quote.bid);
  const ask = Number(quote.ask);
  const multiplier = Number(asset.currentMultiplier);

  if (!(bid > 0) || !(ask > 0)) throw new Error("Invalid bid/ask");
  if (!(multiplier > 0)) throw new Error("Invalid multiplier");

  const deployment =
    (asset.deployments ?? []).find((d) => d.chainId === CHAIN_ID) ?? (asset.deployments ?? [])[0];

  return {
    symbol: SYMBOL,
    name: "NVIDIA Stock Token",
    price: ((bid + ask) / 2) * multiplier,
    isLive: true,
    updatedAt: quote.generatedAt ?? new Date().toISOString(),
    contract: deployment?.contractAddress,
  };
}

/** Factual list of Stock Tokens Robinhood currently lists. Sorted A-Z. No ranking. */
export async function fetchTokenList(): Promise<TokenItem[]> {
  const res = await getJson("/assets");
  const items: TokenItem[] = (res.assets ?? [])
    .filter((a: Asset) => a.tokenSymbol)
    .map((a: Asset) => ({ symbol: String(a.tokenSymbol), name: String(a.tokenName ?? a.tokenSymbol) }));
  return items.sort((a, b) => a.symbol.localeCompare(b.symbol));
    }
