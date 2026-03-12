"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { History, Download, RotateCcw, Eye, Trash2, Clock, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface FileVersion {
  id: string
  version: number
  fileUrl: string
  fileName: string
  fileSize: number
  createdAt: string
  createdBy: {
    id: string
    name: string
    avatar?: string
  }
  comment?: string
  isCurrent: boolean
}

interface FileVersionsProps {
  fileId: string
  versions: FileVersion[]
  onRestore: (versionId: string) => Promise<void>
  onDownload: (versionId: string) => void
  onPreview: (versionId: string) => void
  onDelete?: (versionId: string) => Promise<void>
  className?: string
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

export function FileVersions({
  fileId,
  versions,
  onRestore,
  onDownload,
  onPreview,
  onDelete,
  className,
}: FileVersionsProps) {
  const [restoring, setRestoring] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleRestore = async (versionId: string) => {
    setRestoring(versionId)
    try {
      await onRestore(versionId)
    } finally {
      setRestoring(null)
    }
  }

  const handleDelete = async (versionId: string) => {
    if (!onDelete) return
    setDeleting(versionId)
    try {
      await onDelete(versionId)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Version History
        </CardTitle>
        <CardDescription>
          {versions.length} version{versions.length !== 1 ? "s" : ""} available
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {versions.map((version, index) => (
              <div
                key={version.id}
                className={cn(
                  "relative rounded-lg border p-4 transition-colors",
                  version.isCurrent && "border-primary bg-primary/5"
                )}
              >
                {/* Version timeline connector */}
                {index < versions.length - 1 && (
                  <div className="absolute -bottom-4 left-6 h-4 w-px bg-border" />
                )}

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {/* Version indicator */}
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium",
                        version.isCurrent
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 bg-muted"
                      )}
                    >
                      v{version.version}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{version.fileName}</span>
                        {version.isCurrent && (
                          <Badge variant="default" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>

                      <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {version.createdBy.name}
                        </span>
                        <span>{formatBytes(version.fileSize)}</span>
                      </div>

                      {version.comment && (
                        <p className="mt-2 text-sm text-muted-foreground">{version.comment}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onPreview(version.id)} title="Preview">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDownload(version.id)} title="Download">
                      <Download className="h-4 w-4" />
                    </Button>
                    {!version.isCurrent && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRestore(version.id)}
                          disabled={restoring === version.id}
                          title="Restore this version"
                        >
                          <RotateCcw className={cn("h-4 w-4", restoring === version.id && "animate-spin")} />
                        </Button>
                        {onDelete && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" title="Delete version">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Version</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete version {version.version}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(version.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Compare two versions side by side
interface VersionCompareProps {
  versionA: FileVersion
  versionB: FileVersion
  onClose: () => void
}

export function VersionCompare({ versionA, versionB, onClose }: VersionCompareProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <h2 className="font-semibold">Compare Versions</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
      
      <div className="grid flex-1 grid-cols-2 divide-x">
        <div className="flex flex-col">
          <div className="border-b bg-muted/50 px-4 py-2 text-center">
            <Badge variant="outline">Version {versionA.version}</Badge>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(versionA.createdAt), { addSuffix: true })}
            </p>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <img
              src={versionA.fileUrl}
              alt={`Version ${versionA.version}`}
              className="mx-auto max-h-full max-w-full object-contain"
            />
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="border-b bg-muted/50 px-4 py-2 text-center">
            <Badge variant="outline">Version {versionB.version}</Badge>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(versionB.createdAt), { addSuffix: true })}
            </p>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <img
              src={versionB.fileUrl}
              alt={`Version ${versionB.version}`}
              className="mx-auto max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
