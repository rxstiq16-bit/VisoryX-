"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Box, RotateCcw, Maximize } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModelViewerProps {
  modelUrl: string
  title?: string
  downloadUrl?: string
  className?: string
}

export function ModelViewer({ modelUrl, title, downloadUrl, className }: ModelViewerProps) {
  const [isRotating, setIsRotating] = useState(true)

  const fileName = modelUrl.split('/').pop() || 'model.glb'

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-gradient-to-br from-background to-muted",
        className
      )}
    >
      {title && (
        <div className="absolute left-4 top-4 z-10">
          <div className="flex items-center gap-2 rounded-lg bg-background/80 px-3 py-1.5 backdrop-blur">
            <Box className="h-4 w-4" />
            <span className="text-sm font-medium">{title}</span>
          </div>
        </div>
      )}

      {/* 3D Model Placeholder */}
      <div className="flex h-[400px] flex-col items-center justify-center p-8">
        <div className={cn(
          "mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-8",
          isRotating && "animate-pulse"
        )}>
          <Box className={cn(
            "h-24 w-24 text-primary",
            isRotating && "animate-spin"
          )} style={{ animationDuration: "4s" }} />
        </div>
        
        <h3 className="mb-2 text-lg font-semibold">3D Model Viewer</h3>
        <p className="mb-4 max-w-sm text-center text-sm text-muted-foreground">
          Interactive 3D viewing is available when deployed. The model file is ready for download.
        </p>
        
        <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
          <Box className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-mono text-muted-foreground">{fileName}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-background/80 p-2 backdrop-blur">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setIsRotating(!isRotating)}
          title={isRotating ? "Stop animation" : "Start animation"}
        >
          <RotateCcw className={cn("h-4 w-4", isRotating && "animate-spin")} style={{ animationDuration: "3s" }} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Fullscreen (available in production)"
          disabled
        >
          <Maximize className="h-4 w-4" />
        </Button>

        {downloadUrl && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            asChild
          >
            <a href={downloadUrl} download>
              <Download className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>

      {/* Info */}
      <div className="absolute right-4 top-4 z-10 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="rounded-lg bg-background/80 px-3 py-2 text-xs text-muted-foreground backdrop-blur">
          Full 3D viewer available in production deployment
        </div>
      </div>
    </div>
  )
}
