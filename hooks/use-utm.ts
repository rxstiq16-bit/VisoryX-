"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

interface UTMParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  referrer?: string
}

const UTM_STORAGE_KEY = "visoryx_utm_params"

export function useUTM() {
  const searchParams = useSearchParams()
  const [utmParams, setUtmParams] = useState<UTMParams>({})

  useEffect(() => {
    // Get UTM params from URL
    const params: UTMParams = {
      utm_source: searchParams.get("utm_source") || undefined,
      utm_medium: searchParams.get("utm_medium") || undefined,
      utm_campaign: searchParams.get("utm_campaign") || undefined,
      utm_term: searchParams.get("utm_term") || undefined,
      utm_content: searchParams.get("utm_content") || undefined,
      referrer: typeof document !== "undefined" ? document.referrer : undefined,
    }

    // Filter out undefined values
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined)
    ) as UTMParams

    // If we have UTM params, store them
    if (Object.keys(cleanedParams).length > 0) {
      const existingParams = getStoredUTMParams()
      const mergedParams = { ...existingParams, ...cleanedParams }
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(mergedParams))
      setUtmParams(mergedParams)
    } else {
      // Otherwise, try to get from storage
      setUtmParams(getStoredUTMParams())
    }
  }, [searchParams])

  return utmParams
}

export function getStoredUTMParams(): UTMParams {
  if (typeof window === "undefined") return {}
  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

export function clearUTMParams() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(UTM_STORAGE_KEY)
  }
}

export function buildUTMLink(baseUrl: string, params: UTMParams): string {
  const url = new URL(baseUrl)
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value)
    }
  })
  return url.toString()
}

export function parseUTMFromUrl(url: string): UTMParams {
  try {
    const parsedUrl = new URL(url)
    return {
      utm_source: parsedUrl.searchParams.get("utm_source") || undefined,
      utm_medium: parsedUrl.searchParams.get("utm_medium") || undefined,
      utm_campaign: parsedUrl.searchParams.get("utm_campaign") || undefined,
      utm_term: parsedUrl.searchParams.get("utm_term") || undefined,
      utm_content: parsedUrl.searchParams.get("utm_content") || undefined,
    }
  } catch {
    return {}
  }
}
