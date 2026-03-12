"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe, Check } from "lucide-react"
import { useI18n, LOCALES, type Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface LanguageSwitcherProps {
  variant?: "default" | "compact" | "full"
  className?: string
}

export function LanguageSwitcher({ variant = "default", className }: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n()
  const currentLocale = LOCALES[locale]

  if (variant === "compact") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={className}>
            <Globe className="h-4 w-4" />
            <span className="sr-only">Change language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {(Object.entries(LOCALES) as [Locale, typeof LOCALES[Locale]][]).map(
            ([code, { name, flag }]) => (
              <DropdownMenuItem
                key={code}
                onClick={() => setLocale(code)}
                className="flex items-center gap-2"
              >
                <span>{flag}</span>
                <span>{name}</span>
                {locale === code && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  if (variant === "full") {
    return (
      <div className={cn("grid grid-cols-2 gap-2 sm:grid-cols-4", className)}>
        {(Object.entries(LOCALES) as [Locale, typeof LOCALES[Locale]][]).map(
          ([code, { name, flag }]) => (
            <Button
              key={code}
              variant={locale === code ? "default" : "outline"}
              onClick={() => setLocale(code)}
              className="flex items-center gap-2"
            >
              <span>{flag}</span>
              <span>{name}</span>
            </Button>
          )
        )}
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn("gap-2", className)}>
          <span>{currentLocale.flag}</span>
          <span className="hidden sm:inline">{currentLocale.name}</span>
          <Globe className="h-4 w-4 sm:hidden" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {(Object.entries(LOCALES) as [Locale, typeof LOCALES[Locale]][]).map(
          ([code, { name, flag }]) => (
            <DropdownMenuItem
              key={code}
              onClick={() => setLocale(code)}
              className="flex items-center gap-2"
            >
              <span>{flag}</span>
              <span>{name}</span>
              {locale === code && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
