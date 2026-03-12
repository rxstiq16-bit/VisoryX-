"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

interface FeatureFlags {
  // UI Features
  darkModeDefault: boolean
  showSocialProof: boolean
  showLiveChat: boolean
  showAchievements: boolean
  showReferralProgram: boolean
  // Experimental Features
  newCheckoutFlow: boolean
  aiPoweredSuggestions: boolean
  collaborativeEditing: boolean
  advancedAnalytics: boolean
  // Payment Features
  robuxPayments: boolean
  cryptoPayments: boolean
  subscriptionPlans: boolean
  // Integration Features
  discordIntegration: boolean
  robloxIntegration: boolean
  twitchIntegration: boolean
}

const defaultFlags: FeatureFlags = {
  darkModeDefault: true,
  showSocialProof: true,
  showLiveChat: true,
  showAchievements: true,
  showReferralProgram: true,
  newCheckoutFlow: false,
  aiPoweredSuggestions: false,
  collaborativeEditing: false,
  advancedAnalytics: false,
  robuxPayments: true,
  cryptoPayments: false,
  subscriptionPlans: false,
  discordIntegration: true,
  robloxIntegration: true,
  twitchIntegration: false,
}

interface FeatureFlagsContextType {
  flags: FeatureFlags
  isEnabled: (flag: keyof FeatureFlags) => boolean
  setFlag: (flag: keyof FeatureFlags, value: boolean) => void
  resetFlags: () => void
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(undefined)

interface FeatureFlagsProviderProps {
  children: ReactNode
  overrides?: Partial<FeatureFlags>
}

export function FeatureFlagsProvider({ children, overrides }: FeatureFlagsProviderProps) {
  const [flags, setFlags] = useState<FeatureFlags>({ ...defaultFlags, ...overrides })

  useEffect(() => {
    // In production, fetch flags from API or edge config
    const fetchFlags = async () => {
      try {
        const res = await fetch("/api/feature-flags")
        if (res.ok) {
          const remoteFlags = await res.json()
          setFlags(prev => ({ ...prev, ...remoteFlags }))
        }
      } catch {
        // Use default flags on error
      }
    }
    fetchFlags()
  }, [])

  const isEnabled = (flag: keyof FeatureFlags): boolean => {
    return flags[flag] ?? false
  }

  const setFlag = (flag: keyof FeatureFlags, value: boolean) => {
    setFlags(prev => ({ ...prev, [flag]: value }))
  }

  const resetFlags = () => {
    setFlags(defaultFlags)
  }

  return (
    <FeatureFlagsContext.Provider value={{ flags, isEnabled, setFlag, resetFlags }}>
      {children}
    </FeatureFlagsContext.Provider>
  )
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagsContext)
  if (!context) {
    throw new Error("useFeatureFlags must be used within a FeatureFlagsProvider")
  }
  return context
}

// Component to conditionally render based on feature flag
interface FeatureProps {
  flag: keyof FeatureFlags
  children: ReactNode
  fallback?: ReactNode
}

export function Feature({ flag, children, fallback = null }: FeatureProps) {
  const { isEnabled } = useFeatureFlags()
  
  if (isEnabled(flag)) {
    return <>{children}</>
  }
  
  return <>{fallback}</>
}

// Hook for A/B testing
interface ABTestConfig {
  testName: string
  variants: string[]
  weights?: number[]
}

export function useABTest({ testName, variants, weights }: ABTestConfig): string {
  const [variant, setVariant] = useState<string>(variants[0])

  useEffect(() => {
    // Check if user already has an assigned variant
    const stored = localStorage.getItem(`ab_test_${testName}`)
    if (stored && variants.includes(stored)) {
      setVariant(stored)
      return
    }

    // Assign variant based on weights or random
    let selectedVariant: string
    if (weights && weights.length === variants.length) {
      const totalWeight = weights.reduce((a, b) => a + b, 0)
      const random = Math.random() * totalWeight
      let cumulative = 0
      selectedVariant = variants[variants.length - 1]
      for (let i = 0; i < variants.length; i++) {
        cumulative += weights[i]
        if (random < cumulative) {
          selectedVariant = variants[i]
          break
        }
      }
    } else {
      selectedVariant = variants[Math.floor(Math.random() * variants.length)]
    }

    localStorage.setItem(`ab_test_${testName}`, selectedVariant)
    setVariant(selectedVariant)

    // Track variant assignment
    // analytics.track("ab_test_assigned", { testName, variant: selectedVariant })
  }, [testName, variants, weights])

  return variant
}

// Component for A/B testing
interface ABTestProps {
  testName: string
  variants: Record<string, ReactNode>
  weights?: number[]
}

export function ABTest({ testName, variants, weights }: ABTestProps) {
  const variantNames = Object.keys(variants)
  const selectedVariant = useABTest({ 
    testName, 
    variants: variantNames, 
    weights 
  })

  return <>{variants[selectedVariant]}</>
}
