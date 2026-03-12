import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { HelpCenterContent } from '@/components/help/help-center-content'

export const metadata: Metadata = {
  title: 'Help Center | VisoryX',
  description: 'Find answers to your questions about VisoryX design services, orders, payments, and more.',
}

export default function HelpCenterPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HelpCenterContent />
      <Footer />
    </main>
  )
}
