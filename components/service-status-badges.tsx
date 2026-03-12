"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

interface ServiceStatus {
  id: string
  label: string
  status: "open" | "delayed" | "closed"
  delay_reason: string | null
}

const statusConfig = {
  open: { dot: "bg-emerald-500", text: "text-emerald-400", label: "Open" },
  delayed: { dot: "bg-amber-500", text: "text-amber-400", label: "Delayed" },
  closed: { dot: "bg-red-500", text: "text-red-400", label: "Closed" },
}

export function ServiceStatusBadges({ compact = false }: { compact?: boolean }) {
  const [statuses, setStatuses] = useState<ServiceStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("service_statuses")
      .select("*")
      .order("label")
      .then(({ data }) => {
        if (data) setStatuses(data as ServiceStatus[])
        setLoading(false)
      })
  }, [])

  if (loading || statuses.length === 0) return null

  if (compact) {
    const hasDelayed = statuses.some((s) => s.status === "delayed")
    const hasClosed = statuses.some((s) => s.status === "closed")
    const delayed = statuses.filter((s) => s.status === "delayed")
    const closed = statuses.filter((s) => s.status === "closed")

    if (!hasDelayed && !hasClosed) return null

    return (
      <div className="rounded-lg border border-border/50 bg-card/50 p-3 space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Service Alerts</p>
        {delayed.map((s) => (
          <div key={s.id} className="flex items-center gap-2 text-sm">
            <span className={cn("h-2 w-2 rounded-full shrink-0", statusConfig.delayed.dot)} />
            <span className="text-foreground">{s.label}</span>
            <span className={cn("text-xs", statusConfig.delayed.text)}>Delayed</span>
            {s.delay_reason && (
              <span className="text-xs text-muted-foreground">- {s.delay_reason}</span>
            )}
          </div>
        ))}
        {closed.map((s) => (
          <div key={s.id} className="flex items-center gap-2 text-sm">
            <span className={cn("h-2 w-2 rounded-full shrink-0", statusConfig.closed.dot)} />
            <span className="text-foreground">{s.label}</span>
            <span className={cn("text-xs", statusConfig.closed.text)}>Closed</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {statuses.map((s) => {
        const config = statusConfig[s.status]
        return (
          <div
            key={s.id}
            className="flex items-center gap-3 rounded-lg border border-border/40 bg-card/60 px-4 py-3"
          >
            <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", config.dot)} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{s.label}</p>
              {s.status === "delayed" && s.delay_reason && (
                <p className="text-xs text-muted-foreground truncate">{s.delay_reason}</p>
              )}
            </div>
            <span className={cn("text-xs font-medium", config.text)}>{config.label}</span>
          </div>
        )
      })}
    </div>
  )
}
