"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Trash2, 
  Download, 
  Share2, 
  Image as ImageIcon, 
  Link as LinkIcon,
  Palette,
  Type,
  GripVertical,
  Maximize2,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MoodBoardItem {
  id: string
  type: "image" | "color" | "text" | "link"
  content: string
  position: { x: number; y: number }
  size: { width: number; height: number }
}

interface MoodBoardProps {
  className?: string
  onSave?: (items: MoodBoardItem[]) => void
}

export function MoodBoard({ className, onSave }: MoodBoardProps) {
  const [items, setItems] = useState<MoodBoardItem[]>([])
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const addItem = (type: MoodBoardItem["type"]) => {
    const newItem: MoodBoardItem = {
      id: `item-${Date.now()}`,
      type,
      content: type === "color" ? "#8B5CF6" : type === "text" ? "Add your text" : "",
      position: { x: Math.random() * 200, y: Math.random() * 200 },
      size: { width: 150, height: type === "text" ? 60 : 150 },
    }
    setItems([...items, newItem])
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
    if (selectedItem === id) setSelectedItem(null)
  }

  const updateItem = (id: string, updates: Partial<MoodBoardItem>) => {
    setItems(items.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))
    
    imageFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const newItem: MoodBoardItem = {
          id: `item-${Date.now()}-${Math.random()}`,
          type: "image",
          content: event.target?.result as string,
          position: { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY },
          size: { width: 200, height: 200 },
        }
        setItems((prev) => [...prev, newItem])
      }
      reader.readAsDataURL(file)
    })
  }, [])

  return (
    <Card className={cn("overflow-hidden", isFullscreen && "fixed inset-4 z-50", className)}>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Mood Board</CardTitle>
            <CardDescription>
              Drag and drop to create your design inspiration board
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <X className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button size="sm" onClick={() => onSave?.(items)}>
              <Download className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Toolbar */}
        <div className="flex items-center gap-2 border-b bg-muted/50 p-3">
          <span className="text-sm text-muted-foreground">Add:</span>
          <Button variant="outline" size="sm" onClick={() => addItem("image")}>
            <ImageIcon className="mr-2 h-4 w-4" />
            Image
          </Button>
          <Button variant="outline" size="sm" onClick={() => addItem("color")}>
            <Palette className="mr-2 h-4 w-4" />
            Color
          </Button>
          <Button variant="outline" size="sm" onClick={() => addItem("text")}>
            <Type className="mr-2 h-4 w-4" />
            Text
          </Button>
          <Button variant="outline" size="sm" onClick={() => addItem("link")}>
            <LinkIcon className="mr-2 h-4 w-4" />
            Link
          </Button>
          <div className="ml-auto">
            <Badge variant="secondary">{items.length} items</Badge>
          </div>
        </div>

        {/* Canvas */}
        <div
          className={cn(
            "relative bg-muted/30",
            isFullscreen ? "h-[calc(100vh-12rem)]" : "h-[500px]"
          )}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {items.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="rounded-xl border-2 border-dashed border-muted-foreground/30 p-12 text-center">
                <ImageIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="mb-2 font-medium">Drop images or add elements</p>
                <p className="text-sm text-muted-foreground">
                  Build your mood board by adding colors, images, and text
                </p>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "absolute cursor-move rounded-lg border-2 bg-background shadow-lg transition-shadow hover:shadow-xl",
                  selectedItem === item.id ? "border-primary ring-2 ring-primary/20" : "border-transparent"
                )}
                style={{
                  left: item.position.x,
                  top: item.position.y,
                  width: item.size.width,
                  height: item.size.height,
                }}
                onClick={() => setSelectedItem(item.id)}
              >
                {/* Item content based on type */}
                {item.type === "image" && item.content && (
                  <img
                    src={item.content}
                    alt="Mood board item"
                    className="h-full w-full rounded-md object-cover"
                  />
                )}
                {item.type === "color" && (
                  <div
                    className="h-full w-full rounded-md"
                    style={{ backgroundColor: item.content }}
                  >
                    <span className="absolute bottom-2 left-2 rounded bg-background/80 px-2 py-1 font-mono text-xs">
                      {item.content}
                    </span>
                  </div>
                )}
                {item.type === "text" && (
                  <div className="flex h-full w-full items-center justify-center p-2">
                    <Input
                      value={item.content}
                      onChange={(e) => updateItem(item.id, { content: e.target.value })}
                      className="border-0 text-center focus-visible:ring-0"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
                {item.type === "link" && (
                  <div className="flex h-full w-full items-center justify-center p-2">
                    <LinkIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}

                {/* Controls */}
                {selectedItem === item.id && (
                  <div className="absolute -right-2 -top-2 flex gap-1">
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeItem(item.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                {/* Drag handle */}
                <div className="absolute left-1 top-1 cursor-grab opacity-0 transition-opacity hover:opacity-100">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
