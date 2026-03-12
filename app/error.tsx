"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RefreshCw, MessageSquare } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
        </div>

        <h1 className="mb-2 text-3xl font-bold tracking-tight">Something went wrong</h1>
        <p className="mb-6 text-muted-foreground">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>

        {error.digest && (
          <p className="mb-6 rounded-lg bg-muted px-4 py-2 font-mono text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">
              <MessageSquare className="mr-2 h-4 w-4" />
              Contact Support
            </Link>
          </Button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          If this problem persists, please{" "}
          <Link href="/contact" className="text-primary hover:underline">
            contact our support team
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
