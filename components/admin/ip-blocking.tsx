"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShieldBan, Plus, Trash2, Search, AlertTriangle, Clock, Globe, Activity } from "lucide-react"
import { format } from "date-fns"

interface BlockedIP {
  id: string
  ip: string
  type: "single" | "range" | "cidr"
  reason: string
  blockedAt: Date
  expiresAt?: Date
  blockedBy: string
  hitCount: number
  isActive: boolean
}

interface RateLimitRule {
  id: string
  name: string
  endpoint: string
  limit: number
  window: number // in seconds
  isActive: boolean
}

const mockBlockedIPs: BlockedIP[] = [
  {
    id: "1",
    ip: "192.168.1.100",
    type: "single",
    reason: "Brute force login attempts",
    blockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    blockedBy: "System (Auto)",
    hitCount: 1247,
    isActive: true,
  },
  {
    id: "2",
    ip: "10.0.0.0/24",
    type: "cidr",
    reason: "Known spam network",
    blockedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    blockedBy: "admin@visoryx.com",
    hitCount: 5892,
    isActive: true,
  },
  {
    id: "3",
    ip: "203.0.113.50-203.0.113.100",
    type: "range",
    reason: "DDoS attack source",
    blockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    blockedBy: "System (Auto)",
    hitCount: 89234,
    isActive: true,
  },
]

const mockRateLimits: RateLimitRule[] = [
  { id: "1", name: "API General", endpoint: "/api/*", limit: 100, window: 60, isActive: true },
  { id: "2", name: "Login Attempts", endpoint: "/api/auth/login", limit: 5, window: 300, isActive: true },
  { id: "3", name: "Order Creation", endpoint: "/api/orders", limit: 10, window: 60, isActive: true },
  { id: "4", name: "File Uploads", endpoint: "/api/files/upload", limit: 20, window: 60, isActive: true },
]

export function IPBlocking() {
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>(mockBlockedIPs)
  const [rateLimits, setRateLimits] = useState<RateLimitRule[]>(mockRateLimits)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [search, setSearch] = useState("")

  // New block form
  const [newIP, setNewIP] = useState("")
  const [newType, setNewType] = useState<"single" | "range" | "cidr">("single")
  const [newReason, setNewReason] = useState("")
  const [newExpiry, setNewExpiry] = useState("")

  const addBlock = () => {
    const block: BlockedIP = {
      id: Date.now().toString(),
      ip: newIP,
      type: newType,
      reason: newReason,
      blockedAt: new Date(),
      expiresAt: newExpiry ? new Date(newExpiry) : undefined,
      blockedBy: "admin@visoryx.com",
      hitCount: 0,
      isActive: true,
    }
    setBlockedIPs(prev => [...prev, block])
    setAddDialogOpen(false)
    setNewIP("")
    setNewReason("")
    setNewExpiry("")
  }

  const removeBlock = (id: string) => {
    setBlockedIPs(prev => prev.filter(b => b.id !== id))
  }

  const toggleBlock = (id: string) => {
    setBlockedIPs(prev => prev.map(b =>
      b.id === id ? { ...b, isActive: !b.isActive } : b
    ))
  }

  const toggleRateLimit = (id: string) => {
    setRateLimits(prev => prev.map(r =>
      r.id === id ? { ...r, isActive: !r.isActive } : r
    ))
  }

  const filteredIPs = blockedIPs.filter(b =>
    b.ip.includes(search) || b.reason.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldBan className="h-5 w-5" />
          Security & Rate Limiting
        </CardTitle>
        <CardDescription>
          Manage IP blocks and rate limiting rules to protect your platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="blocked">
          <TabsList>
            <TabsTrigger value="blocked">Blocked IPs</TabsTrigger>
            <TabsTrigger value="ratelimits">Rate Limits</TabsTrigger>
          </TabsList>

          <TabsContent value="blocked" className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search IPs or reasons..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Block IP
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Block IP Address</DialogTitle>
                    <DialogDescription>
                      Add an IP address or range to the blocklist
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Block Type</Label>
                      <Select value={newType} onValueChange={(v: "single" | "range" | "cidr") => setNewType(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single IP</SelectItem>
                          <SelectItem value="range">IP Range</SelectItem>
                          <SelectItem value="cidr">CIDR Block</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>
                        {newType === "single" && "IP Address"}
                        {newType === "range" && "IP Range (e.g., 192.168.1.1-192.168.1.100)"}
                        {newType === "cidr" && "CIDR Block (e.g., 192.168.1.0/24)"}
                      </Label>
                      <Input
                        placeholder={
                          newType === "single" ? "192.168.1.1" :
                          newType === "range" ? "192.168.1.1-192.168.1.100" :
                          "192.168.1.0/24"
                        }
                        value={newIP}
                        onChange={(e) => setNewIP(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Reason</Label>
                      <Textarea
                        placeholder="Reason for blocking..."
                        value={newReason}
                        onChange={(e) => setNewReason(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Expiration (Optional)</Label>
                      <Input
                        type="datetime-local"
                        value={newExpiry}
                        onChange={(e) => setNewExpiry(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addBlock} disabled={!newIP || !newReason}>
                      Block IP
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IP / Range</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Blocked</TableHead>
                    <TableHead>Hits</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIPs.map(block => (
                    <TableRow key={block.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <code className="text-sm">{block.ip}</code>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{block.type}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {block.reason}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(block.blockedAt, "MMM d, yyyy")}
                        {block.expiresAt && (
                          <div className="flex items-center gap-1 text-xs text-yellow-600">
                            <Clock className="h-3 w-3" />
                            Expires {format(block.expiresAt, "MMM d")}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">{block.hitCount.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={block.isActive}
                          onCheckedChange={() => toggleBlock(block.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => removeBlock(block.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="ratelimits" className="space-y-4">
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Limit</TableHead>
                    <TableHead>Window</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rateLimits.map(rule => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">{rule.endpoint}</code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          {rule.limit} requests
                        </div>
                      </TableCell>
                      <TableCell>
                        per {rule.window >= 60 ? `${rule.window / 60} min` : `${rule.window} sec`}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={() => toggleRateLimit(rule.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
