"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { FileText, Clock, CheckCircle, Loader2, DollarSign } from "lucide-react"

interface QuoteRequestProps {
  onSuccess?: () => void
}

export function QuoteRequest({ onSuccess }: QuoteRequestProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    serviceType: "",
    projectTitle: "",
    description: "",
    budget: "",
    timeline: "",
    additionalNotes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.serviceType || !formData.projectTitle || !formData.description) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setLoading(false)
    setSubmitted(true)
    toast.success("Quote request submitted! We'll get back to you within 24 hours.")
    onSuccess?.()
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Quote Request Submitted</h3>
          <p className="text-muted-foreground mb-4">
            We've received your request and will get back to you within 24 hours with a custom quote.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Expected response time: 24 hours</span>
          </div>
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={() => {
              setSubmitted(false)
              setFormData({
                serviceType: "",
                projectTitle: "",
                description: "",
                budget: "",
                timeline: "",
                additionalNotes: "",
              })
            }}
          >
            Request Another Quote
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle>Request a Custom Quote</CardTitle>
        </div>
        <CardDescription>
          Have a unique project? Get a personalized quote tailored to your needs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type *</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, serviceType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="branding">Branding & Identity</SelectItem>
                  <SelectItem value="discord">Discord Setup</SelectItem>
                  <SelectItem value="gaming">Gaming Graphics</SelectItem>
                  <SelectItem value="marketing">Marketing Materials</SelectItem>
                  <SelectItem value="business">Business Kit</SelectItem>
                  <SelectItem value="custom">Custom Project</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectTitle">Project Title *</Label>
              <Input
                id="projectTitle"
                placeholder="e.g., Brand redesign for my company"
                value={formData.projectTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, projectTitle: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your project in detail. What are your goals? What style are you looking for?"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget Range</Label>
              <Select
                value={formData.budget}
                onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-50">Under $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="100-250">$100 - $250</SelectItem>
                  <SelectItem value="250-500">$250 - $500</SelectItem>
                  <SelectItem value="500-plus">$500+</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">Timeline</Label>
              <Select
                value={formData.timeline}
                onValueChange={(value) => setFormData(prev => ({ ...prev, timeline: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rush">Rush (24-48 hours)</SelectItem>
                  <SelectItem value="standard">Standard (3-5 days)</SelectItem>
                  <SelectItem value="relaxed">Relaxed (1-2 weeks)</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              placeholder="Any additional information, links to inspiration, or specific requirements..."
              rows={3}
              value={formData.additionalNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>No commitment required</span>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Quote Request"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
