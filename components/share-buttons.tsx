"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Share2, Copy, Check, Twitter, Facebook, Linkedin, Mail, MessageCircle, Link2 } from "lucide-react"

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
  className?: string
  variant?: "icons" | "buttons" | "dropdown"
}

const shareLinks = {
  twitter: (url: string, title: string) =>
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  facebook: (url: string) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  linkedin: (url: string, title: string) =>
    `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  email: (url: string, title: string, description?: string) =>
    `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description ? `${description}\n\n${url}` : url)}`,
  whatsapp: (url: string, title: string) =>
    `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
}

export function ShareButtons({ url, title, description, className, variant = "icons" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (platform: keyof typeof shareLinks) => {
    const shareUrl = platform === "email" 
      ? shareLinks[platform](url, title, description)
      : shareLinks[platform](url, title)
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400")
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url })
      } catch (err) {
        // User cancelled or error
      }
    }
  }

  if (variant === "dropdown") {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className={className}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72" align="end">
          <div className="space-y-4">
            <p className="text-sm font-medium">Share this</p>
            
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => handleShare("twitter")}>
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleShare("facebook")}>
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleShare("linkedin")}>
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleShare("whatsapp")}>
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleShare("email")}>
                <Mail className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Input value={url} readOnly className="text-xs" />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  if (variant === "buttons") {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        <Button variant="outline" size="sm" onClick={() => handleShare("twitter")}>
          <Twitter className="h-4 w-4 mr-2" />
          Twitter
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleShare("facebook")}>
          <Facebook className="h-4 w-4 mr-2" />
          Facebook
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleShare("linkedin")}>
          <Linkedin className="h-4 w-4 mr-2" />
          LinkedIn
        </Button>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Link2 className="h-4 w-4 mr-2" />}
          {copied ? "Copied!" : "Copy Link"}
        </Button>
      </div>
    )
  }

  // Icons variant (default)
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {"share" in navigator && (
        <Button variant="ghost" size="icon" onClick={handleNativeShare} className="h-8 w-8">
          <Share2 className="h-4 w-4" />
        </Button>
      )}
      <Button variant="ghost" size="icon" onClick={() => handleShare("twitter")} className="h-8 w-8">
        <Twitter className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => handleShare("facebook")} className="h-8 w-8">
        <Facebook className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => handleShare("linkedin")} className="h-8 w-8">
        <Linkedin className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8">
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  )
}
