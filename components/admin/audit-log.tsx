"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Filter, Download, Eye, User, Settings, CreditCard, FileText, Shield, Clock, MapPin } from "lucide-react"
import { format } from "date-fns"

interface AuditLogEntry {
  id: string
  timestamp: Date
  userId: string
  userName: string
  userEmail: string
  action: string
  category: "auth" | "order" | "payment" | "settings" | "admin" | "file"
  resource: string
  resourceId?: string
  ipAddress: string
  userAgent: string
  location?: string
  details: Record<string, unknown>
  status: "success" | "failure" | "warning"
}

const categoryIcons = {
  auth: Shield,
  order: FileText,
  payment: CreditCard,
  settings: Settings,
  admin: User,
  file: FileText,
}

const categoryColors = {
  auth: "bg-blue-500/10 text-blue-500",
  order: "bg-purple-500/10 text-purple-500",
  payment: "bg-green-500/10 text-green-500",
  settings: "bg-orange-500/10 text-orange-500",
  admin: "bg-red-500/10 text-red-500",
  file: "bg-cyan-500/10 text-cyan-500",
}

const statusColors = {
  success: "bg-green-500/10 text-green-500 border-green-500/20",
  failure: "bg-red-500/10 text-red-500 border-red-500/20",
  warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
}

// Mock data
const mockLogs: AuditLogEntry[] = [
  {
    id: "1",
    timestamp: new Date(),
    userId: "user_1",
    userName: "John Doe",
    userEmail: "john@example.com",
    action: "login",
    category: "auth",
    resource: "session",
    ipAddress: "192.168.1.1",
    userAgent: "Chrome/120.0 Windows",
    location: "New York, US",
    details: { method: "password", mfaUsed: true },
    status: "success",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 3600000),
    userId: "user_2",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    action: "order.create",
    category: "order",
    resource: "order",
    resourceId: "ORD-2024-001",
    ipAddress: "10.0.0.1",
    userAgent: "Safari/17.0 macOS",
    location: "Los Angeles, US",
    details: { amount: 299, service: "Logo Design" },
    status: "success",
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 7200000),
    userId: "admin_1",
    userName: "Admin User",
    userEmail: "admin@visoryx.com",
    action: "user.role_change",
    category: "admin",
    resource: "user",
    resourceId: "user_3",
    ipAddress: "172.16.0.1",
    userAgent: "Firefox/120.0 Linux",
    details: { oldRole: "customer", newRole: "vip" },
    status: "success",
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 10800000),
    userId: "user_4",
    userName: "Bob Wilson",
    userEmail: "bob@example.com",
    action: "payment.failed",
    category: "payment",
    resource: "payment",
    resourceId: "pay_xyz",
    ipAddress: "203.0.113.1",
    userAgent: "Chrome/119.0 Android",
    location: "London, UK",
    details: { error: "Card declined", amount: 150 },
    status: "failure",
  },
]

export function AuditLog() {
  const [logs] = useState<AuditLogEntry[]>(mockLogs)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null)

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.ipAddress.includes(search)
    
    const matchesCategory = categoryFilter === "all" || log.category === categoryFilter
    const matchesStatus = statusFilter === "all" || log.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const exportLogs = () => {
    const csv = [
      ["Timestamp", "User", "Email", "Action", "Category", "Resource", "IP Address", "Status"],
      ...filteredLogs.map(log => [
        log.timestamp.toISOString(),
        log.userName,
        log.userEmail,
        log.action,
        log.category,
        log.resource,
        log.ipAddress,
        log.status,
      ])
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-log-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Audit Log</CardTitle>
            <CardDescription>
              Track all user and system actions for security and compliance
            </CardDescription>
          </div>
          <Button variant="outline" onClick={exportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by user, action, or IP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="auth">Authentication</SelectItem>
              <SelectItem value="order">Orders</SelectItem>
              <SelectItem value="payment">Payments</SelectItem>
              <SelectItem value="settings">Settings</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="file">Files</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failure">Failure</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Log Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map(log => {
                const CategoryIcon = categoryIcons[log.category]
                return (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {format(log.timestamp, "MMM d, HH:mm:ss")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{log.userName}</p>
                        <p className="text-xs text-muted-foreground">{log.userEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-1.5 py-0.5 rounded">
                        {log.action}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={categoryColors[log.category]}>
                        <CategoryIcon className="h-3 w-3 mr-1" />
                        {log.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {log.ipAddress}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[log.status]}>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedLog(log)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Audit Log Details</DialogTitle>
                          </DialogHeader>
                          {selectedLog && (
                            <ScrollArea className="max-h-[60vh]">
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Timestamp</p>
                                    <p className="font-medium">{format(selectedLog.timestamp, "PPpp")}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Status</p>
                                    <Badge variant="outline" className={statusColors[selectedLog.status]}>
                                      {selectedLog.status}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">User</p>
                                    <p className="font-medium">{selectedLog.userName}</p>
                                    <p className="text-xs text-muted-foreground">{selectedLog.userEmail}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">User ID</p>
                                    <code className="text-xs">{selectedLog.userId}</code>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">IP Address</p>
                                    <p className="font-medium">{selectedLog.ipAddress}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Location</p>
                                    <p className="font-medium">{selectedLog.location || "Unknown"}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <p className="text-muted-foreground">User Agent</p>
                                    <p className="font-medium text-xs">{selectedLog.userAgent}</p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-muted-foreground text-sm mb-2">Details</p>
                                  <pre className="bg-muted p-3 rounded-lg text-xs overflow-auto">
                                    {JSON.stringify(selectedLog.details, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            </ScrollArea>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
