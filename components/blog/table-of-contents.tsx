"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { List, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  contentSelector?: string
  className?: string
}

export function TableOfContents({ contentSelector = "article", className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Find all headings in the content
    const content = document.querySelector(contentSelector)
    if (!content) return

    const headingElements = content.querySelectorAll("h2, h3, h4")
    const extractedHeadings: Heading[] = []

    headingElements.forEach((heading, index) => {
      // Add ID if not present
      if (!heading.id) {
        heading.id = `heading-${index}`
      }

      extractedHeadings.push({
        id: heading.id,
        text: heading.textContent || "",
        level: parseInt(heading.tagName.charAt(1)),
      })
    })

    setHeadings(extractedHeadings)

    // Set up intersection observer for active heading tracking
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-100px 0px -66%",
        threshold: 0,
      }
    )

    headingElements.forEach((heading) => {
      observerRef.current?.observe(heading)
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, [contentSelector])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const top = element.offsetTop - 100
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  if (headings.length === 0) return null

  return (
    <nav className={cn("sticky top-24", className)}>
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-2 text-sm font-semibold">
            <List className="h-4 w-4" />
            Table of Contents
          </h4>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronUp
              className={cn(
                "h-4 w-4 transition-transform",
                isCollapsed && "rotate-180"
              )}
            />
          </Button>
        </div>

        {!isCollapsed && (
          <ul className="mt-4 space-y-2 text-sm">
            {headings.map((heading) => (
              <li
                key={heading.id}
                style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
              >
                <button
                  onClick={() => scrollToHeading(heading.id)}
                  className={cn(
                    "w-full text-left text-muted-foreground transition-colors hover:text-foreground",
                    activeId === heading.id && "font-medium text-primary"
                  )}
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Progress indicator */}
      <div className="mt-4 rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Reading progress</span>
          <span className="font-medium">
            {headings.length > 0
              ? `${Math.round(
                  ((headings.findIndex((h) => h.id === activeId) + 1) / headings.length) * 100
                )}%`
              : "0%"}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${
                headings.length > 0
                  ? ((headings.findIndex((h) => h.id === activeId) + 1) / headings.length) * 100
                  : 0
              }%`,
            }}
          />
        </div>
      </div>
    </nav>
  )
}
