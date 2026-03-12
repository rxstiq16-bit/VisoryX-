"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Users } from "lucide-react"

interface TeamMember {
  id: string
  display_name: string | null
  username: string
  avatar_url: string | null
  roles: string[]
  team_title: string | null
  team_bio: string | null
  team_sort_order: number
}

const ROLE_LABELS: Record<string, string> = {
  executive: "Executive",
  director: "Director",
  operations_manager: "Operations Manager",
  community_moderator: "Community Moderator",
  design_lead: "Design Lead",
  designer: "Designer",
}

const ROLE_COLORS: Record<string, string> = {
  executive: "from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400",
  director: "from-red-500/20 to-red-500/5 border-red-500/20 text-red-400",
  operations_manager: "from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-400",
  community_moderator: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400",
  design_lead: "from-teal-500/20 to-teal-500/5 border-teal-500/20 text-teal-400",
  designer: "from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400",
}

const ROLE_GLOW: Record<string, string> = {
  executive: "shadow-amber-500/10",
  director: "shadow-red-500/10",
  operations_manager: "shadow-blue-500/10",
  community_moderator: "shadow-cyan-500/10",
  design_lead: "shadow-teal-500/10",
  designer: "shadow-purple-500/10",
}

export function TeamShowcase() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        if (!supabase) { setLoading(false); return }
        const { data } = await supabase
          .from("profiles")
          .select("id, display_name, username, avatar_url, roles, team_title, team_bio, team_sort_order")
          .eq("show_on_team", true)
          .order("team_sort_order", { ascending: true })
          .order("created_at", { ascending: true })
        if (data) setMembers(data)
      } catch { /* columns may not exist yet */ }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.06),transparent_60%)]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/3 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 lg:py-36 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/40 px-4 py-1.5 mb-6">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">The Team</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Meet the <span className="text-primary">Creators</span>
          </h1>
          <p className="mt-5 text-base text-muted-foreground leading-relaxed lg:text-lg">
            The designers, strategists, and builders behind VisoryX -- crafting brands that dominate.
          </p>
        </div>

        {/* Team Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Users className="h-12 w-12 opacity-20 mb-4" />
            <p className="text-lg font-medium">Coming soon</p>
            <p className="text-sm mt-1">Our team page is being set up.</p>
          </div>
        ) : (
          <div className={cn(
            "mx-auto grid gap-6",
            members.length === 1 && "max-w-sm grid-cols-1",
            members.length === 2 && "max-w-2xl grid-cols-1 sm:grid-cols-2",
            members.length === 3 && "max-w-4xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
            members.length >= 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          )}>
            {members.map((member, i) => {
              const role = member.roles[0] || "designer"
              const colorClass = ROLE_COLORS[role] || ROLE_COLORS.designer
              const glowClass = ROLE_GLOW[role] || ROLE_GLOW.designer

              return (
                <div
                  key={member.id}
                  className={cn(
                    "group relative flex flex-col items-center rounded-2xl border bg-gradient-to-b p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                    colorClass,
                    glowClass,
                  )}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Avatar */}
                  <div className="relative mb-5">
                    <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-border/40 bg-muted/60 ring-4 ring-background">
                      {member.avatar_url ? (
                        <img
                          src={member.avatar_url}
                          alt={member.display_name || member.username}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-foreground/60">
                          {(member.display_name || member.username || "?").charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    {/* Online-ish glow ring */}
                    <div className="absolute -inset-1 rounded-full bg-primary/10 blur-md opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-bold tracking-tight text-foreground">
                    {member.display_name || member.username}
                  </h3>

                  {/* Title */}
                  {member.team_title && (
                    <p className="mt-1 text-sm font-medium text-primary/80">
                      {member.team_title}
                    </p>
                  )}

                  {/* Role Badge */}
                  <span className={cn(
                    "mt-3 inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider",
                    colorClass,
                  )}>
                    {ROLE_LABELS[role] || role}
                  </span>

                  {/* Bio */}
                  {member.team_bio && (
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {member.team_bio}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
