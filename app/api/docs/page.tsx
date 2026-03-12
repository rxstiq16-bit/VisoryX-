import { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Copy, ExternalLink, Key, Lock, Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "API Documentation | VisoryX",
  description: "Complete API reference for integrating with VisoryX design services.",
}

const endpoints = [
  {
    method: "GET",
    path: "/api/orders",
    description: "List all orders for the authenticated user",
    auth: "Bearer Token",
    params: [
      { name: "status", type: "string", optional: true, description: "Filter by status" },
      { name: "limit", type: "number", optional: true, description: "Number of results (default: 20)" },
      { name: "offset", type: "number", optional: true, description: "Pagination offset" },
    ],
  },
  {
    method: "POST",
    path: "/api/orders",
    description: "Create a new order",
    auth: "Bearer Token",
    body: {
      service_id: "string (required)",
      requirements: "string (required)",
      files: "array of file URLs (optional)",
      rush_delivery: "boolean (optional)",
    },
  },
  {
    method: "GET",
    path: "/api/orders/:id",
    description: "Get details of a specific order",
    auth: "Bearer Token",
  },
  {
    method: "POST",
    path: "/api/orders/:id/messages",
    description: "Send a message on an order",
    auth: "Bearer Token",
    body: {
      content: "string (required)",
      attachments: "array of file URLs (optional)",
    },
  },
  {
    method: "GET",
    path: "/api/services",
    description: "List all available services",
    auth: "Public",
    params: [
      { name: "category", type: "string", optional: true, description: "Filter by category" },
    ],
  },
  {
    method: "GET",
    path: "/api/portfolio",
    description: "Get portfolio items",
    auth: "Public",
    params: [
      { name: "category", type: "string", optional: true, description: "Filter by category" },
      { name: "featured", type: "boolean", optional: true, description: "Featured items only" },
    ],
  },
  {
    method: "POST",
    path: "/api/webhooks",
    description: "Register a webhook endpoint",
    auth: "Bearer Token",
    body: {
      url: "string (required)",
      events: "array of event types (required)",
    },
  },
]

const webhookEvents = [
  { event: "order.created", description: "Fired when a new order is placed" },
  { event: "order.updated", description: "Fired when an order status changes" },
  { event: "order.completed", description: "Fired when an order is completed" },
  { event: "order.message", description: "Fired when a new message is sent" },
  { event: "payment.succeeded", description: "Fired when a payment is successful" },
  { event: "payment.failed", description: "Fired when a payment fails" },
]

