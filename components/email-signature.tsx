"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Check, Download } from "lucide-react"

interface SignatureData {
  name: string
  title: string
  email: string
  phone: string
  website: string
  discord: string
  template: "minimal" | "professional" | "creative"
  accentColor: string
}

const templates = {
  minimal: (data: SignatureData) => `
    <table cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
      <tr>
        <td style="padding-right: 15px; border-right: 2px solid ${data.accentColor};">
          <img src="https://visoryx.com/logo.png" alt="VisoryX" width="60" height="60" style="border-radius: 8px;" />
        </td>
        <td style="padding-left: 15px;">
          <div style="font-weight: bold; font-size: 16px; color: ${data.accentColor};">${data.name}</div>
          <div style="color: #666; margin-bottom: 8px;">${data.title}</div>
          <div style="font-size: 12px;">
            ${data.email ? `<a href="mailto:${data.email}" style="color: #333; text-decoration: none;">${data.email}</a><br/>` : ''}
            ${data.phone ? `<span>${data.phone}</span><br/>` : ''}
            ${data.website ? `<a href="${data.website}" style="color: ${data.accentColor}; text-decoration: none;">${data.website}</a>` : ''}
          </div>
        </td>
      </tr>
    </table>
  `,
  professional: (data: SignatureData) => `
    <table cellpadding="0" cellspacing="0" style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #1a1a1a; max-width: 450px;">
      <tr>
        <td style="padding: 15px; background: linear-gradient(135deg, ${data.accentColor}15, transparent); border-radius: 8px;">
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="80" valign="top">
                <img src="https://visoryx.com/logo.png" alt="VisoryX" width="70" height="70" style="border-radius: 50%; border: 3px solid ${data.accentColor};" />
              </td>
              <td style="padding-left: 15px;" valign="top">
                <div style="font-weight: 700; font-size: 18px; color: #1a1a1a;">${data.name}</div>
                <div style="color: ${data.accentColor}; font-weight: 500; margin-bottom: 10px;">${data.title}</div>
                <table cellpadding="0" cellspacing="0" style="font-size: 12px;">
                  ${data.email ? `<tr><td style="padding: 2px 0;"><a href="mailto:${data.email}" style="color: #333; text-decoration: none;">📧 ${data.email}</a></td></tr>` : ''}
                  ${data.phone ? `<tr><td style="padding: 2px 0;">📱 ${data.phone}</td></tr>` : ''}
                  ${data.discord ? `<tr><td style="padding: 2px 0;">💬 ${data.discord}</td></tr>` : ''}
                  ${data.website ? `<tr><td style="padding: 2px 0;"><a href="${data.website}" style="color: ${data.accentColor}; text-decoration: none;">🌐 ${data.website}</a></td></tr>` : ''}
                </table>
              </td>
            </tr>
          </table>
          <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e0e0e0; font-size: 11px; color: #666;">
            VisoryX Design Studio | Premium Design Services
          </div>
        </td>
      </tr>
    </table>
  `,
  creative: (data: SignatureData) => `
    <table cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px;">
      <tr>
        <td style="background: linear-gradient(135deg, ${data.accentColor}, #a855f7); padding: 20px; border-radius: 12px;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <div style="color: white; font-weight: 800; font-size: 22px; letter-spacing: -0.5px;">${data.name}</div>
                <div style="color: rgba(255,255,255,0.9); font-size: 14px; margin-bottom: 15px;">${data.title} @ VisoryX</div>
                <div style="background: rgba(255,255,255,0.15); padding: 12px; border-radius: 8px;">
                  <table cellpadding="0" cellspacing="0" style="font-size: 12px; color: white;">
                    ${data.email ? `<tr><td style="padding: 3px 0;"><a href="mailto:${data.email}" style="color: white; text-decoration: none;">${data.email}</a></td></tr>` : ''}
                    ${data.phone ? `<tr><td style="padding: 3px 0;">${data.phone}</td></tr>` : ''}
                    ${data.discord ? `<tr><td style="padding: 3px 0;">${data.discord}</td></tr>` : ''}
                  </table>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `,
}

export function EmailSignatureGenerator() {
  const [copied, setCopied] = useState(false)
  const [data, setData] = useState<SignatureData>({
    name: "",
    title: "",
    email: "",
    phone: "",
    website: "visoryx.com",
    discord: "",
    template: "professional",
    accentColor: "#8b5cf6",
  })

  const generateSignature = () => templates[data.template](data)

  const copyToClipboard = async () => {
    const html = generateSignature()
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([html], { type: "text/plain" }),
        }),
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      await navigator.clipboard.writeText(html)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const downloadHtml = () => {
    const html = generateSignature()
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "email-signature.html"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Signature Generator</CardTitle>
        <CardDescription>Create a professional email signature for your communications</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="edit" className="space-y-4">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} placeholder="Lead Designer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} placeholder="john@visoryx.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} placeholder="+1 (555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discord">Discord</Label>
                <Input id="discord" value={data.discord} onChange={(e) => setData({ ...data, discord: e.target.value })} placeholder="username#1234" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template">Template</Label>
                <Select value={data.template} onValueChange={(v) => setData({ ...data, template: v as SignatureData["template"] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Accent Color</Label>
                <div className="flex gap-2">
                  <Input id="color" type="color" value={data.accentColor} onChange={(e) => setData({ ...data, accentColor: e.target.value })} className="w-12 h-10 p-1" />
                  <Input value={data.accentColor} onChange={(e) => setData({ ...data, accentColor: e.target.value })} className="flex-1" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <div className="border rounded-lg p-6 bg-white">
              <div dangerouslySetInnerHTML={{ __html: generateSignature() }} />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 mt-6">
          <Button onClick={copyToClipboard}>
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? "Copied!" : "Copy HTML"}
          </Button>
          <Button variant="outline" onClick={downloadHtml}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
