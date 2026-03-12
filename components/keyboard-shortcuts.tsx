"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Kbd } from "@/components/ui/kbd"

interface Shortcut { keys: string[]; description: string }

export function KeyboardShortcuts() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const shortcuts: Shortcut[] = [
    { keys: ["?"], description: "Show keyboard shortcuts" },
    { keys: ["Cmd", "K"], description: "Open search" },
    { keys: ["G", "H"], description: "Go to Home" },
    { keys: ["G", "O"], description: "Go to Orders" },
    { keys: ["G", "S"], description: "Go to Services" },
    { keys: ["G", "P"], description: "Go to Portfolio" },
    { keys: ["G", "N"], description: "New Order" },
    { keys: ["Esc"], description: "Close dialogs" },
  ]

  useEffect(() => {
    let lastKey = ""
    let lastKeyTime = 0

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const now = Date.now()
      const key = e.key.toLowerCase()

      if (key === "?" || (e.shiftKey && key === "/")) { e.preventDefault(); setIsOpen(true); return }

      if (lastKey === "g" && now - lastKeyTime < 500) {
        const routes: Record<string, string> = { h: "/", o: "/dashboard", s: "/services", p: "/portfolio", n: "/order" }
        if (routes[key]) { e.preventDefault(); router.push(routes[key]) }
      }
      lastKey = key
      lastKeyTime = now
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Keyboard Shortcuts</DialogTitle></DialogHeader>
        <div className="space-y-3">
          {shortcuts.map((s) => (
            <div key={s.description} className="flex items-center justify-between">
              <span className="text-sm">{s.description}</span>
              <div className="flex gap-1">{s.keys.map((k, i) => (<span key={i} className="flex items-center gap-1"><Kbd>{k}</Kbd>{i < s.keys.length - 1 && <span className="text-muted-foreground">+</span>}</span>))}</div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
