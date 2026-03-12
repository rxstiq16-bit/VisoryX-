"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Printer, Download } from "lucide-react"

interface OrderPrintViewProps {
  order: {
    orderNumber: string
    title: string
    description?: string
    service: string
    status: string
    total: number
    subtotal: number
    tax?: number
    discount?: number
    timeline: string
    revisions: number
    addons?: { name: string; price: number }[]
    customer: { name: string; email: string }
    createdAt: string
    dueDate?: string
  }
}

export function OrderPrintView({ order }: OrderPrintViewProps) {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    const content = printRef.current
    if (!content) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order ${order.orderNumber} - VisoryX</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; }
            .logo { font-size: 24px; font-weight: bold; }
            .order-info { text-align: right; }
            .order-number { font-size: 18px; font-weight: bold; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 14px; font-weight: 600; color: #666; margin-bottom: 10px; text-transform: uppercase; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .label { color: #666; font-size: 12px; }
            .value { font-size: 14px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { text-align: left; padding: 12px; border-bottom: 1px solid #eee; }
            th { font-size: 12px; color: #666; font-weight: 600; }
            .totals { margin-top: 20px; text-align: right; }
            .total-row { display: flex; justify-content: flex-end; gap: 40px; margin-bottom: 8px; }
            .total-label { color: #666; }
            .grand-total { font-size: 18px; font-weight: bold; border-top: 2px solid #000; padding-top: 10px; margin-top: 10px; }
            .footer { margin-top: 60px; text-align: center; color: #999; font-size: 12px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={handlePrint}>
        <Printer className="h-4 w-4 mr-2" />
        Print Order
      </Button>

      <div ref={printRef} className="hidden">
        <div className="header">
          <div>
            <div className="logo">VisoryX</div>
            <div style={{ color: "#666", fontSize: "14px" }}>Premium Design Services</div>
          </div>
          <div className="order-info">
            <div className="order-number">Order {order.orderNumber}</div>
            <div style={{ color: "#666", fontSize: "14px" }}>
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-title">Order Details</div>
          <div className="grid">
            <div>
              <div className="label">Service</div>
              <div className="value">{order.service}</div>
            </div>
            <div>
              <div className="label">Status</div>
              <div className="value">{order.status}</div>
            </div>
            <div>
              <div className="label">Timeline</div>
              <div className="value">{order.timeline}</div>
            </div>
            <div>
              <div className="label">Revisions</div>
              <div className="value">{order.revisions}</div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-title">Customer</div>
          <div>
            <div className="value">{order.customer.name}</div>
            <div style={{ color: "#666" }}>{order.customer.email}</div>
          </div>
        </div>

        <div className="section">
          <div className="section-title">Project</div>
          <div className="value" style={{ fontWeight: 600 }}>{order.title}</div>
          {order.description && (
            <div style={{ marginTop: "10px", color: "#666" }}>{order.description}</div>
          )}
        </div>

        <div className="section">
          <div className="section-title">Pricing</div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{order.service}</td>
                <td style={{ textAlign: "right" }}>${order.subtotal.toFixed(2)}</td>
              </tr>
              {order.addons?.map((addon, i) => (
                <tr key={i}>
                  <td>{addon.name}</td>
                  <td style={{ textAlign: "right" }}>${addon.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="totals">
            <div className="total-row">
              <span className="total-label">Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount && order.discount > 0 && (
              <div className="total-row">
                <span className="total-label">Discount</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            {order.tax && order.tax > 0 && (
              <div className="total-row">
                <span className="total-label">Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
            )}
            <div className="total-row grand-total">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="footer">
          <p>Thank you for choosing VisoryX</p>
          <p>visoryx.design | support@visoryx.design</p>
        </div>
      </div>
    </>
  )
}
