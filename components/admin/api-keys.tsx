"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Key, Plus, Copy, Trash2, Eye, EyeOff, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react"
import { format } from "date-fns"

interface APIKey {
  id: string
  name: string
  keyPrefix: string
  permissions: string[]
  environment: "production" | "development" | "staging"
  createdAt: Date
  lastUsed?: Date
  expiresAt?: Date
  isActive: boolean
  requestCount: number
}

const allPermissions = [
  { id: "orders:read", label: "Read Orders", description: "View order details" },
  { id: "orders:write", label: "Write Orders", description: "Create and update orders" },
  { id: "users:read", label: "Read Users", description: "View user profiles" },
  { id: "files:read", label: "Read Files", description: "Download files" },
  { id: "files:write", label: "Write Files", description: "Upload files" },
  { id: "webhooks:manage", label: "Manage Webhooks", description: "Create and manage webhooks" },
]

const mockKeys: APIKey[] = [
  {
    id: "1",
    name: "Production Integration",
    keyPrefix: "vx_live_abc123...",
    permissions: ["orders:read", "orders:write", "files:read"],
    environment: "production",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    lastUsed: new Date(Date.now() - 3600000),
    isActive: true,
    requestCount: 15420,
  },
  {
    id: "2",
    name: "Development Testing",
    keyPrefix: "vx_test_xyz789...",
    permissions: ["orders:read", "users:read"],
    environment: "development",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lastUsed: new Date(Date.now() - 86400000),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true,
    requestCount: 342,
  },
]

export { APIKeyManagement as APIKeys }

export function APIKeyManagement() {
  const [keys, setKeys] = useState<APIKey[]>(mockKeys)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newKeyVisible, setNewKeyVisible] = useState(false)
  const [generatedKey, setGeneratedKey] = useState("")
  const [copied, setCopied] = useState(false)

  // New key form state
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyEnvironment, setNewKeyEnvironment] = useState<"production" | "development" | "staging">("development")
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>([])
  const [newKeyExpiry, setNewKeyExpiry] = useState("")

  const togglePermission = (permId: string) => {
    setNewKeyPermissions(prev =>
      prev.includes(permId)
        ? prev.filter(p => p !== permId)
        : [...prev, permId]
    )
  }

  const createKey = () => {
    // Generate mock key
    const prefix = newKeyEnvironment === "production" ? "vx_live_" : "vx_test_"
    const fullKey = prefix + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setGeneratedKey(fullKey)
    setNewKeyVisible(true)

    const newKey: APIKey = {
      id: Date.now().toString(),
      name: newKeyName,
      keyPrefix: prefix + fullKey.slice(8, 14) + "...",
      permissions: newKeyPermissions,
      environment: newKeyEnvironment,
      createdAt: new Date(),
      isActive: true,
      requestCount: 0,
      expiresAt: newKeyExpiry ? new Date(newKeyExpiry) : undefined,
    }
    setKeys(prev => [...prev, newKey])
  }

  const deleteKey = (id: string) => {
    setKeys(prev => prev.filter(k => k.id !== id))
  }

  const toggleKeyActive = (id: string) => {
    setKeys(prev => prev.map(k =>
      k.id === id ? { ...k, isActive: !k.isActive } : k
    ))
  }

  const copyKey = () => {
    navigator.clipboard.writeText(generatedKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const closeDialog = () => {
    setCreateDialogOpen(false)
    setNewKeyVisible(false)
    setGeneratedKey("")
    setNewKeyName("")
    setNewKeyEnvironment("development")
    setNewKeyPermissions([])
    setNewKeyExpiry("")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Keys
            </CardTitle>
            <CardDescription>
              Manage API keys for external integrations and developers
            </CardDescription>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create API Key
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {newKeyVisible ? "API Key Created" : "Create New API Key"}
                </DialogTitle>
                <DialogDescription>
                  {newKeyVisible
                    ? "Copy your API key now. You won't be able to see it again."
                    : "Configure permissions and settings for your new API key."
                  }
                </DialogDescription>
              </DialogHeader>

              {newKeyVisible ? (
                <div className="space-y-4 py-4">
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <code className="flex-1 text-sm font-mono break-all">{generatedKey}</code>
                    <Button size="icon" variant="ghost" onClick={copyKey}>
                      {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                      Make sure to copy your API key now. For security reasons, we will not show it again.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button onClick={closeDialog}>Done</Button>
                  </DialogFooter>
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Key Name</Label>
                    <Input
                      placeholder="e.g., Production Integration"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Environment</Label>
                    <Select value={newKeyEnvironment} onValueChange={(v: "production" | "development" | "staging") => setNewKeyEnvironment(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="staging">Staging</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="grid gap-2 max-h-[200px] overflow-auto p-1">
                      {allPermissions.map(perm => (
                        <label
                          key={perm.id}
                          className="flex items-start gap-3 p-2 rounded border cursor-pointer hover:bg-muted/50"
                        >
                          <Checkbox
                            checked={newKeyPermissions.includes(perm.id)}
                            onCheckedChange={() => togglePermission(perm.id)}
                          />
                          <div>
                            <p className="font-medium text-sm">{perm.label}</p>
                            <p className="text-xs text-muted-foreground">{perm.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Expiration (Optional)</Label>
                    <Input
                      type="date"
                      value={newKeyExpiry}
                      onChange={(e) => setNewKeyExpiry(e.target.value)}
                      min={format(new Date(), "yyyy-MM-dd")}
                    />
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={closeDialog}>Cancel</Button>
                    <Button onClick={createKey} disabled={!newKeyName || newKeyPermissions.length === 0}>
                      Generate Key
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Requests</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map(key => (
                <TableRow key={key.id}>
                  <TableCell className="font-medium">{key.name}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{key.keyPrefix}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant={key.environment === "production" ? "default" : "secondary"}>
                      {key.environment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {key.permissions.length} permissions
                    </span>
                  </TableCell>
                  <TableCell>{key.requestCount.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {key.lastUsed ? format(key.lastUsed, "MMM d, HH:mm") : "Never"}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={key.isActive}
                      onCheckedChange={() => toggleKeyActive(key.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteKey(key.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
