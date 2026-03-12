import type { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Key, Webhook, FileJson, BookOpen, Terminal, Zap, Shield, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Developers | VisoryX API",
  description: "Build with VisoryX API. Access order management, file uploads, and more programmatically.",
}

const features = [
  {
    icon: FileJson,
    title: "RESTful API",
    description: "Simple, predictable REST endpoints for all operations",
  },
  {
    icon: Webhook,
    title: "Webhooks",
    description: "Real-time event notifications for order updates",
  },
  {
    icon: Shield,
    title: "Secure Auth",
    description: "API key authentication with fine-grained permissions",
  },
  {
    icon: Zap,
    title: "Fast Response",
    description: "Average response time under 100ms globally",
  },
]

const endpoints = [
  { method: "GET", path: "/api/v1/orders", description: "List all orders" },
  { method: "POST", path: "/api/v1/orders", description: "Create a new order" },
  { method: "GET", path: "/api/v1/orders/:id", description: "Get order details" },
  { method: "PATCH", path: "/api/v1/orders/:id", description: "Update order" },
  { method: "POST", path: "/api/v1/orders/:id/files", description: "Upload files" },
  { method: "GET", path: "/api/v1/services", description: "List services" },
  { method: "GET", path: "/api/v1/portfolio", description: "Get portfolio items" },
  { method: "POST", path: "/api/v1/webhooks", description: "Register webhook" },
]

const codeExamples = {
  curl: `curl -X GET "https://api.visoryx.com/v1/orders" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
  node: `const response = await fetch('https://api.visoryx.com/v1/orders', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const orders = await response.json();`,
  python: `import requests

response = requests.get(
    'https://api.visoryx.com/v1/orders',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    }
)

orders = response.json()`,
}

export default function DevelopersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/20 py-24">
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="outline" className="mb-4">
                <Terminal className="mr-1 h-3 w-3" />
                Developer API
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Build with{" "}
                <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  VisoryX API
                </span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Integrate design services directly into your workflow. Programmatic access to orders, 
                files, and real-time updates.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" asChild>
                  <Link href="/developers/api-keys">
                    <Key className="mr-2 h-4 w-4" />
                    Get API Key
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/api/docs">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Documentation
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        </section>

        {/* Features */}
        <section className="py-24">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="border-0 bg-muted/50">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section className="border-y bg-muted/30 py-24">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-center text-3xl font-bold">Quick Start</h2>
              <p className="mt-4 text-center text-muted-foreground">
                Get up and running in minutes with our simple API
              </p>
              <div className="mt-12">
                <Tabs defaultValue="curl" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                    <TabsTrigger value="node">Node.js</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                  </TabsList>
                  {Object.entries(codeExamples).map(([lang, code]) => (
                    <TabsContent key={lang} value={lang}>
                      <div className="relative rounded-lg bg-zinc-950 p-4">
                        <pre className="overflow-x-auto text-sm text-zinc-100">
                          <code>{code}</code>
                        </pre>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </div>
          </div>
        </section>

        {/* Endpoints */}
        <section className="py-24">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-center text-3xl font-bold">API Endpoints</h2>
              <p className="mt-4 text-center text-muted-foreground">
                Explore available endpoints
              </p>
              <div className="mt-12 space-y-3">
                {endpoints.map((endpoint, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <Badge
                        variant="outline"
                        className={
                          endpoint.method === "GET"
                            ? "border-green-500/50 bg-green-500/10 text-green-600"
                            : endpoint.method === "POST"
                            ? "border-blue-500/50 bg-blue-500/10 text-blue-600"
                            : "border-yellow-500/50 bg-yellow-500/10 text-yellow-600"
                        }
                      >
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm">{endpoint.path}</code>
                    </div>
                    <span className="text-sm text-muted-foreground">{endpoint.description}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Button variant="outline" asChild>
                  <Link href="/api/docs">
                    View Full Documentation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t py-24">
          <div className="container">
            <Card className="mx-auto max-w-2xl border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
              <CardContent className="p-8 text-center">
                <Code className="mx-auto h-12 w-12 text-primary" />
                <h3 className="mt-4 text-2xl font-bold">Ready to integrate?</h3>
                <p className="mt-2 text-muted-foreground">
                  Generate your API key and start building today
                </p>
                <Button className="mt-6" size="lg" asChild>
                  <Link href="/developers/api-keys">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
