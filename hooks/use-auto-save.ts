"use client"

import { useEffect, useRef, useCallback } from "react"

interface UseAutoSaveOptions<T> {
  key: string
  data: T
  delay?: number
  onRestore?: (data: T) => void
}

export function useAutoSave<T>({ key, data, delay = 1000, onRestore }: UseAutoSaveOptions<T>) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initialLoadRef = useRef(true)

  // Save data with debounce
  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false
      return
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }))
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [key, data, delay])

  // Restore data on mount
  const restore = useCallback(() => {
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        const { data: savedData, timestamp } = JSON.parse(stored)
        // Only restore if saved within the last 24 hours
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          onRestore?.(savedData)
          return savedData
        } else {
          localStorage.removeItem(key)
        }
      } catch {
        localStorage.removeItem(key)
      }
    }
    return null
  }, [key, onRestore])

  // Clear saved data
  const clear = useCallback(() => {
    localStorage.removeItem(key)
  }, [key])

  // Check if there's saved data
  const hasSavedData = useCallback(() => {
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        const { timestamp } = JSON.parse(stored)
        return Date.now() - timestamp < 24 * 60 * 60 * 1000
      } catch {
        return false
      }
    }
    return false
  }, [key])

  return { restore, clear, hasSavedData }
}
