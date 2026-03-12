"use client"

import React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { createOrder, ORDER_PRIORITIES, type OrderPriority } from "@/lib/orders"

function hasAnyRole(roles: string[] | undefined, allowedRoles: string[]): boolean {
  if (!roles) return false
  if (roles.includes('executive')) return true
  return allowedRoles.some(role => roles.includes(role))
}

export default function NewOrderPage() {
  const router = useRouter()
  const { user, profile, isLoading: authLoading } = useAuth()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    service_type: "",
    description: "",
    priority: "normal" as OrderPriority,
    price: "",
    estimated_completion: ""
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin/login")
      return
    }
    if (!authLoading && profile && !hasAnyRole(profile.roles, ["executive", "director", "operations_manager"])) {
      router.push("/admin/dashboard")
      return
    }
  }, [authLoading, user, profile, router])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.customer_name || !form.customer_email || !form.service_type) {
      return
    }
    
    setIsSubmitting(true)
    
    const order = await createOrder({
      user_id: null,
      customer_name: form.customer_name,
      customer_email: form.customer_email,
      customer_phone: form.customer_phone || null,
      service_type: form.service_type,
      description: form.description || null,
      status: "pending",
      priority: form.priority,
      assigned_to: null,
      estimated_completion: form.estimated_completion || null,
      actual_completion: null,
      price: form.price ? parseFloat(form.price) : null,
      paid: false,
      payment_method: null,
      payment_date: null,
      tracking_number: null
    })
    
    if (order) {
      router.push(`/admin/orders/${order.id}`)
    } else {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <section className="py-20 lg:py-28">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">New Order</h1>
            <p className="text-muted-foreground">Create a new customer order</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>Enter the customer details for this order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer_name">Customer Name *</Label>
                <Input
                  id="customer_name"
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_email">Email Address *</Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={form.customer_email}
                  onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_phone">Phone Number</Label>
                <Input
                  id="customer_phone"
                  type="tel"
                  value={form.customer_phone}
                  onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>Specify the service and requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="service_type">Service Type *</Label>
                <Select
                  value={form.service_type}
                  onValueChange={(value) => setForm({ ...form, service_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="logo_design">Logo Design</SelectItem>
                    <SelectItem value="brand_identity">Brand Identity</SelectItem>
                    <SelectItem value="web_design">Web Design</SelectItem>
                    <SelectItem value="ui_ux">UI/UX Design</SelectItem>
                    <SelectItem value="illustration">Illustration</SelectItem>
                    <SelectItem value="marketing">Marketing Materials</SelectItem>
                    <SelectItem value="social_media">Social Media Graphics</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={form.priority}
                  onValueChange={(value) => setForm({ ...form, priority: value as OrderPriority })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_PRIORITIES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the project requirements..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Pricing & Timeline</CardTitle>
              <CardDescription>Set the price and estimated completion date</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimated_completion">Est. Completion</Label>
                  <Input
                    id="estimated_completion"
                    type="date"
                    value={form.estimated_completion}
                    onChange={(e) => setForm({ ...form, estimated_completion: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/orders">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Order
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
