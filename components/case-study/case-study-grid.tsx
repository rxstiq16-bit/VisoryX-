"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface CaseStudy {
  id: string
  title: string
  slug: string
  excerpt: string
  thumbnail_url: string
  services: string[]
  client?: { name: string; industry?: string }
  published_at: string
}

export function CaseStudyGrid({ caseStudies }: { caseStudies: CaseStudy[] }) {
  const [filter, setFilter] = useState<string | null>(null)

  const allServices = Array.from(
    new Set(caseStudies.flatMap((cs) => cs.services))
  ).sort()

  const filtered = filter
    ? caseStudies.filter((cs) => cs.services.includes(filter))
    : caseStudies

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant={filter === null ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter(null)}
        >
          All
        </Button>
        {allServices.map((service) => (
          <Button
            key={service}
            variant={filter === service ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(service)}
          >
            {service}
          </Button>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {filtered.map((caseStudy, i) => (
          <Link key={caseStudy.id} href={`/case-studies/${caseStudy.slug}`}>
            <Card className="overflow-hidden group h-full">
              <div className="relative aspect-[16/10]">
                <Image
                  src={caseStudy.thumbnail_url}
                  alt={caseStudy.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="secondary" size="sm">
                    Read Case Study
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {caseStudy.services.slice(0, 3).map((service) => (
                    <Badge key={service} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {caseStudy.title}
                </h2>
                <p className="text-muted-foreground line-clamp-2 mb-3">
                  {caseStudy.excerpt}
                </p>
                {caseStudy.client && (
                  <p className="text-sm text-muted-foreground">
                    Client: <span className="text-foreground">{caseStudy.client.name}</span>
                    {caseStudy.client.industry && ` - ${caseStudy.client.industry}`}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No case studies found for this category.</p>
        </div>
      )}
    </div>
  )
}
