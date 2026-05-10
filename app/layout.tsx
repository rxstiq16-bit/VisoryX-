import React from "react"
import type { Metadata } from 'next'
import { Inter, Syne } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/components/auth-provider'
import { ThemeProvider } from '@/components/theme-provider'


import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });

export const metadata: Metadata = {
  title: {
    default: 'VisoryX | Premium Design Studio - Design Beyond Vision',
    template: '%s | VisoryX',
  },
  description: 'Premium design studio specializing in custom logos, branding, Discord servers, gaming liveries, social media graphics, and business kits. Professional designs starting at $3.75 with fast turnaround.',
  keywords: ['design company', 'branding', 'logo design', 'Discord server setup', 'gaming liveries', 'esports graphics', 'social media graphics', 'creative agency', 'VisoryX', 'graphic design services', 'business branding'],
  metadataBase: new URL('https://visoryx.design'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'VisoryX',
    title: 'VisoryX | Premium Design Studio - Design Beyond Vision',
    description: 'Professional design studio for custom logos, branding, Discord servers, gaming liveries, and more.',
    images: [
      {
        url: '/images/visoryx-social-share.png',
        width: 1200,
        height: 630,
        alt: 'VisoryX - Design Beyond Vision',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VisoryX | Premium Design Studio - Design Beyond Vision',
    description: 'Professional design studio for custom logos, branding, Discord servers, gaming liveries, and more.',
    images: ['/images/visoryx-social-share.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/visoryx-logo.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/visoryx-logo.png',
  },
    generator: 'v0.app'
}

// Root layout for VisoryX - v2
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.variable} ${syne.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful');
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
