import Script from "next/script"

interface OrganizationSchemaProps {
  name?: string
  url?: string
  logo?: string
  description?: string
  sameAs?: string[]
}

export function OrganizationSchema({
  name = "VisoryX",
  url = "https://visoryx.design",
  logo = "https://visoryx.design/logo.png",
  description = "Premium design studio specializing in branding, Discord setup, ERLC liveries, and business design solutions.",
  sameAs = [
    "https://discord.gg/Zeu8F7a2Rx",
    "https://x.com/VisoryXdesign",
    "https://www.youtube.com/@VisoryXdesign",
    "https://www.tiktok.com/@visoryxdesign",
    "https://www.facebook.com/profile.php?id=61588087643774"
  ]
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description,
    sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "contact@visoryx.design",
      availableLanguage: ["English"]
    }
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface ServiceSchemaProps {
  name: string
  description: string
  provider?: string
  price?: string
  priceCurrency?: string
  image?: string
}

export function ServiceSchema({
  name,
  description,
  provider = "VisoryX",
  price,
  priceCurrency = "USD",
  image
}: ServiceSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: provider
    }
  }

  if (price) {
    schema.offers = {
      "@type": "Offer",
      price,
      priceCurrency
    }
  }

  if (image) {
    schema.image = image
  }

  return (
    <Script
      id={`service-schema-${name.toLowerCase().replace(/\s+/g, '-')}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface FAQSchemaProps {
  questions: Array<{
    question: string
    answer: string
  }>
}

export function FAQSchema({ questions }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map(q => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer
      }
    }))
  }

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface ReviewSchemaProps {
  itemReviewed: string
  reviews: Array<{
    author: string
    rating: number
    reviewBody: string
    datePublished?: string
  }>
}

export function AggregateReviewSchema({ itemReviewed, reviews }: ReviewSchemaProps) {
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: itemReviewed,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      reviewCount: reviews.length,
      bestRating: "5",
      worstRating: "1"
    },
    review: reviews.slice(0, 5).map(r => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: r.author
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: "5",
        worstRating: "1"
      },
      reviewBody: r.reviewBody,
      datePublished: r.datePublished || new Date().toISOString().split('T')[0]
    }))
  }

  return (
    <Script
      id="aggregate-review-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface LocalBusinessSchemaProps {
  name?: string
  description?: string
  url?: string
  email?: string
  openingHours?: string
  priceRange?: string
}

export function LocalBusinessSchema({
  name = "VisoryX",
  description = "Premium design studio",
  url = "https://visoryx.design",
  email = "contact@visoryx.design",
  openingHours = "Mo-Fr 09:00-18:00",
  priceRange = "$$"
}: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    description,
    url,
    email,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00"
    },
    priceRange
  }

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
