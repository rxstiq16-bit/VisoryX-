import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { SessionManagement } from "@/components/settings/session-management"
import { TwoFactorAuth } from "@/components/two-factor-auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Smartphone, Key, History } from "lucide-react"

export const metadata: Metadata = {
  title: "Security Settings | VisoryX",
  description: "Manage your account security, 2FA, and active sessions",
}

export default function SettingsSecurityPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Security Settings</h1>
              <p className="text-muted-foreground">Manage your account security and authentication</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="2fa" className="space-y-6">
          <TabsList>
            <TabsTrigger value="2fa" className="gap-2">
              <Smartphone className="h-4 w-4" />
              Two-Factor Auth
            </TabsTrigger>
            <TabsTrigger value="sessions" className="gap-2">
              <History className="h-4 w-4" />
              Active Sessions
            </TabsTrigger>
            <TabsTrigger value="password" className="gap-2">
              <Key className="h-4 w-4" />
              Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="2fa">
            <TwoFactorAuth />
          </TabsContent>

          <TabsContent value="sessions">
            <SessionManagement />
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Password</label>
                  <input type="password" className="w-full px-3 py-2 border rounded-md" placeholder="Enter current password" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <input type="password" className="w-full px-3 py-2 border rounded-md" placeholder="Enter new password" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm New Password</label>
                  <input type="password" className="w-full px-3 py-2 border rounded-md" placeholder="Confirm new password" />
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                  Update Password
                </button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
