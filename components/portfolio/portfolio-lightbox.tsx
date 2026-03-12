"use client"

import { useEffect, useCallback, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Share2, Heart } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface PortfolioImage {
  id: string
  url: string
  alt: string
  title?: string
  description?: string
  tags?: string[]
}

interface PortfolioLightboxProps {
  images: PortfolioImage[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
  onLike?: (id: string) => void
  onShare?: (id: string) => void
  onDownload?: (id: string) => void
}

export function PortfolioLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  onLike,
  onShare,
  onDownload,
}: PortfolioLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [zoom, setZoom] = useState(1)
  const [isLiked, setIsLiked] = useState(false)

  const currentImage = images[currentIndex]

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
    setZoom(1)
  }, [images.length])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    setZoom(1)
  }, [images.length])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 1))
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    onLike?.(currentImage.id)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "ArrowRight":
          goNext()
          break
        case "ArrowLeft":
          goPrev()
          break
        case "Escape":
          onClose()
          break
        case "+":
        case "=":
          handleZoomIn()
          break
        case "-":
          handleZoomOut()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, goNext, goPrev, onClose])

  // Reset index when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      setZoom(1)
    }
  }, [isOpen, initialIndex])

  if (!currentImage) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl border-0 bg-black/95 p-0">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Main content */}
        <div className="relative flex h-[90vh] flex-col">
          {/* Image container */}
          <div className="relative flex-1 overflow-hidden">
            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute left-4 top-1/2 z-40 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-4 top-1/2 z-40 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Image */}
            <div
              className="flex h-full w-full items-center justify-center p-8"
              style={{
                transform: `scale(${zoom})`,
                transition: "transform 0.2s ease-out",
              }}
            >
              <Image
                src={currentImage.url}
                alt={currentImage.alt}
                width={1200}
                height={800}
                className="max-h-full max-w-full object-contain"
                priority
              />
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between border-t border-white/10 bg-black/50 px-6 py-4">
            {/* Info */}
            <div className="space-y-1">
              {currentImage.title && (
                <h3 className="font-medium text-white">{currentImage.title}</h3>
              )}
              {currentImage.description && (
                <p className="text-sm text-white/70">{currentImage.description}</p>
              )}
              {currentImage.tags && currentImage.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {currentImage.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Zoom controls */}
              <div className="flex items-center gap-1 rounded-lg border border-white/20 p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/10"
                  onClick={handleZoomOut}
                  disabled={zoom <= 1}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="min-w-[3rem] text-center text-sm text-white/70">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/10"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              {/* Action buttons */}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-10 w-10 text-white hover:bg-white/10",
                  isLiked && "text-red-500"
                )}
                onClick={handleLike}
              >
                <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
              </Button>

              {onShare && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-white hover:bg-white/10"
                  onClick={() => onShare(currentImage.id)}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              )}

              {onDownload && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-white hover:bg-white/10"
                  onClick={() => onDownload(currentImage.id)}
                >
                  <Download className="h-5 w-5" />
                </Button>
              )}

              {/* Image counter */}
              {images.length > 1 && (
                <span className="ml-2 text-sm text-white/70">
                  {currentIndex + 1} / {images.length}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto bg-black p-4">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => {
                  setCurrentIndex(index)
                  setZoom(1)
                }}
                className={cn(
                  "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                  index === currentIndex
                    ? "border-white"
                    : "border-transparent opacity-50 hover:opacity-100"
                )}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
