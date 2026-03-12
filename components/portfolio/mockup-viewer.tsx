"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { RotateCw, ZoomIn, ZoomOut, Maximize2, Download, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface MockupViewerProps {
  images: string[]
  title?: string
  className?: string
}

export function MockupViewer({ images, title, className }: MockupViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [autoRotate, setAutoRotate] = useState(false)

  // Auto rotate through images to simulate 3D rotation
  useEffect(() => {
    if (!autoRotate || images.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length)
      setRotation(prev => (prev + (360 / images.length)) % 360)
    }, 100)

    return () => clearInterval(interval)
  }, [autoRotate, images.length])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true)
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y })
    } else {
      // Rotate on drag when not zoomed
      setIsDragging(true)
      setStartPos({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    if (zoom > 1) {
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y,
      })
    } else {
      const deltaX = e.clientX - startPos.x
      const newIndex = Math.floor((deltaX / 10) % images.length)
      if (newIndex !== 0) {
        setCurrentIndex(prev => (prev + (newIndex > 0 ? 1 : -1) + images.length) % images.length)
        setRotation(prev => prev + (newIndex > 0 ? 5 : -5))
        setStartPos({ x: e.clientX, y: e.clientY })
      }
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 4))
  }

  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.5, 1)
      if (newZoom === 1) setPosition({ x: 0, y: 0 })
      return newZoom
    })
  }

  const handleReset = () => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
    setRotation(0)
    setCurrentIndex(0)
  }

  const handleDownload = async () => {
    const link = document.createElement("a")
    link.href = images[currentIndex]
    link.download = `${title || "mockup"}-${currentIndex + 1}.png`
    link.click()
  }

  return (
    <div className={cn("relative rounded-lg border bg-muted/30 overflow-hidden", className)}>
      {/* Viewport */}
      <div
        ref={containerRef}
        className="relative aspect-square cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-100"
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
          }}
        >
          <img
            src={images[currentIndex]}
            alt={`${title || "Mockup"} - View ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain select-none"
            draggable={false}
          />
        </div>

        {/* Rotation indicator */}
        <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          {Math.round(rotation)}°
        </div>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between p-3 border-t bg-background/80">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setAutoRotate(!autoRotate)}>
            <RotateCw className={cn("h-4 w-4", autoRotate && "animate-spin")} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Rotation slider */}
        {images.length > 1 && (
          <div className="flex-1 mx-4">
            <Slider
              value={[currentIndex]}
              min={0}
              max={images.length - 1}
              step={1}
              onValueChange={([v]) => {
                setCurrentIndex(v)
                setRotation((v / images.length) * 360)
              }}
            />
          </div>
        )}

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut} disabled={zoom <= 1}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs w-12 text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn} disabled={zoom >= 4}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