export default function APIDocsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b bg-muted/30 py-16">
          <div className="container">
            <Badge className="mb-4">Developer</Badge>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">API Documentation</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Integrate VisoryX into your applications with our RESTful API. 
              Automate orders, manage projects, and receive real-time updates.
            </p>
            <div className="mt-6 flex gap-4">
              <Card className="inline-flex items-center gap-2 px-4 py-2">
                <span className="text-sm text-muted-foreground">Base URL:</span>
                <code className="font-mono text-sm">https://api.visoryx.com/v1</code>
              </Card>
            </div>
          </div>
        </section>

        <div className="container py-12">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <nav className="sticky top-24 space-y-2">
                <h4 className="mb-4 text-sm font-semibold">Quick Links</h4>
                <a href="#authentication" className="block text-sm text-muted-foreground hover:text-foreground">
                  Authentication
                </a>
                <a href="#endpoints" className="block text-sm text-muted-foreground hover:text-foreground">
                  Endpoints
                </a>
                <a href="#webhooks" className="block text-sm text-muted-foreground hover:text-foreground">
                  Webhooks
                </a>
                <a href="#rate-limits" className="block text-sm text-muted-foreground hover:text-foreground">
                  Rate Limits
                </a>
                <a href="#errors" className="block text-sm text-muted-foreground hover:text-foreground">
                  Error Handling
                </a>
              </nav>
            </aside>

            {/* Content */}
            <div className="lg:col-span-3 space-y-12">
              {/* Authentication */}
              <section id="authentication">
                <h2 className="text-2xl font-bold">Authentication</h2>
                <p className="mt-2 text-muted-foreground">
                  All API requests require authentication using Bearer tokens.
                </p>
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      API Keys
                    </CardTitle>
                    <CardDescription>
                      Generate API keys from your dashboard settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="rounded-lg bg-muted p-4 text-sm">
{`curl -X GET "https://api.visoryx.com/v1/orders" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                    </pre>
                  </CardContent>
                </Card>
              </section>

              {/* Endpoints */}
              <section id="endpoints">
                <h2 className="text-2xl font-bold">Endpoints</h2>
                <div className="mt-4 space-y-4">
                  {endpoints.map((endpoint, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={endpoint.method === "GET" ? "secondary" : "default"}
                            className="font-mono"
                          >
                            {endpoint.method}
                          </Badge>
                          <code className="font-mono text-sm">{endpoint.path}</code>
                          <Badge variant="outline" className="ml-auto">
                            {endpoint.auth}
                          </Badge>
                        </div>
                        <CardDescription>{endpoint.description}</CardDescription>
                      </CardHeader>
                      {(endpoint.params || endpoint.body) && (
                        <CardContent>
                          {endpoint.params && (
                            <div>
                              <h4 className="text-sm font-semibold mb-2">Parameters</h4>
                              <div className="space-y-1 text-sm">
                                {endpoint.params.map((param, j) => (
                                  <div key={j} className="flex gap-2">
                                    <code className="text-primary">{param.name}</code>
                                    <span className="text-muted-foreground">({param.type})</span>
                                    {param.optional && <Badge variant="outline" className="text-xs">optional</Badge>}
                                    <span className="text-muted-foreground">- {param.description}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {endpoint.body && (
                            <div>
                              <h4 className="text-sm font-semibold mb-2">Request Body</h4>
                              <pre className="rounded bg-muted p-3 text-sm">
                                {JSON.stringify(endpoint.body, null, 2)}
                              </pre>
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </section>

              {/* Webhooks */}
              <section id="webhooks">
                <h2 className="text-2xl font-bold">Webhooks</h2>
                <p className="mt-2 text-muted-foreground">
                  Receive real-time notifications when events occur.
                </p>
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Available Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {webhookEvents.map((event, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <code className="text-sm font-mono text-primary">{event.event}</code>
                          <span className="text-sm text-muted-foreground">{event.description}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Rate Limits */}
              <section id="rate-limits">
                <h2 className="text-2xl font-bold">Rate Limits</h2>
                <Card className="mt-4">
                  <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <div className="text-2xl font-bold">1,000</div>
                        <div className="text-sm text-muted-foreground">Requests per hour</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">100</div>
                        <div className="text-sm text-muted-foreground">Requests per minute</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">10 MB</div>
                        <div className="text-sm text-muted-foreground">Max request size</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Errors */}
              <section id="errors">
                <h2 className="text-2xl font-bold">Error Handling</h2>
                <Card className="mt-4">
                  <CardContent className="pt-6">
                    <div className="space-y-2 text-sm">
                      <div className="flex gap-4">
                        <code className="text-destructive">400</code>
                        <span>Bad Request - Invalid parameters</span>
                      </div>
                      <div className="flex gap-4">
                        <code className="text-destructive">401</code>
                        <span>Unauthorized - Invalid or missing API key</span>
                      </div>
                      <div className="flex gap-4">
                        <code className="text-destructive">403</code>
                        <span>Forbidden - Insufficient permissions</span>
                      </div>
                      <div className="flex gap-4">
                        <code className="text-destructive">404</code>
                        <span>Not Found - Resource does not exist</span>
                      </div>
                      <div className="flex gap-4">
                        <code className="text-destructive">429</code>
                        <span>Too Many Requests - Rate limit exceeded</span>
                      </div>
                      <div className="flex gap-4">
                        <code className="text-destructive">500</code>
                        <span>Internal Server Error - Something went wrong</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
