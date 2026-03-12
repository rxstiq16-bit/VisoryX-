"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, X, Tag, Star, AlertCircle, Clock, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface OrderTag {
  id: string
  label: string
  color: string
  icon?: React.ElementType
}

const presetTags: OrderTag[] = [
  { id: "priority", label: "Priority", color: "bg-red-500/10 text-red-500 border-red-500/20", icon: AlertCircle },
  { id: "vip", label: "VIP Client", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: Star },
  { id: "rush", label: "Rush", color: "bg-orange-500/10 text-orange-500 border-orange-500/20", icon: Zap },
  { id: "follow-up", label: "Follow Up", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: Clock },
  { id: "repeat", label: "Repeat Customer", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: Tag },
  { id: "erlc", label: "ERLC", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  { id: "discord", label: "Discord", color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
  { id: "logo", label: "Logo", color: "bg-pink-500/10 text-pink-500 border-pink-500/20" },
]

interface OrderTagsProps {
  orderId: string
  initialTags?: string[]
  editable?: boolean
  className?: string
  onTagsChange?: (tags: string[]) => void
}

export function OrderTags({ initialTags = [], editable = true, className, onTagsChange }: OrderTagsProps) {
  const [tags, setTags] = useState<string[]>(initialTags)
  const [customTag, setCustomTag] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const handleAddTag = (tagId: string) => {
    if (!tags.includes(tagId)) {
      const newTags = [...tags, tagId]
      setTags(newTags)
      onTagsChange?.(newTags)
    }
  }

  const handleRemoveTag = (tagId: string) => {
    const newTags = tags.filter((t) => t !== tagId)
    setTags(newTags)
    onTagsChange?.(newTags)
  }

  const handleAddCustomTag = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      const newTags = [...tags, customTag.trim()]
      setTags(newTags)
      onTagsChange?.(newTags)
      setCustomTag("")
    }
  }

  const getTagInfo = (tagId: string): OrderTag => {
    return presetTags.find((t) => t.id === tagId) || {
      id: tagId,
      label: tagId,
      color: "bg-muted text-muted-foreground border-border",
    }
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {tags.map((tagId) => {
        const tag = getTagInfo(tagId)
        const Icon = tag.icon
        return (
          <Badge key={tagId} variant="outline" className={cn("flex items-center gap-1", tag.color)}>
            {Icon && <Icon className="h-3 w-3" />}
            {tag.label}
            {editable && (
              <button onClick={() => handleRemoveTag(tagId)} className="ml-1 rounded-full hover:bg-background/20">
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        )
      })}

      {editable && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-6 px-2">
              <Plus className="h-3 w-3 mr-1" />
              Add Tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="start">
            <div className="space-y-3">
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Quick Tags</p>
                <div className="flex flex-wrap gap-1">
                  {presetTags.filter((t) => !tags.includes(t.id)).map((tag) => {
                    const Icon = tag.icon
                    return (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className={cn("cursor-pointer hover:opacity-80", tag.color)}
                        onClick={() => { handleAddTag(tag.id); setIsOpen(false) }}
                      >
                        {Icon && <Icon className="h-3 w-3 mr-1" />}
                        {tag.label}
                      </Badge>
                    )
                  })}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Custom Tag</p>
                <div className="flex gap-2">
                  <Input
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    placeholder="Enter tag name"
                    className="h-8"
                    onKeyDown={(e) => { if (e.key === "Enter") { handleAddCustomTag(); setIsOpen(false) } }}
                  />
                  <Button size="sm" className="h-8" onClick={() => { handleAddCustomTag(); setIsOpen(false) }}>Add</Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
