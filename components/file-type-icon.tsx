"use client"

import { FileText, Image, Video, Music, Archive, Code, FileSpreadsheet, Presentation, File } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileTypeIconProps {
  filename: string
  className?: string
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
}

const fileTypeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  // Images
  jpg: { icon: Image, color: "text-pink-500", bg: "bg-pink-50" },
  jpeg: { icon: Image, color: "text-pink-500", bg: "bg-pink-50" },
  png: { icon: Image, color: "text-pink-500", bg: "bg-pink-50" },
  gif: { icon: Image, color: "text-pink-500", bg: "bg-pink-50" },
  webp: { icon: Image, color: "text-pink-500", bg: "bg-pink-50" },
  svg: { icon: Image, color: "text-orange-500", bg: "bg-orange-50" },
  
  // Documents
  pdf: { icon: FileText, color: "text-red-500", bg: "bg-red-50" },
  doc: { icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
  docx: { icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
  txt: { icon: FileText, color: "text-gray-500", bg: "bg-gray-50" },
  md: { icon: FileText, color: "text-gray-500", bg: "bg-gray-50" },
  
  // Spreadsheets
  xls: { icon: FileSpreadsheet, color: "text-green-500", bg: "bg-green-50" },
  xlsx: { icon: FileSpreadsheet, color: "text-green-500", bg: "bg-green-50" },
  csv: { icon: FileSpreadsheet, color: "text-green-500", bg: "bg-green-50" },
  
  // Presentations
  ppt: { icon: Presentation, color: "text-orange-500", bg: "bg-orange-50" },
  pptx: { icon: Presentation, color: "text-orange-500", bg: "bg-orange-50" },
  
  // Code
  js: { icon: Code, color: "text-yellow-500", bg: "bg-yellow-50" },
  ts: { icon: Code, color: "text-blue-500", bg: "bg-blue-50" },
  jsx: { icon: Code, color: "text-cyan-500", bg: "bg-cyan-50" },
  tsx: { icon: Code, color: "text-cyan-500", bg: "bg-cyan-50" },
  html: { icon: Code, color: "text-orange-500", bg: "bg-orange-50" },
  css: { icon: Code, color: "text-blue-500", bg: "bg-blue-50" },
  json: { icon: Code, color: "text-gray-500", bg: "bg-gray-50" },
  
  // Archives
  zip: { icon: Archive, color: "text-amber-500", bg: "bg-amber-50" },
  rar: { icon: Archive, color: "text-amber-500", bg: "bg-amber-50" },
  "7z": { icon: Archive, color: "text-amber-500", bg: "bg-amber-50" },
  tar: { icon: Archive, color: "text-amber-500", bg: "bg-amber-50" },
  gz: { icon: Archive, color: "text-amber-500", bg: "bg-amber-50" },
  
  // Video
  mp4: { icon: Video, color: "text-purple-500", bg: "bg-purple-50" },
  mov: { icon: Video, color: "text-purple-500", bg: "bg-purple-50" },
  avi: { icon: Video, color: "text-purple-500", bg: "bg-purple-50" },
  webm: { icon: Video, color: "text-purple-500", bg: "bg-purple-50" },
  
  // Audio
  mp3: { icon: Music, color: "text-indigo-500", bg: "bg-indigo-50" },
  wav: { icon: Music, color: "text-indigo-500", bg: "bg-indigo-50" },
  ogg: { icon: Music, color: "text-indigo-500", bg: "bg-indigo-50" },
  m4a: { icon: Music, color: "text-indigo-500", bg: "bg-indigo-50" },
  
  // Design files
  psd: { icon: Image, color: "text-blue-600", bg: "bg-blue-50" },
  ai: { icon: Image, color: "text-orange-600", bg: "bg-orange-50" },
  sketch: { icon: Image, color: "text-yellow-600", bg: "bg-yellow-50" },
  fig: { icon: Image, color: "text-purple-600", bg: "bg-purple-50" },
  xd: { icon: Image, color: "text-pink-600", bg: "bg-pink-50" },
}

export function FileTypeIcon({ filename, className, size = "md" }: FileTypeIconProps) {
  const extension = filename.split(".").pop()?.toLowerCase() || ""
  const config = fileTypeConfig[extension] || { icon: File, color: "text-gray-400", bg: "bg-gray-50" }
  const Icon = config.icon

  return (
    <div className={cn("flex items-center justify-center rounded", config.bg, className)}>
      <Icon className={cn(sizeClasses[size], config.color)} />
    </div>
  )
}

// File type badge showing extension
interface FileTypeBadgeProps {
  filename: string
  showSize?: boolean
  fileSize?: number
  className?: string
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

export function FileTypeBadge({ filename, showSize, fileSize, className }: FileTypeBadgeProps) {
  const extension = filename.split(".").pop()?.toUpperCase() || "FILE"
  const config = fileTypeConfig[extension.toLowerCase()] || { color: "text-gray-500", bg: "bg-gray-100" }

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span className={cn("px-2 py-0.5 rounded text-xs font-medium uppercase", config.bg, config.color)}>
        {extension}
      </span>
      {showSize && fileSize && (
        <span className="text-xs text-muted-foreground">
          {formatFileSize(fileSize)}
        </span>
      )}
    </div>
  )
}
