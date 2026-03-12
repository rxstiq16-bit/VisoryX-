// Common timezones with offsets
export const TIMEZONES = [
  { value: "Pacific/Honolulu", label: "Hawaii (HST)", offset: -10 },
  { value: "America/Anchorage", label: "Alaska (AKST)", offset: -9 },
  { value: "America/Los_Angeles", label: "Pacific Time (PST)", offset: -8 },
  { value: "America/Denver", label: "Mountain Time (MST)", offset: -7 },
  { value: "America/Chicago", label: "Central Time (CST)", offset: -6 },
  { value: "America/New_York", label: "Eastern Time (EST)", offset: -5 },
  { value: "America/Sao_Paulo", label: "Brasilia (BRT)", offset: -3 },
  { value: "UTC", label: "UTC", offset: 0 },
  { value: "Europe/London", label: "London (GMT)", offset: 0 },
  { value: "Europe/Paris", label: "Paris (CET)", offset: 1 },
  { value: "Europe/Berlin", label: "Berlin (CET)", offset: 1 },
  { value: "Europe/Moscow", label: "Moscow (MSK)", offset: 3 },
  { value: "Asia/Dubai", label: "Dubai (GST)", offset: 4 },
  { value: "Asia/Kolkata", label: "India (IST)", offset: 5.5 },
  { value: "Asia/Singapore", label: "Singapore (SGT)", offset: 8 },
  { value: "Asia/Tokyo", label: "Tokyo (JST)", offset: 9 },
  { value: "Australia/Sydney", label: "Sydney (AEST)", offset: 10 },
  { value: "Pacific/Auckland", label: "Auckland (NZST)", offset: 12 },
] as const

export type TimezoneValue = typeof TIMEZONES[number]["value"]

// Get user's timezone
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

// Format date in user's timezone
export function formatInTimezone(
  date: Date | string,
  timezone: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date
  
  return d.toLocaleString("en-US", {
    timeZone: timezone,
    ...options,
  })
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffSecs < 60) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffWeeks < 4) return `${diffWeeks}w ago`
  if (diffMonths < 12) return `${diffMonths}mo ago`
  return `${diffYears}y ago`
}

// Format date with timezone indicator
export function formatDateWithTimezone(
  date: Date | string,
  timezone: string
): string {
  const d = typeof date === "string" ? new Date(date) : date
  
  const formatted = d.toLocaleString("en-US", {
    timeZone: timezone,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
  
  const tz = TIMEZONES.find((t) => t.value === timezone)
  const tzLabel = tz ? tz.label.match(/\(([^)]+)\)/)?.[1] : timezone
  
  return `${formatted} ${tzLabel}`
}

// Get estimated delivery time in user's timezone
export function getEstimatedDelivery(
  turnaroundDays: number,
  timezone: string
): { date: string; time: string } {
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + turnaroundDays)
  
  // Set to end of business day (5 PM)
  deliveryDate.setHours(17, 0, 0, 0)
  
  return {
    date: formatInTimezone(deliveryDate, timezone, {
      weekday: "long",
      month: "long",
      day: "numeric",
    }),
    time: formatInTimezone(deliveryDate, timezone, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    }),
  }
}

// Business hours check
export function isBusinessHours(timezone: string = "America/New_York"): boolean {
  const now = new Date()
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    hour: "numeric",
    hour12: false,
  }
  const hour = parseInt(now.toLocaleString("en-US", options))
  const dayOptions: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    weekday: "short",
  }
  const day = now.toLocaleString("en-US", dayOptions)
  
  const isWeekday = !["Sat", "Sun"].includes(day)
  const isDuringHours = hour >= 9 && hour < 18
  
  return isWeekday && isDuringHours
}
