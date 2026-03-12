'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Lock, Loader2, CheckCircle, ShieldAlert } from 'lucide-react'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [hasSession, setHasSession] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Supabase automatically handles the token exchange from the URL hash
    const supabase = createClient()
    if (!supabase) {
      setHasSession(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session)
    })

    // Listen for auth state changes (token exchange from URL)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setHasSession(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      if (!supabase) throw new Error("Service unavailable")

      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setSuccess(true)

      // Redirect to login after 3 seconds
      setTimeout(() => router.push('/auth/login'), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state
  if (hasSession === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // No valid session -- link expired or invalid
  if (!hasSession) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md">
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                  <ShieldAlert className="h-6 w-6 text-destructive" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Invalid or expired link</h2>
                <p className="text-sm text-muted-foreground">
                  This password reset link has expired or is invalid. Please request a new one.
                </p>
                <Link href="/auth/forgot-password">
                  <Button>Request new link</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="border-border bg-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-foreground">Set New Password</CardTitle>
              <CardDescription>
                {success ? "Password updated successfully" : "Enter your new password below"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="flex flex-col items-center gap-4 py-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    Your password has been updated. Redirecting to sign in...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-5">
                    <div className="grid gap-2">
                      <Label htmlFor="password">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="At least 8 characters"
                          required
                          minLength={8}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Re-enter your password"
                          required
                          minLength={8}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    {error && (
                      <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                      </div>
                    )}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update password'
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
