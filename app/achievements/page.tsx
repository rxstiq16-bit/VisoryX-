"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AchievementsDisplay } from "@/components/gamification/achievements-display"
import { Leaderboard } from "@/components/gamification/leaderboard"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Star, Zap, Target, Award, TrendingUp } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function AchievementsPage() {
  const { user } = useAuth()
  const { data, isLoading } = useSWR(user ? "/api/achievements" : null, fetcher)

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background pt-24">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Achievements</h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Unlock achievements, earn points, and climb the leaderboard. Every action brings you closer to exclusive rewards.
              </p>
              
              {data?.stats && (
                <div className="mt-8 flex flex-wrap justify-center gap-6">
                  <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 border">
                    <Award className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{data.stats.unlocked}/{data.stats.total}</span>
                    <span className="text-muted-foreground">Unlocked</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 border">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="font-semibold">{data.stats.totalPoints?.toLocaleString()}</span>
                    <span className="text-muted-foreground">Points</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 border">
                    <Zap className="h-5 w-5 text-blue-500" />
                    <span className="font-semibold">{data.stats.totalXP?.toLocaleString()}</span>
                    <span className="text-muted-foreground">XP</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {!user ? (
              <Card className="mx-auto max-w-md text-center">
                <CardHeader>
                  <CardTitle>Sign in to track achievements</CardTitle>
                  <CardDescription>
                    Create an account to start earning achievements and climbing the leaderboard.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <AchievementsDisplay />
                </div>
                <div>
                  <Leaderboard />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-border bg-card/50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center mb-8">How Achievements Work</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <Target className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Complete Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Place orders, leave reviews, refer friends, and engage with the community to unlock achievements.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Star className="h-8 w-8 text-yellow-500 mb-2" />
                  <CardTitle className="text-lg">Earn Points & XP</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Each achievement grants points and XP. Points can be redeemed for rewards, XP increases your level.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
                  <CardTitle className="text-lg">Climb the Ranks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Compete with other members on the leaderboard. Top performers get exclusive perks and recognition.
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
