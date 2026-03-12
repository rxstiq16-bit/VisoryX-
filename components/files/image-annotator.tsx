"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { 
  Pencil, 
  Circle, 
  Square, 
  ArrowRight, 
  Type, 
  Eraser, 
  Undo, 
  Redo, 
  Download, 
  X,
  MousePointer,
  Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"

type Tool = "select" | "pencil" | "circle" | "rectangle" | "arrow" | "text" | "eraser"

interface Annotation {
  id: string
  tool: Tool
  points: { x: number; y: number }[]
  color: string
  strokeWidth: number
  text?: string
}

interface ImageAnnotatorProps {
  imageUrl: string
  existingAnnotations?: Annotation[]
  onSave: (annotations: Annotation[], imageData: string) => void
  onClose: () => void
  className?: string
}

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#ffffff", "#000000"]

export function ImageAnnotator({ imageUrl, existingAnnotations = [], onSave, onClose, className }: ImageAnnotatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [tool, setTool] = useState<Tool>("pencil")
  const [color, setColor] = useState("#ef4444")
  const [strokeWidth, setStrokeWidth] = useState(3)
  const [annotations, setAnnotations] = useState<Annotation[]>(existingAnnotations)
  const [currentAnnotation, setCurrentAnnotation] = useState<Annotation | null>(null)
  const [history, setHistory] = useState<Annotation[][]>([existingAnnotations])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [isDrawing, setIsDrawing] = useState(false)
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  // Load image
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      setImage(img)
      redrawCanvas(img, annotations)
    }
    img.src = imageUrl
  }, [imageUrl])

  const redrawCanvas = useCallback((img: HTMLImageElement | null, anns: Annotation[]) => {
    const canvas = canvasRef.current
    if (!canvas || !img) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to image size
    canvas.width = img.width
    canvas.height = img.height

    // Draw image
    ctx.drawImage(img, 0, 0)

    // Draw annotations
    anns.forEach((ann) => {
      ctx.strokeStyle = ann.color
      ctx.fillStyle = ann.color
      ctx.lineWidth = ann.strokeWidth
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      switch (ann.tool) {
        case "pencil":
          if (ann.points.length < 2) return
          ctx.beginPath()
          ctx.moveTo(ann.points[0].x, ann.points[0].y)
          ann.points.forEach((point) => ctx.lineTo(point.x, point.y))
          ctx.stroke()
          break

        case "circle":
          if (ann.points.length < 2) return
          const radiusX = Math.abs(ann.points[1].x - ann.points[0].x) / 2
          const radiusY = Math.abs(ann.points[1].y - ann.points[0].y) / 2
          const centerX = (ann.points[0].x + ann.points[1].x) / 2
          const centerY = (ann.points[0].y + ann.points[1].y) / 2
          ctx.beginPath()
          ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI)
          ctx.stroke()
          break

        case "rectangle":
          if (ann.points.length < 2) return
          ctx.strokeRect(
            ann.points[0].x,
            ann.points[0].y,
            ann.points[1].x - ann.points[0].x,
            ann.points[1].y - ann.points[0].y
          )
          break

        case "arrow":
          if (ann.points.length < 2) return
          const start = ann.points[0]
          const end = ann.points[1]
          const angle = Math.atan2(end.y - start.y, end.x - start.x)
          const headLength = 15

          ctx.beginPath()
          ctx.moveTo(start.x, start.y)
          ctx.lineTo(end.x, end.y)
          ctx.stroke()

          ctx.beginPath()
          ctx.moveTo(end.x, end.y)
          ctx.lineTo(
            end.x - headLength * Math.cos(angle - Math.PI / 6),
            end.y - headLength * Math.sin(angle - Math.PI / 6)
          )
          ctx.lineTo(
            end.x - headLength * Math.cos(angle + Math.PI / 6),
            end.y - headLength * Math.sin(angle + Math.PI / 6)
          )
          ctx.closePath()
          ctx.fill()
          break

        case "text":
          if (ann.text) {
            ctx.font = `${ann.strokeWidth * 6}px sans-serif`
            ctx.fillText(ann.text, ann.points[0].x, ann.points[0].y)
          }
          break
      }
    })
  }, [])

  useEffect(() => {
    if (image) {
      redrawCanvas(image, [...annotations, ...(currentAnnotation ? [currentAnnotation] : [])])
    }
  }, [annotations, currentAnnotation, image, redrawCanvas])

  const getCanvasPoint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === "select") return

    const point = getCanvasPoint(e)
    setIsDrawing(true)

    if (tool === "text") {
      const text = prompt("Enter text:")
      if (text) {
        const newAnnotation: Annotation = {
          id: crypto.randomUUID(),
          tool,
          points: [point],
          color,
          strokeWidth,
          text,
        }
        addAnnotation(newAnnotation)
      }
      return
    }

    setCurrentAnnotation({
      id: crypto.randomUUID(),
      tool,
      points: [point],
      color,
      strokeWidth,
    })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentAnnotation) return

    const point = getCanvasPoint(e)

    if (tool === "pencil" || tool === "eraser") {
      setCurrentAnnotation({
        ...currentAnnotation,
        points: [...currentAnnotation.points, point],
      })
    } else {
      setCurrentAnnotation({
        ...currentAnnotation,
        points: [currentAnnotation.points[0], point],
      })
    }
  }

  const handleMouseUp = () => {
    if (currentAnnotation) {
      addAnnotation(currentAnnotation)
    }
    setIsDrawing(false)
    setCurrentAnnotation(null)
  }

  const addAnnotation = (annotation: Annotation) => {
    const newAnnotations = [...annotations, annotation]
    setAnnotations(newAnnotations)
    
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newAnnotations)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setAnnotations(history[historyIndex - 1])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setAnnotations(history[historyIndex + 1])
    }
  }

  const clearAll = () => {
    setAnnotations([])
    const newHistory = [...history, []]
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const imageData = canvas.toDataURL("image/png")
    onSave(annotations, imageData)
  }

  const tools: { id: Tool; icon: React.ReactNode; label: string }[] = [
    { id: "select", icon: <MousePointer className="h-4 w-4" />, label: "Select" },
    { id: "pencil", icon: <Pencil className="h-4 w-4" />, label: "Pencil" },
    { id: "circle", icon: <Circle className="h-4 w-4" />, label: "Circle" },
    { id: "rectangle", icon: <Square className="h-4 w-4" />, label: "Rectangle" },
    { id: "arrow", icon: <ArrowRight className="h-4 w-4" />, label: "Arrow" },
    { id: "text", icon: <Type className="h-4 w-4" />, label: "Text" },
    { id: "eraser", icon: <Eraser className="h-4 w-4" />, label: "Eraser" },
  ]

  return (
    <div className={cn("fixed inset-0 z-50 flex flex-col bg-background", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b bg-card px-4 py-2">
        <div className="flex items-center gap-2">
          {tools.map((t) => (
            <Button
              key={t.id}
              variant={tool === t.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setTool(t.id)}
              title={t.label}
            >
              {t.icon}
            </Button>
          ))}

          <div className="mx-2 h-6 w-px bg-border" />

          <div className="flex items-center gap-1">
            {COLORS.map((c) => (
              <button
                key={c}
                className={cn(
                  "h-6 w-6 rounded-full border-2 transition-transform",
                  color === c ? "scale-110 border-foreground" : "border-transparent"
                )}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>

          <div className="mx-2 h-6 w-px bg-border" />

          <div className="flex w-32 items-center gap-2">
            <span className="text-xs text-muted-foreground">Size</span>
            <Slider
              value={[strokeWidth]}
              onValueChange={([v]) => setStrokeWidth(v)}
              min={1}
              max={10}
              step={1}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={undo} disabled={historyIndex === 0}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={redo} disabled={historyIndex === history.length - 1}>
            <Redo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <Trash2 className="h-4 w-4" />
          </Button>

          <div className="mx-2 h-6 w-px bg-border" />

          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Download className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="flex-1 overflow-auto bg-muted/50 p-4">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="mx-auto max-h-full max-w-full cursor-crosshair rounded-lg shadow-lg"
          style={{ touchAction: "none" }}
        />
      </div>
    </div>
  )
}
