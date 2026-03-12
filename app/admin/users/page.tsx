"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  MoreHorizontal,
  Shield,
  ShieldAlert,
  UserX,
  UserCheck,
  RefreshCw,
  Users,
  Crown,
  Paintbrush,
  Headphones,
  Settings,
  KeyRound,
  Trash2,
  Code,
  ShieldCheck,
  Sparkles,
  FileText,
  Clock,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { generateAccountId } from "@/lib/user-store"

type Profile = {
  id: string
  username: string
  email: string
  display_name: string | null
  avatar_url: string | null
  roles: string[]
  status: string | null
  created_at: string
  unsubscribed: boolean | null
}

const ALL_ROLES = [
  { value: "executive", label: "Executive", icon: Crown, color: "text-amber-400 bg-amber-400/10" },
  { value: "director", label: "Director", icon: ShieldAlert, color: "text-red-400 bg-red-400/10" },
  { value: "operations_manager", label: "Ops Manager", icon: Settings, color: "text-blue-400 bg-blue-400/10" },
  { value: "lead_developer", label: "Lead Developer", icon: Code, color: "text-cyan-400 bg-cyan-400/10" },
  { value: "developer", label: "Developer", icon: Code, color: "text-teal-400 bg-teal-400/10" },
  { value: "lead_moderator", label: "Lead Moderator", icon: ShieldCheck, color: "text-emerald-400 bg-emerald-400/10" },
  { value: "community_moderator", label: "Moderator", icon: Headphones, color: "text-green-400 bg-green-400/10" },
  { value: "design_lead", label: "Design Lead", icon: Paintbrush, color: "text-purple-400 bg-purple-400/10" },
  { value: "designer", label: "Designer", icon: Paintbrush, color: "text-indigo-400 bg-indigo-400/10" },
  { value: "content_manager", label: "Content Manager", icon: FileText, color: "text-orange-400 bg-orange-400/10" },
  { value: "support_agent", label: "Support Agent", icon: Headphones, color: "text-sky-400 bg-sky-400/10" },
  { value: "trial", label: "Trial / Probation", icon: Clock, color: "text-zinc-400 bg-zinc-400/10" },
  { value: "premium", label: "Premium / VIP", icon: Sparkles, color: "text-yellow-300 bg-yellow-300/10" },
  { value: "client", label: "Client", icon: Users, color: "text-muted-foreground bg-muted" },
]

const ROLE_RANK: Record<string, number> = {
  executive: 100,
  director: 90,
  operations_manager: 80,
  lead_developer: 75,
  developer: 70,
  lead_moderator: 55,
  community_moderator: 50,
  design_lead: 40,
  designer: 30,
  content_manager: 25,
  support_agent: 20,
  trial: 15,
  premium: 10,
  client: 0,
}

const MANAGEMENT_ROLES = ["executive", "director", "operations_manager"]

function getRoleMeta(role: string) {
  return ALL_ROLES.find((r) => r.value === role) || ALL_ROLES[ALL_ROLES.length - 1]
}

function getUserRank(roles: string[] | undefined): number {
  if (!roles || roles.length === 0) return 0
  return Math.max(...roles.map(r => ROLE_RANK[r] ?? 0))
}

function canSuspendUser(actorRoles: string[] | undefined, targetRoles: string[] | undefined): boolean {
  // Only management+ can suspend
  if (!actorRoles?.some(r => MANAGEMENT_ROLES.includes(r))) return false
  // Cannot suspend someone of equal or higher rank
  return getUserRank(actorRoles) > getUserRank(targetRoles)
}

