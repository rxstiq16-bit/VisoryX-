"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { sendApplicationReceivedEmail } from "@/app/actions/email"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { CheckCircle2, Loader2, Send, Briefcase, Palette, Shield, Headphones } from "lucide-react"

const POSITIONS = [
  {
    value: "designer",
    label: "Designer",
    icon: Palette,
    description: "Create logos, branding, liveries, and other visual assets for clients.",
  },
  {
    value: "community_moderator",
    label: "Community Moderator",
    icon: Shield,
    description: "Moderate reviews, handle tickets, and assist members in Discord.",
  },
  {
    value: "design_lead",
    label: "Design Lead",
    icon: Briefcase,
    description: "Oversee design projects, assign designers, and manage uploads.",
  },
]

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")

  const [form, setForm] = useState({
    name: "",
    email: "",
    discord_username: "",
    portfolio_url: "",
    experience: "",
    why_join: "",
    availability: "",
  })

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !selectedRole || !form.why_join) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("applications").insert({
        name: form.name,
        email: form.email.toLowerCase(),
        discord_username: form.discord_username || null,
        role: selectedRole,
        portfolio_url: form.portfolio_url || null,
        experience: form.experience || "Not specified",
        why_join: form.why_join,
        status: "pending",
      })

      if (error) throw error
      setSubmitted(true)
      toast.success("Application submitted successfully")

      // Send confirmation email (non-blocking)
      sendApplicationReceivedEmail(form.email, form.name, selectedRole).catch(() => {})
    } catch (err) {
      console.error("Error submitting application:", err)
      toast.error("Failed to submit application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto max-w-2xl px-4 py-24">
          <Card className="border-primary/20">
            <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Application Submitted</h2>
              <p className="max-w-md text-muted-foreground">
                Thank you for your interest in joining VisoryX. We will review your application and get back to you
                via email or Discord within 3-5 business days.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.href = "/"}>
                Return Home
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto max-w-3xl px-4 py-24">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Join the VisoryX Team</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            We are always looking for talented individuals to help us deliver premium design work.
          </p>
        </div>

        {/* Position Cards */}
        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          {POSITIONS.map((pos) => {
            const Icon = pos.icon
            const isSelected = selectedRole === pos.value
            return (
              <button
                key={pos.value}
                type="button"
                onClick={() => setSelectedRole(pos.value)}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{pos.label}</p>
                  <p className="text-sm text-muted-foreground">{pos.description}</p>
                </div>
              </button>
            )
          })}
        </div>

        {selectedRole && (
          <Card>
            <CardHeader>
              <CardTitle>Application Form</CardTitle>
              <CardDescription>
                Applying for: <Badge variant="secondary" className="ml-1 capitalize">{selectedRole}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="discord">Discord Username</Label>
                    <Input
                      id="discord"
                      placeholder="username#0000"
                      value={form.discord_username}
                      onChange={(e) => handleChange("discord_username", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability</Label>
                    <Select value={form.availability} onValueChange={(v) => handleChange("availability", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full Time (20+ hrs/week)</SelectItem>
                        <SelectItem value="part-time">Part Time (10-20 hrs/week)</SelectItem>
                        <SelectItem value="casual">Casual ({"<"}10 hrs/week)</SelectItem>
                        <SelectItem value="weekends">Weekends Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(selectedRole === "designer" || selectedRole === "design_lead") && (
                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio URL</Label>
                    <Input
                      id="portfolio"
                      type="url"
                      placeholder="https://your-portfolio.com"
                      value={form.portfolio_url}
                      onChange={(e) => handleChange("portfolio_url", e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="experience">Relevant Experience</Label>
                  <Textarea
                    id="experience"
                    placeholder="Describe your relevant experience, skills, and any previous work..."
                    value={form.experience}
                    onChange={(e) => handleChange("experience", e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="why_join">Why do you want to join VisoryX? <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="why_join"
                    placeholder="Tell us why you'd be a great fit and what excites you about joining the team..."
                    value={form.why_join}
                    onChange={(e) => handleChange("why_join", e.target.value)}
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Fields marked with <span className="text-destructive">*</span> are required
                  </p>
                  <Button type="submit" disabled={isSubmitting} className="gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  )
}
