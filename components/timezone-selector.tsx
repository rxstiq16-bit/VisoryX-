"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Clock } from "lucide-react"
import { TIMEZONES, getUserTimezone, formatInTimezone, type TimezoneValue } from "@/lib/timezone"
import { cn } from "@/lib/utils"

// Context
interface TimezoneContextType {
  timezone: string
  setTimezone: (tz: string) => void
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string
}

const TimezoneContext = createContext<TimezoneContextType | null>(null)

export function TimezoneProvider({ children }: { children: ReactNode }) {
  const [timezone, setTimezoneState] = useState<string>("UTC")

  useEffect(() => {
    // Initialize with user's timezone
    const saved = localStorage.getItem("timezone")
    if (saved) {
      setTimezoneState(saved)
    } else {
      setTimezoneState(getUserTimezone())
    }
  }, [])

  const setTimezone = (tz: string) => {
    setTimezoneState(tz)
    localStorage.setItem("timezone", tz)
  }

  const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    return formatInTimezone(date, timezone, options)
  }

  return (
    <TimezoneContext.Provider value={{ timezone, setTimezone, formatDate }}>
      {children}
    </TimezoneContext.Provider>
  )
}

export function useTimezone() {
  const context = useContext(TimezoneContext)
  if (!context) {
    throw new Error("useTimezone must be used within a TimezoneProvider")
  }
  return context
}

// Selector component
interface TimezoneSelectorProps {
  className?: string
  showCurrentTime?: boolean
}

export function TimezoneSelector({ className, showCurrentTime = false }: TimezoneSelectorProps) {
  const { timezone, setTimezone, formatDate } = useTimezone()
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    if (showCurrentTime) {
      const update = () => {
        setCurrentTime(
          formatDate(new Date(), {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })
        )
      }
      update()
      const interval = setInterval(update, 1000)
      return () => clearInterval(interval)
    }
  }, [showCurrentTime, formatDate])

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Clock className="h-4 w-4 text-muted-foreground" />
      <Select value={timezone} onValueChange={setTimezone}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select timezone" />
        </SelectTrigger>
        <SelectContent>
          {TIMEZONES.map((tz) => (
            <SelectItem key={tz.value} value={tz.value}>
              {tz.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showCurrentTime && (
        <span className="text-sm text-muted-foreground tabular-nums">
          {currentTime}
        </span>
      )}
    </div>
  )
}

// Formatted date display
interface FormattedDateProps {
  date: Date | string
  format?: "short" | "long" | "relative" | "full"
  className?: string
}

export function FormattedDate({ date, format = "short", className }: FormattedDateProps) {
  const { formatDate } = useTimezone()

  const getOptions = (): Intl.DateTimeFormatOptions => {
    switch (format) {
      case "short":
        return { month: "short", day: "numeric" }
      case "long":
        return { month: "long", day: "numeric", year: "numeric" }
      case "full":
        return {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }
      default:
        return {}
    }
  }

  return <span className={className}>{formatDate(date, getOptions())}</span>
}
