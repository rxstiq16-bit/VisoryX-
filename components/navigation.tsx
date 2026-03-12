/* Navigation - VisoryX - rebuilt to clear HMR cache */
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import {
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  Package,
  ArrowUpRight,
  ChevronDown,
  Palette,
  Car,
  Briefcase,
  ImageIcon,
  MessageSquare,
  Handshake,
  Users,
  Mail,
  Headphones,
  UserPlus,
  LayoutDashboard,
  Gift,
  Star,
  Trophy,
  Heart,
  Code,
  Link2,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { GlobalSearch } from "@/components/global-search"

/* ---------- DATA ---------- */
const SERVICES_ITEMS = [
  { href: "/services/branding", label: "Branding & Identity", desc: "Logos, brand kits & visual identity", icon: Palette },
  { href: "/services/community", label: "Community & Discord", desc: "Server setups, bots & community assets", icon: MessageSquare },
  { href: "/services/gaming", label: "Gaming & Creator Packs", desc: "Liveries, overlays & esports graphics", icon: Car },
  { href: "/services/business", label: "Business & Startup Kits", desc: "Pitch decks, cards & professional graphics", icon: Briefcase },
  { href: "/services/marketing", label: "Marketing & Social Media", desc: "Social posts, ads, banners & promo graphics", icon: ImageIcon },
]

const CONNECT_ITEMS_ALL = [
  { href: "/auth/login", label: "Sign In", desc: "Log in to your account", icon: LogIn, guestOnly: true },
  { href: "/auth/sign-up", label: "Create Account", desc: "Sign up to place orders", icon: UserPlus, guestOnly: true },
  { href: "/dashboard", label: "Dashboard", desc: "View your orders & account", icon: Package, authOnly: true },
  { href: "/profile", label: "My Profile", desc: "Edit your profile settings", icon: User, authOnly: true },
  { href: "https://discord.gg/visoryx", label: "Discord Server", desc: "Chat with the team live", icon: MessageSquare, external: true },
  { href: "/contact", label: "Contact Form", desc: "Send us a message directly", icon: Mail },
  { href: "/team", label: "Meet the Creators", desc: "The people behind VisoryX", icon: Users },
  { href: "/apply", label: "Join the Team", desc: "We're hiring designers", icon: Users },
  { href: "/affiliations", label: "Affiliations", desc: "Partner with VisoryX", icon: Handshake },
  { href: "/status", label: "Service Status", desc: "Check system uptime", icon: Headphones },
  { href: "/partners", label: "Partners", desc: "Our trusted partners", icon: Handshake },
  { href: "/community", label: "Community", desc: "Join our community", icon: Users },
  { href: "/loyalty", label: "Loyalty Program", desc: "Earn rewards", icon: Gift },
  { href: "/referrals", label: "Referrals", desc: "Refer friends & earn", icon: Heart },
  { href: "/reviews", label: "Reviews", desc: "See what clients say", icon: Star },
  { href: "/achievements", label: "Achievements", desc: "Unlock badges & rewards", icon: Trophy },
  { href: "/developers", label: "Developers", desc: "API & developer tools", icon: Code },
  { href: "/integrations", label: "Integrations", desc: "Connect your tools", icon: Link2 },
  { href: "/help", label: "Help Center", desc: "Get support & FAQs", icon: BookOpen },
]

type NavItem =
  | { href: string; label: string; dropdown?: undefined }
  | { label: string; dropdown: "services" | "connect"; href?: undefined }

const NAV_ITEMS: NavItem[] = [
  { label: "Services", dropdown: "services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/pricing", label: "Pricing" },
  { label: "Connect", dropdown: "connect" },
]

function checkActive(pathname: string, item: NavItem) {
  if (item.href) return pathname === item.href
  if (item.dropdown === "services") return pathname.startsWith("/services")
  if (item.dropdown === "connect") return pathname === "/contact" || pathname === "/apply" || pathname === "/team" || pathname === "/dashboard" || pathname === "/profile" || pathname === "/affiliations" || pathname.startsWith("/auth/")
  return false
}

/* ---------- MEGA DROPDOWN ---------- */
function MegaDropdown({
  type,
  open,
  onClose,
  anchorRef,
  connectItems,
}: {
  type: "services" | "connect"
  open: boolean
  onClose: () => void
  anchorRef: React.RefObject<HTMLElement | null>
  connectItems: typeof CONNECT_ITEMS_ALL[number][]
}) {
  const items = type === "services" ? SERVICES_ITEMS : connectItems
  const title = type === "services" ? "Solutions & Services" : "Get in Touch"
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      )
        onClose()
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open, onClose, anchorRef])

  if (!open) return null

  return (
    <>
    {/* Backdrop overlay to block page content */}
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />

    <div
      ref={ref}
      className="absolute top-full left-0 right-0 z-50 animate-reveal-down border-b border-primary/10"
      style={{ animationDuration: "0.3s" }}
    >
      <div className="bg-[hsl(260,25%,6%)] shadow-2xl shadow-primary/5">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <p className="mb-8 text-[11px] font-bold uppercase tracking-[0.25em] text-primary/60">
            {title}
          </p>
          <div className={cn(
            "grid gap-x-16 gap-y-2",
            type === "services" ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-2"
          )}>
            {items.map((item) => {
              const Icon = item.icon
              const isExt = "external" in item && item.external
              const Tag = isExt ? "a" : Link
              const extraProps = isExt
                ? { target: "_blank" as const, rel: "noopener noreferrer" }
                : {}
              return (
                <Tag
                  key={item.label}
                  href={item.href}
                  {...extraProps}
                  onClick={onClose}
                  className="group flex items-center gap-4 rounded-xl px-4 py-4 transition-all hover:bg-primary/[0.06]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-foreground transition-colors group-hover:text-primary">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground/70">{item.desc}</p>
                  </div>
                </Tag>
              )
            })}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

/* ---------- NAV COMPONENT ---------- */
export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [openDropdown, setOpenDropdown] = useState<"services" | "connect" | null>(null)
  const navRef = useRef<HTMLElement>(null)

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
    router.refresh()
  }

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const docH = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docH > 0 ? (window.scrollY / docH) * 100 : 0)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  const toggleDropdown = useCallback((key: "services" | "connect") => {
    setOpenDropdown((prev) => (prev === key ? null : key))
  }, [])

  const closeDropdown = useCallback(() => setOpenDropdown(null), [])

  const isAdmin = profile?.roles?.some((r: string) =>
    ["executive", "director", "operations_manager", "design_lead", "designer", "community_moderator"].includes(r)
  )

  const filteredConnectItems = useMemo(() => CONNECT_ITEMS_ALL.filter(item => {
    if ('guestOnly' in item && item.guestOnly) return !user
    if ('authOnly' in item && item.authOnly) return !!user
    return true
  }), [user])

  const [mobileExpand, setMobileExpand] = useState<"services" | "connect" | null>(null)

  return (
    <>
      {/* Scroll Progress */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      <header
        ref={navRef}
        className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-500",
          scrolled ? "glass py-3" : "bg-transparent py-5"
        )}
        style={{ top: "var(--announcement-banner-height, 0px)" }}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="group relative z-10" onClick={closeDropdown}>
            <span
              className="text-xl font-extrabold tracking-tight text-foreground transition-colors group-hover:text-primary"
              style={{ fontFamily: "var(--font-display)" }}
            >
              VISORYX
            </span>
            <span className="ml-0.5 text-lg text-primary">&bull;</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-0.5 md:flex">
            {NAV_ITEMS.map((item) => {
              const active = checkActive(pathname, item)
              const hasDropdown = !!item.dropdown

              return (
                <div key={item.label} className="relative">
                  {hasDropdown ? (
                    <button
                      type="button"
                      onClick={() => toggleDropdown(item.dropdown!)}
                      className={cn(
                        "inline-flex items-center gap-1 px-4 py-2 text-[13px] font-medium uppercase tracking-[0.12em] transition-colors",
                        openDropdown === item.dropdown
                          ? "text-primary"
                          : active
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {active && (
                        <span className="mr-0.5 text-base leading-none text-primary">
                          &bull;
                        </span>
                      )}
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "h-3 w-3 transition-transform duration-300",
                          openDropdown === item.dropdown && "rotate-180"
                        )}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href!}
                      onClick={closeDropdown}
                      className={cn(
                        "animated-underline inline-flex items-center px-4 py-2 text-[13px] font-medium uppercase tracking-[0.12em] transition-colors",
                        active
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {active && (
                        <span className="mr-1.5 text-base leading-none text-primary">
                          &bull;
                        </span>
                      )}
                      {item.label}
                    </Link>
                  )}
                </div>
              )
            })}
          </div>

          {/* Desktop Right */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Global Search */}
            <GlobalSearch />
            
            {/* Notifications */}
            {user && <NotificationsDropdown />}
            
            <Link
              href="/order"
              onClick={closeDropdown}
              className="magnetic-btn inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-primary-foreground transition-all hover:brightness-110"
            >
              Start Order <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                      <AvatarImage
                        src={profile?.avatar_url || undefined}
                        alt={profile?.username || user.email || "User"}
                      />
                      <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                        {profile?.username?.slice(0, 2).toUpperCase() ||
                          user.email?.slice(0, 2).toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-52" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">
                        {profile?.display_name || profile?.username || user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {profile ? `@${profile.username}` : user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <Package className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard">
                        <LogIn className="mr-2 h-4 w-4" />
                        Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="relative z-10 p-2 md:hidden"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen)
              setOpenDropdown(null)
            }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-foreground" />
            )}
          </button>
        </nav>

        {/* Desktop Mega Dropdowns */}
        {openDropdown && (
          <MegaDropdown type={openDropdown} open onClose={closeDropdown} anchorRef={navRef} connectItems={filteredConnectItems} />
        )}
      </header>

      {/* ========= MOBILE MENU ========= */}
      {mobileMenuOpen && (
        <div className="animate-reveal-fade fixed inset-0 z-40 flex flex-col overflow-y-auto bg-background/98 pt-20 backdrop-blur-2xl md:hidden">
          <div className="flex flex-col px-6 py-6">
            {NAV_ITEMS.map((item, i) => {
              const active = checkActive(pathname, item)
              const hasDropdown = !!item.dropdown
              const expanded = hasDropdown && mobileExpand === item.dropdown

              return (
                <div
                  key={item.label}
                  className="animate-reveal-left border-b border-border/30"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {hasDropdown ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setMobileExpand(expanded ? null : item.dropdown!)
                        }
                        className={cn(
                          "flex w-full items-center justify-between py-5 text-2xl font-bold tracking-tight transition-colors",
                          active ? "text-primary" : "text-foreground/70"
                        )}
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        <span className="flex items-center gap-2">
                          {active && <span className="text-sm text-primary">&bull;</span>}
                          {item.label}
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 transition-transform",
                            expanded && "rotate-180"
                          )}
                        />
                      </button>
                      {expanded && (
                        <div
                          className="animate-reveal-up space-y-1 pb-4 pl-4"
                          style={{ animationDuration: "0.3s" }}
                        >
                          {(item.dropdown === "services"
                            ? SERVICES_ITEMS
                            : filteredConnectItems
                          ).map((sub) => {
                            const Icon = sub.icon
                            const isExt = "external" in sub && sub.external
                            return isExt ? (
                              <a
                                key={sub.label}
                                href={sub.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-secondary"
                              >
                                <Icon className="h-4 w-4 text-primary/60" />
                                <div>
                                  <p className="text-sm font-medium text-foreground">
                                    {sub.label}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{sub.desc}</p>
                                </div>
                              </a>
                            ) : (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-secondary"
                              >
                                <Icon className="h-4 w-4 text-primary/60" />
                                <div>
                                  <p className="text-sm font-medium text-foreground">
                                    {sub.label}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{sub.desc}</p>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href!}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-2 py-5 text-2xl font-bold tracking-tight transition-colors",
                        active
                          ? "text-primary"
                          : "text-foreground/70 hover:text-foreground"
                      )}
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {active && <span className="text-sm text-primary">&bull;</span>}
                      {item.label}
                    </Link>
                  )}
                </div>
              )
            })}
          </div>

          {/* Mobile bottom */}
          <div className="mt-auto px-6 pb-10">
            {user ? (
              <div className="animate-reveal-up space-y-4" style={{ animationDelay: "350ms" }}>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                      {profile?.username?.slice(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {profile?.display_name || profile?.username}
                    </p>
                    <p className="text-xs text-muted-foreground">@{profile?.username}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-lg border border-border/50 p-3 text-sm font-medium transition-colors hover:bg-secondary"
                  >
                    <LayoutDashboard className="h-4 w-4 text-primary/70" />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-lg border border-border/50 p-3 text-sm font-medium transition-colors hover:bg-secondary"
                  >
                    <User className="h-4 w-4 text-primary/70" />
                    Profile
                  </Link>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => { handleSignOut(); setMobileMenuOpen(false) }}
                  className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </div>
            ) : (
              <div
                className="animate-reveal-up flex gap-3"
                style={{ animationDelay: "350ms" }}
              >
                <Button variant="outline" asChild className="h-12 flex-1 rounded-full">
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild className="magnetic-btn h-12 flex-1 rounded-full">
                  <Link href="/order">Start Order</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
