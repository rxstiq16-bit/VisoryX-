"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { MobileNav } from "@/components/mobile-nav"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { LiveChatWidget } from "@/components/support/live-chat-widget"
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts"
import { BackToTop } from "@/components/back-to-top"
import { SocialProofPopup } from "@/components/social-proof-popup"
import { PWAInstall } from "@/components/pwa-install"
import { OrderStatusBanner } from "@/components/order-status-banner"
import { CookieConsent } from "@/components/cookie-consent"
import { useAuth } from "@/components/auth-provider"

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user } = useAuth()
  const isAdmin = pathname?.startsWith("/admin")

  // Ensure body overflow is always reset on navigation
  useEffect(() => {
    // Reset any stale overflow hidden states
    document.body.style.overflow = ""
    document.documentElement.style.overflow = ""
    
    return () => {
      // Clean up on unmount
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
    }
  }, [pathname])

  // Admin pages render their own Navigation and Footer
  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <div id="main-content">
      <AnnouncementBanner />
      {user && <OrderStatusBanner />}
      {children}
      
      {/* Global Components */}
      <MobileNav />
      <CartDrawer />
      <PWAInstallPrompt />
      <PWAInstall />
      <LiveChatWidget />
      <KeyboardShortcuts />
      <BackToTop />
      <SocialProofPopup />
      <CookieConsent />
    </div>
  )
}
