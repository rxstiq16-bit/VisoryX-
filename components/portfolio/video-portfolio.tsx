"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Play, Pause, Volume2, VolumeX, Maximize, X, Clock, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoItem {
  id: string
  title: string
  description?: string
  videoUrl: string
  thumbnailUrl: string
  duration: string
  views: number
  category: string
  tags?: string[]
}

interface VideoPortfolioProps {
  videos: VideoItem[]
  className?: string
}

export function VideoPortfolio({ videos, className }: VideoPortfolioProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null)

  return (
    <div className={className}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} onClick={() => setSelectedVideo(video)} />
        ))}
      </div>

      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
          {selectedVideo && (
            <VideoPlayer video={selectedVideo} onClose={() => setSelectedVideo(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function VideoCard({ video, onClick }: { video: VideoItem; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className="overflow-hidden cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative aspect-video">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className={cn(
          "absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="h-8 w-8 text-primary-foreground ml-1" fill="currentColor" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-xs text-white font-medium">
          {video.duration}
        </div>
        <Badge className="absolute top-2 left-2" variant="secondary">
          {video.category}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold truncate">{video.title}</h3>
        {video.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{video.description}</p>
        )}
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {video.views.toLocaleString()} views
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {video.duration}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function VideoPlayer({ video, onClose }: { video: VideoItem; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState("0:00")
  const [duration, setDuration] = useState("0:00")

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(progress)
      setCurrentTime(formatTime(videoRef.current.currentTime))
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(formatTime(videoRef.current.duration))
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      videoRef.current.currentTime = percent * videoRef.current.duration
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  return (
    <div className="relative bg-black">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </Button>

      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.thumbnailUrl}
        className="w-full aspect-video"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
      />

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div
          className="h-1 bg-white/30 rounded-full mb-3 cursor-pointer"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-primary rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <span className="text-white text-sm">
              {currentTime} / {duration}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={toggleFullscreen}>
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 bg-background">
        <h2 className="text-xl font-bold">{video.title}</h2>
        {video.description && (
          <p className="text-muted-foreground mt-2">{video.description}</p>
        )}
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {video.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
