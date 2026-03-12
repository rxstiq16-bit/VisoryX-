import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, Palette, Type, Grid, Image, Sparkles, Wand2, FileCode, Layers, Ruler } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free Design Tools | VisoryX",
  description: "Free design tools and calculators to help with your creative projects. Color palette generators, typography tools, and more.",
}

const tools = [
  {
    name: "Robux Calculator",
    description: "Convert between Robux and USD. Calculate DevEx rates and estimate earnings.",
    icon: Calculator,
    href: "/tools/robux-calculator",
    color: "bg-green-500/10 text-green-500",
  },
  {
    name: "Color Palette Generator",
    description: "Generate beautiful color palettes for your brand. Export as CSS, Tailwind, or image.",
    icon: Palette,
    href: "/tools/color-palette",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    name: "Font Pairing Tool",
    description: "Find perfect font combinations for your designs. Preview with your own text.",
    icon: Type,
    href: "/tools/font-pairing",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    name: "Grid Calculator",
    description: "Calculate grid layouts, margins, and gutters for responsive designs.",
    icon: Grid,
    href: "/tools/grid-calculator",
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    name: "Image Resizer",
    description: "Resize images for different platforms. Social media, web, and print presets.",
    icon: Image,
    href: "/tools/image-resizer",
    color: "bg-pink-500/10 text-pink-500",
  },
  {
    name: "AI Design Brief",
    description: "Generate detailed design briefs using AI. Perfect for starting new projects.",
    icon: Sparkles,
    href: "/tools/ai-brief",
    color: "bg-yellow-500/10 text-yellow-500",
  },
  {
    name: "Contrast Checker",
    description: "Check color contrast ratios for accessibility. WCAG 2.1 compliant.",
    icon: Layers,
    href: "/tools/contrast-checker",
    color: "bg-teal-500/10 text-teal-500",
  },
  {
    name: "CSS Generator",
    description: "Generate CSS for shadows, gradients, and animations with visual controls.",
    icon: FileCode,
    href: "/tools/css-generator",
    color: "bg-indigo-500/10 text-indigo-500",
  },
]

export default function ToolsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background pt-24">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Wand2 className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Free Design Tools</h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Helpful tools and calculators to assist with your creative projects. All completely free to use.
              </p>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tools.map((tool) => (
                <Card key={tool.name} className="group transition-all hover:border-primary/50 hover:shadow-lg">
                  <CardHeader>
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${tool.color}`}>
                      <tool.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                      <Link href={tool.href}>Open Tool</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-card/50 py-16">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold">Need Custom Design Work?</h2>
            <p className="mt-2 text-muted-foreground">
              Our tools are great for quick tasks, but for professional results, let our team help.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/services">Explore Services</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
