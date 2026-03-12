"use client"

import React, { useRef, useState, useEffect } from "react"
import {
  Save, CheckCircle, AlertTriangle, XCircle, Shapes, MessageSquare, Gamepad2,
  Briefcase, Share2, Layers, ImageIcon, X, Building2, Users, Megaphone, Plus,
  Trash2, Pencil, FileText, DollarSign, Globe, Loader2, Eye, EyeOff,
  ClipboardList, Check, XIcon, UserPlus, Shield, Mail, KeyRound,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/components/auth-provider"
import { getSettings, updateSettings, getOrderStatusInfo, type OrderStatus, type SiteSettings } from "@/lib/settings-store"
import { createClient } from "@/lib/supabase/client"
import { getOrders, type Order } from "@/lib/orders"
import { cn } from "@/lib/utils"

const TABS = [
  { id: "general", label: "General", icon: Building2 },
  { id: "team", label: "Team", icon: Users },
  { id: "applications", label: "Applications", icon: ClipboardList },
  { id: "announcements", label: "Announcements", icon: Megaphone },
  { id: "payments", label: "Payments", icon: DollarSign },
  { id: "site-editor", label: "Site Editor", icon: Globe },
] as const

type TabId = (typeof TABS)[number]["id"]

export function SettingsAdmin() {
  const [tab, setTab] = useState<TabId>("general")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your site configuration, applications, announcements, payments, and content.</p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 rounded-lg bg-muted/50 p-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all whitespace-nowrap",
              tab === t.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "general" && <GeneralTab />}
      {tab === "team" && <TeamTab />}
      {tab === "applications" && <ApplicationsTab />}
      {tab === "announcements" && <AnnouncementsTab />}
      {tab === "payments" && <PaymentsTab />}
      {tab === "site-editor" && <SiteEditorTab />}
    </div>
  )
}

/* ==================== TEAM TAB ==================== */
interface TeamMember {
  id: string
  username: string
  email: string
  display_name: string | null
  avatar_url: string | null
  roles: string[]
  created_at: string
  last_seen?: string
  show_on_team?: boolean
  team_title?: string | null
  team_bio?: string | null
  team_sort_order?: number
}

const AVAILABLE_ROLES = [
  { value: "executive", label: "Executive", description: "Full system authority" },
  { value: "director", label: "Director", description: "Co-owner, full access (cannot demote Executive)" },
  { value: "operations_manager", label: "Operations Manager", description: "Orders, assignments, applications, email" },
  { value: "lead_developer", label: "Lead Developer", description: "Admin access, users, development oversight" },
  { value: "developer", label: "Developer", description: "Admin access, orders, portfolio" },
  { value: "lead_moderator", label: "Lead Moderator", description: "Moderation oversight, users management" },
  { value: "community_moderator", label: "Community Moderator", description: "Moderate reviews, tickets, email responses" },
  { value: "design_lead", label: "Design Lead", description: "View all orders, assign designers, uploads" },
  { value: "designer", label: "Designer", description: "View assigned orders, upload files" },
  { value: "content_manager", label: "Content Manager", description: "Blog, portfolio content management" },
  { value: "support_agent", label: "Support Agent", description: "Inbox, customer support access" },
  { value: "trial", label: "Trial / Probation", description: "Limited access, new staff evaluation" },
  { value: "premium", label: "Premium / VIP", description: "VIP customer, no admin access" },
  { value: "client", label: "Client", description: "Default user, no admin access" },
] as const

