// Full precision internally. Format only when displaying.

/** tokens = investment / price */
export function calculateTokens(investment: number, price: number): number {
  if (!(investment > 0) || !(price > 0) || !isFinite(investment) || !isFinite(price)) return NaN;
  return investment / price;
}

/** position value = tokens x price */
export function calculateScenarioValue(tokens: number, price: number): number {
  return tokens * price;
}

/** P&L = position value - investment */
export function calculatePnL(positionValue: number, investment: number): number {
  return positionValue - investment;
}
