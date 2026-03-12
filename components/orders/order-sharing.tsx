"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link2, Mail, Copy, Check, Eye, EyeOff, Clock, Users, Trash2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SharedLink {
  id: string
  token: string
  email?: string
  permissions: ("view" | "comment" | "download")[]
  expiresAt?: Date
  createdAt: Date
  accessCount: number
  lastAccessed?: Date
}

interface OrderSharingProps {
  orderId: string
  orderTitle: string
}

export function OrderSharing({ orderId, orderTitle }: OrderSharingProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [email, setEmail] = useState("")
  const [permissions, setPermissions] = useState({
    view: true,
    comment: false,
    download: false,
  })
  const [expiresIn, setExpiresIn] = useState("7")
  const [sharedLinks, setSharedLinks] = useState<SharedLink[]>([
    {
      id: "1",
      token: "abc123xyz",
      email: "client@example.com",
      permissions: ["view", "comment"],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      accessCount: 5,
      lastAccessed: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
  ])

  const generateLink = () => {
    const token = Math.random().toString(36).substring(2, 15)
    return `${window.location.origin}/orders/shared/${token}`
  }

  const shareLink = generateLink()

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareLink)
    setCopied(true)
    toast({ title: "Link copied!", description: "Share link has been copied to clipboard" })
    setTimeout(() => setCopied(false), 2000)
  }

  const inviteByEmail = () => {
    if (!email) return
    
    const newLink: SharedLink = {
      id: Math.random().toString(),
      token: Math.random().toString(36).substring(2, 15),
      email,
      permissions: Object.entries(permissions).filter(([, v]) => v).map(([k]) => k) as ("view" | "comment" | "download")[],
      expiresAt: expiresIn !== "never" ? new Date(Date.now() + parseInt(expiresIn) * 24 * 60 * 60 * 1000) : undefined,
      createdAt: new Date(),
      accessCount: 0,
    }
    
    setSharedLinks([...sharedLinks, newLink])
    setEmail("")
    toast({ title: "Invitation sent!", description: `Invite sent to ${email}` })
  }

  const revokeAccess = (id: string) => {
    setSharedLinks(sharedLinks.filter(link => link.id !== id))
    toast({ title: "Access revoked", description: "The share link has been deactivated" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Share Order
        </CardTitle>
        <CardDescription>
          Share "{orderTitle}" with clients or collaborators
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="link" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">
              <Link2 className="mr-2 h-4 w-4" />
              Share Link
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="mr-2 h-4 w-4" />
              Invite by Email
            </TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Public Access</Label>
                <p className="text-sm text-muted-foreground">
                  Anyone with the link can view
                </p>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>

            {isPublic && (
              <div className="flex gap-2">
                <Input value={shareLink} readOnly className="font-mono text-sm" />
                <Button onClick={copyLink} variant="outline" size="icon">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="client@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button onClick={inviteByEmail} disabled={!email}>
                  <Plus className="mr-2 h-4 w-4" />
                  Invite
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Permissions</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Can view order</span>
                  <Switch
                    checked={permissions.view}
                    onCheckedChange={(v) => setPermissions({ ...permissions, view: v })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Can add comments</span>
                  <Switch
                    checked={permissions.comment}
                    onCheckedChange={(v) => setPermissions({ ...permissions, comment: v })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Can download files</span>
                  <Switch
                    checked={permissions.download}
                    onCheckedChange={(v) => setPermissions({ ...permissions, download: v })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Link Expiration</Label>
              <select
                value={expiresIn}
                onChange={(e) => setExpiresIn(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2"
              >
                <option value="1">1 day</option>
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="never">Never</option>
              </select>
            </div>
          </TabsContent>
        </Tabs>

        {sharedLinks.length > 0 && (
          <div className="mt-6 space-y-3">
            <Label>Active Shares</Label>
            <div className="space-y-2">
              {sharedLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{link.email || "Public link"}</span>
                      {link.permissions.map((p) => (
                        <Badge key={p} variant="secondary" className="text-xs">
                          {p}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {link.accessCount} views
                      </span>
                      {link.expiresAt && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Expires {link.expiresAt.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => revokeAccess(link.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
