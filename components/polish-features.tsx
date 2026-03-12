"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Lightbulb,
  MapPin,
  Plus,
  X,
  Edit2,
  Download,
  FileText,
  Calendar,
  Trash2,
  Star,
  Save,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Onboarding Tooltips Component
interface TooltipStep {
  id: string
  target: string
  title: string
  description: string
  position: "top" | "bottom" | "left" | "right"
}

const ONBOARDING_STEPS: TooltipStep[] = [
  {
    id: "1",
    target: "navigation",
    title: "Welcome to Stylar Studios! 👋",
    description: "Let's take a quick tour to help you get started with our platform.",
    position: "bottom",
  },
  {
    id: "2",
    target: "services",
    title: "Browse Services",
    description: "Explore our design services including logos, banners, and more.",
    position: "bottom",
  },
  {
    id: "3",
    target: "portfolio",
    title: "View Portfolio",
    description: "Check out examples of our previous work to get inspired.",
    position: "bottom",
  },
  {
    id: "4",
    target: "order",
    title: "Place an Order",
    description: "Ready to get started? Click here to place your first order!",
    position: "left",
  },
]

export function OnboardingTooltips() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)

  useEffect(() => {
    // Check if user has completed onboarding
    const completed = localStorage.getItem("onboarding_completed")
    if (completed) {
      setHasCompleted(true)
    }
  }, [])

  const startTour = () => {
    setIsActive(true)
    setCurrentStep(0)
  }

  const nextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeTour()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeTour = () => {
    setIsActive(false)
    setHasCompleted(true)
    localStorage.setItem("onboarding_completed", "true")
    toast.success("Tour completed! You're all set.")
  }

  const skipTour = () => {
    setIsActive(false)
    localStorage.setItem("onboarding_completed", "true")
  }

  if (hasCompleted && !isActive) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setHasCompleted(false)
          startTour()
        }}
        className="gap-2"
      >
        <Lightbulb className="h-4 w-4" />
        Restart Tour
      </Button>
    )
  }

  if (!isActive) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">New here?</h3>
              <p className="text-xs text-muted-foreground">
                Take a quick tour to learn the basics
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={skipTour}>
              Skip
            </Button>
            <Button size="sm" onClick={startTour}>
              Start Tour
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const step = ONBOARDING_STEPS[currentStep]

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <Card className="max-w-md mx-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">
              Step {currentStep + 1} of {ONBOARDING_STEPS.length}
            </Badge>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={skipTour}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardTitle className="text-lg">{step.title}</CardTitle>
          <CardDescription>{step.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {ONBOARDING_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 w-8 rounded-full transition-colors",
                    i <= currentStep ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" size="sm" onClick={prevStep}>
                  Back
                </Button>
              )}
              <Button size="sm" onClick={nextStep}>
                {currentStep === ONBOARDING_STEPS.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Saved Addresses Component
interface Address {
  id: string
  label: string
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

export function SavedAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      label: "Home",
      name: "John Doe",
      line1: "123 Main St",
      line2: "Apt 4B",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
      isDefault: true,
    },
    {
      id: "2",
      label: "Office",
      name: "John Doe",
      line1: "456 Business Ave",
      city: "New York",
      state: "NY",
      postalCode: "10002",
      country: "United States",
      isDefault: false,
    },
  ])
  const [isAdding, setIsAdding] = useState(false)

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    )
    toast.success("Default address updated")
  }

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id))
    toast.success("Address removed")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <CardTitle>Saved Addresses</CardTitle>
          </div>
          <Button size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        </div>
        <CardDescription>Manage your delivery addresses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={cn(
                "flex items-start justify-between p-4 rounded-lg border",
                address.isDefault && "border-primary/50 bg-primary/5"
              )}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{address.label}</span>
                  {address.isDefault && (
                    <Badge variant="default" className="text-[10px]">
                      Default
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{address.name}</p>
                <p className="text-sm text-muted-foreground">
                  {address.line1}
                  {address.line2 && `, ${address.line2}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p className="text-sm text-muted-foreground">{address.country}</p>
              </div>
              <div className="flex gap-2">
                {!address.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    Set Default
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => handleDelete(address.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Order History Export Component
export function OrderHistoryExport() {
  const [format, setFormat] = useState("csv")
  const [dateRange, setDateRange] = useState("all")
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    // Simulate export
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsExporting(false)
    toast.success(`Order history exported as ${format.toUpperCase()}`)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          <CardTitle>Export Order History</CardTitle>
        </div>
        <CardDescription>Download your order history in various formats</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Estimated file size: ~245 KB
            </span>
          </div>
          <span className="text-sm text-muted-foreground">42 orders</span>
        </div>

        <Button onClick={handleExport} className="w-full" disabled={isExporting}>
          {isExporting ? (
            <>Exporting...</>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export Orders
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

// Customer Notes Component
export function CustomerNotes() {
  const [notes, setNotes] = useState([
    {
      id: "1",
      content: "Prefers minimalist designs with clean lines",
      createdAt: "2024-01-15",
      isPinned: true,
    },
    {
      id: "2",
      content: "Favorite colors: Blue, Purple, Black",
      createdAt: "2024-02-10",
      isPinned: false,
    },
    {
      id: "3",
      content: "Responsive to feedback, usually approves after first revision",
      createdAt: "2024-03-05",
      isPinned: false,
    },
  ])
  const [newNote, setNewNote] = useState("")

  const handleAddNote = () => {
    if (!newNote.trim()) return

    setNotes([
      {
        id: Date.now().toString(),
        content: newNote,
        createdAt: new Date().toISOString().split("T")[0],
        isPinned: false,
      },
      ...notes,
    ])
    setNewNote("")
    toast.success("Note added")
  }

  const handleDelete = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id))
    toast.success("Note deleted")
  }

  const handleTogglePin = (id: string) => {
    setNotes(
      notes.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    )
  }

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return 0
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle>Customer Notes</CardTitle>
        </div>
        <CardDescription>Internal notes about this customer</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Textarea
            placeholder="Add a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[80px]"
          />
        </div>
        <Button onClick={handleAddNote} className="w-full" disabled={!newNote.trim()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Note
        </Button>

        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {sortedNotes.map((note) => (
              <div
                key={note.id}
                className={cn(
                  "p-3 rounded-lg border",
                  note.isPinned && "border-amber-500/50 bg-amber-500/5"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm flex-1">{note.content}</p>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-6 w-6",
                        note.isPinned && "text-amber-500"
                      )}
                      onClick={() => handleTogglePin(note.id)}
                    >
                      <Star className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive"
                      onClick={() => handleDelete(note.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {note.createdAt}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
