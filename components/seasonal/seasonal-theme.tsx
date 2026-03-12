"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type Season = "default" | "halloween" | "christmas" | "valentines" | "summer" | "easter"

interface SeasonConfig {
  name: string
  startMonth: number
  startDay: number
  endMonth: number
  endDay: number
  className: string
  particles?: string[]
  accent: string
}

const seasons: Record<Season, SeasonConfig> = {
  default: {
    name: "Default",
    startMonth: 1,
    startDay: 1,
    endMonth: 12,
    endDay: 31,
    className: "",
    accent: "hsl(var(--primary))",
  },
  halloween: {
    name: "Halloween",
    startMonth: 10,
    startDay: 15,
    endMonth: 11,
    endDay: 1,
    className: "theme-halloween",
    particles: ["🎃", "👻", "🦇", "🕷️", "💀"],
    accent: "#ff6b00",
  },
  christmas: {
    name: "Christmas",
    startMonth: 12,
    startDay: 1,
    endMonth: 12,
    endDay: 31,
    className: "theme-christmas",
    particles: ["❄️", "🎄", "🎁", "⭐", "🔔"],
    accent: "#c41e3a",
  },
  valentines: {
    name: "Valentine's Day",
    startMonth: 2,
    startDay: 7,
    endMonth: 2,
    endDay: 15,
    className: "theme-valentines",
    particles: ["❤️", "💕", "💖", "💘", "🌹"],
    accent: "#ff69b4",
  },
  summer: {
    name: "Summer",
    startMonth: 6,
    startDay: 21,
    endMonth: 8,
    endDay: 31,
    className: "theme-summer",
    particles: ["☀️", "🌴", "🏖️", "🌊", "🍦"],
    accent: "#ffd700",
  },
  easter: {
    name: "Easter",
    startMonth: 3,
    startDay: 20,
    endMonth: 4,
    endDay: 20,
    className: "theme-easter",
    particles: ["🐰", "🥚", "🌷", "🐣", "🦋"],
    accent: "#9370db",
  },
}

function getCurrentSeason(): Season {
  const now = new Date()
  const month = now.getMonth() + 1
  const day = now.getDate()

  for (const [key, config] of Object.entries(seasons)) {
    if (key === "default") continue
    
    const { startMonth, startDay, endMonth, endDay } = config
    
    // Handle year wrap (e.g., Christmas Dec 1 - Dec 31)
    if (startMonth <= endMonth) {
      if (
        (month > startMonth || (month === startMonth && day >= startDay)) &&
        (month < endMonth || (month === endMonth && day <= endDay))
      ) {
        return key as Season
      }
    } else {
      // Handle wrap around year end
      if (
        (month > startMonth || (month === startMonth && day >= startDay)) ||
        (month < endMonth || (month === endMonth && day <= endDay))
      ) {
        return key as Season
      }
    }
  }
  
  return "default"
}

export function useSeasonalTheme() {
  const [season, setSeason] = useState<Season>("default")

  useEffect(() => {
    setSeason(getCurrentSeason())
  }, [])

  return {
    season,
    config: seasons[season],
    isSpecialSeason: season !== "default",
  }
}

export function SeasonalParticles() {
  const { config, isSpecialSeason } = useSeasonalTheme()
  const [particles, setParticles] = useState<{ id: number; emoji: string; left: number; delay: number }[]>([])

  useEffect(() => {
    if (!isSpecialSeason || !config.particles) return

    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: config.particles![Math.floor(Math.random() * config.particles!.length)],
      left: Math.random() * 100,
      delay: Math.random() * 5,
    }))
    setParticles(newParticles)
  }, [isSpecialSeason, config])

  if (!isSpecialSeason) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-fall text-2xl"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: "10s",
          }}
        >
          {particle.emoji}
        </div>
      ))}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  )
}

export function SeasonalBanner() {
  const { config, isSpecialSeason, season } = useSeasonalTheme()

  if (!isSpecialSeason) return null

  const messages: Record<Season, string> = {
    default: "",
    halloween: "Spooky season is here! Get 13% off with code SPOOKY13",
    christmas: "Happy Holidays! Enjoy 20% off all services with code HOLIDAY20",
    valentines: "Spread the love! 15% off for you and a friend with code LOVE15",
    summer: "Summer Sale! Beat the heat with 25% off with code SUMMER25",
    easter: "Hop into savings! 15% off with code EASTER15",
  }

  return (
    <div 
      className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white"
      style={{ backgroundColor: config.accent }}
    >
      {config.particles && <span>{config.particles[0]}</span>}
      <span>{messages[season]}</span>
      {config.particles && <span>{config.particles[0]}</span>}
    </div>
  )
}

export function SeasonalWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  const { config } = useSeasonalTheme()

  return (
    <div className={cn(config.className, className)}>
      {children}
    </div>
  )
}
