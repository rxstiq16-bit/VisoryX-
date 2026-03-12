"use client"

import { cn } from "@/lib/utils"

interface ClientLogo {
  name: string
  logo?: string
}

const clients: ClientLogo[] = [
  { name: "Roblox Community" },
  { name: "ERLC Squad" },
  { name: "Discord Servers" },
  { name: "Gaming Teams" },
  { name: "Content Creators" },
  { name: "Small Businesses" },
  { name: "Streamers" },
  { name: "YouTubers" },
]

interface ClientLogosProps {
  className?: string
  title?: string
  variant?: "scroll" | "grid"
}

export function ClientLogos({ className, title = "Trusted by creators everywhere", variant = "scroll" }: ClientLogosProps) {
  if (variant === "grid") {
    return (
      <div className={cn("space-y-4", className)}>
        {title && (
          <p className="text-center text-sm text-muted-foreground">{title}</p>
        )}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-8">
          {clients.map((client) => (
            <div
              key={client.name}
              className="flex h-12 items-center justify-center rounded-lg border bg-muted/50 px-4"
            >
              <span className="text-xs font-medium text-muted-foreground">{client.name}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4 overflow-hidden", className)}>
      {title && (
        <p className="text-center text-sm text-muted-foreground">{title}</p>
      )}
      <div className="relative">
        {/* Gradient masks */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-background to-transparent" />
        
        {/* Scrolling container */}
        <div className="flex animate-scroll gap-8">
          {[...clients, ...clients].map((client, i) => (
            <div
              key={`${client.name}-${i}`}
              className="flex h-12 shrink-0 items-center justify-center rounded-lg border bg-muted/50 px-6"
            >
              <span className="whitespace-nowrap text-sm font-medium text-muted-foreground">
                {client.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
