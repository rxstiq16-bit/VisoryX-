"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Upload, 
  Palette, 
  Type, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Copy, 
  Check,
  Download,
  Edit2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface BrandColor {
  name: string
  hex: string
}

interface BrandFont {
  name: string
  style: string
}

interface BrandAsset {
  id: string
  name: string
  type: "logo" | "icon" | "pattern"
  url: string
}

interface BrandKitProps {
  className?: string
}

export function BrandKit({ className }: BrandKitProps) {
  const [colors, setColors] = useState<BrandColor[]>([
    { name: "Primary", hex: "#8B5CF6" },
    { name: "Secondary", hex: "#EC4899" },
    { name: "Background", hex: "#0F0F0F" },
    { name: "Text", hex: "#FFFFFF" },
  ])
  const [fonts, setFonts] = useState<BrandFont[]>([
    { name: "Syne", style: "Display / Headings" },
    { name: "Inter", style: "Body Text" },
  ])
  const [assets, setAssets] = useState<BrandAsset[]>([])
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex)
    setCopiedColor(hex)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const addColor = () => {
    setColors([...colors, { name: `Color ${colors.length + 1}`, hex: "#000000" }])
  }

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index))
  }

  const updateColor = (index: number, field: keyof BrandColor, value: string) => {
    const newColors = [...colors]
    newColors[index] = { ...newColors[index], [field]: value }
    setColors(newColors)
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Brand Kit</h2>
          <p className="text-muted-foreground">
            Store your brand assets for consistent designs
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Kit
        </Button>
      </div>

      <Tabs defaultValue="colors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="colors" className="gap-2">
            <Palette className="h-4 w-4" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="fonts" className="gap-2">
            <Type className="h-4 w-4" />
            Fonts
          </TabsTrigger>
          <TabsTrigger value="assets" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            Assets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Brand Colors</CardTitle>
              <CardDescription>
                Your color palette will be used across all designs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div
                      className="h-12 w-12 shrink-0 rounded-lg border shadow-sm"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex-1 space-y-1">
                      <Input
                        value={color.name}
                        onChange={(e) => updateColor(index, "name", e.target.value)}
                        className="h-8 border-0 p-0 text-sm font-medium focus-visible:ring-0"
                      />
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={color.hex}
                          onChange={(e) => updateColor(index, "hex", e.target.value)}
                          className="h-6 w-8 cursor-pointer border-0 p-0"
                        />
                        <span className="font-mono text-xs text-muted-foreground">
                          {color.hex.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => copyColor(color.hex)}
                      >
                        {copiedColor === color.hex ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeColor(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" onClick={addColor} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Color
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fonts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>
                Fonts used in your brand materials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {fonts.map((font, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium" style={{ fontFamily: font.name }}>
                      {font.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{font.style}</p>
                  </div>
                  <Badge variant="secondary">{font.style}</Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Font
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Brand Assets</CardTitle>
              <CardDescription>
                Upload logos, icons, and other brand assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assets.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
                  <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="mb-2 font-medium">No assets uploaded</p>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Upload logos, icons, and patterns for your brand
                  </p>
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Assets
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-3">
                  {assets.map((asset) => (
                    <div
                      key={asset.id}
                      className="group relative aspect-square rounded-lg border bg-muted"
                    >
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="h-full w-full object-contain p-4"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex gap-2">
                          <Button size="icon" variant="secondary">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
