"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FileImage, FileType, Download, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConversionFormat {
  id: string
  label: string
  extension: string
  mimeType: string
}

const IMAGE_FORMATS: ConversionFormat[] = [
  { id: "png", label: "PNG", extension: ".png", mimeType: "image/png" },
  { id: "jpg", label: "JPEG", extension: ".jpg", mimeType: "image/jpeg" },
  { id: "webp", label: "WebP", extension: ".webp", mimeType: "image/webp" },
  { id: "gif", label: "GIF", extension: ".gif", mimeType: "image/gif" },
  { id: "bmp", label: "BMP", extension: ".bmp", mimeType: "image/bmp" },
  { id: "ico", label: "ICO", extension: ".ico", mimeType: "image/x-icon" },
]

const DOCUMENT_FORMATS: ConversionFormat[] = [
  { id: "pdf", label: "PDF", extension: ".pdf", mimeType: "application/pdf" },
  { id: "svg", label: "SVG", extension: ".svg", mimeType: "image/svg+xml" },
]

interface FileConverterProps {
  file: {
    id: string
    name: string
    url: string
    type: string
  }
  onDownload: (url: string, filename: string) => void
  className?: string
}

export function FileConverter({ file, onDownload, className }: FileConverterProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>("")
  const [converting, setConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"idle" | "converting" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  const isImage = file.type.startsWith("image/")
  const availableFormats = isImage ? IMAGE_FORMATS : DOCUMENT_FORMATS

  // Get current format from file extension
  const currentExtension = file.name.split(".").pop()?.toLowerCase()
  const filteredFormats = availableFormats.filter((f) => f.id !== currentExtension)

  const handleConvert = async () => {
    if (!selectedFormat) return

    setConverting(true)
    setStatus("converting")
    setProgress(0)
    setError(null)

    try {
      // Simulate progress for client-side conversion
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 100)

      if (isImage) {
        // Client-side image conversion using canvas
        const img = new Image()
        img.crossOrigin = "anonymous"
        
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve()
          img.onerror = () => reject(new Error("Failed to load image"))
          img.src = file.url
        })

        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        
        const ctx = canvas.getContext("2d")
        if (!ctx) throw new Error("Canvas not supported")
        
        ctx.drawImage(img, 0, 0)

        const format = availableFormats.find((f) => f.id === selectedFormat)
        if (!format) throw new Error("Invalid format")

        const quality = selectedFormat === "jpg" ? 0.92 : undefined
        const dataUrl = canvas.toDataURL(format.mimeType, quality)

        clearInterval(progressInterval)
        setProgress(100)

        // Convert data URL to blob and download
        const response = await fetch(dataUrl)
        const blob = await response.blob()
        const blobUrl = URL.createObjectURL(blob)
        
        const newFilename = file.name.replace(/\.[^.]+$/, format.extension)
        onDownload(blobUrl, newFilename)

        setStatus("success")
      } else {
        // Server-side conversion for documents
        const response = await fetch("/api/files/convert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileId: file.id,
            targetFormat: selectedFormat,
          }),
        })

        if (!response.ok) {
          throw new Error("Conversion failed")
        }

        const result = await response.json()
        clearInterval(progressInterval)
        setProgress(100)
        
        onDownload(result.url, result.filename)
        setStatus("success")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed")
      setStatus("error")
    } finally {
      setConverting(false)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileType className="h-5 w-5" />
          Convert File
        </CardTitle>
        <CardDescription>
          Convert {file.name} to a different format
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
            <FileImage className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate font-medium">{file.name}</p>
            <Badge variant="outline" className="text-xs">
              {currentExtension?.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Convert to:</span>
          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              {filteredFormats.map((format) => (
                <SelectItem key={format.id} value={format.id}>
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {status === "converting" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Converting...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {status === "success" && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            Conversion complete! Download started.
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <Button
          onClick={handleConvert}
          disabled={!selectedFormat || converting}
          className="w-full"
        >
          {converting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Convert & Download
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

// Batch download as ZIP
interface BatchDownloadProps {
  files: Array<{
    id: string
    name: string
    url: string
  }>
  onDownload: () => void
  className?: string
}

export function BatchDownload({ files, onDownload, className }: BatchDownloadProps) {
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleDownload = async () => {
    setDownloading(true)
    setProgress(0)

    try {
      const response = await fetch("/api/files/batch-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileIds: files.map((f) => f.id) }),
      })

      if (!response.ok) throw new Error("Download failed")

      // Stream the ZIP file
      const reader = response.body?.getReader()
      const contentLength = Number(response.headers.get("Content-Length"))
      
      const chunks: Uint8Array[] = []
      let receivedLength = 0

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        
        chunks.push(value)
        receivedLength += value.length
        setProgress(Math.round((receivedLength / contentLength) * 100))
      }

      const blob = new Blob(chunks, { type: "application/zip" })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement("a")
      a.href = url
      a.download = `files-${Date.now()}.zip`
      a.click()
      
      URL.revokeObjectURL(url)
      onDownload()
    } catch (error) {
      console.error("Batch download failed:", error)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {downloading && (
        <div className="flex items-center gap-2 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Preparing ZIP... {progress}%</span>
        </div>
      )}
      <Button onClick={handleDownload} disabled={downloading || files.length === 0}>
        <Download className="mr-2 h-4 w-4" />
        Download All ({files.length} files)
      </Button>
    </div>
  )
}
