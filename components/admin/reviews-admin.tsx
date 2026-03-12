"use client"

import React, { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Star, Loader2, Handshake, GripVertical, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getReviews, addReview, updateReview, deleteReview, type Review } from "@/lib/reviews-store"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"

type Partner = {
  id: string
  name: string
  type: string
  initials: string
  logo_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export function ReviewsAdmin() {
  const [tab, setTab] = useState<"reviews" | "partners">("reviews")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Reviews & Partners
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage testimonials and trusted partner organizations.
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 rounded-lg bg-muted/50 p-1 w-fit">
        <button
          onClick={() => setTab("reviews")}
          className={cn(
            "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
            tab === "reviews" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Star className="h-3.5 w-3.5" />
          Reviews
        </button>
        <button
          onClick={() => setTab("partners")}
          className={cn(
            "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
            tab === "partners" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Handshake className="h-3.5 w-3.5" />
          Partners
        </button>
      </div>

      {tab === "reviews" ? <ReviewsTab /> : <PartnersTab />}
    </div>
  )
}

/* ==================== REVIEWS TAB ==================== */
function ReviewsTab() {
  const { user, profile, isLoading } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [formData, setFormData] = useState({ customerName: "", designerName: "", review: "", rating: 5 })
  const [loadingReviews, setLoadingReviews] = useState(true)

  useEffect(() => {
    if (!isLoading && user && profile) loadReviews()
  }, [user, profile, isLoading])

  const loadReviews = async () => {
    setLoadingReviews(true)
    const data = await getReviews()
    setReviews(data)
    setLoadingReviews(false)
  }

  const handleOpenDialog = (review?: Review) => {
    if (review) {
      setEditingReview(review)
      setFormData({ customerName: review.customerName, designerName: review.designerName, review: review.review, rating: review.rating })
    } else {
      setEditingReview(null)
      setFormData({ customerName: "", designerName: "", review: "", rating: 5 })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingReview) await updateReview(editingReview.id, formData)
    else await addReview(formData)
    await loadReviews()
    setIsDialogOpen(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Delete this review?")) { await deleteReview(id); await loadReviews() }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
        <Button size="sm" onClick={() => handleOpenDialog()} className="gap-2 text-xs font-semibold">
          <Plus className="h-3.5 w-3.5" /> Add Review
        </Button>
      </div>

      {loadingReviews ? (
        <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <img src="/images/mascot/virox-walking.png" alt="" className="h-20 w-auto opacity-30 mb-3" />
          <p className="text-sm font-medium">No reviews yet</p>
          <p className="text-xs mt-1">Add your first customer testimonial</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.id} className="group relative rounded-xl border border-border/40 bg-card/80 p-5 transition-all hover:border-border/60 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{review.customerName}</h3>
                  <p className="text-[11px] text-muted-foreground">by {review.designerName}</p>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={cn("h-3 w-3", star <= review.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted")} />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">{review.review}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleOpenDialog(review)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => handleDelete(review.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="text-lg">{editingReview ? "Edit Review" : "Add Review"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="customerName" className="text-xs">Customer Name</Label>
              <Input id="customerName" value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="designerName" className="text-xs">Designer Name</Label>
              <Input id="designerName" value={formData.designerName} onChange={(e) => setFormData({ ...formData, designerName: e.target.value })} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="review" className="text-xs">Review</Label>
              <Textarea id="review" value={formData.review} onChange={(e) => setFormData({ ...formData, review: e.target.value })} rows={3} required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setFormData({ ...formData, rating: star })} className="p-0.5">
                    <Star className={cn("h-5 w-5 transition-colors", star <= formData.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted hover:fill-yellow-200 hover:text-yellow-200")} />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1 font-semibold">{editingReview ? "Update" : "Add Review"}</Button>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

/* ==================== PARTNERS TAB ==================== */
function PartnersTab() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Partner | null>(null)
  const [formData, setFormData] = useState({ name: "", type: "community", initials: "", logo_url: "", display_order: 0 })

  useEffect(() => { loadPartners() }, [])

  const loadPartners = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase.from("trusted_partners").select("*").order("display_order", { ascending: true })
      setPartners(data || [])
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  const handleOpenDialog = (partner?: Partner) => {
    if (partner) {
      setEditing(partner)
      setFormData({ name: partner.name, type: partner.type, initials: partner.initials, logo_url: partner.logo_url || "", display_order: partner.display_order })
    } else {
      setEditing(null)
      setFormData({ name: "", type: "community", initials: "", logo_url: "", display_order: partners.length })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    if (!supabase) return
    const payload = { ...formData, logo_url: formData.logo_url || null, updated_at: new Date().toISOString() }
    if (editing) {
      await supabase.from("trusted_partners").update(payload).eq("id", editing.id)
    } else {
      await supabase.from("trusted_partners").insert(payload)
    }
    await loadPartners()
    setIsDialogOpen(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this partner?")) return
    const supabase = createClient()
    if (!supabase) return
    await supabase.from("trusted_partners").delete().eq("id", id)
    await loadPartners()
  }

  const toggleActive = async (partner: Partner) => {
    const supabase = createClient()
    if (!supabase) return
    await supabase.from("trusted_partners").update({ is_active: !partner.is_active, updated_at: new Date().toISOString() }).eq("id", partner.id)
    await loadPartners()
  }

  const typeColors: Record<string, string> = {
    community: "bg-primary/10 text-primary",
    business: "bg-emerald-500/10 text-emerald-500",
    gaming: "bg-amber-500/10 text-amber-500",
    esports: "bg-sky-500/10 text-sky-500",
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{partners.length} partner{partners.length !== 1 ? "s" : ""}</p>
        <Button size="sm" onClick={() => handleOpenDialog()} className="gap-2 text-xs font-semibold">
          <Plus className="h-3.5 w-3.5" /> Add Partner
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      ) : partners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Handshake className="h-10 w-10 opacity-30 mb-3" />
          <p className="text-sm font-medium">No partners yet</p>
          <p className="text-xs mt-1">Add organizations that trust VisoryX</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/40 bg-card/80 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_100px_80px_80px_70px] gap-4 border-b border-border/30 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Partner</span>
            <span>Type</span>
            <span>Order</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>
          {partners.map((partner) => (
            <div key={partner.id} className="grid grid-cols-[1fr_100px_80px_80px_70px] gap-4 items-center border-b border-border/10 px-5 py-3 text-sm hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/60 text-xs font-bold text-foreground shrink-0">
                  {partner.initials || partner.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-[13px] truncate">{partner.name}</p>
                  {partner.logo_url && <p className="text-[10px] text-muted-foreground truncate">{partner.logo_url}</p>}
                </div>
              </div>
              <span className={cn("inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-medium capitalize", typeColors[partner.type] || "bg-muted text-muted-foreground")}>
                {partner.type}
              </span>
              <span className="text-xs text-muted-foreground font-mono">{partner.display_order}</span>
              <button onClick={() => toggleActive(partner)} className="flex items-center gap-1.5 text-xs">
                {partner.is_active ? (
                  <><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /><span className="text-emerald-500">Active</span></>
                ) : (
                  <><span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" /><span className="text-muted-foreground">Hidden</span></>
                )}
              </button>
              <div className="flex gap-1 justify-end">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleOpenDialog(partner)}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => handleDelete(partner.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="text-lg">{editing ? "Edit Partner" : "Add Partner"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="pName" className="text-xs">Name</Label>
              <Input id="pName" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Apex Gaming" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="pType" className="text-xs">Type</Label>
                <select id="pType" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm">
                  <option value="community">Community</option>
                  <option value="business">Business</option>
                  <option value="gaming">Gaming</option>
                  <option value="esports">Esports</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pInitials" className="text-xs">Initials</Label>
                <Input id="pInitials" value={formData.initials} onChange={(e) => setFormData({ ...formData, initials: e.target.value.toUpperCase() })} placeholder="AG" maxLength={3} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pLogo" className="text-xs">Logo URL (optional)</Label>
              <Input id="pLogo" value={formData.logo_url} onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pOrder" className="text-xs">Display Order</Label>
              <Input id="pOrder" type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1 font-semibold">{editing ? "Update" : "Add Partner"}</Button>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
