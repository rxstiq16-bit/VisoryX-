"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FileText,
  Plus,
  Download,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Send,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Contract {
  id: string
  clientId: string
  clientName: string
  title: string
  type: "standard" | "custom" | "enterprise" | "freelancer"
  status: "draft" | "sent" | "signed" | "active" | "expired" | "terminated"
  value: number
  startDate: string
  endDate: string
  createdAt: string
  signedAt?: string
  terms: string[]
  deliverables: string[]
}

const mockContracts: Contract[] = [
  {
    id: "CONTRACT-001",
    clientId: "client-1",
    clientName: "TechCorp Inc",
    title: "Enterprise Design Services Agreement",
    type: "enterprise",
    status: "active",
    value: 25000,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    createdAt: "2023-12-15",
    signedAt: "2023-12-20",
    terms: ["Unlimited revisions", "24-hour response time", "Dedicated designer", "Priority support"],
    deliverables: ["Monthly design package", "Brand guidelines", "Social media assets"],
  },
  {
    id: "CONTRACT-002",
    clientId: "client-2",
    clientName: "Gaming Studio X",
    title: "ERLC Fleet Package",
    type: "custom",
    status: "sent",
    value: 5000,
    startDate: "2024-02-01",
    endDate: "2024-07-31",
    createdAt: "2024-01-10",
    terms: ["10 vehicle liveries", "2 revision rounds", "Source files included"],
    deliverables: ["Fleet liveries", "Department manual", "Social media kit"],
  },
]

const contractTypes = [
  { value: "standard", label: "Standard", description: "Basic service agreement" },
  { value: "custom", label: "Custom", description: "Tailored project scope" },
  { value: "enterprise", label: "Enterprise", description: "Full-service retainer" },
  { value: "freelancer", label: "Freelancer", description: "Subcontractor agreement" },
]

const statusColors: Record<Contract["status"], string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-blue-500/10 text-blue-500",
  signed: "bg-green-500/10 text-green-500",
  active: "bg-primary/10 text-primary",
  expired: "bg-amber-500/10 text-amber-500",
  terminated: "bg-destructive/10 text-destructive",
}

export function ContractManagement() {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)

  const stats = {
    total: contracts.length,
    active: contracts.filter((c) => c.status === "active").length,
    pending: contracts.filter((c) => c.status === "sent").length,
    totalValue: contracts.filter((c) => c.status === "active").reduce((sum, c) => sum + c.value, 0),
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Contracts</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl text-green-500">{stats.active}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Signature</CardDescription>
            <CardTitle className="text-3xl text-blue-500">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Value</CardDescription>
            <CardTitle className="text-3xl">${stats.totalValue.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Contract List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Contracts</CardTitle>
            <CardDescription>Manage client contracts and agreements</CardDescription>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Contract
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Contract</DialogTitle>
                <DialogDescription>Set up a new client contract or agreement</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Contract Title</label>
                    <Input placeholder="e.g., Enterprise Design Services" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Client</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client-1">TechCorp Inc</SelectItem>
                        <SelectItem value="client-2">Gaming Studio X</SelectItem>
                        <SelectItem value="client-3">StartupCo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Contract Type</label>
                  <div className="mt-2 grid gap-2 md:grid-cols-2">
                    {contractTypes.map((type) => (
                      <label
                        key={type.value}
                        className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 hover:bg-accent"
                      >
                        <input type="radio" name="type" value={type.value} className="mt-1" />
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm text-muted-foreground">{type.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium">Contract Value</label>
                    <Input type="number" placeholder="5000" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Start Date</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">End Date</label>
                    <Input type="date" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Terms & Conditions</label>
                  <Textarea placeholder="Enter contract terms..." rows={4} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button>Create Contract</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{contract.title}</div>
                        <div className="text-xs text-muted-foreground">{contract.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{contract.clientName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {contract.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("capitalize", statusColors[contract.status])}>
                      {contract.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${contract.value.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(contract.startDate).toLocaleDateString()} -{" "}
                      {new Date(contract.endDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      {contract.status === "draft" && (
                        <Button variant="ghost" size="icon">
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
