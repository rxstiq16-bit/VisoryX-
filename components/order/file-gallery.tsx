"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Download,
  Eye,
  File,
  FileText,
  Film,
  Image as ImageIcon,
  Music,
  Archive,
  Trash2,
  X,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

interface OrderFile {
  id: string
  file_name: string
  file_size: number
  file_type: string
  file_category: "reference" | "deliverable" | "revision"
  version?: number
  is_final?: boolean
  created_at: string
  uploaded_by: string
}

interface FileGalleryProps {
  files: OrderFile[]
  canDelete?: boolean
  onDelete?: (fileId: string) => void
  className?: string
}

const FILE_ICONS: Record<string, React.ElementType> = {
  image: ImageIcon,
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
  if (mimeType.includes("zip") || mimeType.includes("rar")) return FILE_ICONS.archive
  return FILE_ICONS.default
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith("image/")
}

export function FileGallery({
  files,
  canDelete = false,
  onDelete,
  className,
}: FileGalleryProps) {
  const [selectedFile, setSelectedFile] = useState<OrderFile | null>(null)
  const [deleteFile, setDeleteFile] = useState<OrderFile | null>(null)
  const [zoom, setZoom] = useState(1)

  const imageFiles = files.filter((f) => isImageFile(f.file_type))
  const currentImageIndex = selectedFile
    ? imageFiles.findIndex((f) => f.id === selectedFile.id)
    : -1

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setSelectedFile(imageFiles[currentImageIndex - 1])
      setZoom(1)
    }
  }

  const handleNextImage = () => {
    if (currentImageIndex < imageFiles.length - 1) {
      setSelectedFile(imageFiles[currentImageIndex + 1])
      setZoom(1)
    }
  }

  const handleDelete = async () => {
    if (!deleteFile || !onDelete) return

    try {
      const response = await fetch(`/api/files/${deleteFile.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onDelete(deleteFile.id)
      }
    } catch (error) {
      console.error("Failed to delete file:", error)
    } finally {
      setDeleteFile(null)
    }
  }

  const groupedFiles = files.reduce((acc, file) => {
    const category = file.file_category
    if (!acc[category]) acc[category] = []
    acc[category].push(file)
    return acc
  }, {} as Record<string, OrderFile[]>)

  const categoryLabels: Record<string, string> = {
    reference: "Reference Files",
    deliverable: "Deliverables",
    revision: "Revisions",
  }

  const categoryOrder = ["deliverable", "revision", "reference"]

  return (
    <div className={cn("space-y-6", className)}>
      {categoryOrder.map((category) => {
        const categoryFiles = groupedFiles[category]
        if (!categoryFiles?.length) return null

        return (
          <div key={category}>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              {categoryLabels[category]}
              <Badge variant="secondary" className="text-xs">
                {categoryFiles.length}
              </Badge>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {categoryFiles.map((file) => {
                const FileIcon = getFileIcon(file.file_type)
                const isImage = isImageFile(file.file_type)

                return (
                  <div
                    key={file.id}
                    className="group relative rounded-lg border bg-card overflow-hidden"
                  >
                    {/* Preview Area */}
                    <div
                      className={cn(
                        "aspect-square flex items-center justify-center bg-muted cursor-pointer",
                        isImage && "relative"
                      )}
                      onClick={() => isImage && setSelectedFile(file)}
                    >
                      {isImage ? (
                        <Image
                          src={`/api/files/${file.id}`}
                          alt={file.file_name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <FileIcon className="h-12 w-12 text-muted-foreground" />
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {isImage && (
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedFile(file)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8"
                          asChild
                        >
                          <a
                            href={`/api/files/${file.id}?download=true`}
                            download={file.file_name}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                        {canDelete && (
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteFile(file)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {/* Final Badge */}
                      {file.is_final && (
                        <Badge className="absolute top-2 right-2 bg-green-500">
                          Final
                        </Badge>
                      )}

                      {/* Version Badge */}
                      {file.version && file.version > 1 && (
                        <Badge
                          variant="secondary"
                          className="absolute top-2 left-2"
                        >
                          v{file.version}
                        </Badge>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="p-2">
                      <p className="text-xs font-medium truncate" title={file.file_name}>
                        {file.file_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.file_size)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Image Lightbox */}
      <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="truncate pr-8">
              {selectedFile?.file_name}
            </DialogTitle>
          </DialogHeader>

          <div className="relative bg-black/90 min-h-[60vh] flex items-center justify-center">
            {selectedFile && isImageFile(selectedFile.file_type) && (
              <div
                className="relative transition-transform"
                style={{ transform: `scale(${zoom})` }}
              >
                <Image
                  src={`/api/files/${selectedFile.id}`}
                  alt={selectedFile.file_name}
                  width={800}
                  height={600}
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>
            )}

            {/* Navigation Arrows */}
            {currentImageIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                onClick={handlePrevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}
            {currentImageIndex < imageFiles.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                onClick={handleNextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}

            {/* Zoom Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 rounded-full px-3 py-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-white text-sm min-w-[3rem] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 flex items-center justify-between border-t">
            <div className="text-sm text-muted-foreground">
              {selectedFile && formatFileSize(selectedFile.file_size)}
              {currentImageIndex >= 0 && (
                <span className="ml-2">
                  ({currentImageIndex + 1} of {imageFiles.length})
                </span>
              )}
            </div>
            <Button asChild>
              <a
                href={`/api/files/${selectedFile?.id}?download=true`}
                download={selectedFile?.file_name}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteFile} onOpenChange={() => setDeleteFile(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteFile?.file_name}&quot;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
