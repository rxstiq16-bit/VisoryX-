'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Loader2, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (!username.trim() || username.trim().length < 3) {
      setError('Username must be at least 3 characters')
      return
    }

    if (/[^a-zA-Z0-9_.-]/.test(username)) {
      setError('Username can only contain letters, numbers, dots, hyphens, and underscores')
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      if (!supabase) {
        setError('Unable to connect to authentication service')
        setIsLoading(false)
        return
      }

      // Check if username is taken
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username.toLowerCase())
        .single()

      if (existingUser) {
        setError('That username is already taken')
        setIsLoading(false)
        return
      }

      // Create the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.toLowerCase(),
            display_name: displayName || username,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setIsLoading(false)
        return
      }

      if (data.user) {
        // Create profile
        await supabase.from('profiles').insert({
          id: data.user.id,
          username: username.toLowerCase(),
          email,
          display_name: displayName || username,
          roles: ['client'],
          created_at: new Date().toISOString(),
        })
      }

      router.push('/auth/login?registered=true')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh bg-background">
      {/* Left: Branding panel */}
      <div className="hidden w-1/2 flex-col justify-between bg-card p-12 lg:flex">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to site</span>
          </Link>
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-4xl font-bold tracking-tight text-foreground">
              Join VisoryX
            </h2>
            <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
              Create your free account to place orders, track progress, and get professional designs delivered to you.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {[
              "Place and track orders from your dashboard",
              "Secure payments via Stripe",
              "Direct communication with our design team",
              "Access to exclusive promotions and updates",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground/50">
          visoryx.design
        </p>
      </div>

      {/* Right: Sign up form */}
      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2 lg:px-16">
        <div className="w-full max-w-sm">
          {/* Mobile back link */}
          <div className="mb-8 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to site
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-foreground">Create your account</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Get started with VisoryX in seconds
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Username</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground/60">@</span>
                  <Input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    className="h-11 pl-8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Display Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="John Doe"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="h-11 pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-10"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 pl-10"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="h-11 w-full gap-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-medium text-primary transition-colors hover:text-primary/80">
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-4 text-center text-[11px] text-muted-foreground/50">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-muted-foreground">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline hover:text-muted-foreground">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
