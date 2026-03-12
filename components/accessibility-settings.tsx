"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Accessibility, Type, Moon, Zap, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccessibilityState {
  highContrast: boolean
  reducedMotion: boolean
  fontSize: number
  dyslexiaFont: boolean
}

const defaultState: AccessibilityState = {
  highContrast: false,
  reducedMotion: false,
  fontSize: 100,
  dyslexiaFont: false,
}

const AccessibilityContext = createContext<{
  settings: AccessibilityState
  updateSettings: (settings: Partial<AccessibilityState>) => void
}>({
  settings: defaultState,
  updateSettings: () => {},
})

export function useAccessibility() {
  return useContext(AccessibilityContext)
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilityState>(defaultState)

  useEffect(() => {
    const stored = localStorage.getItem("visoryx-accessibility")
    if (stored) {
      const parsed = JSON.parse(stored)
      setSettings(parsed)
      applySettings(parsed)
    }
  }, [])

  const applySettings = (s: AccessibilityState) => {
    const root = document.documentElement
    
    // High contrast
    root.classList.toggle("high-contrast", s.highContrast)
    
    // Reduced motion
    root.classList.toggle("reduce-motion", s.reducedMotion)
    
    // Font size
    root.style.fontSize = `${s.fontSize}%`
    
    // Dyslexia font
    root.classList.toggle("dyslexia-font", s.dyslexiaFont)
  }

  const updateSettings = (newSettings: Partial<AccessibilityState>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    localStorage.setItem("visoryx-accessibility", JSON.stringify(updated))
    applySettings(updated)
  }

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function AccessibilityMenu() {
  const { settings, updateSettings } = useAccessibility()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0">
          <Accessibility className="h-5 w-5" />
          <span className="sr-only">Accessibility settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Accessibility className="h-4 w-4" />
          Accessibility
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="p-3 space-y-4">
          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm">High Contrast</Label>
            </div>
            <Switch
              checked={settings.highContrast}
              onCheckedChange={(checked) => updateSettings({ highContrast: checked })}
            />
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm">Reduced Motion</Label>
            </div>
            <Switch
              checked={settings.reducedMotion}
              onCheckedChange={(checked) => updateSettings({ reducedMotion: checked })}
            />
          </div>

          {/* Dyslexia Font */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm">Dyslexia Font</Label>
            </div>
            <Switch
              checked={settings.dyslexiaFont}
              onCheckedChange={(checked) => updateSettings({ dyslexiaFont: checked })}
            />
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Font Size</Label>
              <span className="text-xs text-muted-foreground">{settings.fontSize}%</span>
            </div>
            <Slider
              value={[settings.fontSize]}
              min={80}
              max={150}
              step={10}
              onValueChange={([value]) => updateSettings({ fontSize: value })}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Smaller</span>
              <span>Larger</span>
            </div>
          </div>

          {/* Reset */}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => updateSettings(defaultState)}
          >
            Reset to Default
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// CSS to be added to globals.css
export const accessibilityCss = `
/* High Contrast Mode */
.high-contrast {
  --background: 0 0% 0%;
  --foreground: 0 0% 100%;
  --muted: 0 0% 15%;
  --muted-foreground: 0 0% 80%;
  --border: 0 0% 40%;
}

.high-contrast * {
  border-color: hsl(var(--border)) !important;
}

/* Reduced Motion */
.reduce-motion,
.reduce-motion * {
  animation-duration: 0.001ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.001ms !important;
}

/* Dyslexia Font */
.dyslexia-font {
  --font-sans: 'OpenDyslexic', sans-serif;
}
`
