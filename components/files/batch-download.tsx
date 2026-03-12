"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Download, FileArchive, Loader2, CheckCircle2, XCircle, File } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileItem {
  id: string
  name: string
  size: number
  type: string
  url: string
}

interface BatchDownloadProps {
  files: FileItem[]
  orderId?: string
  className?: string
}

export function BatchDownload({ files, orderId, className }: BatchDownloadProps) {
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [isDownloading, setIsDownloading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "downloading" | "success" | "error">("idle")

  const toggleFile = (fileId: string) => {
    const newSelected = new Set(selectedFiles)
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId)
    } else {
      newSelected.add(fileId)
    }
    setSelectedFiles(newSelected)
  }

  const selectAll = () => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set())
    } else {
      setSelectedFiles(new Set(files.map(f => f.id)))
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getTotalSize = () => {
    return files
      .filter(f => selectedFiles.has(f.id))
      .reduce((acc, f) => acc + f.size, 0)
  }

  const handleDownload = async () => {
    if (selectedFiles.size === 0) return

    setIsDownloading(true)
    setDownloadStatus("downloading")
    setProgress(0)

    try {
      const fileIds = Array.from(selectedFiles)
      
      // Simulate progress for demo
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch("/api/files/batch-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileIds, orderId }),
      })

      clearInterval(progressInterval)

      if (!response.ok) throw new Error("Download failed")

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = orderId ? `order-${orderId}-files.zip` : "files.zip"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setProgress(100)
      setDownloadStatus("success")
      
      setTimeout(() => {
        setDownloadStatus("idle")
        setProgress(0)
      }, 3000)
    } catch (error) {
      setDownloadStatus("error")
      setTimeout(() => {
        setDownloadStatus("idle")
        setProgress(0)
      }, 3000)
    } finally {
      setIsDownloading(false)
    }
  }

  const getFileIcon = (type: string) => {
    return <File className="h-4 w-4 text-muted-foreground" />
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileArchive className="h-5 w-5" />
            Batch Download
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={selectAll}>
            {selectedFiles.size === files.length ? "Deselect All" : "Select All"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="max-h-64 space-y-2 overflow-y-auto">
          {files.map((file) => (
            <div
              key={file.id}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-3 transition-colors",
                selectedFiles.has(file.id) && "border-primary bg-primary/5"
              )}
            >
              <Checkbox
                checked={selectedFiles.has(file.id)}
                onCheckedChange={() => toggleFile(file.id)}
              />
              {getFileIcon(file.type)}
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedFiles.size > 0 && (
          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
            <span className="text-sm">
              {selectedFiles.size} file{selectedFiles.size > 1 ? "s" : ""} selected
            </span>
            <Badge variant="secondary">{formatFileSize(getTotalSize())}</Badge>
          </div>
        )}

        {downloadStatus === "downloading" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Preparing ZIP file...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        {downloadStatus === "success" && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700 dark:bg-green-950/30 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm">Download complete!</span>
          </div>
        )}

        {downloadStatus === "error" && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700 dark:bg-red-950/30 dark:text-red-400">
            <XCircle className="h-4 w-4" />
            <span className="text-sm">Download failed. Please try again.</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full gap-2"
          onClick={handleDownload}
          disabled={selectedFiles.size === 0 || isDownloading}
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download as ZIP
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
