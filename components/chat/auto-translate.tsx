"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Languages, ChevronDown, Loader2, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "pt", name: "Portuguese", flag: "🇧🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
]

interface AutoTranslateProps {
  message: string
  originalLanguage?: string
  onTranslate?: (translated: string, targetLang: string) => void
  className?: string
}

export function AutoTranslate({ message, originalLanguage = "en", onTranslate, className }: AutoTranslateProps) {
  const [isTranslating, setIsTranslating] = useState(false)
  const [translatedText, setTranslatedText] = useState<string | null>(null)
  const [targetLanguage, setTargetLanguage] = useState<string | null>(null)

  const handleTranslate = async (langCode: string) => {
    if (langCode === originalLanguage) return

    setIsTranslating(true)
    setTargetLanguage(langCode)

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: message,
          from: originalLanguage,
          to: langCode,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setTranslatedText(data.translatedText)
        onTranslate?.(data.translatedText, langCode)
      }
    } catch (error) {
      console.error("Translation failed:", error)
    } finally {
      setIsTranslating(false)
    }
  }

  const targetLangInfo = SUPPORTED_LANGUAGES.find(l => l.code === targetLanguage)

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              <Languages className="h-3 w-3" />
              Translate
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => handleTranslate(lang.code)}
                disabled={lang.code === originalLanguage}
                className="gap-2"
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
                {lang.code === originalLanguage && (
                  <Badge variant="secondary" className="ml-auto text-xs">Original</Badge>
                )}
                {lang.code === targetLanguage && translatedText && (
                  <Check className="ml-auto h-4 w-4 text-green-500" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {isTranslating && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            Translating...
          </div>
        )}
      </div>

      {translatedText && targetLangInfo && (
        <Card className="bg-muted/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">{targetLangInfo.flag}</span>
              <span className="text-xs text-muted-foreground">{targetLangInfo.name}</span>
            </div>
            <p className="text-sm">{translatedText}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export function TranslateAPI() {
  return null
}
