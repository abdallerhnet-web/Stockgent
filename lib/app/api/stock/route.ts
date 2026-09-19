import { NextResponse } from "next/server";
import { fetchNvda, type StockData } from "../../../lib/robinhood";

export const dynamic = "force-dynamic";

const TTL_MS = 15_000;
let cache: { data: StockData; at: number } | null = null;

export async function GET() {
  // Explicit, opt-in demo mode for local development only.
  if (process.env.STOCKGENT_DEMO_MODE === "true") {
    const demo: StockData = {
      symbol: "NVDA",
      name: "NVIDIA Stock Token",
      price: 218.4,
      isLive: false,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(demo, {
      headers: { "Cache-Control": "no-store" },
    });
  }

  if (cache && Date.now() - cache.at < TTL_MS) {
    return NextResponse.json(cache.data, {
      headers: { "Cache-Control": "no-store" },
    });
  }

  try {
    const data = await fetchNvda();
    cache = { data, at: Date.now() };
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("stock fetch failed:", err);

    if (cache) {
      return NextResponse.json(cache.data, {
        headers: { "Cache-Control": "no-store" },
      });
    }

    return NextResponse.json(
      {
        symbol: "NVDA",
        name: "NVIDIA Stock Token",
        price: 0,
        isLive: false,
        updatedAt: new Date().toISOString(),
        error: "Live NVDA price temporarily unavailable",
      },
      {
        status: 502,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
