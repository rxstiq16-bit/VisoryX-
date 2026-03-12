"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Copy, Check, Palette } from "lucide-react"

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  presets?: string[]
  className?: string
}

const DEFAULT_PRESETS = [
  "#000000", "#FFFFFF", "#EF4444", "#F97316", "#EAB308",
  "#22C55E", "#14B8A6", "#3B82F6", "#8B5CF6", "#EC4899",
  "#6B7280", "#1F2937", "#FCA5A5", "#FDBA74", "#FDE047",
  "#86EFAC", "#5EEAD4", "#93C5FD", "#C4B5FD", "#F9A8D4",
]

export function ColorPicker({
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  className,
}: ColorPickerProps) {
  const [copied, setCopied] = useState(false)
  const [hexInput, setHexInput] = useState(value)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [value])

  const handleHexChange = useCallback((hex: string) => {
    setHexInput(hex)
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      onChange(hex)
    }
  }, [onChange])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start gap-2", className)}
        >
          <div
            className="h-5 w-5 rounded border"
            style={{ backgroundColor: value }}
          />
          <span className="font-mono text-sm">{value}</span>
          <Palette className="ml-auto h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="start">
        <div className="space-y-4">
          {/* Native color picker */}
          <div className="flex items-center gap-2">
            <Label className="text-sm">Color</Label>
            <input
              type="color"
              value={value}
              onChange={(e) => {
                onChange(e.target.value)
                setHexInput(e.target.value)
              }}
              className="h-8 w-8 cursor-pointer rounded border p-0"
            />
          </div>

          {/* Hex input */}
          <div className="flex items-center gap-2">
            <Input
              value={hexInput}
              onChange={(e) => handleHexChange(e.target.value)}
              placeholder="#000000"
              className="font-mono text-sm"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          {/* Color presets */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Presets</Label>
            <div className="grid grid-cols-5 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset}
                  className={cn(
                    "h-6 w-6 rounded border-2 transition-transform hover:scale-110",
                    value === preset ? "border-primary ring-2 ring-primary ring-offset-2" : "border-transparent"
                  )}
                  style={{ backgroundColor: preset }}
                  onClick={() => {
                    onChange(preset)
                    setHexInput(preset)
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Color palette generator
interface ColorPaletteProps {
  baseColor: string
  onSelectColor: (color: string) => void
}

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 }
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, "0")
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export function ColorPalette({ baseColor, onSelectColor }: ColorPaletteProps) {
  const { h, s } = hexToHSL(baseColor)
  
  const shades = [
    { name: "50", color: hslToHex(h, s, 95) },
    { name: "100", color: hslToHex(h, s, 90) },
    { name: "200", color: hslToHex(h, s, 80) },
    { name: "300", color: hslToHex(h, s, 70) },
    { name: "400", color: hslToHex(h, s, 60) },
    { name: "500", color: hslToHex(h, s, 50) },
    { name: "600", color: hslToHex(h, s, 40) },
    { name: "700", color: hslToHex(h, s, 30) },
    { name: "800", color: hslToHex(h, s, 20) },
    { name: "900", color: hslToHex(h, s, 10) },
  ]

  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">Color Palette</Label>
      <div className="flex gap-1">
        {shades.map((shade) => (
          <button
            key={shade.name}
            className="flex-1 h-8 first:rounded-l last:rounded-r hover:ring-2 ring-primary ring-offset-1 transition-all"
            style={{ backgroundColor: shade.color }}
            onClick={() => onSelectColor(shade.color)}
            title={`${shade.name}: ${shade.color}`}
          />
        ))}
      </div>
    </div>
  )
}
