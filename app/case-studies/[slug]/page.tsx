import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Calendar, Clock, User, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: caseStudy } = await supabase
    .from("case_studies")
    .select("title, excerpt")
    .eq("slug", slug)
    .single()

  return {
    title: caseStudy?.title || "Case Study",
    description: caseStudy?.excerpt,
  }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: caseStudy } = await supabase
    .from("case_studies")
    .select(`
      *,
      author:profiles(full_name, avatar_url)
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (!caseStudy) notFound()

  return (
    <main className="min-h-screen pb-20">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[500px]">
        {caseStudy.hero_image && (
          <Image
            src={caseStudy.hero_image}
            alt={caseStudy.title}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container pb-12">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/case-studies">
                <ArrowLeft className="h-4 w-4 mr-2" />
                All Case Studies
              </Link>
            </Button>
            <div className="flex flex-wrap gap-2 mb-4">
              {caseStudy.tags?.map((tag: string) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{caseStudy.title}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">{caseStudy.excerpt}</p>
          </div>
        </div>
      </section>

      {/* Meta */}
      <section className="container py-8 border-b">
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Client: <strong>{caseStudy.client_name}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{new Date(caseStudy.project_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Duration: <strong>{caseStudy.duration}</strong></span>
          </div>
          {caseStudy.live_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={caseStudy.live_url} target="_blank" rel="noopener noreferrer">
                View Live <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          )}
        </div>
      </section>

      {/* Content */}
      <article className="container py-12">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Services</h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {caseStudy.services?.map((service: string) => (
                      <Badge key={service} variant="outline">{service}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Tools Used</h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {caseStudy.tools?.map((tool: string) => (
                      <Badge key={tool} variant="secondary">{tool}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {caseStudy.results && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Results</h3>
                  <div className="space-y-3">
                    {caseStudy.results.map((result: { metric: string; value: string }, i: number) => (
                      <div key={i}>
                        <div className="text-2xl font-bold text-primary">{result.value}</div>
                        <div className="text-sm text-muted-foreground">{result.metric}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </aside>

          {/* Main content */}
          <div className="lg:col-span-3 prose prose-lg dark:prose-invert max-w-none">
            {/* Challenge */}
            <section>
              <h2>The Challenge</h2>
              <div dangerouslySetInnerHTML={{ __html: caseStudy.challenge }} />
            </section>

            {/* Solution */}
            <section>
              <h2>Our Solution</h2>
              <div dangerouslySetInnerHTML={{ __html: caseStudy.solution }} />
            </section>

            {/* Gallery */}
            {caseStudy.gallery?.length > 0 && (
              <section>
                <h2>Gallery</h2>
                <div className="grid grid-cols-2 gap-4 not-prose">
                  {caseStudy.gallery.map((image: string, i: number) => (
                    <div key={i} className="relative aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`${caseStudy.title} - Image ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Outcome */}
            <section>
              <h2>The Outcome</h2>
              <div dangerouslySetInnerHTML={{ __html: caseStudy.outcome }} />
            </section>

            {/* Testimonial */}
            {caseStudy.testimonial && (
              <blockquote className="border-l-4 border-primary pl-6 italic">
                <p>{caseStudy.testimonial.quote}</p>
                <footer className="text-sm not-italic text-muted-foreground">
                  — {caseStudy.testimonial.author}, {caseStudy.testimonial.role}
                </footer>
              </blockquote>
            )}
          </div>
        </div>
      </article>
    </main>
  )
}
