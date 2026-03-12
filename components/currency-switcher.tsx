"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DollarSign, Check } from "lucide-react"
import { CURRENCIES, type CurrencyCode, convertAndFormat } from "@/lib/currency"
import { cn } from "@/lib/utils"

// Context
interface CurrencyContextType {
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => void
  format: (amountUSD: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | null>(null)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD")

  const setCurrency = (newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency)
    localStorage.setItem("currency", newCurrency)
  }

  const format = (amountUSD: number) => {
    return convertAndFormat(amountUSD, currency)
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}

// Price display component
interface PriceProps {
  amount: number // Always in USD
  className?: string
  showOriginal?: boolean
}

export function Price({ amount, className, showOriginal }: PriceProps) {
  const { currency, format } = useCurrency()
  
  if (currency === "USD" || !showOriginal) {
    return <span className={className}>{format(amount)}</span>
  }

  return (
    <span className={className}>
      {format(amount)}
      <span className="ml-1 text-xs text-muted-foreground">
        (${amount.toFixed(2)} USD)
      </span>
    </span>
  )
}

// Switcher component
interface CurrencySwitcherProps {
  variant?: "default" | "compact"
  className?: string
}

export function CurrencySwitcher({ variant = "default", className }: CurrencySwitcherProps) {
  const { currency, setCurrency } = useCurrency()
  const currentCurrency = CURRENCIES[currency]

  if (variant === "compact") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={className}>
            <DollarSign className="h-4 w-4" />
            <span className="sr-only">Change currency</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {(Object.entries(CURRENCIES) as [CurrencyCode, typeof CURRENCIES[CurrencyCode]][]).map(
            ([code, { symbol, name }]) => (
              <DropdownMenuItem
                key={code}
                onClick={() => setCurrency(code)}
                className="flex items-center gap-2"
              >
                <span className="w-6 text-center">{symbol}</span>
                <span>{name}</span>
                {currency === code && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn("gap-2", className)}>
          <span>{currentCurrency.symbol}</span>
          <span>{currency}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {(Object.entries(CURRENCIES) as [CurrencyCode, typeof CURRENCIES[CurrencyCode]][]).map(
          ([code, { symbol, name }]) => (
            <DropdownMenuItem
              key={code}
              onClick={() => setCurrency(code)}
              className="flex items-center gap-2"
            >
              <span className="w-6 text-center">{symbol}</span>
              <span className="flex-1">{name}</span>
              <span className="text-muted-foreground">{code}</span>
              {currency === code && <Check className="ml-2 h-4 w-4" />}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
