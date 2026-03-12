import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { AffiliateDashboardContent } from '@/components/affiliates/affiliate-dashboard-content'

export const metadata: Metadata = {
  title: 'Affiliate Dashboard | VisoryX',
  description: 'Track your affiliate performance, earnings, and referrals.',
}

export default async function AffiliateDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirect=/affiliates/dashboard')
  }

  // Check if user is an affiliate
  const { data: affiliate } = await supabase
    .from('affiliates')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!affiliate) {
    redirect('/affiliates')
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <AffiliateDashboardContent affiliate={affiliate} />
      <Footer />
    </main>
  )
}
