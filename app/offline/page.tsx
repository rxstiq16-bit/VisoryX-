import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WifiOff, RefreshCw, Home, Clock, FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Offline | VisoryX",
  description: "You appear to be offline. Some features may be unavailable.",
}

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="relative mx-auto">
          <div className="absolute inset-0 animate-ping rounded-full bg-amber-500/20" />
          <div className="relative flex h-24 w-24 mx-auto items-center justify-center rounded-full bg-amber-500/10">
            <WifiOff className="h-12 w-12 text-amber-500" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">You're Offline</h1>
          <p className="text-muted-foreground">
            It looks like you've lost your internet connection. Some features may be unavailable until you're back online.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button onClick={() => window.location.reload()} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Available offline features */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Available Offline</CardTitle>
            <CardDescription className="text-xs">
              These features work without internet
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>View cached pages</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Draft order forms (sync when online)</span>
            </div>
          </CardContent>
        </Card>

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Waiting for connection...</span>
        </div>
      </div>
    </div>
  )
}
