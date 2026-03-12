"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  sendManualPaymentReceipt,
  sendManualReviewRequest,
  sendNewsletterEmail,
  sendCustomEmail,
} from "@/app/actions/email"
import {
  Mail,
  Send,
  Receipt,
  Star,
  Newspaper,
  Loader2,
  Users,
  CheckCircle,
  AlertCircle,
  Monitor,
  Smartphone,
  Eye,
  SendHorizontal,
} from "lucide-react"
import type { EmailTemplate } from "@/lib/email-notifications"
import { EMAIL_TEMPLATES, interpolate } from "@/lib/email-notifications"

// ============= TEMPLATE OPTIONS =============
const TEMPLATE_OPTIONS: { value: EmailTemplate; label: string; category: string }[] = [
  { value: "welcome", label: "Welcome Email", category: "General" },
  { value: "staff_welcome", label: "Staff Welcome (New Hire)", category: "Staff" },
  { value: "order_confirmation", label: "Order Confirmation", category: "Orders" },
  { value: "order_status_update", label: "Order Status Update", category: "Orders" },
  { value: "order_delivered", label: "Order Delivered", category: "Orders" },
  { value: "order_cancelled", label: "Order Cancelled", category: "Orders" },
  { value: "revision_request", label: "Revision Request", category: "Orders" },
  { value: "payment_receipt", label: "Payment Receipt", category: "Payments" },
  { value: "refund_issued", label: "Refund Issued", category: "Payments" },
  { value: "review_request", label: "Review Request", category: "Follow-up" },
  { value: "promotion", label: "Promotion / Sale", category: "Marketing" },
  { value: "visoryx_intro", label: "VisoryX Introduction", category: "Marketing" },
  { value: "affiliation_request", label: "Affiliation Request", category: "Marketing" },
  { value: "password_reset", label: "Password Reset", category: "Account" },
  { value: "account_suspended", label: "Account Suspended", category: "Account" },
  { value: "account_reactivated", label: "Account Reactivated", category: "Account" },
  { value: "ticket_response", label: "Ticket Response", category: "Support" },
  { value: "application_received", label: "Application Received", category: "Applications" },
  { value: "application_accepted", label: "Application Accepted", category: "Applications" },
  { value: "application_rejected", label: "Application Rejected", category: "Applications" },
]

// ============= DEFAULT DATA =============
function getDefaultData(email?: string): Record<string, string | number> {
  return {
    customerName: "Customer",
    applicantName: "Applicant",
    orderId: "VX-000000",
    serviceName: "Design Service",
    amount: "$0.00",
    status: "Updated",
    statusMessage: "",
    designerName: "Designer",
    daysAgo: "3",
    resetLink: "https://visoryx.design/auth/reset-password",
    role: "Designer",
    adminNotes: "",
    recipientName: "your organization",
    subject: "VisoryX Update",
    content: "",
    email: email || "customer@example.com",
    paymentMethod: "card",
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    estimatedDelivery: "3-5 business days",
    staffName: "New Staff Member",
    staffEmail: "staff@example.com",
    tempPassword: "ChangeMe123!",
    ticketId: "TK-000000",
    responseMessage: "Thank you for reaching out. We have looked into your issue and...",
    reason: "No reason specified",
    revisionNotes: "Please adjust the colors and layout per the client's feedback.",
    recipientName: "there",
  }
}

