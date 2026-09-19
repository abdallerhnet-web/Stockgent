import { NextResponse } from "next/server";
import { fetchNvda, type StockData } from "../../../lib/robinhood";

export const dynamic = "force-dynamic";

const TTL_MS = 15_000;
let cache: { data: StockData; at: number } | null = null;

export async function GET() {
  // Explicit, opt-in demo mode for local development only. Always flagged isLive: false.
  if (process.env.STOCKGENT_DEMO_MODE === "true") {
    const demo: StockData = {
      symbol: "NVDA",
      name: "NVIDIA Stock Token",
      price: 218.4,
      isLive: false,
      updatedAt: new Date().toISOString(),
    };
    return NextResponse.json(demo);
  }

  if (cache && Date.now() - cache.at < TTL_MS) {
    return NextResponse.json(cache.data);
  }

  try {
    const data = await fetchNvda();
    cache = { data, at: Date.now() };
    return NextResponse.json(data);
  } catch (err) {
    console.error("stock fetch failed:", err);
    return NextResponse.json(
      { error: "Live NVDA price temporarily unavailable" },
      { status: 502 }
    );
  }
}
