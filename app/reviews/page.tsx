"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Star, Send, CheckCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { cn } from "@/lib/utils"
import { addReview, getReviews, type Review } from "@/lib/reviews-store"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { format } from "date-fns"
import { Suspense } from "react"

function ReviewForm() {
  const searchParams = useSearchParams()
  const [name, setName] = useState(searchParams.get("name") || "")
  const [service, setService] = useState(searchParams.get("service") || "")
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !reviewText.trim()) return
    setSubmitting(true)
    const result = await addReview({
      customerName: name,
      designerName: "VisoryX Team",
      review: reviewText,
      rating,
      service: service || undefined,
      status: "pending",
    })
    if (result) setSubmitted(true)
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 mb-4">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Thank you for your review!</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Your feedback means a lot to us. Your review will appear on our website once approved.
          </p>
          <Button asChild className="mt-6" variant="outline">
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Leave a Review</CardTitle>
        <CardDescription>
          Share your experience working with VisoryX. Your feedback helps us improve and helps others find us.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-2">
            <Label htmlFor="name">Your Name *</Label>
            <Input
              id="name"
              placeholder="Your name or username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="service">Service Received</Label>
            <Input
              id="service"
              placeholder="e.g. Logo Design, ERLC Liveries, etc."
              value={service}
              onChange={(e) => setService(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Rating *</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-0.5 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "h-7 w-7 transition-colors",
                      (hoverRating ? star <= hoverRating : star <= rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted-foreground/30"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="review">Your Review *</Label>
            <Textarea
              id="review"
              placeholder="Tell us about your experience..."
              rows={5}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={submitting || !name.trim() || !reviewText.trim()} className="w-full gap-2">
            {submitting ? "Submitting..." : <><Send className="h-4 w-4" />Submit Review</>}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function PublishedReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getReviews()
      setReviews(data.filter((r) => r.status === "published"))
      setLoading(false)
    }
    load()
  }, [])

  if (loading || reviews.length === 0) return null

  return (
    <div className="mt-16 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-6">What Others Are Saying</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {reviews.slice(0, 8).map((review) => (
          <Card key={review.id} className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {review.customerName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{review.customerName}</p>
                  {review.service && (
                    <p className="text-xs text-muted-foreground">{review.service}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={cn(
                      "h-3.5 w-3.5",
                      s <= review.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
                    )}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                &ldquo;{review.review}&rdquo;
              </p>
              <p className="mt-3 text-[11px] text-muted-foreground/50">
                {format(new Date(review.createdAt), "MMM d, yyyy")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function ReviewsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild className="gap-1.5 mb-4">
              <Link href="/"><ArrowLeft className="h-3.5 w-3.5" />Back to Home</Link>
            </Button>
          </div>
          <Suspense fallback={null}>
            <ReviewForm />
          </Suspense>
          <Suspense fallback={null}>
            <PublishedReviews />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
