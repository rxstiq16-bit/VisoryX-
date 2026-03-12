"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Copy, QrCode, CheckCircle, Palette } from "lucide-react"

interface QRCodeGeneratorProps {
  defaultValue?: string
  defaultType?: "url" | "order" | "text"
}

export function QRCodeGenerator({ defaultValue = "", defaultType = "url" }: QRCodeGeneratorProps) {
  const [value, setValue] = useState(defaultValue)
  const [type, setType] = useState(defaultType)
  const [size, setSize] = useState(200)
  const [fgColor, setFgColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#FFFFFF")
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate QR code using canvas
  useEffect(() => {
    if (!value || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Simple QR code visualization (in production, use a proper QR library like 'qrcode')
    // This is a placeholder that draws a stylized QR pattern
    canvas.width = size
    canvas.height = size

    // Background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, size, size)

    // QR pattern simulation
    const moduleSize = size / 25
    ctx.fillStyle = fgColor

    // Corner squares (finder patterns)
    const drawFinder = (x: number, y: number) => {
      ctx.fillRect(x, y, 7 * moduleSize, 7 * moduleSize)
      ctx.fillStyle = bgColor
      ctx.fillRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize)
      ctx.fillStyle = fgColor
      ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize)
    }

    drawFinder(0, 0)
    drawFinder(size - 7 * moduleSize, 0)
    drawFinder(0, size - 7 * moduleSize)

    // Data modules (randomized for visual effect)
    const seed = value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    for (let i = 8; i < 17; i++) {
      for (let j = 0; j < 25; j++) {
        if ((seed + i * j) % 3 === 0) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize)
        }
      }
    }
    for (let i = 0; i < 8; i++) {
      for (let j = 8; j < 17; j++) {
        if ((seed + i * j) % 3 === 0) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize)
        }
      }
    }
    for (let i = 17; i < 25; i++) {
      for (let j = 8; j < 25; j++) {
        if ((seed + i * j) % 3 === 0) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize)
        }
      }
    }
  }, [value, size, fgColor, bgColor])

  const downloadQR = () => {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.download = `qr-code-${Date.now()}.png`
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
  }

  const copyQR = async () => {
    if (!canvasRef.current) return
    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvasRef.current!.toBlob((b) => resolve(b!), "image/png")
      })
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob })
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: copy data URL
      const dataUrl = canvasRef.current.toDataURL("image/png")
      await navigator.clipboard.writeText(dataUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getPlaceholder = () => {
    switch (type) {
      case "url": return "https://visoryx.com"
      case "order": return "ORD-2024-001"
      case "text": return "Enter any text..."
      default: return ""
    }
  }

  const getFullValue = () => {
    switch (type) {
      case "url": return value
      case "order": return `https://visoryx.com/orders/${value}`
      case "text": return value
      default: return value
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Settings */}
          <div className="space-y-4">
            <Tabs value={type} onValueChange={(v) => setType(v as typeof type)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="order">Order</TabsTrigger>
                <TabsTrigger value="text">Text</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-2">
              <Label>
                {type === "url" && "URL"}
                {type === "order" && "Order ID"}
                {type === "text" && "Text Content"}
              </Label>
              <Input
                placeholder={getPlaceholder()}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Size</Label>
              <Select value={size.toString()} onValueChange={(v) => setSize(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="150">Small (150px)</SelectItem>
                  <SelectItem value="200">Medium (200px)</SelectItem>
                  <SelectItem value="300">Large (300px)</SelectItem>
                  <SelectItem value="400">Extra Large (400px)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Foreground
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Background
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-white rounded-lg shadow-sm border">
              <canvas ref={canvasRef} className="max-w-full" />
            </div>
            
            {value && (
              <p className="text-xs text-muted-foreground text-center max-w-[200px] truncate">
                {getFullValue()}
              </p>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={copyQR} disabled={!value}>
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              <Button onClick={downloadQR} disabled={!value}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Simple component for displaying QR codes inline
export function QRCodeDisplay({ 
  value, 
  size = 100,
  className = "" 
}: { 
  value: string
  size?: number
  className?: string 
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!value || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = size
    canvas.height = size
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, size, size)
    ctx.fillStyle = "#000000"

    const moduleSize = size / 25
    const drawFinder = (x: number, y: number) => {
      ctx.fillRect(x, y, 7 * moduleSize, 7 * moduleSize)
      ctx.fillStyle = "#FFFFFF"
      ctx.fillRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize)
      ctx.fillStyle = "#000000"
      ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize)
    }
    drawFinder(0, 0)
    drawFinder(size - 7 * moduleSize, 0)
    drawFinder(0, size - 7 * moduleSize)

    const seed = value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    for (let i = 8; i < 17; i++) {
      for (let j = 0; j < 25; j++) {
        if ((seed + i * j) % 3 === 0) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize)
        }
      }
    }
  }, [value, size])

  return <canvas ref={canvasRef} className={className} />
}
