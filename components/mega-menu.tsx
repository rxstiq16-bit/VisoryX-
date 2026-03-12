"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { Palette, Gamepad2, MessageSquare, Briefcase, Megaphone, Gift, ChevronRight, Star } from "lucide-react"

const services = [
  {
    title: "Branding & Identity",
    icon: Palette,
    description: "Logos, brand kits, and visual identity design",
    href: "/services?category=branding",
    featured: true,
    items: [
      { title: "Logo Design", href: "/services/logo-design" },
      { title: "Full Brand Kit", href: "/services/brand-kit" },
      { title: "Style Guide", href: "/services/style-guide" },
    ],
  },
  {
    title: "Gaming & ERLC",
    icon: Gamepad2,
    description: "Vehicle liveries, team logos, and stream overlays",
    href: "/services/roblox",
    featured: true,
    items: [
      { title: "ERLC Liveries", href: "/services/erlc-liveries" },
      { title: "Stream Overlays", href: "/services/stream-overlays" },
      { title: "Esports Branding", href: "/services/esports" },
    ],
  },
  {
    title: "Discord Services",
    icon: MessageSquare,
    description: "Server setup, bots, embeds, and branding",
    href: "/services/discord",
    items: [
      { title: "Server Setup", href: "/services/discord-setup" },
      { title: "Bot Configuration", href: "/services/discord-bots" },
      { title: "Custom Embeds", href: "/services/discord-embeds" },
    ],
  },
  {
    title: "Business",
    icon: Briefcase,
    description: "Pitch decks, business cards, and presentations",
    href: "/services?category=business",
    items: [
      { title: "Pitch Decks", href: "/services/pitch-deck" },
      { title: "Business Cards", href: "/services/business-cards" },
      { title: "Presentations", href: "/services/presentations" },
    ],
  },
  {
    title: "Marketing",
    icon: Megaphone,
    description: "Social media graphics, ads, and banners",
    href: "/services?category=marketing",
    items: [
      { title: "Social Media Pack", href: "/services/social-media" },
      { title: "Ad Creatives", href: "/services/ad-creatives" },
      { title: "Banners & Headers", href: "/services/banners" },
    ],
  },
  {
    title: "Bundles",
    icon: Gift,
    description: "Save with our discounted service packages",
    href: "/services?category=bundles",
    items: [
      { title: "Creator Starter", href: "/services/creator-bundle" },
      { title: "Business Launch", href: "/services/business-bundle" },
      { title: "Gaming Community", href: "/services/gaming-bundle" },
    ],
  },
]

export function MegaMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Services</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[800px] gap-3 p-4 md:grid-cols-3">
              {services.map((service) => (
                <div key={service.title} className="group relative">
                  <Link
                    href={service.href}
                    className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-background group-hover:border-primary/50">
                      <service.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{service.title}</span>
                        {service.featured && (
                          <Star className="h-3 w-3 fill-primary text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                  </Link>
                  <div className="mt-1 space-y-1 pl-[52px]">
                    {service.items.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="flex items-center gap-1 rounded px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <ChevronRight className="h-3 w-3" />
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t bg-muted/50 px-4 py-3">
              <Link
                href="/services"
                className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                View all services
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/portfolio" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Portfolio
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/pricing" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Pricing
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="/blog"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Blog</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Tips, tutorials, and design inspiration
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="/help"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Help Center</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      FAQs and support articles
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="/changelog"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Changelog</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Latest updates and new features
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="/tools"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Tools</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Free design tools and calculators
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
