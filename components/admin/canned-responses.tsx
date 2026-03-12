"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, Copy, Edit, Trash2, MoreVertical, MessageSquare, Tag, Zap } from "lucide-react"

interface CannedResponse {
  id: string
  title: string
  shortcut: string
  content: string
  category: string
  variables: string[]
  usageCount: number
  createdAt: Date
}

const categories = [
  { value: "greeting", label: "Greetings", color: "bg-blue-500" },
  { value: "update", label: "Order Updates", color: "bg-green-500" },
  { value: "revision", label: "Revisions", color: "bg-yellow-500" },
  { value: "completion", label: "Completion", color: "bg-purple-500" },
  { value: "issue", label: "Issues", color: "bg-red-500" },
  { value: "payment", label: "Payment", color: "bg-pink-500" },
]

const sampleResponses: CannedResponse[] = [
  {
    id: "1",
    title: "Welcome Message",
    shortcut: "/welcome",
    content: "Hi {{customer_name}}! Thank you for choosing VisoryX for your {{service_type}} project. I'm {{designer_name}}, and I'll be working on your order. I've reviewed your brief and I'm excited to get started!\n\nExpected delivery: {{delivery_date}}\n\nFeel free to reach out if you have any questions!",
    category: "greeting",
    variables: ["customer_name", "service_type", "designer_name", "delivery_date"],
    usageCount: 156,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Work in Progress Update",
    shortcut: "/wip",
    content: "Hi {{customer_name}}! Just wanted to give you a quick update on your project.\n\nI've completed the initial {{stage}} and I'm now working on {{next_stage}}. Everything is on track for delivery by {{delivery_date}}.\n\nI'll share a preview soon!",
    category: "update",
    variables: ["customer_name", "stage", "next_stage", "delivery_date"],
    usageCount: 203,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    title: "Revision Received",
    shortcut: "/revreceived",
    content: "Thanks for the feedback, {{customer_name}}! I've noted your revision requests:\n\n{{revision_notes}}\n\nI'll have the updated version ready within {{revision_eta}}. Let me know if you'd like to add anything else!",
    category: "revision",
    variables: ["customer_name", "revision_notes", "revision_eta"],
    usageCount: 89,
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "4",
    title: "Order Complete",
    shortcut: "/complete",
    content: "Great news, {{customer_name}}! Your {{service_type}} project is complete! 🎉\n\nAll files have been uploaded and are ready for download. You'll find:\n{{file_list}}\n\nPlease review everything and let me know if you need any final adjustments. It was a pleasure working with you!\n\nIf you're happy with the work, a review would be greatly appreciated!",
    category: "completion",
    variables: ["customer_name", "service_type", "file_list"],
    usageCount: 178,
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "5",
    title: "Payment Reminder",
    shortcut: "/payremind",
    content: "Hi {{customer_name}}, I hope you're doing well!\n\nJust a friendly reminder that payment for your {{service_type}} order (#{{order_id}}) is pending.\n\nTotal: {{amount}}\nDue: {{due_date}}\n\nYou can complete payment through your dashboard. Let me know if you have any questions!",
    category: "payment",
    variables: ["customer_name", "service_type", "order_id", "amount", "due_date"],
    usageCount: 45,
    createdAt: new Date("2024-02-15"),
  },
]

export function CannedResponses() {
  const [responses, setResponses] = useState<CannedResponse[]>(sampleResponses)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingResponse, setEditingResponse] = useState<CannedResponse | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    shortcut: "",
    content: "",
    category: "greeting",
  })

  const filteredResponses = responses.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.shortcut.toLowerCase().includes(search.toLowerCase()) || r.content.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === "all" || r.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const extractVariables = (content: string): string[] => {
    const matches = content.match(/\{\{(\w+)\}\}/g) || []
    return [...new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, "")))]
  }

  const handleSave = () => {
    const variables = extractVariables(formData.content)

    if (editingResponse) {
      setResponses(responses.map((r) => (r.id === editingResponse.id ? { ...r, ...formData, variables } : r)))
    } else {
      const newResponse: CannedResponse = {
        id: Date.now().toString(),
        ...formData,
        variables,
        usageCount: 0,
        createdAt: new Date(),
      }
      setResponses([newResponse, ...responses])
    }

    setFormData({ title: "", shortcut: "", content: "", category: "greeting" })
    setEditingResponse(null)
    setIsCreateOpen(false)
  }

  const handleEdit = (response: CannedResponse) => {
    setEditingResponse(response)
    setFormData({
      title: response.title,
      shortcut: response.shortcut,
      content: response.content,
      category: response.category,
    })
    setIsCreateOpen(true)
  }

  const handleDelete = (id: string) => {
    setResponses(responses.filter((r) => r.id !== id))
  }

  const copyToClipboard = async (content: string) => {
    await navigator.clipboard.writeText(content)
  }

  const getCategoryColor = (category: string) => {
    return categories.find((c) => c.value === category)?.color || "bg-gray-500"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Canned Responses</h2>
          <p className="text-muted-foreground">Pre-written templates for quick replies</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Response
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingResponse ? "Edit Response" : "Create Response"}</DialogTitle>
              <DialogDescription>Create a reusable response template. Use {"{{variable_name}}"} for dynamic content.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Welcome Message" />
                </div>
                <div className="space-y-2">
                  <Label>Shortcut</Label>
                  <Input value={formData.shortcut} onChange={(e) => setFormData({ ...formData, shortcut: e.target.value })} placeholder="/welcome" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Hi {{customer_name}}! ..." rows={8} />
                <p className="text-xs text-muted-foreground">Variables detected: {extractVariables(formData.content).map((v) => `{{${v}}}`).join(", ") || "None"}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>{editingResponse ? "Update" : "Create"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-10" placeholder="Search responses..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredResponses.map((response) => (
          <Card key={response.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base">{response.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono text-xs">{response.shortcut}</Badge>
                    <Badge className={`${getCategoryColor(response.category)} text-white text-xs`}>
                      {categories.find((c) => c.value === response.category)?.label}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => copyToClipboard(response.content)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(response)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(response.id)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{response.content}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {response.variables.length} variables
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    Used {response.usageCount}x
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResponses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold">No responses found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search or create a new response</p>
        </div>
      )}
    </div>
  )
}
