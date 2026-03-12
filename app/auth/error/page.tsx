import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          {/* Logo/Brand */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <span className="font-display text-xl font-bold">V</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">VisoryX</h1>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="font-display text-2xl">
                Authentication Error
              </CardTitle>
              <CardDescription>
                Something went wrong during authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {params?.error ? (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  Error: {params.error}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  An unspecified error occurred during the authentication process. 
                  Please try again or contact support if the issue persists.
                </p>
              )}
              <div className="flex gap-3 pt-2">
                <Link href="/auth/login" className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                  </Button>
                </Link>
                <Link href="/auth/sign-up" className="flex-1">
                  <Button className="w-full">
                    Try again
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
