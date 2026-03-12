import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const metadata = {
  title: "Case Studies | VisoryX",
  description: "Explore our design case studies and see how we help clients achieve their goals.",
}

export default async function CaseStudiesPage() {
  const supabase = await createClient()

  const { data: caseStudies } = await supabase
    .from("case_studies")
    .select("id, slug, title, excerpt, hero_image, client_name, tags, services")
    .eq("status", "published")
    .order("project_date", { ascending: false })

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="container py-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Case Studies</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Dive deep into our design process and see how we help clients transform their vision into reality.
        </p>
      </section>

      {/* Case Studies Grid */}
      <section className="container pb-20">
        <div className="grid md:grid-cols-2 gap-8">
          {caseStudies?.map((study, index) => (
            <Link key={study.id} href={`/case-studies/${study.slug}`}>
              <Card className={`group overflow-hidden h-full hover:border-primary transition-colors ${index === 0 ? "md:col-span-2" : ""}`}>
                <div className={`relative ${index === 0 ? "aspect-[21/9]" : "aspect-video"}`}>
                  {study.hero_image ? (
                    <Image
                      src={study.hero_image}
                      alt={study.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                </div>
                <CardContent className="relative -mt-20 pt-0">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {study.services?.slice(0, 3).map((service: string) => (
                      <Badge key={service} variant="secondary" className="text-xs">{service}</Badge>
                    ))}
                  </div>
                  <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {study.title}
                  </h2>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{study.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{study.client_name}</span>
                    <span className="text-primary flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">
                      Read Case Study <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {(!caseStudies || caseStudies.length === 0) && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No case studies published yet. Check back soon!</p>
          </div>
        )}
      </section>
    </main>
  )
}
