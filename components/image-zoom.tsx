"use client"

import { useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

interface ImageZoomProps {
  src: string
  alt: string
  className?: string
  zoomScale?: number
}

export function ImageZoom({ src, alt, className, zoomScale = 2 }: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setPosition({ x, y })
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden cursor-zoom-in",
        isZoomed && "cursor-zoom-out",
        className
      )}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-transform duration-200",
          isZoomed && "scale-150"
        )}
        style={isZoomed ? {
          transformOrigin: `${position.x}% ${position.y}%`,
          transform: `scale(${zoomScale})`,
        } : undefined}
      />
    </div>
  )
}

// Full screen zoom modal
interface ImageZoomModalProps {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
}

export function ImageZoomModal({ src, alt, isOpen, onClose }: ImageZoomModalProps) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const startPos = useRef({ x: 0, y: 0 })

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setScale(prev => Math.min(Math.max(prev - e.deltaY * 0.001, 0.5), 5))
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale <= 1) return
    setIsDragging(true)
    startPos.current = { x: e.clientX - position.x, y: e.clientY - position.y }
  }, [scale, position])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - startPos.current.x,
      y: e.clientY - startPos.current.y,
    })
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className={cn(
          "max-w-[90vw] max-h-[90vh] overflow-hidden",
          scale > 1 ? "cursor-grab" : "cursor-zoom-in",
          isDragging && "cursor-grabbing"
        )}
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[90vh] object-contain select-none"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
          draggable={false}
        />
      </div>
      
      {/* Zoom controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 rounded-full px-4 py-2">
        <button
          onClick={(e) => { e.stopPropagation(); setScale(prev => Math.max(prev - 0.5, 0.5)) }}
          className="text-white hover:text-primary"
        >
          -
        </button>
        <span className="text-white text-sm min-w-[3rem] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); setScale(prev => Math.min(prev + 0.5, 5)) }}
          className="text-white hover:text-primary"
        >
          +
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setScale(1); setPosition({ x: 0, y: 0 }) }}
          className="text-white hover:text-primary text-xs"
        >
          Reset
        </button>
      </div>
      
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-primary"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
