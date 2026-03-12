"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const quickLinks = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/pricing", label: "Pricing" },
  { href: "/services/roblox", label: "Roblox Services" },
  { href: "/services/discord", label: "Discord Services" },
  { href: "/order", label: "Order Now" },
  { href: "/designers", label: "Designers" },
  { href: "/reviews", label: "Reviews" },
  { href: "/case-studies", label: "Case Studies" },
];

const resourceLinks = [
  { href: "/help", label: "Help Center" },
  { href: "/blog", label: "Blog" },
  { href: "/changelog", label: "Changelog" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/status", label: "Status" },
  { href: "/tools", label: "Tools" },
  { href: "/api/docs", label: "API Docs" },
  { href: "/developers", label: "Developers" },
  { href: "/integrations", label: "Integrations" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/press", label: "Press Kit" },
  { href: "/affiliates", label: "Affiliates" },
  { href: "/gift-cards", label: "Gift Cards" },
  { href: "/contact", label: "Contact" },
  { href: "/partners", label: "Partners" },
  { href: "/team", label: "Team" },
  { href: "/brand-kit", label: "Brand Kit" },
];

const communityLinks = [
  { href: "/community", label: "Community" },
  { href: "/loyalty", label: "Loyalty Program" },
  { href: "/referrals", label: "Referrals" },
  { href: "/achievements", label: "Achievements" },
  { href: "/mood-board", label: "Mood Board" },
  { href: "/waitlist", label: "Waitlist" },
  { href: "/subscriptions", label: "Subscriptions" },
];

const socialLinks = [
  { label: "Discord", href: "https://discord.gg/Zeu8F7a2Rx" },
  { label: "X / Twitter", href: "https://x.com/VisoryXdesign" },
  { label: "YouTube", href: "https://www.youtube.com/@VisoryXdesign" },
  { label: "TikTok", href: "https://www.tiktok.com/@visoryxdesign" },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61588087643774" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-background grain">
      {/* Gradient line top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* Large brand text */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-24 pb-4">
        <div className="overflow-hidden">
          <h2 className="text-[clamp(4rem,12vw,10rem)] font-extrabold leading-[0.85] tracking-tighter text-border/30 select-none" style={{ fontFamily: "var(--font-display)" }}>
            VISORYX
          </h2>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Content grid */}
        <div className="grid grid-cols-2 gap-12 py-16 sm:grid-cols-3 lg:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-6 lg:pb-8">
            <p className="max-w-lg text-sm text-muted-foreground leading-relaxed">
              Premium design studio crafting brands, logos, liveries, and digital
              experiences for gaming communities and businesses worldwide.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="animated-underline text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-foreground">
              <span className="h-px w-4 bg-primary" />
              Navigation
            </h3>
            <ul className="mt-6 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-foreground">
              <span className="h-px w-4 bg-primary" />
              Resources
            </h3>
            <ul className="mt-6 space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-foreground">
              <span className="h-px w-4 bg-primary" />
              Company
            </h3>
            <ul className="mt-6 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-foreground">
              <span className="h-px w-4 bg-primary" />
              Community
            </h3>
            <ul className="mt-6 space-y-3">
              {communityLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-foreground">
              <span className="h-px w-4 bg-primary" />
              Contact
            </h3>
            <ul className="mt-6 space-y-3">
              <li><a href="mailto:contact@visoryx.design" className="text-sm text-muted-foreground transition-colors hover:text-foreground">contact@visoryx.design</a></li>
              <li><a href="https://discord.gg/Zeu8F7a2Rx" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Join Discord</a></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Contact Form</Link></li>
              <li><Link href="/apply" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Join Team</Link></li>
            </ul>
          </div>

          {/* Settings */}
          <div>
            <h3 className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-foreground">
              <span className="h-px w-4 bg-primary" />
              Account
            </h3>
            <ul className="mt-6 space-y-3">
              <li><Link href="/settings/notifications" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Notifications</Link></li>
              <li><Link href="/settings/privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Privacy Settings</Link></li>
              <li><Link href="/settings/security" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Security</Link></li>
              <li><Link href="/settings/integrations" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Integrations</Link></li>
              <li><Link href="/settings/calendar" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Calendar</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/50 py-8 sm:flex-row">
          <p className="text-xs text-muted-foreground/60">&copy; {new Date().getFullYear()} VisoryX. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors">Terms</Link>
            <Link href="/admin/login" className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors">Staff</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
