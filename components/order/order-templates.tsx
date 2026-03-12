"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, Plus, MoreHorizontal, Pencil, Trash2, Copy, Star, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface OrderTemplate {
  id: string
  name: string
  description: string
  serviceType: string
  briefContent: string
  isFavorite: boolean
  usageCount: number
  lastUsed?: Date
  createdAt: Date
}

interface OrderTemplatesProps {
  templates: OrderTemplate[]
  onUseTemplate: (template: OrderTemplate) => void
  onSaveTemplate: (data: { name: string; description: string; briefContent: string }) => Promise<void>
  onDeleteTemplate: (id: string) => Promise<void>
  onToggleFavorite: (id: string) => Promise<void>
  className?: string
}

export function OrderTemplates({
  templates,
  onUseTemplate,
  onSaveTemplate,
  onDeleteTemplate,
  onToggleFavorite,
  className,
}: OrderTemplatesProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    briefContent: "",
  })

  const handleCreate = async () => {
    if (!newTemplate.name.trim()) return

    setIsCreating(true)
    try {
      await onSaveTemplate(newTemplate)
      setNewTemplate({ name: "", description: "", briefContent: "" })
      setIsCreateOpen(false)
    } finally {
      setIsCreating(false)
    }
  }

  const sortedTemplates = [...templates].sort((a, b) => {
    // Favorites first
    if (a.isFavorite && !b.isFavorite) return -1
    if (!a.isFavorite && b.isFavorite) return 1
    // Then by usage count
    return b.usageCount - a.usageCount
  })

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Order Templates</h3>
          <p className="text-sm text-muted-foreground">
            Save and reuse project briefs for faster ordering
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Order Template</DialogTitle>
              <DialogDescription>
                Save your current brief as a reusable template for future orders.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  placeholder="e.g., My Standard Logo Brief"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-description">Description (optional)</Label>
                <Input
                  id="template-description"
                  placeholder="Brief description of this template"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isCreating || !newTemplate.name.trim()}>
                {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Template"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h4 className="mb-2 font-medium">No templates yet</h4>
            <p className="mb-4 text-sm text-muted-foreground">
              Create templates to quickly reuse your project briefs
            </p>
            <Button variant="outline" size="sm" onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {sortedTemplates.map((template) => (
            <Card key={template.id} className="group relative">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleFavorite(template.id)}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Star
                        className={cn(
                          "h-4 w-4",
                          template.isFavorite && "fill-primary text-primary"
                        )}
                      />
                    </button>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onUseTemplate(template)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Use Template
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDeleteTemplate(template.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {template.description && (
                  <CardDescription className="line-clamp-1">
                    {template.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary">{template.serviceType}</Badge>
                    <span>Used {template.usageCount}x</span>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => onUseTemplate(template)}>
                    Use
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
