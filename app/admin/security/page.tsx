import type { Metadata } from "next"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { IPBlocking } from "@/components/admin/ip-blocking"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Ban, Activity, Key } from "lucide-react"

export const metadata: Metadata = {
  title: "Security | Admin | VisoryX",
  description: "Manage security settings, IP blocking, and rate limiting",
}

export default function AdminSecurityPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Security Settings</h1>
              <p className="text-muted-foreground">Manage IP blocking, rate limiting, and security policies</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="ip-blocking" className="space-y-6">
          <TabsList>
            <TabsTrigger value="ip-blocking" className="gap-2">
              <Ban className="h-4 w-4" />
              IP Blocking
            </TabsTrigger>
            <TabsTrigger value="rate-limiting" className="gap-2">
              <Activity className="h-4 w-4" />
              Rate Limiting
            </TabsTrigger>
            <TabsTrigger value="api-security" className="gap-2">
              <Key className="h-4 w-4" />
              API Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ip-blocking">
            <IPBlocking />
          </TabsContent>

          <TabsContent value="rate-limiting">
            <RateLimitingDashboard />
          </TabsContent>

          <TabsContent value="api-security">
            <APISecuritySettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function RateLimitingDashboard() {
  const limits = [
    { endpoint: "/api/auth/*", limit: "10 req/min", current: 3, status: "healthy" },
    { endpoint: "/api/orders/*", limit: "100 req/min", current: 45, status: "healthy" },
    { endpoint: "/api/payments/*", limit: "20 req/min", current: 18, status: "warning" },
    { endpoint: "/api/files/*", limit: "50 req/min", current: 12, status: "healthy" },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Rate Limit Configuration</h3>
        <div className="space-y-4">
          {limits.map((limit) => (
            <div key={limit.endpoint} className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{limit.endpoint}</code>
                <p className="text-sm text-muted-foreground mt-1">Limit: {limit.limit}</p>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${limit.status === 'warning' ? 'text-yellow-500' : 'text-green-500'}`}>
                  {limit.current} / {limit.limit.split(' ')[0]}
                </div>
                <p className="text-xs text-muted-foreground capitalize">{limit.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function APISecuritySettings() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">API Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <p className="font-medium">Require API Key for all endpoints</p>
              <p className="text-sm text-muted-foreground">All API requests must include a valid API key</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-primary relative cursor-pointer">
              <div className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <p className="font-medium">Enable CORS restrictions</p>
              <p className="text-sm text-muted-foreground">Only allow requests from approved domains</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-primary relative cursor-pointer">
              <div className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <p className="font-medium">Log all API requests</p>
              <p className="text-sm text-muted-foreground">Store detailed logs for security auditing</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-muted relative cursor-pointer">
              <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
