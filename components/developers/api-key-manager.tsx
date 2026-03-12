"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Key, Plus, Copy, Eye, EyeOff, Trash2, CheckCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const permissions = [
  { id: "orders:read", label: "Read Orders", description: "View order details" },
  { id: "orders:write", label: "Create/Update Orders", description: "Create and modify orders" },
  { id: "files:read", label: "Read Files", description: "Download order files" },
  { id: "files:write", label: "Upload Files", description: "Upload files to orders" },
  { id: "services:read", label: "Read Services", description: "View available services" },
  { id: "portfolio:read", label: "Read Portfolio", description: "View portfolio items" },
  { id: "webhooks:manage", label: "Manage Webhooks", description: "Create and delete webhooks" },
]

interface ApiKey {
  id: string
  name: string
  key_prefix: string
  permissions: string[]
  last_used_at: string | null
  created_at: string
  expires_at: string | null
}

export function ApiKeyManager() {
  const { data, mutate, isLoading } = useSWR<{ keys: ApiKey[] }>("/api/developers/keys", fetcher)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(["orders:read", "services:read"])
  const [isCreating, setIsCreating] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [showKey, setShowKey] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleCreate = async () => {
    setIsCreating(true)
    try {
      const response = await fetch("/api/developers/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newKeyName,
          permissions: selectedPermissions,
        }),
      })
      const data = await response.json()
      if (data.key) {
        setNewKey(data.key)
        mutate()
      }
    } catch (error) {
      console.error("Failed to create API key:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDelete = async (keyId: string) => {
    try {
      await fetch(`/api/developers/keys/${keyId}`, { method: "DELETE" })
      mutate()
    } catch (error) {
      console.error("Failed to delete API key:", error)
    }
  }

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(keyId)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const resetCreateDialog = () => {
    setNewKeyName("")
    setSelectedPermissions(["orders:read", "services:read"])
    setNewKey(null)
    setShowKey(false)
  }

  return (
    <div className="space-y-6">
      {/* Create Key Button */}
      <div className="flex justify-end">
        <Dialog
          open={isCreateOpen}
          onOpenChange={(open) => {
            setIsCreateOpen(open)
            if (!open) resetCreateDialog()
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            {newKey ? (
              <>
                <DialogHeader>
                  <DialogTitle>API Key Created</DialogTitle>
                  <DialogDescription>
                    Copy your API key now. You will not be able to see it again.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <div className="flex items-center justify-between">
                      <code className={cn("flex-1 text-sm", !showKey && "blur-sm select-none")}>
                        {newKey}
                      </code>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setShowKey(!showKey)}
                        >
                          {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => copyToClipboard(newKey, "new")}
                        >
                          {copiedKey === "new" ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-yellow-600">
                    Make sure to copy your API key now. You will not be able to see it again!
                  </p>
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsCreateOpen(false)}>Done</Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Create API Key</DialogTitle>
                  <DialogDescription>
                    Create a new API key with specific permissions
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Key Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Production Server"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Permissions</Label>
                    {permissions.map((perm) => (
                      <div key={perm.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={perm.id}
                          checked={selectedPermissions.includes(perm.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedPermissions([...selectedPermissions, perm.id])
                            } else {
                              setSelectedPermissions(
                                selectedPermissions.filter((p) => p !== perm.id)
                              )
                            }
                          }}
                        />
                        <div className="grid gap-1 leading-none">
                          <label
                            htmlFor={perm.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {perm.label}
                          </label>
                          <p className="text-xs text-muted-foreground">{perm.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreate}
                    disabled={isCreating || !newKeyName.trim() || selectedPermissions.length === 0}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Key"
                    )}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Keys List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : data?.keys?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Key className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No API Keys</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your first API key to start using the VisoryX API
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data?.keys?.map((apiKey) => (
            <Card key={apiKey.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Key className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{apiKey.name}</CardTitle>
                      <CardDescription>
                        <code className="text-xs">{apiKey.key_prefix}...****</code>
                      </CardDescription>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this API key? Any applications using this key will lose access.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleDelete(apiKey.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {apiKey.permissions.map((perm) => (
                    <Badge key={perm} variant="secondary" className="text-xs">
                      {perm}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Created {format(new Date(apiKey.created_at), "MMM d, yyyy")}</span>
                  <span>
                    {apiKey.last_used_at
                      ? `Last used ${format(new Date(apiKey.last_used_at), "MMM d, yyyy")}`
                      : "Never used"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
