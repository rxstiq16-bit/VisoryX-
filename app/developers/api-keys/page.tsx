import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ApiKeyManager } from "@/components/developers/api-key-manager"

export const metadata: Metadata = {
  title: "API Keys | Developers | VisoryX",
  description: "Manage your VisoryX API keys",
}

export default async function ApiKeysPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/developers/api-keys")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <div className="container py-12">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
              <p className="mt-2 text-muted-foreground">
                Create and manage API keys for accessing the VisoryX API
              </p>
            </div>
            <ApiKeyManager />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
