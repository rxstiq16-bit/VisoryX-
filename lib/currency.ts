// Supported currencies with exchange rates (relative to USD)
export const CURRENCIES = {
  USD: { symbol: "$", name: "US Dollar", rate: 1, position: "before" },
  EUR: { symbol: "€", name: "Euro", rate: 0.92, position: "before" },
  GBP: { symbol: "£", name: "British Pound", rate: 0.79, position: "before" },
  CAD: { symbol: "C$", name: "Canadian Dollar", rate: 1.36, position: "before" },
  AUD: { symbol: "A$", name: "Australian Dollar", rate: 1.53, position: "before" },
  JPY: { symbol: "¥", name: "Japanese Yen", rate: 149.50, position: "before", decimals: 0 },
  CNY: { symbol: "¥", name: "Chinese Yuan", rate: 7.24, position: "before" },
  INR: { symbol: "₹", name: "Indian Rupee", rate: 83.12, position: "before" },
  BRL: { symbol: "R$", name: "Brazilian Real", rate: 4.97, position: "before" },
  MXN: { symbol: "$", name: "Mexican Peso", rate: 17.15, position: "before" },
} as const

export type CurrencyCode = keyof typeof CURRENCIES

// Convert amount from USD to target currency
export function convertCurrency(
  amountUSD: number,
  targetCurrency: CurrencyCode
): number {
  const rate = CURRENCIES[targetCurrency].rate
  return amountUSD * rate
}

// Format price with currency symbol
export function formatPrice(
  amount: number,
  currency: CurrencyCode = "USD",
  options?: { showCode?: boolean }
): string {
  const { symbol, position, decimals = 2 } = CURRENCIES[currency]
  const formattedAmount = amount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  
  const price = position === "before" 
    ? `${symbol}${formattedAmount}`
    : `${formattedAmount}${symbol}`
  
  if (options?.showCode) {
    return `${price} ${currency}`
  }
  
  return price
}

// Convert and format price
export function convertAndFormat(
  amountUSD: number,
  targetCurrency: CurrencyCode,
  options?: { showCode?: boolean }
): string {
  const converted = convertCurrency(amountUSD, targetCurrency)
  return formatPrice(converted, targetCurrency, options)
}

// Get user's preferred currency from locale
export function getCurrencyFromLocale(locale: string): CurrencyCode {
  const localeCurrencyMap: Record<string, CurrencyCode> = {
    "en-US": "USD",
    "en-GB": "GBP",
    "en-CA": "CAD",
    "en-AU": "AUD",
    "es": "EUR",
    "es-MX": "MXN",
    "fr": "EUR",
    "de": "EUR",
    "ja": "JPY",
    "zh": "CNY",
    "pt-BR": "BRL",
    "hi": "INR",
  }
  
  return localeCurrencyMap[locale] ?? "USD"
}

// Robux conversion (approximate - 1 USD = ~80 Robux at DevEx rate)
export const ROBUX_RATE = 80

export function usdToRobux(amountUSD: number): number {
  return Math.ceil(amountUSD * ROBUX_RATE)
}

export function robuxToUSD(robux: number): number {
  return robux / ROBUX_RATE
}

export function formatRobux(amount: number): string {
  return `R$${amount.toLocaleString()}`
}
