'use client'

import React from "react"
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Mail, Lock, Loader2, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const justRegistered = searchParams.get('registered') === 'true'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    if (!supabase) {
      setError('Unable to connect to authentication service')
      setIsLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    window.location.href = '/dashboard'
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
              Design Beyond Vision
            </h2>
            <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
              Access your orders, track project progress, and connect with the VisoryX design team.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {[
              "Track your active orders in real-time",
              "Download completed deliverables",
              "Communicate directly with your designer",
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

      {/* Right: Login form */}
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
            <h1 className="font-display text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to your VisoryX account
            </p>
          </div>

          {justRegistered && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-4 w-4 shrink-0" />
              Account created successfully! You can now sign in.
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</Label>
                <Link href="/auth/forgot-password" className="text-xs font-medium text-primary hover:underline underline-offset-4">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-10"
                  placeholder="Enter your password"
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
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {"Don't have an account? "}
              <Link href="/auth/sign-up" className="font-medium text-primary transition-colors hover:text-primary/80">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
