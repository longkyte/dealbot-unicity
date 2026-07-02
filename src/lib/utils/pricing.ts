export function formatAssetPrice(price: number, currency: string = "UCT"): string {
  return `${price.toFixed(2)} ${currency}`;
}

export function calculateMidpoint(priceA: number, priceB: number): number {
  return Number(((priceA + priceB) / 2).toFixed(4));
}

export function parseTokenUnits(amountStr: string, decimals: number = 6): bigint {
  const parts = amountStr.split(".");
  const integerPart = parts[0];
  const fractionalPart = (parts[1] || "").padEnd(decimals, "0").substring(0, decimals);
  return BigInt(integerPart + fractionalPart);
}
