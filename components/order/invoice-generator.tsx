"use client"

import { useState, useRef } from 'react'
import { Download, Printer, Mail, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface InvoiceData {
  orderId: string
  invoiceNumber: string
  issueDate: string
  dueDate?: string
  customer: {
    name: string
    email: string
    phone?: string
    address?: string
  }
  items: {
    description: string
    quantity: number
    unitPrice: number
    total: number
  }[]
  subtotal: number
  tax?: number
  discount?: number
  total: number
  paid: boolean
  paidDate?: string
  paymentMethod?: string
  notes?: string
}

interface InvoiceGeneratorProps {
  order: {
    id: string
    customer_name: string
    customer_email: string
    customer_phone?: string | null
    service_type: string
    price: number | null
    paid: boolean
    payment_date?: string | null
    payment_method?: string | null
    created_at: string
  }
  trigger?: React.ReactNode
}

export function InvoiceGenerator({ order, trigger }: InvoiceGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const invoiceRef = useRef<HTMLDivElement>(null)

  const invoiceData: InvoiceData = {
    orderId: order.id,
    invoiceNumber: `INV-${order.id.slice(0, 8).toUpperCase()}`,
    issueDate: new Date(order.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    customer: {
      name: order.customer_name,
      email: order.customer_email,
      phone: order.customer_phone || undefined
    },
    items: [
      {
        description: order.service_type,
        quantity: 1,
        unitPrice: order.price || 0,
        total: order.price || 0
      }
    ],
    subtotal: order.price || 0,
    total: order.price || 0,
    paid: order.paid,
    paidDate: order.payment_date ? new Date(order.payment_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : undefined,
    paymentMethod: order.payment_method || undefined
  }

  const handleDownload = async () => {
    setIsGenerating(true)
    
    try {
      // Create a printable version
      const printContent = invoiceRef.current?.innerHTML
      if (!printContent) return

      const printWindow = window.open('', '_blank')
      if (!printWindow) return

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice ${invoiceData.invoiceNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 40px;
              color: #1a1a1a;
            }
            .invoice-header { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .logo { font-size: 24px; font-weight: bold; color: #7c3aed; }
            .invoice-title { text-align: right; }
            .invoice-title h1 { font-size: 28px; color: #7c3aed; margin-bottom: 8px; }
            .invoice-title p { color: #666; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 12px; text-transform: uppercase; color: #666; margin-bottom: 8px; letter-spacing: 0.5px; }
            .customer-info p { margin: 4px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { text-align: left; padding: 12px; background: #f5f5f5; border-bottom: 2px solid #e0e0e0; font-weight: 600; }
            td { padding: 12px; border-bottom: 1px solid #e0e0e0; }
            .text-right { text-align: right; }
            .totals { margin-top: 20px; }
            .totals-row { display: flex; justify-content: flex-end; padding: 8px 0; }
            .totals-label { width: 150px; text-align: right; padding-right: 20px; }
            .totals-value { width: 120px; text-align: right; font-weight: 500; }
            .total-final { font-size: 18px; font-weight: bold; border-top: 2px solid #1a1a1a; padding-top: 12px; margin-top: 8px; }
            .paid-badge { display: inline-block; background: #22c55e; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
            .unpaid-badge { display: inline-block; background: #ef4444; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
            .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px; }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div class="logo">VisoryX</div>
            <div class="invoice-title">
              <h1>INVOICE</h1>
              <p>${invoiceData.invoiceNumber}</p>
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between;">
            <div class="section">
              <div class="section-title">Bill To</div>
              <div class="customer-info">
                <p><strong>${invoiceData.customer.name}</strong></p>
                <p>${invoiceData.customer.email}</p>
                ${invoiceData.customer.phone ? `<p>${invoiceData.customer.phone}</p>` : ''}
              </div>
            </div>
            <div class="section" style="text-align: right;">
              <div class="section-title">Invoice Details</div>
              <p><strong>Invoice Date:</strong> ${invoiceData.issueDate}</p>
              <p><strong>Order ID:</strong> ${invoiceData.orderId.slice(0, 8).toUpperCase()}</p>
              <p style="margin-top: 12px;">
                ${invoiceData.paid 
                  ? `<span class="paid-badge">PAID</span>` 
                  : `<span class="unpaid-badge">UNPAID</span>`
                }
              </p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceData.items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">$${item.unitPrice.toFixed(2)}</td>
                  <td class="text-right">$${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row">
              <span class="totals-label">Subtotal:</span>
              <span class="totals-value">$${invoiceData.subtotal.toFixed(2)}</span>
            </div>
            ${invoiceData.tax ? `
              <div class="totals-row">
                <span class="totals-label">Tax:</span>
                <span class="totals-value">$${invoiceData.tax.toFixed(2)}</span>
              </div>
            ` : ''}
            ${invoiceData.discount ? `
              <div class="totals-row">
                <span class="totals-label">Discount:</span>
                <span class="totals-value">-$${invoiceData.discount.toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="totals-row total-final">
              <span class="totals-label">Total:</span>
              <span class="totals-value">$${invoiceData.total.toFixed(2)}</span>
            </div>
          </div>

          ${invoiceData.paid && invoiceData.paidDate ? `
            <div class="section" style="margin-top: 30px;">
              <p><strong>Payment received:</strong> ${invoiceData.paidDate}${invoiceData.paymentMethod ? ` via ${invoiceData.paymentMethod}` : ''}</p>
            </div>
          ` : ''}

          <div class="footer">
            <p>Thank you for your business!</p>
            <p style="margin-top: 8px;">VisoryX Design Services | support@visoryx.com</p>
          </div>
        </body>
        </html>
      `)
      
      printWindow.document.close()
      
      // Trigger print dialog for PDF save
      setTimeout(() => {
        printWindow.print()
      }, 250)
      
    } catch (error) {
      console.error('Error generating invoice:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePrint = () => {
    handleDownload()
  }

  const handleSendEmail = async () => {
    setIsSending(true)
    
    try {
      const response = await fetch('/api/invoices/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: invoiceData.orderId,
          customerEmail: invoiceData.customer.email,
          customerName: invoiceData.customer.name,
          invoiceNumber: invoiceData.invoiceNumber,
          total: invoiceData.total,
          items: invoiceData.items,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send invoice')
      }

      alert(`Invoice sent to ${invoiceData.customer.email}`)
    } catch (error) {
      console.error('Error sending invoice:', error)
      alert('Failed to send invoice. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Invoice
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Invoice {invoiceData.invoiceNumber}</DialogTitle>
          <DialogDescription>
            Preview and download the invoice for this order
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button onClick={handleDownload} disabled={isGenerating}>
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Download PDF
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleSendEmail} disabled={isSending}>
            {isSending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}
            Email to Customer
          </Button>
        </div>

        <div 
          ref={invoiceRef}
          className="border rounded-lg p-6 bg-white text-foreground max-h-[500px] overflow-auto"
        >
          {/* Invoice Preview */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-primary">VisoryX</h2>
              <p className="text-sm text-muted-foreground mt-1">Design Services</p>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-primary">INVOICE</h1>
              <p className="text-muted-foreground">{invoiceData.invoiceNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Bill To</p>
              <p className="font-semibold">{invoiceData.customer.name}</p>
              <p className="text-sm text-muted-foreground">{invoiceData.customer.email}</p>
              {invoiceData.customer.phone && (
                <p className="text-sm text-muted-foreground">{invoiceData.customer.phone}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Invoice Details</p>
              <p className="text-sm"><span className="text-muted-foreground">Date:</span> {invoiceData.issueDate}</p>
              <p className="text-sm"><span className="text-muted-foreground">Order:</span> {invoiceData.orderId.slice(0, 8).toUpperCase()}</p>
              <div className="mt-2">
                <span className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  invoiceData.paid 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                )}>
                  {invoiceData.paid ? 'PAID' : 'UNPAID'}
                </span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 text-sm font-semibold">Description</th>
                <th className="text-right py-3 text-sm font-semibold">Qty</th>
                <th className="text-right py-3 text-sm font-semibold">Price</th>
                <th className="text-right py-3 text-sm font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3">{item.description}</td>
                  <td className="py-3 text-right">{item.quantity}</td>
                  <td className="py-3 text-right">${item.unitPrice.toFixed(2)}</td>
                  <td className="py-3 text-right">${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${invoiceData.subtotal.toFixed(2)}</span>
              </div>
              {invoiceData.tax && (
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${invoiceData.tax.toFixed(2)}</span>
                </div>
              )}
              {invoiceData.discount && (
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Discount</span>
                  <span>-${invoiceData.discount.toFixed(2)}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between py-2 text-lg font-semibold">
                <span>Total</span>
                <span>${invoiceData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {invoiceData.paid && invoiceData.paidDate && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <span className="font-semibold">Payment received:</span> {invoiceData.paidDate}
                {invoiceData.paymentMethod && ` via ${invoiceData.paymentMethod}`}
              </p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>Thank you for your business!</p>
            <p className="mt-1">VisoryX Design Services | support@visoryx.com</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
