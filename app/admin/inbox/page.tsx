"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Inbox,
  Search,
  Star,
  StarOff,
  Mail,
  MailOpen,
  Archive,
  Reply,
  RefreshCw,
  Trash2,
  ChevronLeft,
  Clock,
  AlertCircle,
  MessageSquare,
  Users,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { sendPlainReply } from "@/app/actions/email"

type InboundEmail = {
  id: string
  from_email: string
  from_name: string | null
  to_email: string
  subject: string
  body_text: string | null
  body_html: string | null
  status: "unread" | "read" | "replied" | "archived"
  starred: boolean
  admin_notes: string | null
  created_at: string
  updated_at: string
  source: "email" | "contact_form"
  inquiry_type?: string
}

const STATUS_COLORS: Record<string, string> = {
  unread: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  read: "bg-muted text-muted-foreground border-border",
  replied: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  archived: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  unread: <Mail className="h-3 w-3" />,
  read: <MailOpen className="h-3 w-3" />,
  replied: <Reply className="h-3 w-3" />,
  archived: <Archive className="h-3 w-3" />,
}

export default function AdminInboxPage() {
  const { profile } = useAuth()
  const isAdmin = profile?.roles?.some((r: string) =>
    ["executive", "director"].includes(r)
  )
  const supabase = useMemo(() => createClient(), [])

  const [emails, setEmails] = useState<InboundEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<"all" | "email" | "contact_form">("all")
  const [selectedEmail, setSelectedEmail] = useState<InboundEmail | null>(null)
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyBody, setReplyBody] = useState("")
  const [replySending, setReplySending] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const fetchEmails = useCallback(async () => {
    // Fetch inbound emails
    const { data: inboundData } = await supabase
      .from("inbound_emails")
      .select("*")
      .order("created_at", { ascending: false })

    const inboundEmails: InboundEmail[] = (inboundData || []).map((e: Record<string, unknown>) => ({
      ...e,
      source: "email" as const,
    })) as InboundEmail[]

    // Fetch contact form submissions
    const { data: contactData } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false })

    const contactEmails: InboundEmail[] = (contactData || []).map((c: Record<string, unknown>) => ({
      id: c.id as string,
      from_email: c.email as string,
      from_name: c.name as string,
      to_email: "contact@visoryx.design",
      subject: (c.subject as string) || `Contact: ${c.inquiry_type || "General"}`,
      body_text: c.message as string,
      body_html: null,
      status: (c.status === "new" ? "unread" : c.status === "responded" ? "replied" : c.status === "reviewed" ? "read" : c.status) as InboundEmail["status"],
      starred: false,
      admin_notes: null,
      created_at: c.created_at as string,
      updated_at: c.created_at as string,
      source: "contact_form" as const,
      inquiry_type: c.inquiry_type as string,
    }))

    // Merge and sort by date
    const merged = [...inboundEmails, ...contactEmails].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    setEmails(merged)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchEmails()
  }, [fetchEmails])

  const handleRefresh = async () => {
    setRefreshing(true)
    // Trigger email sync from Resend API before refreshing
    try {
      await fetch("/api/webhooks/resend/inbound")
    } catch {
      // sync failed silently, still refresh from DB
    }
    await fetchEmails()
    setRefreshing(false)
    toast.success("Inbox refreshed")
  }

  const updateStatus = async (id: string, status: string) => {
    const email = emails.find((e) => e.id === id)
    const table = email?.source === "contact_form" ? "contact_submissions" : "inbound_emails"
    const contactStatusMap: Record<string, string> = {
      unread: "new",
      read: "reviewed",
      replied: "responded",
      archived: "archived",
    }
    const statusVal = email?.source === "contact_form"
      ? (contactStatusMap[status] || status)
      : status
    const updatePayload: Record<string, string> = { status: statusVal }
    if (table === "inbound_emails") {
      updatePayload.updated_at = new Date().toISOString()
    }
    const { error } = await supabase
      .from(table)
      .update(updatePayload)
      .eq("id", id)

    if (!error) {
      setEmails((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, status: status as InboundEmail["status"] } : e
        )
      )
      if (selectedEmail?.id === id) {
        setSelectedEmail((prev) => prev ? { ...prev, status: status as InboundEmail["status"] } : null)
      }
      toast.success(`Marked as ${status}`)
    }
  }

  const toggleStar = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("inbound_emails")
      .update({ starred: !current })
      .eq("id", id)

    if (!error) {
      setEmails((prev) =>
        prev.map((e) => (e.id === id ? { ...e, starred: !current } : e))
      )
      if (selectedEmail?.id === id) {
        setSelectedEmail((prev) => prev ? { ...prev, starred: !current } : null)
      }
    }
  }

  const deleteEmail = async (id: string) => {
    const email = emails.find((e) => e.id === id)
    const table = email?.source === "contact_form" ? "contact_submissions" : "inbound_emails"
    const { error } = await supabase.from(table).delete().eq("id", id)
    if (!error) {
      setEmails((prev) => prev.filter((e) => e.id !== id))
      if (selectedEmail?.id === id) setSelectedEmail(null)
      toast.success("Email deleted")
    }
  }

  const openEmail = async (email: InboundEmail) => {
    setSelectedEmail(email)
    if (email.status === "unread") {
      await updateStatus(email.id, "read")
    }
  }

  const handleReply = async () => {
    if (!selectedEmail || !replyBody.trim()) return
    setReplySending(true)
    try {
      const result = await sendPlainReply(
        selectedEmail.from_email,
        `Re: ${selectedEmail.subject}`,
        replyBody,
        "VisoryX",
        "contact@visoryx.design"
      )
      if (result) {
        toast.success(`Reply sent to ${selectedEmail.from_email}`)
        await updateStatus(selectedEmail.id, "replied")
        setReplyOpen(false)
        setReplyBody("")
      } else {
        toast.error("Failed to send reply")
      }
    } catch {
      toast.error("Failed to send reply")
    } finally {
      setReplySending(false)
    }
  }

  // Filter & search
  const filtered = emails.filter((e) => {
    if (sourceFilter !== "all" && e.source !== sourceFilter) return false
    if (filter === "unread" && e.status !== "unread") return false
    if (filter === "starred" && !e.starred) return false
    if (filter === "replied" && e.status !== "replied") return false
    if (filter === "archived" && e.status !== "archived") return false
    if (search) {
      const q = search.toLowerCase()
      return (
        e.from_email.toLowerCase().includes(q) ||
        (e.from_name || "").toLowerCase().includes(q) ||
        e.subject.toLowerCase().includes(q) ||
        (e.body_text || "").toLowerCase().includes(q)
      )
    }
    return true
  })

  const unreadCount = emails.filter((e) => e.status === "unread").length

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 7) return `${days}d ago`
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  if (!isAdmin) return null

  // Detail view
  if (selectedEmail) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedEmail(null)}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Inbox
        </Button>

        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold leading-tight text-balance">
                  {selectedEmail.subject}
                </CardTitle>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {selectedEmail.from_name || selectedEmail.from_email}
                  </span>
                  {selectedEmail.from_name && (
                    <span className="text-xs">{"<"}{selectedEmail.from_email}{">"}</span>
                  )}
                  <span className="text-xs">to {selectedEmail.to_email}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  {selectedEmail.source === "contact_form" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-2 py-0.5 text-[11px] font-medium text-violet-400">
                      <MessageSquare className="h-3 w-3" />
                      Contact Form{selectedEmail.inquiry_type ? ` - ${selectedEmail.inquiry_type}` : ""}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-400">
                      <Mail className="h-3 w-3" />
                      Inbound Email
                    </span>
                  )}
                  <Badge
                    variant="outline"
                    className={cn("gap-1 text-[10px] uppercase tracking-wider", STATUS_COLORS[selectedEmail.status])}
                  >
                    {STATUS_ICONS[selectedEmail.status]}
                    {selectedEmail.status}
                  </Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(selectedEmail.created_at).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => toggleStar(selectedEmail.id, selectedEmail.starred)}
                >
                  {selectedEmail.starred ? (
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ) : (
                    <StarOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateStatus(selectedEmail.id, "archived")}
                >
                  <Archive className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => deleteEmail(selectedEmail.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email body */}
            <div className="rounded-lg border border-border/50 bg-muted/30 p-5">
              {selectedEmail.body_html ? (
                <iframe
                  srcDoc={selectedEmail.body_html}
                  className="w-full min-h-[300px] border-0 rounded"
                  sandbox="allow-same-origin"
                  title="Email content"
                />
              ) : (
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                  {selectedEmail.body_text || "(Empty email body)"}
                </pre>
              )}
            </div>

            {/* Reply section */}
            <div className="flex gap-2">
              <Button
                onClick={() => setReplyOpen(!replyOpen)}
                className="gap-1.5"
                size="sm"
              >
                <Reply className="h-3.5 w-3.5" />
                Reply
              </Button>
              {selectedEmail.status !== "read" && selectedEmail.status !== "unread" ? null : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateStatus(
                      selectedEmail.id,
                      selectedEmail.status === "unread" ? "read" : "unread"
                    )
                  }
                  className="gap-1.5"
                >
                  {selectedEmail.status === "unread" ? (
                    <><MailOpen className="h-3.5 w-3.5" /> Mark Read</>
                  ) : (
                    <><Mail className="h-3.5 w-3.5" /> Mark Unread</>
                  )}
                </Button>
              )}
            </div>

            {replyOpen && (
              <div className="space-y-3 rounded-lg border border-border/50 bg-card p-4">
                <p className="text-xs text-muted-foreground">
                  Replying to <span className="font-medium text-foreground">{selectedEmail.from_email}</span> from contact@visoryx.design
                </p>
                <Textarea
                  placeholder="Write your reply..."
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setReplyOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleReply}
                    disabled={replySending || !replyBody.trim()}
                    className="gap-1.5"
                  >
                    {replySending ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Reply className="h-3.5 w-3.5" />
                    )}
                    Send Reply
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // List view
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inbox</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}` : "No unread messages"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="gap-1.5"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Source tabs */}
      <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-muted/30 p-1 w-fit">
        {[
          { value: "all" as const, label: "All", icon: Inbox },
          { value: "email" as const, label: "Emails", icon: Mail },
          { value: "contact_form" as const, label: "Contact Form", icon: MessageSquare },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSourceFilter(tab.value)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              sourceFilter === tab.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search emails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[140px] h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Mail</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="starred">Starred</SelectItem>
            <SelectItem value="replied">Replied</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Email list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          {emails.length === 0 ? (
            <>
              <Inbox className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No emails yet</p>
              <p className="mt-1 text-xs text-muted-foreground/60 max-w-xs">
                Configure the Resend inbound webhook to start receiving emails here.
              </p>
            </>
          ) : (
            <>
              <AlertCircle className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No matching emails</p>
              <p className="mt-1 text-xs text-muted-foreground/60">Try adjusting your search or filter</p>
            </>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-border/50 overflow-hidden divide-y divide-border/50">
          {filtered.map((email) => (
            <button
              key={email.id}
              onClick={() => openEmail(email)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40",
                email.status === "unread" && "bg-primary/[0.03]"
              )}
            >
              {/* Star */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleStar(email.id, email.starred)
                }}
                className="shrink-0"
              >
                {email.starred ? (
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                ) : (
                  <Star className="h-4 w-4 text-muted-foreground/30 hover:text-muted-foreground" />
                )}
              </button>

              {/* Status dot */}
              <div className="shrink-0">
                {email.status === "unread" ? (
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-transparent" />
                )}
              </div>

              {/* Source badge */}
              <div className="shrink-0">
                {email.source === "contact_form" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-1.5 py-0.5 text-[10px] font-medium text-violet-400">
                    <MessageSquare className="h-2.5 w-2.5" />
                    Form
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">
                    <Mail className="h-2.5 w-2.5" />
                    Email
                  </span>
                )}
              </div>

              {/* Sender */}
              <div className="w-36 shrink-0 truncate">
                <span
                  className={cn(
                    "text-sm",
                    email.status === "unread"
                      ? "font-semibold text-foreground"
                      : "font-medium text-muted-foreground"
                  )}
                >
                  {email.from_name || email.from_email.split("@")[0]}
                </span>
              </div>

              {/* Subject + preview */}
              <div className="flex-1 min-w-0 flex items-baseline gap-2">
                <span
                  className={cn(
                    "truncate text-sm",
                    email.status === "unread"
                      ? "font-semibold text-foreground"
                      : "text-foreground"
                  )}
                >
                  {email.subject}
                </span>
                <span className="truncate text-xs text-muted-foreground/60">
                  {(email.body_text || "").slice(0, 80)}
                </span>
              </div>

              {/* Status badge */}
              {email.status === "replied" && (
                <Badge
                  variant="outline"
                  className={cn("shrink-0 gap-1 text-[10px] uppercase tracking-wider", STATUS_COLORS.replied)}
                >
                  <Reply className="h-2.5 w-2.5" />
                  replied
                </Badge>
              )}

              {/* Date */}
              <span className="shrink-0 text-xs text-muted-foreground w-16 text-right">
                {formatDate(email.created_at)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
