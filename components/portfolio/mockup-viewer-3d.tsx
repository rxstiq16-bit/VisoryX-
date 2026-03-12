"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { RotateCcw, ZoomIn, ZoomOut, Move, Maximize2, Download, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

interface Mockup3DViewerProps {
  images: string[]
  title?: string
  className?: string
}

export function Mockup3DViewer({ images, title, className }: Mockup3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isAutoRotating, setIsAutoRotating] = useState(false)
  const [lightMode, setLightMode] = useState<"light" | "dark">("dark")

  useEffect(() => {
    if (!isAutoRotating) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 100)
    return () => clearInterval(interval)
  }, [isAutoRotating, images.length])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - rotation.y, y: e.clientY - rotation.x })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setRotation({
      x: (e.clientY - dragStart.y) * 0.5,
      y: (e.clientX - dragStart.x) * 0.5,
    })
    setIsAutoRotating(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)))
  }

  const resetView = () => {
    setRotation({ x: 0, y: 0 })
    setZoom(1)
    setPosition({ x: 0, y: 0 })
    setCurrentIndex(0)
  }

  const handleSliderChange = (value: number[]) => {
    setCurrentIndex(Math.round((value[0] / 100) * (images.length - 1)))
    setIsAutoRotating(false)
  }

  const downloadImage = () => {
    const link = document.createElement("a")
    link.href = images[currentIndex]
    link.download = `mockup-${currentIndex + 1}.png`
    link.click()
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        <div
          ref={containerRef}
          className={cn(
            "relative aspect-square cursor-grab active:cursor-grabbing select-none overflow-hidden",
            lightMode === "light" ? "bg-gray-100" : "bg-gray-900"
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform duration-100"
            style={{
              transform: `
                perspective(1000px)
                rotateX(${rotation.x}deg)
                rotateY(${rotation.y}deg)
                scale(${zoom})
                translate(${position.x}px, ${position.y}px)
              `,
            }}
          >
            <img
              src={images[currentIndex]}
              alt={`${title || "Mockup"} - View ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              draggable={false}
            />
          </div>

          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8"
              onClick={() => setLightMode(lightMode === "light" ? "dark" : "light")}
            >
              {lightMode === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </div>

          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.min(3, z + 0.2))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" className="h-8 w-8" onClick={resetView}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" className="h-8 w-8" onClick={downloadImage}>
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {title && (
            <div className="absolute bottom-4 left-4 text-sm font-medium text-white bg-black/50 px-3 py-1 rounded">
              {title}
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="p-4 border-t space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-12">Rotate</span>
              <Slider
                value={[(currentIndex / (images.length - 1)) * 100]}
                onValueChange={handleSliderChange}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-16 text-right">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
            <div className="flex justify-center">
              <Button
                variant={isAutoRotating ? "default" : "outline"}
                size="sm"
                onClick={() => setIsAutoRotating(!isAutoRotating)}
              >
                <RotateCcw className={cn("h-4 w-4 mr-2", isAutoRotating && "animate-spin")} />
                {isAutoRotating ? "Stop" : "Auto Rotate"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