function TeamTab() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [editingRoles, setEditingRoles] = useState<string[]>([])
  const [updatingRole, setUpdatingRole] = useState(false)
  const [createForm, setCreateForm] = useState({ email: "", username: "", displayName: "", password: "", role: "designer" as string })
  const [createError, setCreateError] = useState("")
  const [createSuccess, setCreateSuccess] = useState("")
  const [passwordTarget, setPasswordTarget] = useState<TeamMember | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  useEffect(() => { loadMembers() }, [])

  const loadMembers = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
      if (data) setMembers(data as TeamMember[])
    } catch { /* table may not exist */ } finally { setLoading(false) }
  }

  const handleCreate = async () => {
    setCreating(true)
    setCreateError("")
    setCreateSuccess("")
    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: createForm.email,
          password: createForm.password,
          username: createForm.username,
          displayName: createForm.displayName || createForm.username,
          roles: [createForm.role],
        }),
      })
      const data = await res.json()
      if (!res.ok) { setCreateError(data.error || "Failed to create user"); return }
      setCreateSuccess(`Account created for ${createForm.email}`)
      setCreateForm({ email: "", username: "", displayName: "", password: "", role: "designer" })
      setShowCreate(false)
      loadMembers()
    } catch { setCreateError("Network error") } finally { setCreating(false) }
  }

  const handleRoleUpdate = async (userId: string, newRoles: string[]) => {
    setUpdatingRole(true)
    try {
      const res = await fetch("/api/admin/update-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, roles: newRoles }),
      })
      if (res.ok) {
        setMembers(m => m.map(member => member.id === userId ? { ...member, roles: newRoles } : member))
      }
    } catch { /* silently fail */ } finally { setUpdatingRole(false) }
  }

  const handlePasswordChange = async () => {
    if (!passwordTarget || !newPassword) return
    setChangingPassword(true)
    setPasswordError("")
    try {
      const res = await fetch("/api/admin/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: passwordTarget.id, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) { setPasswordError(data.error || "Failed to update password"); return }
      setCreateSuccess(`Password updated for ${passwordTarget.display_name || passwordTarget.username}`)
      setPasswordTarget(null)
      setNewPassword("")
    } catch { setPasswordError("Network error") } finally { setChangingPassword(false) }
  }

  const roleColor = (role: string) => {
    switch (role) {
      case "executive": return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "director": return "bg-red-500/10 text-red-500 border-red-500/20"
      case "operations_manager": return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "lead_developer": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
      case "developer": return "bg-teal-500/10 text-teal-400 border-teal-500/20"
      case "lead_moderator": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      case "community_moderator": return "bg-green-500/10 text-green-400 border-green-500/20"
      case "design_lead": return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      case "designer": return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
      case "content_manager": return "bg-orange-500/10 text-orange-400 border-orange-500/20"
      case "support_agent": return "bg-sky-500/10 text-sky-400 border-sky-500/20"
      case "trial": return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
      case "premium": return "bg-yellow-500/10 text-yellow-300 border-yellow-500/20"
      case "client": return "bg-muted text-muted-foreground border-border"
      default: return "bg-muted text-muted-foreground border-border"
    }
  }

  const roleName = (role: string) => {
    const found = AVAILABLE_ROLES.find(r => r.value === role)
    return found ? found.label : role
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Manage team members, create accounts for designers, and assign roles.</p>
        <Button size="sm" className="gap-2" onClick={() => setShowCreate(true)}>
          <UserPlus className="h-3.5 w-3.5" />
          Create Account
        </Button>
      </div>

      {createSuccess && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-400">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{createSuccess}</span>
          <button onClick={() => setCreateSuccess("")} className="ml-auto"><X className="h-3.5 w-3.5" /></button>
        </div>
      )}

      {/* Create Account Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Create New Account
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {createError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-400">
                <XCircle className="h-3.5 w-3.5 shrink-0" />
                {createError}
              </div>
            )}
            <div className="grid gap-2">
              <Label className="text-xs">Email</Label>
              <Input
                placeholder="designer@visoryx.com"
                type="email"
                value={createForm.email}
                onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label className="text-xs">Username</Label>
                <Input
                  placeholder="johndoe"
                  value={createForm.username}
                  onChange={e => setCreateForm(f => ({ ...f, username: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs">Display Name</Label>
                <Input
                  placeholder="John Doe"
                  value={createForm.displayName}
                  onChange={e => setCreateForm(f => ({ ...f, displayName: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="text-xs">Temporary Password</Label>
              <Input
                type="password"
                placeholder="Min 6 characters"
                value={createForm.password}
                onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs">Role</Label>
              <Select value={createForm.role} onValueChange={v => setCreateForm(f => ({ ...f, role: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {AVAILABLE_ROLES.map(r => (
                    <SelectItem key={r.value} value={r.value}>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">{r.label}</span>
                        <span className="text-[10px] text-muted-foreground">{r.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full gap-2"
              onClick={handleCreate}
              disabled={creating || !createForm.email || !createForm.username || !createForm.password}
            >
              {creating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />}
              {creating ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={!!passwordTarget} onOpenChange={(open) => { if (!open) { setPasswordTarget(null); setNewPassword(""); setPasswordError("") } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              Change Password
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {passwordTarget && (
              <p className="text-sm text-muted-foreground">
                Set a new password for <span className="font-medium text-foreground">{passwordTarget.display_name || passwordTarget.username}</span>
              </p>
            )}
            {passwordError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-400">
                <XCircle className="h-3.5 w-3.5 shrink-0" />
                {passwordError}
              </div>
            )}
            <div className="grid gap-2">
              <Label className="text-xs">New Password</Label>
              <Input
                type="password"
                placeholder="Min 6 characters"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                autoFocus
              />
            </div>
            <Button
              className="w-full gap-2"
              onClick={handlePasswordChange}
              disabled={changingPassword || newPassword.length < 6}
            >
              {changingPassword ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <KeyRound className="h-3.5 w-3.5" />}
              {changingPassword ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Role Management Dialog */}
      <Dialog open={!!editingMember} onOpenChange={(open) => { if (!open) setEditingMember(null) }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Roles - {editingMember?.display_name || editingMember?.username}</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">Select one or more roles. Multiple roles can be combined.</p>
          <div className="space-y-1.5 max-h-[340px] overflow-y-auto py-1">
            {AVAILABLE_ROLES.map((r) => {
              const isSelected = editingRoles.includes(r.value)
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setEditingRoles(prev => prev.includes(r.value) ? prev.filter(x => x !== r.value) : [...prev, r.value])}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border p-2.5 text-sm transition-all text-left",
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border/40 hover:border-border hover:bg-muted/30"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-[13px]">{r.label}</span>
                    <p className="text-[11px] text-muted-foreground">{r.description}</p>
                  </div>
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
          {editingRoles.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {editingRoles.map(r => (
                <Badge key={r} variant="outline" className={cn("text-[10px]", roleColor(r))}>
                  {roleName(r)}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditingMember(null)}>Cancel</Button>
            <Button
              size="sm"
              className="flex-1 gap-1.5"
              disabled={updatingRole || editingRoles.length === 0}
              onClick={async () => {
                if (!editingMember) return
                await handleRoleUpdate(editingMember.id, editingRoles)
                setEditingMember(null)
              }}
            >
              {updatingRole ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
              Save Roles ({editingRoles.length})
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Members List */}
      <div className="rounded-xl border border-border/40 overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-[1fr_140px_100px_60px_80px] items-center gap-3 border-b border-border/30 bg-muted/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Member</span>
          <span>Email</span>
          <span>Role</span>
          <span></span>
          <span className="text-right">Joined</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Users className="h-8 w-8 opacity-30 mb-2" />
            <p className="text-sm">No team members found</p>
          </div>
        ) : (
          <div className="divide-y divide-border/20">
            {members.map((member) => (
              <div key={member.id} className="grid grid-cols-[1fr_140px_100px_60px_80px] items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors">
                {/* Avatar + Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted/60 text-[11px] font-bold text-foreground/70">
                    {member.avatar_url ? (
                      <img src={member.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      (member.display_name || member.username || "?").charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium truncate">{member.display_name || member.username}</p>
                    <p className="text-[11px] text-muted-foreground truncate">@{member.username}</p>
                  </div>
                </div>

                {/* Email */}
                <p className="text-[12px] text-muted-foreground truncate">{member.email}</p>

                {/* Roles */}
                <div>
                  <button
                    onClick={() => { setEditingMember(member); setEditingRoles(member.roles?.length ? [...member.roles] : ["client"]) }}
                    className="group flex items-center gap-1 flex-wrap max-w-[160px]"
                    title="Click to manage roles"
                  >
                    <div className="flex flex-wrap gap-1">
                      {(member.roles?.length ? member.roles : ["client"]).slice(0, 2).map(r => (
                        <Badge key={r} variant="outline" className={cn("text-[10px] px-1.5 py-0 cursor-pointer", roleColor(r))}>
                          {roleName(r)}
                        </Badge>
                      ))}
                      {(member.roles?.length || 0) > 2 && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 cursor-pointer bg-muted/50">
                          +{member.roles.length - 2}
                        </Badge>
                      )}
                    </div>
                    <Pencil className="h-2.5 w-2.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>

                {/* Password */}
                <button
                  onClick={() => { setPasswordTarget(member); setNewPassword(""); setPasswordError("") }}
                  className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
                  title="Change password"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                </button>

                {/* Joined */}
                <p className="text-[11px] text-muted-foreground text-right">
                  {new Date(member.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground">
        Click role badges to manage. Multiple roles can be assigned. Chain of command: <span className="font-medium">Executive</span> {'>'} <span className="font-medium">Director</span> {'>'} <span className="font-medium">Ops Manager</span> {'>'} <span className="font-medium">Lead Dev</span> {'>'} <span className="font-medium">Dev</span> {'>'} <span className="font-medium">Lead Mod</span> {'>'} <span className="font-medium">Mod</span> {'>'} <span className="font-medium">Design Lead</span> {'>'} <span className="font-medium">Designer</span> {'>'} <span className="font-medium">Content Mgr</span> {'>'} <span className="font-medium">Support</span> {'>'} <span className="font-medium">Trial</span> {'>'} <span className="font-medium">Premium</span> {'>'} <span className="font-medium">Client</span>.
      </p>

      {/* Team Page Display Section */}
      <div className="rounded-xl border border-border/40 overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border/30 bg-muted/30 px-5 py-3.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Globe className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Meet the Creators</h3>
            <p className="text-[11px] text-muted-foreground">Choose who appears on the public /team page and set their display title and bio.</p>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {members.length === 0 && !loading ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No team members to display.</p>
          ) : (
            members.map((member) => (
              <div key={`team-display-${member.id}`} className="flex items-start gap-4 rounded-lg border border-border/30 p-4 transition-colors hover:bg-muted/10">
                {/* Toggle */}
                <label className="relative mt-1 inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={member.show_on_team || false}
                    onChange={async (e) => {
                      const val = e.target.checked
                      setMembers(m => m.map(x => x.id === member.id ? { ...x, show_on_team: val } : x))
                      await fetch("/api/admin/update-team-display", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId: member.id, show_on_team: val }),
                      })
                    }}
                    className="peer sr-only"
                  />
                  <div className="peer h-5 w-9 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-background after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full" />
                </label>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted/60 text-[10px] font-bold">
                      {member.avatar_url ? (
                        <img src={member.avatar_url} alt="" className="h-7 w-7 rounded-full object-cover" />
                      ) : (
                        (member.display_name || member.username || "?").charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="text-[13px] font-medium">{member.display_name || member.username}</span>
                    <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0", roleColor(member.roles[0] || "client"))}>
                      {roleName(member.roles[0] || "client")}
                    </Badge>
                  </div>
                  {member.show_on_team && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Display Title</Label>
                        <Input
                          placeholder="e.g. Founder & CEO"
                          value={member.team_title || ""}
                          onChange={e => setMembers(m => m.map(x => x.id === member.id ? { ...x, team_title: e.target.value } : x))}
                          onBlur={async (e) => {
                            await fetch("/api/admin/update-team-display", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ userId: member.id, team_title: e.target.value }),
                            })
                          }}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Short Bio</Label>
                        <Input
                          placeholder="e.g. Building brands that dominate"
                          value={member.team_bio || ""}
                          onChange={e => setMembers(m => m.map(x => x.id === member.id ? { ...x, team_bio: e.target.value } : x))}
                          onBlur={async (e) => {
                            await fetch("/api/admin/update-team-display", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ userId: member.id, team_bio: e.target.value }),
                            })
                          }}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

/* ==================== GENERAL TAB ==================== */
const statusOptions: OrderStatus[] = ["open", "delayed", "closed"]
const serviceConfig = [
  { key: "branding" as const, label: "Branding & Identity", icon: Shapes, description: "Logos, brand kits & visual identity" },
  { key: "community" as const, label: "Community & Discord", icon: MessageSquare, description: "Server setups, bots & community assets" },
  { key: "gaming" as const, label: "Gaming & Creator Packs", icon: Gamepad2, description: "Liveries, overlays, thumbnails & esports" },
  { key: "business" as const, label: "Business & Startup Kits", icon: Briefcase, description: "Pitch decks, business cards & pro graphics" },
  { key: "marketing" as const, label: "Marketing & Social Media", icon: Share2, description: "Social posts, ads, banners & promos" },
  { key: "uiAssets" as const, label: "UI & Visual Assets", icon: Layers, description: "UI elements, templates & icons" },
]

type ServiceStatusRow = { id: string; service_key: string; label: string; status: string; message: string }

function GeneralTab() {
  const { user, profile, isLoading } = useAuth()
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [serviceStatuses, setServiceStatuses] = useState<ServiceStatusRow[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isLoading && user && profile) {
      setSettings(getSettings())
      // Load service statuses from Supabase
      const supabase = createClient()
      if (supabase) {
        supabase.from("service_statuses").select("*").order("label").then(({ data }) => {
          if (data) setServiceStatuses(data)
        })
      }
    }
  }, [user, profile, isLoading])

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && settings) {
      const reader = new FileReader()
      reader.onloadend = () => { setSettings({ ...settings, logoUrl: reader.result as string }) }
      reader.readAsDataURL(file)
    }
  }

  const handleServiceStatusChange = (serviceKey: string, status: string) => {
    setServiceStatuses(prev => prev.map(s => s.service_key === serviceKey ? { ...s, status } : s))
  }

  const handleServiceMessageChange = (serviceKey: string, message: string) => {
    setServiceStatuses(prev => prev.map(s => s.service_key === serviceKey ? { ...s, message } : s))
  }

  const handleSave = async () => {
    if (!settings) return
    setIsSaving(true)
    updateSettings(settings)
    // Save service statuses to Supabase
    const supabase = createClient()
    if (supabase) {
      for (const svc of serviceStatuses) {
        await supabase.from("service_statuses").update({ status: svc.status, message: svc.message }).eq("id", svc.id)
      }
    }
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!settings) return <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Branding */}
      <div className="rounded-xl border border-border/40 bg-card/80 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10"><Building2 className="h-4 w-4 text-primary" /></div>
          <div>
            <h2 className="text-sm font-semibold">Company Branding</h2>
            <p className="text-[11px] text-muted-foreground">Name and logo</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Company Name</Label>
            <Input value={settings.companyName} onChange={(e) => setSettings({ ...settings, companyName: e.target.value })} placeholder="VisoryX" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Logo</Label>
            <div className="flex items-start gap-4">
              {settings.logoUrl ? (
                <div className="relative">
                  <div className="h-14 w-14 rounded-lg border border-border bg-background p-2 flex items-center justify-center">
                    <img src={settings.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                  </div>
                  <button onClick={() => { setSettings({ ...settings, logoUrl: null }); if (fileInputRef.current) fileInputRef.current.value = "" }} className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"><X className="h-3 w-3" /></button>
                </div>
              ) : (
                <div className="h-14 w-14 rounded-lg border-2 border-dashed border-border flex items-center justify-center"><ImageIcon className="h-5 w-5 text-muted-foreground" /></div>
              )}
              <div>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleLogoSelect} className="hidden" />
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="text-xs"><ImageIcon className="mr-1.5 h-3 w-3" />{settings.logoUrl ? "Change" : "Upload"}</Button>
                <p className="text-[10px] text-muted-foreground mt-1">PNG or SVG</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Status */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Service Status</h2>
        {serviceStatuses.map((svc) => {
          const configMatch = serviceConfig.find(c => c.key === svc.service_key)
          const Icon = configMatch?.icon || Layers
          const currentInfo = getOrderStatusInfo(svc.status as OrderStatus)
          return (
            <div key={svc.id} className="rounded-xl border border-border/40 bg-card/80 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50"><Icon className="h-4 w-4 text-muted-foreground" /></div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13px] font-semibold">{svc.label}</h3>
                </div>
                <div className={cn("flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium", currentInfo.bgColor)}>
                  <span className={cn("h-1.5 w-1.5 rounded-full", currentInfo.dotColor)} />
                  <span className={currentInfo.color}>{currentInfo.label}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {statusOptions.map((status) => {
                  const info = getOrderStatusInfo(status)
                  const StatusIcon = status === "open" ? CheckCircle : status === "delayed" ? AlertTriangle : XCircle
                  return (
                    <button key={status} type="button" onClick={() => handleServiceStatusChange(svc.service_key, status)}
                      className={cn("flex items-center justify-center gap-1.5 rounded-lg border p-2 text-xs transition-all", svc.status === status ? `${info.bgColor} border-2` : "border-border/50 hover:border-border")}
                    >
                      <StatusIcon className={cn("h-3 w-3", info.color)} />
                      <span className="font-medium">{info.label}</span>
                    </button>
                  )
                })}
              </div>
              <Input value={svc.message} onChange={(e) => handleServiceMessageChange(svc.service_key, e.target.value)} placeholder="Custom message (optional)" className="text-xs h-8" />
            </div>
          )
        })}
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={isSaving} className="gap-2 font-semibold">
          <Save className="h-3.5 w-3.5" />{isSaving ? "Saving..." : "Save Settings"}
        </Button>
        {saved && <span className="text-xs text-emerald-500 font-medium">Settings saved</span>}
      </div>
    </div>
  )
}

/* ==================== APPLICATIONS TAB ==================== */
type Application = { id: string; name: string; email: string; age: string; portfolio_url: string; skills: string; experience: string; status: string; created_at: string }

function ApplicationsTab() {
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Application | null>(null)

  useEffect(() => { loadApps() }, [])

  const loadApps = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase.from("applications").select("*").order("created_at", { ascending: false })
      setApps(data || [])
    } catch {} finally { setLoading(false) }
  }

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient()
    if (!supabase) return
    await supabase.from("applications").update({ status }).eq("id", id)
    await loadApps()
    if (selected?.id === id) setSelected(s => s ? { ...s, status } : null)
  }

  const statusColors: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-500",
    accepted: "bg-emerald-500/10 text-emerald-500",
    rejected: "bg-destructive/10 text-destructive",
  }

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{apps.length} application{apps.length !== 1 ? "s" : ""}</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      ) : apps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <ClipboardList className="h-10 w-10 opacity-30 mb-3" />
          <p className="text-sm font-medium">No applications yet</p>
          <p className="text-xs mt-1">Applications from /apply will appear here</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/40 bg-card/80 overflow-hidden">
          <div className="grid grid-cols-[1fr_120px_80px_100px] gap-4 border-b border-border/30 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Applicant</span><span>Date</span><span>Status</span><span className="text-right">Actions</span>
          </div>
          {apps.map((app) => (
            <div key={app.id} className="grid grid-cols-[1fr_120px_80px_100px] gap-4 items-center border-b border-border/10 px-5 py-3 text-sm hover:bg-muted/30 transition-colors">
              <button onClick={() => setSelected(app)} className="text-left min-w-0">
                <p className="font-medium text-[13px] truncate hover:text-primary transition-colors">{app.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{app.email}</p>
              </button>
              <span className="text-[11px] text-muted-foreground">{new Date(app.created_at).toLocaleDateString()}</span>
              <span className={cn("inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-medium capitalize", statusColors[app.status] || "bg-muted text-muted-foreground")}>{app.status}</span>
              <div className="flex gap-1 justify-end">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-emerald-500 hover:text-emerald-500" onClick={() => updateStatus(app.id, "accepted")} title="Accept"><Check className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => updateStatus(app.id, "rejected")} title="Reject"><XIcon className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle className="text-lg">Application from {selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-[11px] text-muted-foreground mb-0.5">Email</p><p className="font-medium">{selected.email}</p></div>
                <div><p className="text-[11px] text-muted-foreground mb-0.5">Age</p><p className="font-medium">{selected.age || "N/A"}</p></div>
              </div>
              {selected.portfolio_url && <div><p className="text-[11px] text-muted-foreground mb-0.5">Portfolio</p><a href={selected.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-[13px]">{selected.portfolio_url}</a></div>}
              {selected.skills && <div><p className="text-[11px] text-muted-foreground mb-0.5">Skills</p><p className="text-[13px]">{selected.skills}</p></div>}
              {selected.experience && <div><p className="text-[11px] text-muted-foreground mb-0.5">Experience</p><p className="text-[13px] leading-relaxed">{selected.experience}</p></div>}
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-xs" onClick={() => { updateStatus(selected.id, "accepted"); setSelected(null) }}><Check className="h-3 w-3" />Accept</Button>
                <Button size="sm" variant="destructive" className="gap-2 text-xs" onClick={() => { updateStatus(selected.id, "rejected"); setSelected(null) }}><XIcon className="h-3 w-3" />Reject</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ==================== ANNOUNCEMENTS TAB ==================== */
type Announcement = { id: string; title: string; message: string; type: string; status: string; priority: string; link: string | null; link_text: string | null; expires_at: string | null; created_at: string }

function AnnouncementsTab() {
  const [items, setItems] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Announcement | null>(null)
  const [formData, setFormData] = useState({ title: "", message: "", type: "info", status: "active", priority: "normal", link: "", link_text: "" })

  useEffect(() => { loadAnnouncements() }, [])

  const loadAnnouncements = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase.from("announcements").select("*").order("priority", { ascending: false })
      setItems(data || [])
    } catch {} finally { setLoading(false) }
  }

  const handleOpen = (item?: Announcement) => {
    if (item) {
      setEditing(item)
      setFormData({ title: item.title, message: item.message, type: item.type, status: item.status, priority: item.priority, link: item.link || "", link_text: item.link_text || "" })
    } else {
      setEditing(null)
      setFormData({ title: "", message: "", type: "info", status: "active", priority: "normal", link: "", link_text: "" })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    if (!supabase) return
    const payload = { ...formData, link: formData.link || null, link_text: formData.link_text || null, updated_at: new Date().toISOString() }
    if (editing) await supabase.from("announcements").update(payload).eq("id", editing.id)
    else await supabase.from("announcements").insert(payload)
    await loadAnnouncements()
    setIsDialogOpen(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement?")) return
    const supabase = createClient()
    if (!supabase) return
    await supabase.from("announcements").delete().eq("id", id)
    await loadAnnouncements()
  }

  const toggleActive = async (item: Announcement) => {
    const supabase = createClient()
    if (!supabase) return
    await supabase.from("announcements").update({ status: item.status === "active" ? "inactive" : "active" }).eq("id", item.id)
    await loadAnnouncements()
  }

  const typeColors: Record<string, string> = { info: "bg-sky-500/10 text-sky-500", warning: "bg-amber-500/10 text-amber-500", success: "bg-emerald-500/10 text-emerald-500", promo: "bg-primary/10 text-primary" }

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} announcement{items.length !== 1 ? "s" : ""}</p>
        <Button size="sm" onClick={() => handleOpen()} className="gap-2 text-xs font-semibold"><Plus className="h-3.5 w-3.5" />New Announcement</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Megaphone className="h-10 w-10 opacity-30 mb-3" />
          <p className="text-sm font-medium">No announcements</p>
          <p className="text-xs mt-1">Create announcements to show as banners on the site</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className={cn("rounded-xl border bg-card/80 p-4 transition-all", item.status === "active" ? "border-border/40" : "border-border/20 opacity-60")}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize", typeColors[item.type] || "bg-muted text-muted-foreground")}>{item.type}</span>
                    {item.status === "active" ? <span className="flex items-center gap-1 text-[10px] text-emerald-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Active</span> : <span className="text-[10px] text-muted-foreground">Hidden</span>}
                  </div>
                  <h3 className="font-semibold text-[13px]">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.message}</p>
                  {item.link && <p className="text-[11px] text-primary mt-1">{item.link_text || item.link}</p>}
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toggleActive(item)}>{item.status === "active" ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}</Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleOpen(item)}><Pencil className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="text-lg">{editing ? "Edit Announcement" : "New Announcement"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5"><Label className="text-xs">Title</Label><Input value={formData.title} onChange={(e) => setFormData(f => ({ ...f, title: e.target.value }))} required /></div>
            <div className="space-y-1.5"><Label className="text-xs">Message</Label><Textarea value={formData.message} onChange={(e) => setFormData(f => ({ ...f, message: e.target.value }))} rows={2} required /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Type</Label>
                <select value={formData.type} onChange={(e) => setFormData(f => ({ ...f, type: e.target.value }))} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm">
                  <option value="info">Info</option><option value="warning">Warning</option><option value="success">Success</option><option value="promo">Promo</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Priority</Label>
                <select value={formData.priority} onChange={(e) => setFormData(f => ({ ...f, priority: e.target.value }))} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm">
                  <option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Link URL (optional)</Label><Input value={formData.link} onChange={(e) => setFormData(f => ({ ...f, link: e.target.value }))} placeholder="https://..." /></div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1 font-semibold">{editing ? "Update" : "Create"}</Button>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ==================== PAYMENTS TAB ==================== */
function PaymentsTab() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadOrders() }, [])

  const loadOrders = async () => {
    setLoading(true)
    try { const data = await getOrders(); setOrders(data) } catch {} finally { setLoading(false) }
  }

  const togglePaid = async (order: Order) => {
    const supabase = createClient()
    if (!supabase) return
    await supabase.from("orders").update({ paid: !order.paid, payment_date: !order.paid ? new Date().toISOString() : null }).eq("id", order.id)
    await loadOrders()
  }

  const totalRevenue = orders.filter(o => o.paid).reduce((sum, o) => sum + (o.price || 0), 0)
  const pendingPayments = orders.filter(o => !o.paid && o.price).reduce((sum, o) => sum + (o.price || 0), 0)
  const paidCount = orders.filter(o => o.paid).length

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Revenue Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="rounded-xl border border-border/40 bg-card/80 p-5">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Total Revenue</p>
          <p className="mt-1 text-2xl font-bold text-emerald-500">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border/40 bg-card/80 p-5">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Pending</p>
          <p className="mt-1 text-2xl font-bold text-amber-500">${pendingPayments.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border/40 bg-card/80 p-5">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Paid Orders</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{paidCount}/{orders.length}</p>
        </div>
      </div>

      {/* Orders with payment info */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      ) : orders.filter(o => o.price).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <DollarSign className="h-10 w-10 opacity-30 mb-3" />
          <p className="text-sm font-medium">No priced orders yet</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/40 bg-card/80 overflow-hidden">
          <div className="grid grid-cols-[1fr_80px_100px_80px] gap-4 border-b border-border/30 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Order</span><span>Amount</span><span>Method</span><span className="text-right">Paid</span>
          </div>
          {orders.filter(o => o.price).map((order) => (
            <div key={order.id} className="grid grid-cols-[1fr_80px_100px_80px] gap-4 items-center border-b border-border/10 px-5 py-3 text-sm hover:bg-muted/30 transition-colors">
              <div className="min-w-0">
                <p className="font-medium text-[13px] truncate">{order.customer_name || "Unknown"}</p>
                <p className="text-[11px] text-muted-foreground truncate">{order.service_type}</p>
              </div>
              <span className="text-[13px] font-semibold">${order.price}</span>
              <span className="text-[11px] text-muted-foreground capitalize">{order.payment_method || "N/A"}</span>
              <div className="flex justify-end">
                <button onClick={() => togglePaid(order)} className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors", order.paid ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground hover:bg-amber-500/10 hover:text-amber-500")}>
                  {order.paid ? <><Check className="h-3 w-3" />Paid</> : <>Mark Paid</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ==================== SITE EDITOR TAB ==================== */
const DEFAULTS: Record<string, Record<string, string>> = {
  hero: { headline_1: "We design brands", headline_2: "that dominate", description: "Logos, liveries, branding, and digital graphics engineered for gaming communities, esports organizations, and visionary businesses worldwide.", cta_text: "Start a Project", cta_link: "/order" },
  footer: { tagline: "Premium design for gaming, esports & business.", discord: "https://discord.gg/Zeu8F7a2Rx", email: "contact@visoryx.com" },
}

function SiteEditorTab() {
  const [config, setConfig] = useState<Record<string, Record<string, string>>>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [tableExists, setTableExists] = useState(false)

  useEffect(() => { loadConfig() }, [])

  const loadConfig = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      if (!supabase) { setLoading(false); return }
      const { data, error } = await supabase.from("site_config").select("*")
      if (error) { setTableExists(false); setLoading(false); return }
      setTableExists(true)
      if (data && data.length > 0) {
        const merged = { ...DEFAULTS }
        for (const row of data) {
          try {
            const parsed = typeof row.value === "string" ? JSON.parse(row.value) : row.value
            if (typeof parsed === "object" && parsed !== null) {
              merged[row.key] = { ...(merged[row.key] || {}), ...parsed }
            }
          } catch { /* skip malformed rows */ }
        }
        setConfig(merged)
      }
    } catch { setTableExists(false) } finally { setLoading(false) }
  }

  const updateField = (section: string, key: string, value: string) => {
    setConfig(c => ({ ...c, [section]: { ...c[section], [key]: value } }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      if (!supabase) return
      if (tableExists) {
        for (const [section, fields] of Object.entries(config)) {
          await supabase.from("site_config").upsert({ key: section, value: fields, updated_at: new Date().toISOString() }, { onConflict: "key" })
        }
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {} finally { setSaving(false) }
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>

  const fields = [
    { section: "hero", key: "headline_1", label: "Hero Headline 1", placeholder: "We design brands" },
    { section: "hero", key: "headline_2", label: "Hero Headline 2", placeholder: "that dominate" },
    { section: "hero", key: "description", label: "Hero Description", placeholder: "Main description...", multiline: true },
    { section: "hero", key: "cta_text", label: "CTA Button Text", placeholder: "Start a Project" },
    { section: "hero", key: "cta_link", label: "CTA Link", placeholder: "/order" },
    { section: "footer", key: "tagline", label: "Footer Tagline", placeholder: "Premium design..." },
    { section: "footer", key: "discord", label: "Discord Link", placeholder: "https://discord.gg/..." },
    { section: "footer", key: "email", label: "Contact Email", placeholder: "contact@visoryx.com" },
  ]

  return (
    <div className="space-y-6 max-w-3xl">
      <p className="text-sm text-muted-foreground">Edit text content displayed on the public site. Changes take effect after saving.</p>
      {!tableExists && !loading && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>The site_config table has not been created yet. Edits are shown locally but won{"'"}t persist until the table is set up in your Supabase dashboard.</span>
        </div>
      )}

      {/* Hero section */}
      <div className="rounded-xl border border-border/40 bg-card/80 p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"><Globe className="h-4 w-4 text-primary" /></div>
          <h2 className="text-sm font-semibold">Hero Section</h2>
        </div>
        {fields.filter(f => f.section === "hero").map((f) => (
          <div key={`${f.section}-${f.key}`} className="space-y-1.5">
            <Label className="text-xs">{f.label}</Label>
            {f.multiline ? (
              <Textarea value={config[f.section]?.[f.key] || ""} onChange={(e) => updateField(f.section, f.key, e.target.value)} placeholder={f.placeholder} rows={3} />
            ) : (
              <Input value={config[f.section]?.[f.key] || ""} onChange={(e) => updateField(f.section, f.key, e.target.value)} placeholder={f.placeholder} />
            )}
          </div>
        ))}
      </div>

      {/* Footer section */}
      <div className="rounded-xl border border-border/40 bg-card/80 p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50"><Layers className="h-4 w-4 text-muted-foreground" /></div>
          <h2 className="text-sm font-semibold">Footer</h2>
        </div>
        {fields.filter(f => f.section === "footer").map((f) => (
          <div key={`${f.section}-${f.key}`} className="space-y-1.5">
            <Label className="text-xs">{f.label}</Label>
            <Input value={config[f.section]?.[f.key] || ""} onChange={(e) => updateField(f.section, f.key, e.target.value)} placeholder={f.placeholder} />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving} className="gap-2 font-semibold"><Save className="h-3.5 w-3.5" />{saving ? "Saving..." : "Save Changes"}</Button>
        {saved && <span className="text-xs text-emerald-500 font-medium">Content saved</span>}
      </div>
    </div>
  )
}
