import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Mail, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Page() {
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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-display text-2xl">
                Check your email
              </CardTitle>
              <CardDescription>
                We&apos;ve sent you a confirmation link
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                You&apos;ve successfully signed up for VisoryX! Please check your email 
                inbox and click the confirmation link to activate your account.
              </p>
              <p className="text-center text-xs text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder or try signing up again.
              </p>
              <div className="pt-2">
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full bg-transparent">
                    Back to login
                    <ArrowRight className="ml-2 h-4 w-4" />
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
