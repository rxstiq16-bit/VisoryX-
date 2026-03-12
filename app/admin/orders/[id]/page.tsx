"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  DollarSign,
  Package,
  MessageSquare,
  History,
  Loader2,
  Send,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  UserPlus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { useAuth } from "@/components/auth-provider"
import { createClient } from "@/lib/supabase/client"
import { Upload, Download, FileIcon, Trash2 as TrashIcon } from "lucide-react"

import { 
  getOrder, 
  getOrderNotes, 
  getOrderStatusHistory,
  updateOrderStatus,
  addOrderNote,
  markOrderPaid,
  updateOrder,
  deleteOrder,
  ORDER_STATUSES,
  ORDER_PRIORITIES,
  type Order,
  type OrderNote,
  type OrderStatusHistory,
  type OrderStatus,
  type OrderPriority
} from "@/lib/orders"

function hasAnyRole(roles: string[] | undefined, allowedRoles: string[]): boolean {
  if (!roles) return false
  if (roles.includes('executive')) return true
  return allowedRoles.some(role => roles.includes(role))
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { user, profile, isLoading: authLoading } = useAuth()
  
  const [order, setOrder] = useState<Order | null>(null)
  const [notes, setNotes] = useState<OrderNote[]>([])
  const [statusHistory, setStatusHistory] = useState<OrderStatusHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("details")
  const [deliverables, setDeliverables] = useState<{ id: string; file_name: string; file_url: string; file_size: number; file_type: string; created_at: string }[]>([])
  const [uploading, setUploading] = useState(false)
  
  // Form states
  const [newNote, setNewNote] = useState("")
  const [isInternalNote, setIsInternalNote] = useState(false)
  const [statusChangeReason, setStatusChangeReason] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("")
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Edit mode
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    service_type: "",
    description: "",
    priority: "" as OrderPriority,
    price: "",
    estimated_completion: ""
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin/login")
      return
    }
    if (!authLoading && profile && !hasAnyRole(profile.roles, ["executive", "director", "operations_manager", "design_lead", "designer", "community_moderator"])) {
      router.push("/")
      return
    }
    
    loadOrderData()
  }, [authLoading, user, profile, resolvedParams.id])
  
  const loadOrderData = async () => {
    setIsLoading(true)
    const [orderData, notesData, historyData] = await Promise.all([
      getOrder(resolvedParams.id),
      getOrderNotes(resolvedParams.id, hasAnyRole(profile?.roles, ["executive", "director", "operations_manager"])),
      getOrderStatusHistory(resolvedParams.id)
    ])
    
    setOrder(orderData)
    setNotes(notesData)
    setStatusHistory(historyData)
    
    if (orderData) {
      setEditForm({
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone || "",
        service_type: orderData.service_type,
        description: orderData.description || "",
        priority: orderData.priority,
        price: orderData.price?.toString() || "",
        estimated_completion: orderData.estimated_completion?.split('T')[0] || ""
      })
    }
    
    setIsLoading(false)
  }
  
  const handleAddNote = async () => {
    if (!newNote.trim() || !profile || !order) return
    
    setIsSubmitting(true)
    const note = await addOrderNote({
      order_id: order.id,
      user_id: profile.id,
      user_name: profile.display_name || profile.username,
      note_type: 'note',
      content: newNote,
      is_internal: isInternalNote
    })
    
    if (note) {
      setNotes([note, ...notes])
      setNewNote("")
      setIsInternalNote(false)
    }
    setIsSubmitting(false)
  }
  
  const handleStatusChange = async () => {
    if (!selectedStatus || !profile || !order) return
    
    setIsSubmitting(true)
    const success = await updateOrderStatus(
      order.id,
      selectedStatus,
      profile.id,
      profile.display_name || profile.username,
      statusChangeReason || undefined
    )
    
    if (success) {
      await loadOrderData()
      setShowStatusDialog(false)
      setSelectedStatus("")
      setStatusChangeReason("")
    }
    setIsSubmitting(false)
  }
  
  const handleMarkPaid = async () => {
    if (!paymentMethod || !profile || !order) return
    
    setIsSubmitting(true)
    const success = await markOrderPaid(
      order.id,
      paymentMethod,
      profile.id,
      profile.display_name || profile.username
    )
    
    if (success) {
      await loadOrderData()
      setShowPaymentDialog(false)
      setPaymentMethod("")
    }
    setIsSubmitting(false)
  }
  
  const handleSaveEdit = async () => {
    if (!order) return
    
    setIsSubmitting(true)
    const updated = await updateOrder(order.id, {
      customer_name: editForm.customer_name,
      customer_email: editForm.customer_email,
      customer_phone: editForm.customer_phone || null,
      service_type: editForm.service_type,
      description: editForm.description || null,
      priority: editForm.priority,
      price: editForm.price ? parseFloat(editForm.price) : null,
      estimated_completion: editForm.estimated_completion || null
    })
    
    if (updated) {
      setOrder(updated)
      setIsEditing(false)
    }
    setIsSubmitting(false)
  }
  
  const handleClaimOrder = async () => {
    if (!order || !profile) return
    setIsSubmitting(true)
    const updated = await updateOrder(order.id, {
      assigned_to: profile.id,
      assigned_to_name: profile.display_name || profile.username,
    } as Partial<Order>)
    if (updated) {
      await addOrderNote({
        order_id: order.id,
        user_id: profile.id,
        user_name: profile.display_name || profile.username,
        note_type: 'assignment',
        content: `${profile.display_name || profile.username} claimed this order.`,
        is_internal: false,
      })
      await loadOrderData()
    }
    setIsSubmitting(false)
  }

  const handleDelete = async () => {
    if (!order) return
    
    setIsSubmitting(true)
    const success = await deleteOrder(order.id)
    
    if (success) {
      router.push("/admin/orders")
    }
    setIsSubmitting(false)
  }

  const loadDeliverables = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("order_deliverables")
      .select("*")
      .eq("order_id", resolvedParams.id)
      .order("created_at", { ascending: false })
    if (data) setDeliverables(data)
  }

  useEffect(() => {
    if (order) loadDeliverables()
  }, [order?.id])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !order) return
    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("orderId", order.id)
    formData.append("uploadedBy", profile?.display_name || profile?.username || "admin")
    try {
      const res = await fetch("/api/admin/orders/upload", { method: "POST", body: formData })
      if (res.ok) {
        await loadDeliverables()
      }
    } catch {}
    setUploading(false)
    e.target.value = ""
  }

  const handleDeleteFile = async (id: string, fileUrl: string) => {
    try {
      await fetch("/api/admin/orders/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, fileUrl }),
      })
      setDeliverables(prev => prev.filter(d => d.id !== id))
    } catch {}
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
  
  const getStatusBadge = (status: OrderStatus) => {
    const statusInfo = ORDER_STATUSES.find(s => s.value === status)
    return (
      <Badge className={`${statusInfo?.color} text-white`}>
        {statusInfo?.label || status}
      </Badge>
    )
  }
  
  const getPriorityBadge = (priority: OrderPriority) => {
    const priorityInfo = ORDER_PRIORITIES.find(p => p.value === priority)
    return (
      <Badge variant="outline" className={`border-2 ${priorityInfo?.color.replace('bg-', 'border-')} ${priorityInfo?.color.replace('bg-', 'text-')}`}>
        {priorityInfo?.label || priority}
      </Badge>
    )
  }

  if (authLoading || isLoading) {
    return (
      <section className="py-20 lg:py-28">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    )
  }
  
  if (!order) {
    return (
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">This order doesn&apos;t exist or has been deleted.</p>
          <Button asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/orders">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">Order #{order.id.slice(0, 8)}</h1>
                {getStatusBadge(order.status)}
                {getPriorityBadge(order.priority)}
              </div>
              <p className="text-muted-foreground text-sm mt-1">
                Created {format(new Date(order.created_at), 'PPP')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Claim Order - designers can assign themselves */}
            {(!order.assigned_to || order.assigned_to !== profile?.id) && (
              <Button
                variant={order.assigned_to ? "outline" : "default"}
                onClick={handleClaimOrder}
                disabled={isSubmitting}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {order.assigned_to ? "Reassign to Me" : "Claim Order"}
              </Button>
            )}
            {order.assigned_to === profile?.id && (
              <Badge variant="outline" className="gap-1.5 py-1.5 px-3 border-primary/30 bg-primary/5 text-primary">
                <CheckCircle className="h-3.5 w-3.5" />
                Assigned to you
              </Badge>
            )}

            <Button 
              variant="outline" 
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel Edit' : 'Edit'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedStatus("")
                setShowStatusDialog(true)
              }}
            >
              Update Status
            </Button>
            {!order.paid && (
              <Button 
                variant="default"
                onClick={() => setShowPaymentDialog(true)}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Mark Paid
              </Button>
            )}
            {hasAnyRole(profile?.roles, ["executive", "director"]) && (
              <Button 
                variant="destructive" 
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Notes ({notes.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History ({statusHistory.length})
            </TabsTrigger>
            <TabsTrigger value="deliverables" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Files
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <div className="mb-6"></div>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input 
                          value={editForm.customer_name}
                          onChange={(e) => setEditForm({...editForm, customer_name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input 
                          type="email"
                          value={editForm.customer_email}
                          onChange={(e) => setEditForm({...editForm, customer_email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input 
                          value={editForm.customer_phone}
                          onChange={(e) => setEditForm({...editForm, customer_phone: e.target.value})}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{order.customer_name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${order.customer_email}`} className="text-primary hover:underline">
                          {order.customer_email}
                        </a>
                      </div>
                      {order.customer_phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a href={`tel:${order.customer_phone}`} className="text-primary hover:underline">
                            {order.customer_phone}
                          </a>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Order Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label>Service Type</Label>
                        <Input 
                          value={editForm.service_type}
                          onChange={(e) => setEditForm({...editForm, service_type: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Priority</Label>
                        <Select 
                          value={editForm.priority}
                          onValueChange={(value) => setEditForm({...editForm, priority: value as OrderPriority})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ORDER_PRIORITIES.map((p) => (
                              <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea 
                          value={editForm.description}
                          onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                          rows={4}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="text-sm text-muted-foreground">Service Type</span>
                        <p className="font-medium">{order.service_type}</p>
                      </div>
                      {order.description && (
                        <div>
                          <span className="text-sm text-muted-foreground">Description</span>
                          <p className="text-sm mt-1">{order.description}</p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Payment Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-2">
                      <Label>Price</Label>
                      <Input 
                        type="number"
                        value={editForm.price}
                        onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-bold text-lg">
                          {order.price ? `$${order.price.toFixed(2)}` : 'Not set'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant={order.paid ? "default" : "secondary"}>
                          {order.paid ? (
                            <><CheckCircle className="h-3 w-3 mr-1" /> Paid</>
                          ) : (
                            'Unpaid'
                          )}
                        </Badge>
                      </div>
                      {order.paid && order.payment_method && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Method</span>
                          <span>{order.payment_method}</span>
                        </div>
                      )}
                      {order.paid && order.payment_date && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Date</span>
                          <span>{format(new Date(order.payment_date), 'PPP')}</span>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Timeline Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-2">
                      <Label>Estimated Completion</Label>
                      <Input 
                        type="date"
                        value={editForm.estimated_completion}
                        onChange={(e) => setEditForm({...editForm, estimated_completion: e.target.value})}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Created</span>
                        <span>{format(new Date(order.created_at), 'PPP')}</span>
                      </div>
                      {order.estimated_completion && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Est. Completion</span>
                          <span>{format(new Date(order.estimated_completion), 'PPP')}</span>
                        </div>
                      )}
                      {order.actual_completion && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Completed</span>
                          <span>{format(new Date(order.actual_completion), 'PPP')}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span>{format(new Date(order.updated_at), 'PPP')}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {isEditing && (
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
                <CardDescription>
                  Add notes and track communication about this order
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Add note form */}
                <div className="space-y-4 mb-6 pb-6 border-b">
                  <Textarea
                    placeholder="Add a note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="internal" 
                        checked={isInternalNote}
                        onCheckedChange={(checked) => setIsInternalNote(checked === true)}
                      />
                      <Label htmlFor="internal" className="text-sm text-muted-foreground">
                        Internal note (not visible to customer)
                      </Label>
                    </div>
                    <Button onClick={handleAddNote} disabled={!newNote.trim() || isSubmitting}>
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Add Note
                    </Button>
                  </div>
                </div>
                
                {/* Notes list */}
                <div className="space-y-4">
                  {notes.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No notes yet
                    </p>
                  ) : (
                    notes.map((note) => (
                      <div 
                        key={note.id} 
                        className={`p-4 rounded-lg ${
                          note.is_internal 
                            ? 'bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800' 
                            : 'bg-secondary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{note.user_name}</span>
                            {note.is_internal && (
                              <Badge variant="outline" className="text-xs">Internal</Badge>
                            )}
                            <Badge variant="secondary" className="text-xs">
                              {note.note_type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(note.created_at), 'PPp')}
                          </span>
                        </div>
                        <p className="text-sm">{note.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Status History</CardTitle>
                <CardDescription>
                  Track all status changes for this order
                </CardDescription>
              </CardHeader>
              <CardContent>
                {statusHistory.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No status changes recorded
                  </p>
                ) : (
                  <div className="space-y-4">
                    {statusHistory.map((entry, index) => (
                      <div key={entry.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-primary" />
                          {index < statusHistory.length - 1 && (
                            <div className="w-0.5 h-full bg-border mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            {entry.previous_status && (
                              <>
                                {getStatusBadge(entry.previous_status as OrderStatus)}
                                <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
                              </>
                            )}
                            {getStatusBadge(entry.new_status as OrderStatus)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Changed by {entry.changed_by_name}
                          </p>
                          {entry.reason && (
                            <p className="text-sm mt-1">{entry.reason}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(entry.created_at), 'PPp')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deliverables">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Deliverables</CardTitle>
                    <CardDescription>Upload completed files for the customer to download.</CardDescription>
                  </div>
                  <label>
                    <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                    <Button asChild variant="outline" size="sm" className="gap-2 cursor-pointer" disabled={uploading}>
                      <span>
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        Upload File
                      </span>
                    </Button>
                  </label>
                </div>
              </CardHeader>
              <CardContent>
                {deliverables.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileIcon className="h-10 w-10 text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">No files uploaded yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Upload completed designs for the customer.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {deliverables.map(file => (
                      <div key={file.id} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <FileIcon className="h-5 w-5 text-primary/60 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{file.file_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.file_size)} &middot; {format(new Date(file.created_at), "MMM d, yyyy h:mm a")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button variant="ghost" size="sm" asChild className="gap-1.5 h-8">
                            <a href={file.file_url} target="_blank" rel="noreferrer" download>
                              <Download className="h-3.5 w-3.5" />
                              Download
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteFile(file.id, file.file_url)}
                          >
                            <TrashIcon className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Status Change Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status of this order and optionally provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select 
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${status.color}`} />
                        {status.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reason (optional)</Label>
              <Textarea
                placeholder="Why is the status being changed?"
                value={statusChangeReason}
                onChange={(e) => setStatusChangeReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusChange} disabled={!selectedStatus || isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Order as Paid</DialogTitle>
            <DialogDescription>
              Record payment for this order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="debit_card">Debit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {order?.price && (
              <div className="p-4 bg-secondary rounded-lg">
                <div className="flex items-center justify-between">
                  <span>Amount</span>
                  <span className="font-bold text-lg">${order.price.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleMarkPaid} disabled={!paymentMethod || isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
