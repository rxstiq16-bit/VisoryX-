"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, Trash2, Shield, FileText, AlertTriangle, Loader2, CheckCircle } from "lucide-react"

interface DataCategory {
  id: string
  name: string
  description: string
  size: string
  selected: boolean
}

export function GDPRTools() {
  const [exporting, setExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [deleting, setDeleting] = useState(false)
  
  const [dataCategories, setDataCategories] = useState<DataCategory[]>([
    { id: "profile", name: "Profile Information", description: "Name, email, avatar, bio", size: "2 KB", selected: true },
    { id: "orders", name: "Order History", description: "All orders, messages, and attachments", size: "15 MB", selected: true },
    { id: "payments", name: "Payment Records", description: "Transaction history and invoices", size: "500 KB", selected: true },
    { id: "preferences", name: "Preferences", description: "Settings, notifications, integrations", size: "1 KB", selected: true },
    { id: "activity", name: "Activity Log", description: "Login history, actions, and events", size: "2 MB", selected: true },
    { id: "files", name: "Uploaded Files", description: "All files you have uploaded", size: "250 MB", selected: false },
  ])

  const toggleCategory = (id: string) => {
    setDataCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, selected: !cat.selected } : cat
    ))
  }

  const handleExport = async () => {
    setExporting(true)
    // Simulate export
    await new Promise(r => setTimeout(r, 3000))
    setExporting(false)
    setExportComplete(true)
  }

  const handleDelete = async () => {
    if (deleteConfirmation !== "DELETE MY ACCOUNT") return
    setDeleting(true)
    // Simulate deletion
    await new Promise(r => setTimeout(r, 2000))
    // In production, redirect to goodbye page
    window.location.href = "/goodbye"
  }

  const selectedSize = dataCategories
    .filter(c => c.selected)
    .reduce((acc, c) => {
      const size = parseFloat(c.size)
      const unit = c.size.includes("MB") ? 1024 : 1
      return acc + size * unit
    }, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Your Data Rights (GDPR)
          </CardTitle>
          <CardDescription>
            Under GDPR, you have the right to access, export, and delete your personal data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Export Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Your Data
                </h3>
                <p className="text-sm text-muted-foreground">
                  Download a copy of all your personal data
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              {dataCategories.map(category => (
                <label
                  key={category.id}
                  className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={category.selected}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-xs text-muted-foreground">{category.size}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </label>
              ))}
            </div>

            {exportComplete ? (
              <Alert className="border-green-500/50 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="flex items-center justify-between">
                  <span>Your data export is ready!</span>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download ZIP
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <Button onClick={handleExport} disabled={exporting || !dataCategories.some(c => c.selected)}>
                {exporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Preparing Export...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Export Selected Data ({(selectedSize / 1024).toFixed(1)} MB)
                  </>
                )}
              </Button>
            )}
          </div>

          <hr />

          {/* Account Deletion Section */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2 text-destructive">
                <Trash2 className="h-4 w-4" />
                Delete Your Account
              </h3>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This action is irreversible. All your data, orders, files, and account information will be permanently deleted within 30 days.
              </AlertDescription>
            </Alert>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete My Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This will permanently delete your account and all associated data. This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Type DELETE MY ACCOUNT to confirm</Label>
                    <Input
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      placeholder="DELETE MY ACCOUNT"
                    />
                  </div>

                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>What will be deleted:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Your profile and account information</li>
                      <li>All order history and messages</li>
                      <li>Uploaded files and deliverables</li>
                      <li>Payment and transaction records</li>
                      <li>Loyalty points and referral history</li>
                    </ul>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleteConfirmation !== "DELETE MY ACCOUNT" || deleting}
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Permanently Delete"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
