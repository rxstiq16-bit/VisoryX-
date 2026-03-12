"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Copy, Check, Code, Link, Image } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmbedGeneratorProps {
  portfolioId: string
  title: string
  thumbnailUrl: string
  className?: string
}

export function EmbedGenerator({ portfolioId, title, thumbnailUrl, className }: EmbedGeneratorProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const [width, setWidth] = useState("600")
  const [height, setHeight] = useState("400")
  const [showTitle, setShowTitle] = useState(true)
  const [theme, setTheme] = useState<"light" | "dark">("dark")

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://visoryx.design"
  const embedUrl = `${baseUrl}/embed/portfolio/${portfolioId}?theme=${theme}&title=${showTitle}`
  const directUrl = `${baseUrl}/portfolio/${portfolioId}`

  const iframeCode = `<iframe 
  src="${embedUrl}"
  width="${width}"
  height="${height}"
  frameborder="0"
  allowfullscreen
  title="${title}"
></iframe>`

  const htmlCode = `<a href="${directUrl}" target="_blank" rel="noopener noreferrer">
  <img 
    src="${thumbnailUrl}" 
    alt="${title}" 
    width="${width}"
    style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
  />
</a>`

  const markdownCode = `[![${title}](${thumbnailUrl})](${directUrl})`

  const bbcodeCode = `[url=${directUrl}][img]${thumbnailUrl}[/img][/url]`

  const handleCopy = async (code: string, type: string) => {
    await navigator.clipboard.writeText(code)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Code className="h-5 w-5" />
          Embed Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Width (px)</Label>
            <Input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Height (px)</Label>
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch
              checked={showTitle}
              onCheckedChange={setShowTitle}
            />
            <Label>Show Title</Label>
          </div>
          <Select value={theme} onValueChange={(v: "light" | "dark") => setTheme(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="iframe" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="iframe" className="flex-1">iFrame</TabsTrigger>
            <TabsTrigger value="html" className="flex-1">HTML</TabsTrigger>
            <TabsTrigger value="markdown" className="flex-1">Markdown</TabsTrigger>
            <TabsTrigger value="bbcode" className="flex-1">BBCode</TabsTrigger>
          </TabsList>

          <TabsContent value="iframe" className="space-y-2">
            <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
              {iframeCode}
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => handleCopy(iframeCode, "iframe")}
            >
              {copied === "iframe" ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied === "iframe" ? "Copied!" : "Copy Code"}
            </Button>
          </TabsContent>

          <TabsContent value="html" className="space-y-2">
            <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
              {htmlCode}
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => handleCopy(htmlCode, "html")}
            >
              {copied === "html" ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied === "html" ? "Copied!" : "Copy Code"}
            </Button>
          </TabsContent>

          <TabsContent value="markdown" className="space-y-2">
            <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
              {markdownCode}
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => handleCopy(markdownCode, "markdown")}
            >
              {copied === "markdown" ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied === "markdown" ? "Copied!" : "Copy Code"}
            </Button>
          </TabsContent>

          <TabsContent value="bbcode" className="space-y-2">
            <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
              {bbcodeCode}
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => handleCopy(bbcodeCode, "bbcode")}
            >
              {copied === "bbcode" ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied === "bbcode" ? "Copied!" : "Copy Code"}
            </Button>
          </TabsContent>
        </Tabs>

        <div className="pt-2 border-t">
          <Label className="text-sm text-muted-foreground">Direct Link</Label>
          <div className="flex gap-2 mt-1">
            <Input value={directUrl} readOnly className="text-xs" />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleCopy(directUrl, "link")}
            >
              {copied === "link" ? <Check className="h-4 w-4" /> : <Link className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
