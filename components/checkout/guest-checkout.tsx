"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { UserPlus, ArrowRight, Mail, User, Shield, Sparkles } from "lucide-react"
import Link from "next/link"

interface GuestCheckoutProps {
  onContinue: (data: { email: string; name: string; createAccount: boolean; password?: string }) => void
  defaultEmail?: string
  defaultName?: string
}

export function GuestCheckout({ onContinue, defaultEmail = "", defaultName = "" }: GuestCheckoutProps) {
  const [email, setEmail] = useState(defaultEmail)
  const [name, setName] = useState(defaultName)
  const [createAccount, setCreateAccount] = useState(true)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!name) {
      newErrors.name = "Name is required"
    }

    if (createAccount) {
      if (!password) {
        newErrors.password = "Password is required"
      } else if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters"
      }

      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onContinue({
        email,
        name,
        createAccount,
        password: createAccount ? password : undefined,
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Checkout as Guest
        </CardTitle>
        <CardDescription>
          Order without creating an account, or create one for order tracking and rewards.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
              />
            </div>
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <Separator />

          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="create-account"
                checked={createAccount}
                onCheckedChange={(checked) => setCreateAccount(!!checked)}
              />
              <div className="space-y-1">
                <Label htmlFor="create-account" className="cursor-pointer font-medium">
                  Create an account
                </Label>
                <p className="text-sm text-muted-foreground">
                  Track orders, earn loyalty points, and get exclusive discounts.
                </p>
              </div>
            </div>

            {createAccount && (
              <div className="mt-4 grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Get <span className="font-medium text-primary">100 bonus points</span> when you create an account!
                  </p>
                </div>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full gap-2">
            Continue to Payment
            <ArrowRight className="h-4 w-4" />
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
