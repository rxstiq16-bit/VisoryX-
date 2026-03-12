'use client'

import React from "react"
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'

interface Profile {
  id: string
  username: string
  email: string
  display_name: string | null
  avatar_url: string | null
  banner_url?: string | null
  roles: string[]
  role: string
  status?: string
  status_message?: string | null
  availability?: string
  notifications_enabled?: boolean
  mention_notifications?: boolean
  order_notifications?: boolean
  update_notifications?: boolean
  first_login?: boolean
  last_seen?: string
  created_at: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
})

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}



export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string, userEmail?: string, userMeta?: Record<string, unknown>): Promise<Profile | null> => {
    const supabase = createClient()
    if (!supabase) return null
    
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<null>((resolve) => 
        setTimeout(() => resolve(null), 3000)
      )
      
      const fetchPromise = (async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (error || !data) {
          // Profile doesn't exist -- auto-create one so the user isn't stuck
          if (userEmail) {
            const username = userMeta?.username as string || userEmail.split('@')[0]
            const displayName = userMeta?.display_name as string || username
            const { data: newProfile, error: insertErr } = await supabase
              .from('profiles')
              .insert({
                id: userId,
                username: username.toLowerCase(),
                email: userEmail.toLowerCase(),
                display_name: displayName,
                roles: ['customer'],
              })
              .select()
              .single()
            
            if (insertErr || !newProfile) return null
            
            const np = newProfile as Profile & { roles?: string[] }
            return {
              ...np,
              roles: np.roles || ['customer'],
              role: np.roles?.[0] || 'customer',
            } as Profile
          }
          return null
        }
        
        const profileData = data as Profile & { roles?: string[] }
        return {
          ...profileData,
          roles: profileData.roles || [profileData.role || 'customer'],
          role: profileData.roles?.[0] || profileData.role || 'customer',
        } as Profile
      })()
      
      return await Promise.race([fetchPromise, timeoutPromise])
    } catch {
      return null
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user) {
      const profileData = await fetchProfile(user.id, user.email, user.user_metadata)
      if (profileData) {
        setProfile(profileData)
      }
    }
  }, [user, fetchProfile])

  useEffect(() => {
    let mounted = true
    const supabase = createClient()
    
    if (!supabase) {
      setIsLoading(false)
      return
    }

    // Track the current user ID to avoid redundant profile fetches on token refresh
    let currentUserId: string | null = null

    // First, actively restore the session from storage on mount.
    // This is the KEY to persistent sessions - getSession() reads the stored
    // session from localStorage/cookies and restores it immediately.
    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (error) {
          // Session is corrupted - clear it
          await supabase.auth.signOut().catch(() => {})
          setUser(null)
          setProfile(null)
          setIsLoading(false)
          return
        }
        
        if (session?.user) {
          currentUserId = session.user.id
          setUser(session.user)
          const profileData = await fetchProfile(session.user.id, session.user.email, session.user.user_metadata)
          if (mounted) {
            setProfile(profileData)
            setIsLoading(false)
          }
        } else {
          setUser(null)
          setProfile(null)
          setIsLoading(false)
        }
      } catch {
        if (mounted) setIsLoading(false)
      }
    }
    
    initSession()

    // Then listen for subsequent auth changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return
      
      // Skip INITIAL_SESSION since we handle it above with getSession
      if (event === 'INITIAL_SESSION') return
      
      // Token refresh with same user -- just update the user object, skip profile re-fetch
      if (event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          setUser(session.user)
        } else {
          // Token refresh failed -- session is gone
          currentUserId = null
          setUser(null)
          setProfile(null)
        }
        setIsLoading(false)
        return
      }
      
      const newUser = session?.user ?? null
      
      // SIGNED_OUT -- clear everything
      if (!newUser) {
        currentUserId = null
        setUser(null)
        setProfile(null)
        setIsLoading(false)
        return
      }
      
      // Same user signing in again (e.g. tab focus) -- skip profile re-fetch
      if (newUser.id === currentUserId) {
        setUser(newUser)
        setIsLoading(false)
        return
      }
      
      // New user signed in -- fetch their profile
      currentUserId = newUser.id
      setUser(newUser)
      
      const profileData = await fetchProfile(newUser.id, newUser.email, newUser.user_metadata)
      if (mounted) {
        setProfile(profileData)
        setIsLoading(false)
      }
    })

    // Safety timeout - only for edge cases where nothing fires at all
    const timeout = setTimeout(() => {
      if (mounted) setIsLoading(false)
    }, 2500)

    return () => {
      mounted = false
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signOut = useCallback(async () => {
    const supabase = createClient()
    if (supabase) {
      await supabase.auth.signOut().catch(() => {})
    }
    setUser(null)
    setProfile(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