// ============= BUILD HTML PREVIEW (client-side mirror of server HTML builder) =============
function buildPreviewHtml(template: EmailTemplate, data: Record<string, string | number>): string {
  const tpl = EMAIL_TEMPLATES[template]
  if (!tpl) return ""

  const body = interpolate(tpl.body, data)
  const subject = interpolate(tpl.subject, data)

  const lines = body.split("\n")
  const htmlLines: string[] = []
  let inList = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed === "") {
      if (inList) { htmlLines.push("</ul>"); inList = false }
      htmlLines.push('<div style="height:12px;"></div>')
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) { htmlLines.push('<ul style="margin:8px 0;padding-left:20px;">'); inList = true }
      htmlLines.push(`<li style="color:#374151;font-size:14px;line-height:1.7;margin-bottom:4px;">${trimmed.slice(2)}</li>`)
    } else if (trimmed.startsWith("Order Details:") || trimmed.startsWith("Next steps:") || trimmed.startsWith("Here's what you can do:")) {
      htmlLines.push(`<p style="margin:16px 0 8px;color:#111827;font-size:14px;font-weight:600;line-height:1.6;">${trimmed}</p>`)
    } else if (trimmed.match(/^https?:\/\//) || trimmed.includes("https://")) {
      const urlMatch = trimmed.match(/(https?:\/\/[^\s]+)/)
      if (urlMatch) {
        const url = urlMatch[1]
        const label = trimmed.replace(url, "").replace(/[:\-]/g, "").trim() || "View Now"
        htmlLines.push(`<p style="margin:4px 0;font-size:14px;line-height:1.7;color:#374151;">${label} <a href="${url}" style="color:#2563eb;text-decoration:underline;font-weight:500;">${url.replace("https://visoryx.design", "visoryx.design")}</a></p>`)
      } else {
        htmlLines.push(`<p style="margin:4px 0;font-size:14px;line-height:1.7;color:#374151;">${trimmed}</p>`)
      }
    } else {
      htmlLines.push(`<p style="margin:0 0 6px;color:#374151;font-size:14px;line-height:1.7;">${trimmed}</p>`)
    }
  }
  if (inList) htmlLines.push("</ul>")
  const htmlBody = htmlLines.join("\n")

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f3f4f6;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="background:#111827;border-radius:12px 12px 0 0;padding:28px 32px;text-align:center;">
          <h1 style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">VisoryX</h1>
          <p style="margin:4px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;color:#9ca3af;letter-spacing:1.5px;text-transform:uppercase;">Design Beyond Vision</p>
        </td></tr>
        <tr><td style="height:3px;background:linear-gradient(90deg,#2563eb,#7c3aed,#2563eb);"></td></tr>
        <tr><td style="background:#ffffff;padding:32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          ${htmlBody}
        </td></tr>
        <tr><td style="background:#f9fafb;border-top:1px solid #e5e7eb;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;">
          <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#6b7280;">VisoryX Design Studio</p>
          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;color:#9ca3af;">
            <a href="https://visoryx.design" style="color:#2563eb;text-decoration:none;">visoryx.design</a>
          </p>
        </td></tr>
      </table>
      <p style="margin:16px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;color:#9ca3af;text-align:center;">Subject: ${subject}</p>
    </td></tr>
  </table>
