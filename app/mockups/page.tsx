import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Design Mockups",
  description: "VisoryX website design mockups and wireframes",
}

const mockups = [
  {
    id: "admin-orders-dashboard",
    title: "Admin Orders Dashboard",
    description: "Admin panel order management area with sidebar navigation, stats cards for order status counts, and a data table listing all orders with client info, service type, status badges, assigned designer, and amounts.",
    image: "/mockups/admin-orders-dashboard.jpg",
    category: "Admin Panel",
    features: [
      "Sidebar navigation with icons",
      "Order stats cards (Total, Pending, In Progress, Completed)",
      "Searchable and filterable order table",
      "Status badges with color coding",
      "Designer assignment column",
      "Quick actions per order"
    ]
  },
  {
    id: "order-form-view",
    title: "Client Order Form",
    description: "Client-facing multi-step order wizard with progress indicator, service selection, form fields for project details, style/color preferences, and order summary sidebar.",
    image: "/mockups/order-form-view.jpg",
    category: "Client Portal",
    features: [
      "Multi-step form wizard",
      "Progress indicator (4 steps)",
      "Service selection with thumbnails",
      "Project details form",
      "Style and color preferences",
      "Live order summary sidebar",
      "Back/Continue navigation"
    ]
  }
]

export default function MockupsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="font-display text-4xl font-bold tracking-tight">Design Mockups</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Website wireframes and UI mockups for the VisoryX platform
          </p>
        </div>
      </div>

      {/* Mockups Grid */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-12">
          {mockups.map((mockup) => (
            <Card key={mockup.id} className="overflow-hidden border-border/50 bg-card/50">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative aspect-video lg:aspect-auto bg-muted">
                  <Image
                    src={mockup.image}
                    alt={mockup.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground">
                      {mockup.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 lg:p-8 flex flex-col">
                  <CardHeader className="p-0 mb-6">
                    <CardTitle className="text-2xl font-display">{mockup.title}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {mockup.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-0 flex-1">
                    <h4 className="text-sm font-semibold text-foreground mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {mockup.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <div className="flex gap-3 mt-6 pt-6 border-t border-border/50">
                    <Button asChild variant="outline" size="sm">
                      <a href={mockup.image} download={`${mockup.id}.jpg`}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <a href={mockup.image} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Full Size
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Design System Reference */}
        <div className="mt-16 pt-12 border-t border-border/50">
          <h2 className="font-display text-2xl font-bold mb-6">Design System Reference</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Colors */}
            <Card className="p-6 border-border/50 bg-card/50">
              <h3 className="font-semibold mb-4">Primary Colors</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-md bg-primary" />
                  <div>
                    <p className="text-sm font-medium">Primary</p>
                    <p className="text-xs text-muted-foreground">#8B5CF6</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-md bg-[#EC4899]" />
                  <div>
                    <p className="text-sm font-medium">Accent</p>
                    <p className="text-xs text-muted-foreground">#EC4899</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-md bg-background border border-border" />
                  <div>
                    <p className="text-sm font-medium">Background</p>
                    <p className="text-xs text-muted-foreground">#0A0A0A</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Typography */}
            <Card className="p-6 border-border/50 bg-card/50">
              <h3 className="font-semibold mb-4">Typography</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-display text-lg">Syne</p>
                  <p className="text-xs text-muted-foreground">Headlines, Display</p>
                </div>
                <div>
                  <p className="font-sans text-lg">Inter</p>
                  <p className="text-xs text-muted-foreground">Body, UI Elements</p>
                </div>
                <div>
                  <p className="font-mono text-lg">Geist Mono</p>
                  <p className="text-xs text-muted-foreground">Code, Technical</p>
                </div>
              </div>
            </Card>

            {/* Status Colors */}
            <Card className="p-6 border-border/50 bg-card/50">
              <h3 className="font-semibold mb-4">Status Badges</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-yellow-500/20 px-2.5 py-0.5 text-xs font-medium text-yellow-500">
                    Pending
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-blue-500">
                    In Progress
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-medium text-green-500">
                    Completed
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-red-500/20 px-2.5 py-0.5 text-xs font-medium text-red-500">
                    Cancelled
                  </span>
                </div>
              </div>
            </Card>

            {/* Spacing */}
            <Card className="p-6 border-border/50 bg-card/50">
              <h3 className="font-semibold mb-4">Border Radius</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-sm border border-border bg-muted" />
                  <div>
                    <p className="text-sm font-medium">Small</p>
                    <p className="text-xs text-muted-foreground">6px</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-md border border-border bg-muted" />
                  <div>
                    <p className="text-sm font-medium">Medium</p>
                    <p className="text-xs text-muted-foreground">8px</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg border border-border bg-muted" />
                  <div>
                    <p className="text-sm font-medium">Large</p>
                    <p className="text-xs text-muted-foreground">10px</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Page Structure */}
        <div className="mt-12 pt-12 border-t border-border/50">
          <h2 className="font-display text-2xl font-bold mb-6">Confirmed Page Structure</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 border-border/50 bg-card/50">
              <h3 className="font-semibold mb-3">Main Pages</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Homepage (with Affiliations)</li>
                <li>Portfolio</li>
                <li>Pricing</li>
              </ul>
            </Card>

            <Card className="p-6 border-border/50 bg-card/50">
              <h3 className="font-semibold mb-3">Services</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Branding and Identity</li>
                <li>Community and Discord</li>
                <li>Gaming and Creator Packs</li>
                <li>Marketing and Social Media</li>
                <li>Business and Startup Kits</li>
              </ul>
            </Card>

            <Card className="p-6 border-border/50 bg-card/50">
              <h3 className="font-semibold mb-3">Connect</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Discord Server</li>
                <li>Client Dashboard/Profile</li>
                <li>Join the Team</li>
                <li>Contact Form</li>
                <li>FAQs</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
