"use client"

import { useCallback, useEffect, useState } from "react"

type HapticPattern = "light" | "medium" | "heavy" | "success" | "warning" | "error"

const PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: [10, 50, 10],
  warning: [25, 50, 25],
  error: [50, 100, 50],
}

export function useHaptic() {
  const [isSupported, setIsSupported] = useState(false)
  const [isEnabled, setIsEnabled] = useState(true)

  useEffect(() => {
    // Check if vibration API is supported
    setIsSupported("vibrate" in navigator)

    // Check localStorage for haptic preferences
    const hapticPreference = localStorage.getItem("hapticEnabled")
    if (hapticPreference !== null) {
      setIsEnabled(hapticPreference === "true")
    }
  }, [])

  const vibrate = useCallback(
    (pattern: HapticPattern = "light") => {
      if (!isSupported || !isEnabled) return false

      try {
        const vibrationPattern = PATTERNS[pattern]
        return navigator.vibrate(vibrationPattern)
      } catch {
        return false
      }
    },
    [isSupported, isEnabled]
  )

  const toggle = useCallback(() => {
    const newValue = !isEnabled
    setIsEnabled(newValue)
    localStorage.setItem("hapticEnabled", String(newValue))
  }, [isEnabled])

  return {
    isSupported,
    isEnabled,
    vibrate,
    toggle,
    // Convenience methods
    light: () => vibrate("light"),
    medium: () => vibrate("medium"),
    heavy: () => vibrate("heavy"),
    success: () => vibrate("success"),
    warning: () => vibrate("warning"),
    error: () => vibrate("error"),
  }
}