export default function AdminUsersPage() {
  const { profile } = useAuth()
  const supabase = createClient()
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const isAdmin = profile?.roles?.some((r: string) => ["executive", "director"].includes(r))

  const fetchUsers = useCallback(async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setUsers(data as Profile[])
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const filtered = users.filter((u) => {
    if (roleFilter !== "all" && !u.roles?.includes(roleFilter)) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.display_name?.toLowerCase().includes(q)
      )
    }
    return true
  })

  const staffCount = users.filter((u) => u.roles?.some((r) => r !== "client")).length
  const clientCount = users.filter((u) => u.roles?.every((r) => r === "client") || !u.roles?.length).length

  const toggleRole = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    )
  }

  const handleRoleUpdate = async () => {
    if (!selectedUser || selectedRoles.length === 0) return
    setActionLoading(true)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ roles: selectedRoles })
        .eq("id", selectedUser.id)

      if (error) throw error
      const labels = selectedRoles.map(r => getRoleMeta(r).label).join(", ")
      toast.success(`Roles updated to: ${labels}`)
      setRoleDialogOpen(false)
      fetchUsers()
    } catch {
      toast.error("Failed to update roles")
    }
    setActionLoading(false)
  }

  const handleSuspend = async () => {
    if (!selectedUser) return
    setActionLoading(true)
    const isSuspended = selectedUser.status === "suspended"
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ status: isSuspended ? "active" : "suspended" })
        .eq("id", selectedUser.id)

      if (error) throw error
      toast.success(isSuspended ? "Account reactivated" : "Account suspended")
      setSuspendDialogOpen(false)
      fetchUsers()
    } catch {
      toast.error("Failed to update status")
    }
    setActionLoading(false)
  }

  const handleDelete = async () => {
    if (!selectedUser) return
    setActionLoading(true)
    try {
      const res = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser.id }),
      })
      if (!res.ok) throw new Error("Failed")
      toast.success("User deleted")
      setDeleteDialogOpen(false)
      fetchUsers()
    } catch {
      toast.error("Failed to delete user")
    }
    setActionLoading(false)
  }

  const handleResetPassword = async () => {
    if (!selectedUser) return
    setActionLoading(true)
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: selectedUser.email }),
      })
      if (!res.ok) throw new Error("Failed")
      toast.success("Password reset email sent")
      setResetDialogOpen(false)
    } catch {
      toast.error("Failed to send reset email")
    }
    setActionLoading(false)
  }

  if (!isAdmin) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-sm text-muted-foreground">
          {users.length} total users -- {staffCount} staff, {clientCount} clients
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{users.length}</p>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{staffCount}</p>
            <p className="text-xs text-muted-foreground">Staff Members</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{clientCount}</p>
            <p className="text-xs text-muted-foreground">Clients</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{users.filter((u) => u.status === "suspended").length}</p>
            <p className="text-xs text-muted-foreground">Suspended</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[160px] h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {ALL_ROLES.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setLoading(true); fetchUsers() }}
          className="gap-1.5"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* User list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No users found</p>
        </div>
      ) : (
        <Card className="border-border/50 overflow-hidden">
          <div className="divide-y divide-border/50">
            {filtered.map((user) => {
              const isSuspended = user.status === "suspended"
              const isSelf = user.id === profile?.id

              return (
                <div
                  key={user.id}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/30",
                    isSuspended && "opacity-60"
                  )}
                >
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={user.avatar_url || undefined} />
                    <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                      {user.username?.slice(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">
                        {user.display_name || user.username}
                      </span>
                      {isSelf && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">You</Badge>
                      )}
                      {isSuspended && (
                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Suspended</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>@{user.username}</span>
                      <span className="hidden sm:inline">--</span>
                      <span className="hidden sm:inline truncate">{user.email}</span>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-1.5 flex-wrap max-w-[240px]">
                    {(user.roles?.length ? user.roles : ["client"]).map(r => {
                      const meta = getRoleMeta(r)
                      return (
                        <Badge
                          key={r}
                          variant="secondary"
                          className={cn("gap-1 text-[10px] font-medium", meta.color)}
                        >
                          <meta.icon className="h-3 w-3" />
                          {meta.label}
                        </Badge>
                      )
                    })}
                  </div>

                  <span className="hidden lg:block text-xs text-muted-foreground font-mono">
                    {generateAccountId(user.id)}
                  </span>

                  <span className="hidden lg:block text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(user.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>

                  {!isSelf && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedUser(user)
                          setSelectedRoles(user.roles?.length ? [...user.roles] : ["client"])
                          setRoleDialogOpen(true)
                        }}>
                          <Shield className="h-3.5 w-3.5 mr-2" />
                          Manage Roles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedUser(user)
                          setResetDialogOpen(true)
                        }}>
                          <KeyRound className="h-3.5 w-3.5 mr-2" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {canSuspendUser(profile?.roles, user.roles) ? (
                          <DropdownMenuItem onClick={() => {
                            setSelectedUser(user)
                            setSuspendDialogOpen(true)
                          }}>
                            {isSuspended ? (
                              <><UserCheck className="h-3.5 w-3.5 mr-2" />Reactivate</>
                            ) : (
                              <><UserX className="h-3.5 w-3.5 mr-2" />Suspend</>
                            )}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem disabled className="opacity-40">
                            <UserX className="h-3.5 w-3.5 mr-2" />
                            {getUserRank(user.roles) >= getUserRank(profile?.roles)
                              ? "Cannot suspend equal/higher rank"
                              : "Management+ required"}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            setSelectedUser(user)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Role Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Roles</DialogTitle>
            <DialogDescription>
              Select one or more roles for {selectedUser?.display_name || selectedUser?.username}.
              Multiple roles can be assigned.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2 max-h-[360px] overflow-y-auto">
            {ALL_ROLES.map((r) => {
              const isSelected = selectedRoles.includes(r.value)
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => toggleRole(r.value)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border p-3 text-sm transition-all text-left",
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border/50 hover:border-border hover:bg-muted/30"
                  )}
                >
                  <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-md", r.color)}>
                    <r.icon className="h-4 w-4" />
                  </div>
                  <span className="flex-1 font-medium">{r.label}</span>
                  <div className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                    isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
                  )}>
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                </button>
              )
            })}
          </div>
          {selectedRoles.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedRoles.map(r => {
                const meta = getRoleMeta(r)
                return (
                  <span key={r} className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", meta.color)}>
                    <meta.icon className="h-3 w-3" />
                    {meta.label}
                  </span>
                )
              })}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRoleUpdate} disabled={actionLoading || selectedRoles.length === 0}>
              {actionLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
              Update Roles ({selectedRoles.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend Dialog */}
      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.status === "suspended" ? "Reactivate Account" : "Suspend Account"}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.status === "suspended"
                ? `Reactivate the account for ${selectedUser?.display_name || selectedUser?.username}? They will regain access.`
                : `Suspend the account for ${selectedUser?.display_name || selectedUser?.username}? They will lose access until reactivated.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendDialogOpen(false)}>Cancel</Button>
            <Button
              variant={selectedUser?.status === "suspended" ? "default" : "destructive"}
              onClick={handleSuspend}
              disabled={actionLoading}
            >
              {actionLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
              {selectedUser?.status === "suspended" ? "Reactivate" : "Suspend"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Permanently delete {selectedUser?.display_name || selectedUser?.username}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={actionLoading}>
              {actionLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Send a password reset email to {selectedUser?.email}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleResetPassword} disabled={actionLoading}>
              {actionLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
              Send Reset Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
