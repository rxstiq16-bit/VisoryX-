"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Clock, Target, Lightbulb, CheckCircle2, Quote, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface CaseStudy {
  id: string
  title: string
  slug: string
  excerpt: string
  thumbnail_url: string
  hero_image_url?: string
  client?: { name: string; logo_url?: string; industry?: string }
  challenge: string
  solution: string
  results: string
  testimonial?: string
  testimonial_author?: string
  testimonial_role?: string
  timeline?: string
  services: string[]
  metrics?: { label: string; value: string; description?: string }[]
  gallery?: string[]
  portfolio_items?: { id: string; title: string; slug: string; thumbnail_url: string }[]
  published_at: string
}

export function CaseStudyContent({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[500px]">
        <Image
          src={caseStudy.hero_image_url || caseStudy.thumbnail_url}
          alt={caseStudy.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="container max-w-5xl">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/case-studies">
                <ArrowLeft className="h-4 w-4 mr-2" />
                All Case Studies
              </Link>
            </Button>
            <div className="flex flex-wrap gap-2 mb-4">
              {caseStudy.services.map((service) => (
                <Badge key={service} variant="secondary">{service}</Badge>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{caseStudy.title}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">{caseStudy.excerpt}</p>
          </div>
        </div>
      </section>

      <div className="container max-w-5xl py-16 space-y-16">
        {/* Client Info & Metrics */}
        <div className="grid gap-8 md:grid-cols-3">
          {caseStudy.client && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  {caseStudy.client.logo_url && (
                    <Image
                      src={caseStudy.client.logo_url}
                      alt={caseStudy.client.name}
                      width={48}
                      height={48}
                      className="rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{caseStudy.client.name}</h3>
                    {caseStudy.client.industry && (
                      <p className="text-sm text-muted-foreground">{caseStudy.client.industry}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {caseStudy.timeline && (
            <Card>
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Timeline</p>
                  <p className="font-semibold">{caseStudy.timeline}</p>
                </div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="font-semibold">
                  {new Date(caseStudy.published_at).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Metrics */}
        {caseStudy.metrics && caseStudy.metrics.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {caseStudy.metrics.map((metric, i) => (
              <Card key={i}>
                <CardContent className="pt-6 text-center">
                  <p className="text-4xl font-bold text-primary">{metric.value}</p>
                  <p className="font-medium mt-2">{metric.label}</p>
                  {metric.description && (
                    <p className="text-sm text-muted-foreground mt-1">{metric.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Challenge */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <Target className="h-5 w-5 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold">The Challenge</h2>
          </div>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: caseStudy.challenge }} />
          </div>
        </section>

        <Separator />

        {/* Solution */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold">Our Solution</h2>
          </div>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: caseStudy.solution }} />
          </div>
        </section>

        {/* Gallery */}
        {caseStudy.gallery && caseStudy.gallery.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Project Gallery</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {caseStudy.gallery.map((image, i) => (
                <div key={i} className="relative aspect-video rounded-lg overflow-hidden">
                  <Image src={image} alt={`${caseStudy.title} - Image ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </section>
        )}

        <Separator />

        {/* Results */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold">The Results</h2>
          </div>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: caseStudy.results }} />
          </div>
        </section>

        {/* Testimonial */}
        {caseStudy.testimonial && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-8 pb-8">
              <Quote className="h-10 w-10 text-primary/50 mb-4" />
              <blockquote className="text-xl italic mb-6">
                "{caseStudy.testimonial}"
              </blockquote>
              {caseStudy.testimonial_author && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {caseStudy.testimonial_author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{caseStudy.testimonial_author}</p>
                    {caseStudy.testimonial_role && (
                      <p className="text-sm text-muted-foreground">{caseStudy.testimonial_role}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Related Portfolio Items */}
        {caseStudy.portfolio_items && caseStudy.portfolio_items.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Related Work</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {caseStudy.portfolio_items.map((item) => (
                <Link key={item.id} href={`/portfolio/${item.slug}`}>
                  <Card className="overflow-hidden group">
                    <div className="relative aspect-video">
                      <Image
                        src={item.thumbnail_url}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Let's create something amazing together. Get in touch to discuss your design needs.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/services">View Services</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