</body>
</html>`
}

// ============= EMAIL PREVIEW COMPONENT =============
function EmailPreview({ template, data }: { template: EmailTemplate; data: Record<string, string | number> }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop")

  const html = useMemo(() => buildPreviewHtml(template, data), [template, data])

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-none pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Eye className="h-4 w-4 text-primary" />
            Live Preview
          </CardTitle>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-0.5">
            <button
              onClick={() => setDevice("desktop")}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors ${
                device === "desktop" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setDevice("mobile")}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors ${
                device === "mobile" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-4">
        <div className="flex h-full items-start justify-center overflow-auto rounded-lg border border-border bg-muted/30 p-4">
          <div
            className="transition-all duration-300 rounded-lg overflow-hidden shadow-sm border border-border/50"
            style={{ width: device === "mobile" ? 375 : "100%", maxWidth: 620 }}
          >
            <iframe
              srcDoc={html}
              title="Email preview"
              className="w-full border-0 bg-white"
              style={{ height: 520 }}
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============= MAIN PAGE =============
export default function AdminEmailPage() {
  const { profile, isLoading } = useAuth()
  const router = useRouter()
  const isAdmin = profile?.roles?.includes("executive") || profile?.roles?.includes("director")

  // Shared preview state -- updated by any tab
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate>("welcome")
  const [previewData, setPreviewData] = useState<Record<string, string | number>>(getDefaultData(profile?.email))

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/admin/dashboard")
    }
  }, [isLoading, isAdmin, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const handleQuickSendPreview = useCallback((t: EmailTemplate, d: Record<string, string | number>) => {
    setPreviewTemplate(t)
    setPreviewData(d)
  }, [])

  const handleReceiptPreview = useCallback((d: Record<string, string | number>) => {
    setPreviewTemplate("payment_receipt")
    setPreviewData(d)
  }, [])

  const handleReviewPreview = useCallback((d: Record<string, string | number>) => {
    setPreviewTemplate("review_request")
    setPreviewData(d)
  }, [])

  const handleNewsletterPreview = useCallback((d: Record<string, string | number>) => {
    setPreviewTemplate("newsletter")
    setPreviewData(d)
  }, [])

  if (!isAdmin) return null

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Send Controls */}
        <div className="space-y-0">
          <Tabs defaultValue="quick-send" className="space-y-4">
            <TabsList className="inline-flex h-9 w-auto gap-1 bg-muted/50 p-1 rounded-lg">
              <TabsTrigger value="quick-send" className="gap-1.5 rounded-md px-3 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Send className="h-3.5 w-3.5" />
                Quick Send
              </TabsTrigger>
              <TabsTrigger value="receipt" className="gap-1.5 rounded-md px-3 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Receipt className="h-3.5 w-3.5" />
                Receipt
              </TabsTrigger>
              <TabsTrigger value="review" className="gap-1.5 rounded-md px-3 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Star className="h-3.5 w-3.5" />
                Review
              </TabsTrigger>
              <TabsTrigger value="newsletter" className="gap-1.5 rounded-md px-3 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Newspaper className="h-3.5 w-3.5" />
                Newsletter
              </TabsTrigger>
            </TabsList>

            <TabsContent value="quick-send">
              <QuickSendTab
                onPreviewChange={handleQuickSendPreview}
                userEmail={profile?.email}
              />
            </TabsContent>
            <TabsContent value="receipt">
              <PaymentReceiptTab
                onPreviewChange={handleReceiptPreview}
                userEmail={profile?.email}
              />
            </TabsContent>
            <TabsContent value="review">
              <ReviewRequestTab
                onPreviewChange={handleReviewPreview}
                userEmail={profile?.email}
              />
            </TabsContent>
            <TabsContent value="newsletter">
              <NewsletterTab
                onPreviewChange={handleNewsletterPreview}
                userEmail={profile?.email}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: Live Preview */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <EmailPreview template={previewTemplate} data={previewData} />
        </div>
      </div>
    </div>
  )
}

// ============= QUICK SEND TAB =============
function QuickSendTab({
  onPreviewChange,
  userEmail,
}: {
  onPreviewChange: (template: EmailTemplate, data: Record<string, string | number>) => void
  userEmail?: string
}) {
  const [email, setEmail] = useState("")
  const [template, setTemplate] = useState<EmailTemplate>("welcome")
  const [senderName, setSenderName] = useState("VisoryX")
  const [senderEmail, setSenderEmail] = useState("support@visoryx.design")
  const [sending, setSending] = useState(false)
  const [sendingTest, setSendingTest] = useState(false)
  const [customData, setCustomData] = useState("")

  // Update preview whenever template or data changes
  useEffect(() => {
    const data = getDefaultData(email)
    if (customData.trim()) {
      try {
        const parsed = JSON.parse(customData)
        Object.assign(data, parsed)
      } catch { /* ignore parse errors for preview */ }
    }
    onPreviewChange(template, data)
  }, [template, customData, email, onPreviewChange])

  const buildData = () => {
    const data = getDefaultData(email)
    if (customData.trim()) {
      try {
        const parsed = JSON.parse(customData)
        return { ...data, ...parsed }
      } catch {
        toast.error("Invalid JSON in custom data field")
        return null
      }
    }
    return data
  }

  const handleSend = async () => {
    if (!email) { toast.error("Enter a recipient email"); return }
    const data = buildData()
    if (!data) return
    setSending(true)
    try {
      const result = await sendCustomEmail(email, template, data, senderName, senderEmail)
      if (result) {
        toast.success(`Sent "${TEMPLATE_OPTIONS.find(t => t.value === template)?.label}" to ${email}`)
        setEmail("")
      } else {
        toast.error("Failed to send email")
      }
    } catch {
      toast.error("Failed to send email")
    } finally {
      setSending(false)
    }
  }

  const handleTestSend = async () => {
    if (!userEmail) { toast.error("No email on your profile"); return }
    const data = buildData()
    if (!data) return
    setSendingTest(true)
    try {
      const result = await sendCustomEmail(userEmail, template, data, senderName, senderEmail)
      if (result) toast.success(`Test email sent to ${userEmail}`)
      else toast.error("Failed to send test email")
    } catch {
      toast.error("Failed to send test email")
    } finally {
      setSendingTest(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5 text-primary" />
          Quick Send
        </CardTitle>
        <CardDescription>Send any email template to a specific address with custom data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="qs-email">Recipient Email</Label>
            <Input
              id="qs-email"
              type="email"
              placeholder="customer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Template</Label>
            <Select value={template} onValueChange={(v) => setTemplate(v as EmailTemplate)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Sender Name</Label>
            <Input
              placeholder="VisoryX"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Sender Email</Label>
            <Input
              type="email"
              placeholder="support@visoryx.design"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="qs-data">Custom Data (JSON, optional)</Label>
          <Textarea
            id="qs-data"
            placeholder={'{"customerName": "John", "orderId": "VX-ABC123"}'}
            value={customData}
            onChange={(e) => setCustomData(e.target.value)}
            className="font-mono text-sm"
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Override template variables with a JSON object. Leave blank to use defaults.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSend} disabled={sending} className="gap-2">
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send Email
          </Button>
          <Button variant="outline" onClick={handleTestSend} disabled={sendingTest} className="gap-2">
            {sendingTest ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
            Test to Self
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ============= PAYMENT RECEIPT TAB =============
function PaymentReceiptTab({
  onPreviewChange,
  userEmail,
}: {
  onPreviewChange: (data: Record<string, string | number>) => void
  userEmail?: string
}) {
  const [form, setForm] = useState({
    email: "",
    customerName: "",
    orderId: "",
    serviceName: "",
    amount: "",
    paymentMethod: "card",
  })
  const [senderName, setSenderName] = useState("VisoryX")
  const [senderEmail, setSenderEmail] = useState("support@visoryx.design")
  const [sending, setSending] = useState(false)
  const [sendingTest, setSendingTest] = useState(false)

  useEffect(() => {
    onPreviewChange({
      ...getDefaultData(form.email),
      customerName: form.customerName || "Customer",
      orderId: form.orderId || "VX-000000",
      serviceName: form.serviceName || "Design Service",
      amount: form.amount || "$0.00",
      paymentMethod: form.paymentMethod,
    })
  }, [form, onPreviewChange])

  const handleSend = async () => {
    if (!form.email || !form.customerName || !form.orderId) {
      toast.error("Fill in all required fields"); return
    }
    setSending(true)
    try {
      const result = await sendManualPaymentReceipt(form.email, form.customerName, form.orderId, form.serviceName || "Design Service", form.amount || "$0.00", form.paymentMethod, senderName, senderEmail)
      if (result) {
        toast.success(`Payment receipt sent to ${form.email}`)
        setForm({ email: "", customerName: "", orderId: "", serviceName: "", amount: "", paymentMethod: "card" })
      } else {
        toast.error("Failed to send receipt")
      }
    } catch {
      toast.error("Failed to send receipt")
    } finally {
      setSending(false)
    }
  }

  const handleTestSend = async () => {
    if (!userEmail) { toast.error("No email on your profile"); return }
    setSendingTest(true)
    try {
      const result = await sendManualPaymentReceipt(userEmail, form.customerName || "Test User", form.orderId || "VX-TEST", form.serviceName || "Design Service", form.amount || "$0.00", form.paymentMethod, senderName, senderEmail)
      if (result) toast.success(`Test receipt sent to ${userEmail}`)
      else toast.error("Failed to send test receipt")
    } catch {
      toast.error("Failed to send test receipt")
    } finally {
      setSendingTest(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-emerald-500" />
          Send Payment Receipt
        </CardTitle>
        <CardDescription>Manually send a payment receipt to a customer</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Recipient Email *</Label>
            <Input type="email" placeholder="customer@example.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label>Customer Name *</Label>
            <Input placeholder="John Doe" value={form.customerName} onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label>Order ID *</Label>
            <Input placeholder="VX-ABC123" value={form.orderId} onChange={(e) => setForm((f) => ({ ...f, orderId: e.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label>Service Name</Label>
            <Input placeholder="ERLC Police Livery Pack" value={form.serviceName} onChange={(e) => setForm((f) => ({ ...f, serviceName: e.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label>Amount</Label>
            <Input placeholder="$49.99" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label>Payment Method</Label>
            <Select value={form.paymentMethod} onValueChange={(v) => setForm((f) => ({ ...f, paymentMethod: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="robux">Robux</SelectItem>
                <SelectItem value="crypto">Crypto</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Sender Name</Label>
            <Input placeholder="VisoryX" value={senderName} onChange={(e) => setSenderName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Sender Email</Label>
            <Input type="email" placeholder="support@visoryx.design" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSend} disabled={sending} className="gap-2">
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Receipt className="h-4 w-4" />}
            Send Receipt
          </Button>
          <Button variant="outline" onClick={handleTestSend} disabled={sendingTest} className="gap-2">
            {sendingTest ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
            Test to Self
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ============= REVIEW REQUEST TAB =============
function ReviewRequestTab({
  onPreviewChange,
  userEmail,
}: {
  onPreviewChange: (data: Record<string, string | number>) => void
  userEmail?: string
}) {
  const [form, setForm] = useState({ email: "", customerName: "", orderId: "" })
  const [senderName, setSenderName] = useState("VisoryX")
  const [senderEmail, setSenderEmail] = useState("support@visoryx.design")
  const [sending, setSending] = useState(false)
  const [sendingTest, setSendingTest] = useState(false)

  useEffect(() => {
    onPreviewChange({
      ...getDefaultData(form.email),
      customerName: form.customerName || "Customer",
      orderId: form.orderId || "VX-000000",
      daysAgo: "a few",
    })
  }, [form, onPreviewChange])

  const handleSend = async () => {
    if (!form.email || !form.customerName || !form.orderId) {
      toast.error("Fill in all required fields"); return
    }
    setSending(true)
    try {
      const result = await sendManualReviewRequest(form.email, form.customerName, form.orderId, senderName, senderEmail)
      if (result) {
        toast.success(`Review request sent to ${form.email}`)
        setForm({ email: "", customerName: "", orderId: "" })
      } else {
        toast.error("Failed to send review request")
      }
    } catch {
      toast.error("Failed to send review request")
    } finally {
      setSending(false)
    }
  }

  const handleTestSend = async () => {
    if (!userEmail) { toast.error("No email on your profile"); return }
    setSendingTest(true)
    try {
      const result = await sendManualReviewRequest(userEmail, form.customerName || "Test User", form.orderId || "VX-TEST", senderName, senderEmail)
      if (result) toast.success(`Test review request sent to ${userEmail}`)
      else toast.error("Failed to send test")
    } catch {
      toast.error("Failed to send test")
    } finally {
      setSendingTest(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-500" />
          Send Review Request
        </CardTitle>
        <CardDescription>Ask a customer to leave a review after delivery</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Recipient Email *</Label>
            <Input type="email" placeholder="customer@example.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label>Customer Name *</Label>
            <Input placeholder="John Doe" value={form.customerName} onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label>Order ID *</Label>
            <Input placeholder="VX-ABC123" value={form.orderId} onChange={(e) => setForm((f) => ({ ...f, orderId: e.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label>Sender Name</Label>
            <Input placeholder="VisoryX" value={senderName} onChange={(e) => setSenderName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Sender Email</Label>
            <Input type="email" placeholder="support@visoryx.design" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSend} disabled={sending} className="gap-2">
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}
            Send Review Request
          </Button>
          <Button variant="outline" onClick={handleTestSend} disabled={sendingTest} className="gap-2">
            {sendingTest ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
            Test to Self
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ============= NEWSLETTER TAB =============
function NewsletterTab({
  onPreviewChange,
  userEmail,
}: {
  onPreviewChange: (data: Record<string, string | number>) => void
  userEmail?: string
}) {
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [recipientMode, setRecipientMode] = useState<"manual" | "all">("manual")
  const [manualEmails, setManualEmails] = useState("")
  const [allProfiles, setAllProfiles] = useState<{ email: string; display_name: string | null }[]>([])
  const [loadingProfiles, setLoadingProfiles] = useState(false)
  const [senderName, setSenderName] = useState("VisoryX")
  const [senderEmail, setSenderEmail] = useState("noreply@visoryx.design")
  const [sending, setSending] = useState(false)
  const [sendingTest, setSendingTest] = useState(false)
  const [result, setResult] = useState<{ succeeded: number; failed: number; total: number } | null>(null)

  useEffect(() => {
    onPreviewChange({
      ...getDefaultData(),
      subject: subject || "VisoryX Update",
      content: content || "Your newsletter content will appear here...",
      email: "subscriber@example.com",
    })
  }, [subject, content, onPreviewChange])

  const loadAllProfiles = async () => {
    setLoadingProfiles(true)
    try {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase.from("profiles").select("email, display_name").neq("unsubscribed", true).order("created_at", { ascending: false })
      if (data) setAllProfiles(data)
    } catch {
      toast.error("Failed to load profiles")
    } finally {
      setLoadingProfiles(false)
    }
  }

  useEffect(() => {
    if (recipientMode === "all") loadAllProfiles()
  }, [recipientMode])

  const getRecipientEmails = (): string[] => {
    if (recipientMode === "manual") {
      return manualEmails.split(/[,\n]/).map((e) => e.trim()).filter((e) => e.includes("@"))
    }
    return allProfiles.map((p) => p.email).filter(Boolean)
  }

  const handleSend = async () => {
    if (!subject.trim() || !content.trim()) { toast.error("Subject and content are required"); return }
    const emails = getRecipientEmails()
    if (emails.length === 0) { toast.error("No recipients specified"); return }
    setSending(true)
    setResult(null)
    try {
      const res = await sendNewsletterEmail(emails, subject, content, senderName, senderEmail)
      setResult(res)
      if (res.failed === 0) toast.success(`Newsletter sent to ${res.succeeded} recipients`)
      else toast.warning(`Sent to ${res.succeeded}/${res.total} recipients (${res.failed} failed)`)
    } catch {
      toast.error("Failed to send newsletter")
    } finally {
      setSending(false)
    }
  }

  const handleTestSend = async () => {
    if (!userEmail) { toast.error("No email on your profile"); return }
    if (!subject.trim() || !content.trim()) { toast.error("Subject and content are required"); return }
    setSendingTest(true)
    try {
      const res = await sendNewsletterEmail([userEmail], subject, content, senderName, senderEmail)
      if (res.succeeded > 0) toast.success(`Test newsletter sent to ${userEmail}`)
      else toast.error("Failed to send test newsletter")
    } catch {
      toast.error("Failed to send test newsletter")
    } finally {
      setSendingTest(false)
    }
  }

  const recipientCount = getRecipientEmails().length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-blue-500" />
          Send Newsletter
        </CardTitle>
        <CardDescription>Broadcast an email to multiple recipients</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label>Recipients</Label>
          <div className="flex gap-2">
            <Button variant={recipientMode === "manual" ? "default" : "outline"} size="sm" onClick={() => setRecipientMode("manual")} className="gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              Manual List
            </Button>
            <Button variant={recipientMode === "all" ? "default" : "outline"} size="sm" onClick={() => setRecipientMode("all")} className="gap-1.5">
              <Users className="h-3.5 w-3.5" />
              All Users
              {recipientMode === "all" && !loadingProfiles && (
                <Badge variant="secondary" className="ml-1 text-xs">{allProfiles.length}</Badge>
              )}
            </Button>
          </div>
        </div>

        {recipientMode === "manual" ? (
          <div className="grid gap-2">
            <Label>Email Addresses (comma or newline separated)</Label>
            <Textarea
              placeholder={"user1@example.com\nuser2@example.com\nuser3@example.com"}
              value={manualEmails}
              onChange={(e) => setManualEmails(e.target.value)}
              rows={3}
            />
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-secondary/30 p-3">
            {loadingProfiles ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading user profiles...
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Sending to <strong className="text-foreground">{allProfiles.length}</strong> registered users
                </p>
                <Button variant="ghost" size="sm" onClick={loadAllProfiles} className="text-xs">Refresh</Button>
              </div>
            )}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Sender Name</Label>
            <Input placeholder="VisoryX" value={senderName} onChange={(e) => setSenderName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Sender Email</Label>
            <Input type="email" placeholder="noreply@visoryx.design" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="nl-subject">Subject *</Label>
          <Input
            id="nl-subject"
            placeholder="VisoryX February Update - New Templates & More"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="nl-content">Content *</Label>
          <Textarea
            id="nl-content"
            placeholder={"Hey there!\n\nWe've got some exciting updates to share...\n\n- New ERLC livery templates\n- Faster turnaround times\n- Training courses now available\n\nCheck it out at visoryx.design"}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
          />
          <p className="text-xs text-muted-foreground">
            Plain text content. Line breaks will be preserved in the email.
          </p>
        </div>

        {result && (
          <div className={`flex items-center gap-2 rounded-md p-3 text-sm ${
            result.failed === 0 ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
          }`}>
            {result.failed === 0 ? <CheckCircle className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
            Sent to {result.succeeded} of {result.total} recipients
            {result.failed > 0 && ` (${result.failed} failed)`}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button onClick={handleSend} disabled={sending || recipientCount === 0} className="gap-2">
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {sending ? "Sending..." : `Send to ${recipientCount} recipient${recipientCount !== 1 ? "s" : ""}`}
          </Button>
          <Button variant="outline" onClick={handleTestSend} disabled={sendingTest} className="gap-2">
            {sendingTest ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
            Test to Self
          </Button>
          {recipientCount === 0 && !sending && (
            <p className="text-xs text-muted-foreground">Add at least one recipient to send</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
