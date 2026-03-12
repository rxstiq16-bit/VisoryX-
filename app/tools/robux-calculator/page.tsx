import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { RobuxCalculator } from "@/components/robux-calculator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, DollarSign, Info, ArrowRight } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Robux Calculator | VisoryX Tools",
  description: "Calculate Robux to USD conversion rates. Estimate DevEx earnings and understand Roblox currency exchange.",
}

export default function RobuxCalculatorPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-gradient-to-b from-green-500/5 to-background pt-24">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">
                <Calculator className="h-8 w-8 text-green-500" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Robux Calculator</h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Convert between Robux and USD. Understand DevEx rates and estimate your earnings.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <RobuxCalculator />
          </div>
        </section>

        {/* Info Section */}
        <section className="border-t border-border bg-card/50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center mb-8">Understanding Robux Exchange Rates</h2>
            
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <DollarSign className="h-8 w-8 text-green-500 mb-2" />
                  <CardTitle className="text-lg">DevEx Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The Developer Exchange (DevEx) program lets creators cash out Robux at a rate of approximately 
                    $0.0035 per Robux, or 285 Robux per $1 USD.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <ArrowRight className="h-8 w-8 text-blue-500 mb-2" />
                  <CardTitle className="text-lg">Purchase Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    When purchasing Robux, the rate varies based on the package. Premium members get bonus Robux, 
                    typically around 80-100 Robux per $1 USD.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Info className="h-8 w-8 text-orange-500 mb-2" />
                  <CardTitle className="text-lg">Important Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    DevEx requires a minimum of 30,000 Robux to cash out. Rates are subject to change by Roblox. 
                    Always check official sources for current rates.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
