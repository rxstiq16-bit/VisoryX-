"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoHeroProps {
  src: string
  poster?: string
  className?: string
  overlay?: boolean
  children?: React.ReactNode
}

export function VideoHero({ src, poster, className, overlay = true, children }: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => setIsLoaded(true)
    video.addEventListener("canplay", handleCanPlay)
    
    // Auto-play muted
    video.play().catch(() => {})

    return () => video.removeEventListener("canplay", handleCanPlay)
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop
        muted={isMuted}
        playsInline
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Fallback image while loading */}
      {poster && !isLoaded && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}

      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={togglePlay}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
