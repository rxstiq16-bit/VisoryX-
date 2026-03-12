"use client"

import { useEffect, useState, useCallback } from "react"
import { createPortal } from "react-dom"

interface ConfettiPiece {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  scale: number
  velocityX: number
  velocityY: number
}

interface ConfettiProps {
  trigger?: boolean
  duration?: number
  pieces?: number
  colors?: string[]
  onComplete?: () => void
}

export function Confetti({
  trigger = false,
  duration = 3000,
  pieces = 100,
  colors = ["#f97316", "#3b82f6", "#22c55e", "#eab308", "#ec4899", "#8b5cf6"],
  onComplete,
}: ConfettiProps) {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([])
  const [isActive, setIsActive] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const generateConfetti = useCallback(() => {
    const newPieces: ConfettiPiece[] = []
    for (let i = 0; i < pieces; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        scale: 0.5 + Math.random() * 0.5,
        velocityX: (Math.random() - 0.5) * 10,
        velocityY: Math.random() * 3 + 2,
      })
    }
    return newPieces
  }, [pieces, colors])

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true)
      setConfettiPieces(generateConfetti())

      const timeout = setTimeout(() => {
        setIsActive(false)
        setConfettiPieces([])
        onComplete?.()
      }, duration)

      return () => clearTimeout(timeout)
    }
  }, [trigger, isActive, duration, generateConfetti, onComplete])

  if (!mounted || !isActive || confettiPieces.length === 0) return null

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall"
          style={{
            left: piece.x,
            top: piece.y,
            transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        >
          <div
            className="h-3 w-2 rounded-sm"
            style={{ backgroundColor: piece.color }}
          />
        </div>
      ))}
    </div>,
    document.body
  )
}

// Hook for easy confetti triggering
export function useConfetti() {
  const [trigger, setTrigger] = useState(false)

  const fire = useCallback(() => {
    setTrigger(true)
  }, [])

  const reset = useCallback(() => {
    setTrigger(false)
  }, [])

  return { trigger, fire, reset }
}
