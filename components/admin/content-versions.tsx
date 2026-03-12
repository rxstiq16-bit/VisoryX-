"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, RotateCcw, Eye, GitCompare, Clock, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import useSWR from "swr"

interface Version {
  id: string
  version: number
  title: string
  content: string
  excerpt?: string
  createdAt: Date
  author: {
    name: string
    avatar?: string
  }
  changeType: "created" | "edited" | "published" | "unpublished"
  changeSummary?: string
}

interface ContentVersionsProps {
  contentType: "blog" | "page" | "portfolio"
  contentId: string
  currentVersion?: number
  onRestore?: (version: Version) => void
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function ContentVersions({ contentType, contentId, currentVersion, onRestore }: ContentVersionsProps) {
  const { data, mutate } = useSWR<{ versions: Version[] }>(
    `/api/admin/${contentType}/${contentId}/versions`,
    fetcher
  )
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null)
  const [compareVersion, setCompareVersion] = useState<Version | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)

  const versions = data?.versions || []

  const handleRestore = async (version: Version) => {
    setIsRestoring(true)
    try {
      await fetch(`/api/admin/${contentType}/${contentId}/versions/${version.id}/restore`, {
        method: "POST",
      })
      onRestore?.(version)
      mutate()
    } finally {
      setIsRestoring(false)
    }
  }

  const getChangeTypeBadge = (type: Version["changeType"]) => {
    const variants: Record<typeof type, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      created: { label: "Created", variant: "default" },
      edited: { label: "Edited", variant: "secondary" },
      published: { label: "Published", variant: "default" },
      unpublished: { label: "Unpublished", variant: "outline" },
    }
    return variants[type]
  }

  const getDiff = (oldText: string, newText: string) => {
    const oldLines = oldText.split("\n")
    const newLines = newText.split("\n")
    const diff: { type: "added" | "removed" | "unchanged"; line: string }[] = []

    const maxLen = Math.max(oldLines.length, newLines.length)
    for (let i = 0; i < maxLen; i++) {
      if (i >= oldLines.length) {
        diff.push({ type: "added", line: newLines[i] })
      } else if (i >= newLines.length) {
        diff.push({ type: "removed", line: oldLines[i] })
      } else if (oldLines[i] !== newLines[i]) {
        diff.push({ type: "removed", line: oldLines[i] })
        diff.push({ type: "added", line: newLines[i] })
      } else {
        diff.push({ type: "unchanged", line: oldLines[i] })
      }
    }
    return diff
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Version History
        </CardTitle>
        <CardDescription>
          View and restore previous versions of this content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {versions.map((version, index) => {
              const badge = getChangeTypeBadge(version.changeType)
              const isCurrent = version.version === currentVersion

              return (
                <div
                  key={version.id}
                  className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${
                    isCurrent ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    v{version.version}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{version.title}</span>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                      {isCurrent && <Badge variant="outline">Current</Badge>}
                    </div>

                    {version.changeSummary && (
                      <p className="text-sm text-muted-foreground">{version.changeSummary}</p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {version.author.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedVersion(version)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Version {version.version}: {version.title}</DialogTitle>
                          <DialogDescription>
                            {version.changeType} by {version.author.name} {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                          </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="max-h-[60vh]">
                          <div className="prose prose-sm dark:prose-invert">
                            <div dangerouslySetInnerHTML={{ __html: version.content }} />
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>

                    {index < versions.length - 1 && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedVersion(version)
                              setCompareVersion(versions[index + 1])
                            }}
                          >
                            <GitCompare className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Compare Versions</DialogTitle>
                            <DialogDescription>
                              v{compareVersion?.version} → v{selectedVersion?.version}
                            </DialogDescription>
                          </DialogHeader>
                          <ScrollArea className="max-h-[60vh]">
                            <div className="space-y-1 font-mono text-sm">
                              {selectedVersion && compareVersion && getDiff(compareVersion.content, selectedVersion.content).map((line, i) => (
                                <div
                                  key={i}
                                  className={`px-2 py-0.5 ${
                                    line.type === "added"
                                      ? "bg-green-500/20 text-green-400"
                                      : line.type === "removed"
                                      ? "bg-red-500/20 text-red-400"
                                      : ""
                                  }`}
                                >
                                  {line.type === "added" && "+ "}
                                  {line.type === "removed" && "- "}
                                  {line.line || " "}
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    )}

                    {!isCurrent && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRestore(version)}
                        disabled={isRestoring}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}

            {versions.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                No version history available
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
