"use client"

import { useState, useCallback, useRef } from "react"
import { Upload, X, File, Image, FileText, Film, Music, Archive, Loader2, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  progress: number
  status: "uploading" | "complete" | "error"
  error?: string
}

interface FileUploadProps {
  orderId: string
  fileType?: "reference" | "deliverable" | "revision"
  onUploadComplete?: (files: UploadedFile[]) => void
  maxFiles?: number
  maxSizeMB?: number
  acceptedTypes?: string[]
  className?: string
}

const FILE_ICONS: Record<string, React.ElementType> = {
  image: Image,
  video: Film,
  audio: Music,
  pdf: FileText,
  archive: Archive,
  default: File,
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return FILE_ICONS.image
  if (mimeType.startsWith("video/")) return FILE_ICONS.video
  if (mimeType.startsWith("audio/")) return FILE_ICONS.audio
  if (mimeType === "application/pdf") return FILE_ICONS.pdf
  if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("tar")) return FILE_ICONS.archive
  return FILE_ICONS.default
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

export function FileUpload({
  orderId,
  fileType = "reference",
  onUploadComplete,
  maxFiles = 10,
  maxSizeMB = 50,
  acceptedTypes,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File): Promise<UploadedFile> => {
    const tempId = Math.random().toString(36).substring(7)
    const uploadedFile: UploadedFile = {
      id: tempId,
      name: file.name,
      size: file.size,
      type: file.type,
      url: "",
      progress: 0,
      status: "uploading",
    }

    setFiles((prev) => [...prev, uploadedFile])

    try {
      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`File size exceeds ${maxSizeMB}MB limit`)
      }

      // Create form data
      const formData = new FormData()
      formData.append("file", file)
      formData.append("orderId", orderId)
      formData.append("fileType", fileType)

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === tempId && f.progress < 90
              ? { ...f, progress: f.progress + 10 }
              : f
          )
        )
      }, 200)

      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }

      const result = await response.json()

      const completedFile: UploadedFile = {
        ...uploadedFile,
        id: result.id,
        url: result.url,
        progress: 100,
        status: "complete",
      }

      setFiles((prev) =>
        prev.map((f) => (f.id === tempId ? completedFile : f))
      )

      return completedFile
    } catch (error) {
      const errorFile: UploadedFile = {
        ...uploadedFile,
        progress: 0,
        status: "error",
        error: error instanceof Error ? error.message : "Upload failed",
      }

      setFiles((prev) =>
        prev.map((f) => (f.id === tempId ? errorFile : f))
      )

      return errorFile
    }
  }

  const handleFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const newFiles = Array.from(fileList).slice(0, maxFiles - files.length)

      if (newFiles.length === 0) return

      const uploadPromises = newFiles.map(uploadFile)
      const results = await Promise.all(uploadPromises)

      const completedFiles = results.filter((f) => f.status === "complete")
      if (completedFiles.length > 0 && onUploadComplete) {
        onUploadComplete(completedFiles)
      }
    },
    [files.length, maxFiles, onUploadComplete, orderId, fileType]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFiles(e.target.files)
      }
    },
    [handleFiles]
  )

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const retryUpload = async (file: UploadedFile) => {
    // Remove the failed file and re-upload
    setFiles((prev) => prev.filter((f) => f.id !== file.id))
    // Note: We'd need the original File object to retry, so this is simplified
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes?.join(",")}
          onChange={handleInputChange}
          className="sr-only"
        />

        <div className="rounded-full bg-muted p-3">
          <Upload className="h-6 w-6 text-muted-foreground" />
        </div>

        <div className="text-center">
          <p className="text-sm font-medium">
            Drop files here or click to upload
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Max {maxFiles} files, up to {maxSizeMB}MB each
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => {
            const FileIcon = getFileIcon(file.type)

            return (
              <div
                key={file.id}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-3",
                  file.status === "error" && "border-destructive/50 bg-destructive/5"
                )}
              >
                <div className="shrink-0">
                  <FileIcon className="h-8 w-8 text-muted-foreground" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>

                  {file.status === "uploading" && (
                    <Progress value={file.progress} className="h-1 mt-2" />
                  )}

                  {file.status === "error" && (
                    <p className="text-xs text-destructive mt-1">{file.error}</p>
                  )}
                </div>

                <div className="shrink-0">
                  {file.status === "uploading" && (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  )}
                  {file.status === "complete" && (
                    <Check className="h-5 w-5 text-green-500" />
                  )}
                  {file.status === "error" && (
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(file.id)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
