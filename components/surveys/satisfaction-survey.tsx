'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Star, ThumbsUp, ThumbsDown, Meh, Smile, Frown, Heart, Send, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { submitSurvey } from '@/lib/surveys'
import { toast } from 'sonner'

interface SatisfactionSurveyProps {
  orderId?: string
  type?: 'nps' | 'csat'
  onComplete?: () => void
  onDismiss?: () => void
  isOpen?: boolean
}

export function SatisfactionSurvey({
  orderId,
  type = 'csat',
  onComplete,
  onDismiss,
  isOpen = true
}: SatisfactionSurveyProps) {
  const [score, setScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const [step, setStep] = useState<'rating' | 'feedback' | 'thanks'>('rating')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (score === null) return

    setIsSubmitting(true)
    try {
      await submitSurvey(
        type,
        {
          score,
          feedback,
          orderId
        },
        orderId,
        score
      )
      setStep('thanks')
      toast.success('Thank you for your feedback!')
      setTimeout(() => {
        onComplete?.()
      }, 2000)
    } catch (error) {
      toast.error('Failed to submit survey')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleScoreSelect = (value: number) => {
    setScore(value)
    setStep('feedback')
  }

  if (type === 'nps') {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss?.()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>How likely are you to recommend VisoryX?</DialogTitle>
            <DialogDescription>
              On a scale of 0-10, how likely are you to recommend us to a friend or colleague?
            </DialogDescription>
          </DialogHeader>

          {step === 'rating' && (
            <div className="space-y-6">
              <div className="flex justify-between gap-1">
                {Array.from({ length: 11 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handleScoreSelect(i)}
                    className={cn(
                      'w-9 h-9 rounded-md text-sm font-medium transition-colors',
                      'hover:bg-primary hover:text-primary-foreground',
                      i <= 6 && 'bg-red-100 text-red-700 hover:bg-red-500 hover:text-white',
                      i > 6 && i < 9 && 'bg-yellow-100 text-yellow-700 hover:bg-yellow-500 hover:text-white',
                      i >= 9 && 'bg-green-100 text-green-700 hover:bg-green-500 hover:text-white'
                    )}
                  >
                    {i}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Not likely at all</span>
                <span>Extremely likely</span>
              </div>
            </div>
          )}

          {step === 'feedback' && (
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-4xl font-bold text-primary">{score}</span>
                <p className="text-sm text-muted-foreground mt-1">
                  {score !== null && score <= 6 && "We're sorry to hear that. How can we improve?"}
                  {score !== null && score > 6 && score < 9 && "Thanks! What could we do better?"}
                  {score !== null && score >= 9 && "That's great! What do you love most about us?"}
                </p>
              </div>
              <Textarea
                placeholder="Share your thoughts (optional)..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep('rating')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </div>
          )}

          {step === 'thanks' && (
            <div className="text-center py-6">
              <Heart className="w-16 h-16 mx-auto text-primary mb-4" />
              <h3 className="text-xl font-semibold">Thank You!</h3>
              <p className="text-muted-foreground mt-2">
                Your feedback helps us improve. You've earned 25 loyalty points!
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    )
  }

  // CSAT Survey (5-star rating)
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss?.()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How was your experience?</DialogTitle>
          <DialogDescription>
            Rate your satisfaction with this order
          </DialogDescription>
        </DialogHeader>

        {step === 'rating' && (
          <div className="space-y-6 py-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleScoreSelect(value)}
                  className="p-2 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      'w-10 h-10 transition-colors',
                      score && score >= value
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground hover:text-yellow-400'
                    )}
                  />
                </button>
              ))}
            </div>
            <div className="flex justify-center gap-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Frown className="w-4 h-4" /> Poor
              </span>
              <span className="flex items-center gap-1">
                <Meh className="w-4 h-4" /> Okay
              </span>
              <span className="flex items-center gap-1">
                <Smile className="w-4 h-4" /> Great
              </span>
            </div>
          </div>
        )}

        {step === 'feedback' && (
          <div className="space-y-4">
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <Star
                  key={value}
                  className={cn(
                    'w-6 h-6',
                    score && score >= value
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  )}
                />
              ))}
            </div>
            <Textarea
              placeholder="Tell us more about your experience (optional)..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('rating')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Sending...' : 'Send Feedback'}
              </Button>
            </div>
          </div>
        )}

        {step === 'thanks' && (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <ThumbsUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold">Thanks for your feedback!</h3>
            <p className="text-muted-foreground mt-2">
              You've earned 25 loyalty points for sharing your thoughts.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Inline mini survey for quick feedback
export function QuickFeedback({
  question = "Was this helpful?",
  onFeedback
}: {
  question?: string
  onFeedback?: (positive: boolean) => void
}) {
  const [submitted, setSubmitted] = useState(false)
  const [response, setResponse] = useState<boolean | null>(null)

  const handleFeedback = (positive: boolean) => {
    setResponse(positive)
    setSubmitted(true)
    onFeedback?.(positive)
  }

  if (submitted) {
    return (
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <Heart className="w-4 h-4 text-primary" />
        Thanks for your feedback!
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">{question}</span>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFeedback(true)}
          className="h-8 px-2"
        >
          <ThumbsUp className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFeedback(false)}
          className="h-8 px-2"
        >
          <ThumbsDown className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
