"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  Trophy, Clock, Users, Star, Upload, Heart, 
  Award, Flame, Target, Gift
} from "lucide-react"

interface Challenge {
  id: string
  title: string
  description: string
  prize: string
  prizeValue: number
  deadline: Date
  participants: number
  submissions: number
  status: "active" | "voting" | "ended"
  category: string
  image?: string
}

interface Submission {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  image: string
  likes: number
  rank?: number
}

export function DesignChallenges() {
  const challenges: Challenge[] = [
    {
      id: "1",
      title: "ERLC Emergency Vehicle Challenge",
      description: "Design the most realistic and detailed emergency vehicle livery for ERLC. Creativity and attention to detail are key!",
      prize: "Featured Portfolio Spot + $50 Credit",
      prizeValue: 50,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      participants: 47,
      submissions: 32,
      status: "active",
      category: "ERLC",
    },
    {
      id: "2",
      title: "Discord Server Rebrand",
      description: "Create a complete Discord branding package including server icon, banner, and role icons.",
      prize: "1 Month Free Pro Subscription",
      prizeValue: 79,
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      participants: 89,
      submissions: 67,
      status: "voting",
      category: "Discord",
    },
  ]

  const topSubmissions: Submission[] = [
    { id: "1", userId: "u1", userName: "DesignMaster", userAvatar: "/avatars/1.jpg", image: "/submissions/1.jpg", likes: 234, rank: 1 },
    { id: "2", userId: "u2", userName: "ArtCreator", userAvatar: "/avatars/2.jpg", image: "/submissions/2.jpg", likes: 189, rank: 2 },
    { id: "3", userId: "u3", userName: "PixelPro", userAvatar: "/avatars/3.jpg", image: "/submissions/3.jpg", likes: 156, rank: 3 },
  ]

  const getDaysLeft = (deadline: Date) => {
    const days = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days
  }

  const getStatusColor = (status: Challenge["status"]) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-500"
      case "voting": return "bg-yellow-500/10 text-yellow-500"
      case "ended": return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
          <Trophy className="h-5 w-5" />
          <span className="font-medium">Design Challenges</span>
        </div>
        <h1 className="mt-4 text-3xl font-bold">Compete. Create. Win.</h1>
        <p className="mt-2 text-muted-foreground">
          Showcase your skills, win prizes, and get featured in our portfolio
        </p>
      </div>

      {/* Active Challenges */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Active Challenges</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {challenges.map((challenge) => (
            <Card key={challenge.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge className={getStatusColor(challenge.status)}>
                    {challenge.status === "active" && <Flame className="mr-1 h-3 w-3" />}
                    {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                  </Badge>
                  <Badge variant="outline">{challenge.category}</Badge>
                </div>
                <CardTitle className="mt-2">{challenge.title}</CardTitle>
                <CardDescription>{challenge.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3">
                  <Gift className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Prize</div>
                    <div className="text-sm text-muted-foreground">{challenge.prize}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      {getDaysLeft(challenge.deadline)}
                    </div>
                    <div className="text-xs text-muted-foreground">Days Left</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      {challenge.participants}
                    </div>
                    <div className="text-xs text-muted-foreground">Participants</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      {challenge.submissions}
                    </div>
                    <div className="text-xs text-muted-foreground">Submissions</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  {challenge.status === "active" ? (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Submit Entry
                    </>
                  ) : (
                    <>
                      <Heart className="mr-2 h-4 w-4" />
                      Vote Now
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Top Submissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Top Submissions This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {topSubmissions.map((submission) => (
              <div key={submission.id} className="relative overflow-hidden rounded-lg border">
                {submission.rank && submission.rank <= 3 && (
                  <div className="absolute left-2 top-2 z-10">
                    <Badge className={
                      submission.rank === 1 ? "bg-yellow-500" :
                      submission.rank === 2 ? "bg-slate-400" :
                      "bg-orange-500"
                    }>
                      #{submission.rank}
                    </Badge>
                  </div>
                )}
                <div className="aspect-video bg-muted" />
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={submission.userAvatar} />
                        <AvatarFallback>{submission.userName[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{submission.userName}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Heart className="h-4 w-4" />
                      {submission.likes}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Past Winners */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Hall of Fame
          </CardTitle>
          <CardDescription>Previous challenge winners</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <Avatar className="mx-auto h-16 w-16">
                  <AvatarFallback>W{i}</AvatarFallback>
                </Avatar>
                <div className="mt-2 font-medium">Winner {i}</div>
                <div className="text-xs text-muted-foreground">Challenge Name</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
