import { NextResponse } from "next/server";
import { fetchTokenList, type TokenItem } from "../../../lib/robinhood";

export const dynamic = "force-dynamic";

const TTL_MS = 5 * 60_000;
let cache: { tokens: TokenItem[]; at: number } | null = null;

export async function GET() {
  if (cache && Date.now() - cache.at < TTL_MS) {
    return NextResponse.json({ tokens: cache.tokens });
  }
  try {
    const tokens = await fetchTokenList();
    cache = { tokens, at: Date.now() };
    return NextResponse.json({ tokens });
  } catch (err) {
    console.error("assets fetch failed:", err);
    return NextResponse.json({ error: "Token list temporarily unavailable" }, { status: 502 });
  }
}
