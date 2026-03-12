"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Printer, Download } from "lucide-react"
import { format } from "date-fns"

interface InvoiceItem {
  name: string
  description?: string
  quantity: number
  unitPrice: number
}

interface InvoiceData {
  invoiceNumber: string
  issueDate: Date
  dueDate: Date
  status: "paid" | "pending" | "overdue"
  customer: {
    name: string
    email: string
    address?: string
  }
  items: InvoiceItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  notes?: string
  paymentMethod?: string
  paidAt?: Date
}

interface PrintInvoiceProps {
  invoice: InvoiceData
}

export function PrintInvoice({ invoice }: PrintInvoiceProps) {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    const printContent = printRef.current
    if (!printContent) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1a1a1a; }
            .invoice { max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .logo { font-size: 24px; font-weight: bold; color: #7c3aed; }
            .invoice-info { text-align: right; }
            .invoice-number { font-size: 20px; font-weight: bold; }
            .status { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
            .status-paid { background: #dcfce7; color: #166534; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-overdue { background: #fee2e2; color: #991b1b; }
            .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
            .party h3 { font-size: 12px; text-transform: uppercase; color: #6b7280; margin-bottom: 8px; }
            .party p { margin: 4px 0; }
            .items { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .items th { text-align: left; padding: 12px; border-bottom: 2px solid #e5e7eb; font-size: 12px; text-transform: uppercase; color: #6b7280; }
            .items td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
            .items .amount { text-align: right; }
            .totals { margin-left: auto; width: 300px; }
            .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
            .totals-row.total { border-top: 2px solid #1a1a1a; font-weight: bold; font-size: 18px; padding-top: 12px; }
            .notes { margin-top: 40px; padding: 20px; background: #f9fafb; border-radius: 8px; }
            .notes h3 { font-size: 12px; text-transform: uppercase; color: #6b7280; margin-bottom: 8px; }
            .footer { margin-top: 60px; text-align: center; color: #6b7280; font-size: 12px; }
            @media print { body { padding: 0; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const downloadPDF = () => {
    // In production, use a library like jsPDF or call an API
    handlePrint()
  }

  return (
    <div>
      {/* Print/Download Buttons */}
      <div className="flex gap-2 mb-6 print:hidden">
        <Button onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print Invoice
        </Button>
        <Button variant="outline" onClick={downloadPDF}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Invoice Preview */}
      <div ref={printRef} className="bg-white p-8 rounded-lg border shadow-sm">
        <div className="invoice">
          {/* Header */}
          <div className="header flex justify-between items-start mb-10">
            <div>
              <div className="logo text-2xl font-bold text-primary">VisoryX</div>
              <p className="text-sm text-muted-foreground mt-1">Premium Design Services</p>
            </div>
            <div className="invoice-info text-right">
              <div className="invoice-number text-xl font-bold">{invoice.invoiceNumber}</div>
              <div className={`status mt-2 inline-block px-3 py-1 rounded text-xs font-semibold uppercase
                ${invoice.status === "paid" ? "status-paid bg-green-100 text-green-800" : ""}
                ${invoice.status === "pending" ? "status-pending bg-yellow-100 text-yellow-800" : ""}
                ${invoice.status === "overdue" ? "status-overdue bg-red-100 text-red-800" : ""}
              `}>
                {invoice.status}
              </div>
            </div>
          </div>

          {/* Parties */}
          <div className="parties grid grid-cols-2 gap-10 mb-10">
            <div className="party">
              <h3 className="text-xs uppercase text-muted-foreground mb-2">From</h3>
              <p className="font-medium">VisoryX Design Studio</p>
              <p className="text-sm text-muted-foreground">hello@visoryx.com</p>
              <p className="text-sm text-muted-foreground">visoryx.com</p>
            </div>
            <div className="party">
              <h3 className="text-xs uppercase text-muted-foreground mb-2">Bill To</h3>
              <p className="font-medium">{invoice.customer.name}</p>
              <p className="text-sm text-muted-foreground">{invoice.customer.email}</p>
              {invoice.customer.address && (
                <p className="text-sm text-muted-foreground">{invoice.customer.address}</p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
            <div>
              <span className="text-muted-foreground">Issue Date:</span>
              <span className="ml-2 font-medium">{format(invoice.issueDate, "MMM d, yyyy")}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Due Date:</span>
              <span className="ml-2 font-medium">{format(invoice.dueDate, "MMM d, yyyy")}</span>
            </div>
            {invoice.paidAt && (
              <div>
                <span className="text-muted-foreground">Paid:</span>
                <span className="ml-2 font-medium">{format(invoice.paidAt, "MMM d, yyyy")}</span>
              </div>
            )}
          </div>

          {/* Items Table */}
          <table className="items w-full mb-8">
            <thead>
              <tr className="border-b-2">
                <th className="text-left py-3 text-xs uppercase text-muted-foreground">Description</th>
                <th className="text-center py-3 text-xs uppercase text-muted-foreground w-20">Qty</th>
                <th className="text-right py-3 text-xs uppercase text-muted-foreground w-28">Unit Price</th>
                <th className="text-right py-3 text-xs uppercase text-muted-foreground w-28">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-4">
                    <p className="font-medium">{item.name}</p>
                    {item.description && (
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    )}
                  </td>
                  <td className="text-center py-4">{item.quantity}</td>
                  <td className="text-right py-4">${item.unitPrice.toFixed(2)}</td>
                  <td className="text-right py-4 font-medium">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="totals ml-auto w-72">
            <div className="totals-row flex justify-between py-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${invoice.subtotal.toFixed(2)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="totals-row flex justify-between py-2 text-green-600">
                <span>Discount</span>
                <span>-${invoice.discount.toFixed(2)}</span>
              </div>
            )}
            {invoice.tax > 0 && (
              <div className="totals-row flex justify-between py-2">
                <span className="text-muted-foreground">Tax</span>
                <span>${invoice.tax.toFixed(2)}</span>
              </div>
            )}
            <div className="totals-row total flex justify-between py-3 border-t-2 border-foreground font-bold text-lg">
              <span>Total</span>
              <span>${invoice.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="notes mt-10 p-5 bg-muted/50 rounded-lg">
              <h3 className="text-xs uppercase text-muted-foreground mb-2">Notes</h3>
              <p className="text-sm">{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="footer mt-16 text-center text-xs text-muted-foreground">
            <p>Thank you for your business!</p>
            <p className="mt-1">Questions? Contact us at support@visoryx.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Export a demo component for testing
export function PrintInvoiceDemo() {
  const demoInvoice: InvoiceData = {
    invoiceNumber: "INV-2024-001",
    issueDate: new Date(),
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: "paid",
    paidAt: new Date(),
    customer: {
      name: "John Doe",
      email: "john@example.com",
      address: "123 Main St, New York, NY 10001",
    },
    items: [
      { name: "Logo Design", description: "Custom logo with 3 concepts", quantity: 1, unitPrice: 299 },
      { name: "Brand Guidelines", description: "Complete brand style guide", quantity: 1, unitPrice: 199 },
      { name: "Social Media Kit", description: "Templates for all platforms", quantity: 1, unitPrice: 149 },
    ],
    subtotal: 647,
    discount: 50,
    tax: 0,
    total: 597,
    notes: "Payment received via Stripe. All deliverables have been provided.",
    paymentMethod: "Credit Card",
  }

  return <PrintInvoice invoice={demoInvoice} />
}
