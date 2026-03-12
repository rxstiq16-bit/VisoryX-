'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DollarSign,
  Users,
  MousePointer,
  TrendingUp,
  Copy,
  Check,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  Wallet
} from 'lucide-react'
import { toast } from 'sonner'

interface Affiliate {
  id: string
  user_id: string
  affiliate_code: string
  company_name?: string
  website?: string
  commission_rate: number
  total_earnings: number
  pending_payout: number
  paid_out: number
  total_clicks: number
  total_conversions: number
  status: string
  created_at: string
}

interface AffiliateDashboardContentProps {
  affiliate: Affiliate
}

// Mock conversion data
const MOCK_CONVERSIONS = [
  {
    id: '1',
    order_id: 'ORD-2024-001',
    order_total: 49.99,
    commission: 5.00,
    status: 'approved',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    order_id: 'ORD-2024-002',
    order_total: 129.99,
    commission: 13.00,
    status: 'pending',
    created_at: '2024-01-14T14:20:00Z'
  },
  {
    id: '3',
    order_id: 'ORD-2024-003',
    order_total: 79.99,
    commission: 8.00,
    status: 'paid',
    created_at: '2024-01-10T09:15:00Z'
  }
]

export function AffiliateDashboardContent({ affiliate }: AffiliateDashboardContentProps) {
  const [copied, setCopied] = useState(false)
  const affiliateLink = `https://visoryx.com/?ref=${affiliate.affiliate_code}`
  
  const conversionRate = affiliate.total_clicks > 0 
    ? ((affiliate.total_conversions / affiliate.total_clicks) * 100).toFixed(2)
    : '0.00'

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-blue-500/10 text-blue-500">Approved</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500/10 text-yellow-500">Pending</Badge>
      case 'paid':
        return <Badge className="bg-green-500/10 text-green-500">Paid</Badge>
      case 'rejected':
        return <Badge className="bg-red-500/10 text-red-500">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Affiliate Dashboard</h1>
            <Badge className="bg-green-500/10 text-green-500">Active</Badge>
          </div>
          <p className="text-muted-foreground">
            Track your performance, earnings, and manage your affiliate account.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-500">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold text-foreground">
                  ${affiliate.total_earnings.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-500">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Payout</p>
                <p className="text-2xl font-bold text-foreground">
                  ${affiliate.pending_payout.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <MousePointer className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
                <p className="text-2xl font-bold text-foreground">
                  {affiliate.total_clicks.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold text-foreground">{conversionRate}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Affiliate Link Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Affiliate Link</CardTitle>
            <CardDescription>
              Share this link to earn {(affiliate.commission_rate * 100).toFixed(0)}% commission on every sale
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Input
                  value={affiliateLink}
                  readOnly
                  className="pr-20 font-mono text-sm"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => copyToClipboard(affiliateLink)}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Button variant="outline" asChild>
                <a href={affiliateLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Preview
                </a>
              </Button>
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="font-medium">Code:</span>
                <code className="rounded bg-muted px-2 py-0.5 font-mono">
                  {affiliate.affiliate_code}
                </code>
              </div>
              <div>
                <span className="font-medium">Commission:</span> {(affiliate.commission_rate * 100).toFixed(0)}%
              </div>
              <div>
                <span className="font-medium">Conversions:</span> {affiliate.total_conversions}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Conversions and Payouts */}
        <Tabs defaultValue="conversions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="conversions">Conversions</TabsTrigger>
            <TabsTrigger value="payouts">Payout History</TabsTrigger>
            <TabsTrigger value="resources">Marketing Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="conversions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Conversions</CardTitle>
                <CardDescription>
                  Track orders made through your affiliate link
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Order Total</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_CONVERSIONS.map((conversion) => (
                      <TableRow key={conversion.id}>
                        <TableCell className="font-mono text-sm">
                          {conversion.order_id}
                        </TableCell>
                        <TableCell>
                          {new Date(conversion.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>${conversion.order_total.toFixed(2)}</TableCell>
                        <TableCell className="font-medium text-green-600">
                          +${conversion.commission.toFixed(2)}
                        </TableCell>
                        <TableCell>{getStatusBadge(conversion.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Payout History</CardTitle>
                  <CardDescription>
                    View your payout requests and history
                  </CardDescription>
                </div>
                <Button disabled={affiliate.pending_payout < 50}>
                  Request Payout
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Wallet className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">No payouts yet</h3>
                  <p className="text-sm text-muted-foreground">
                    You can request a payout once you reach $50 in approved commissions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>Marketing Resources</CardTitle>
                <CardDescription>
                  Download banners, logos, and promotional materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                    <CardContent className="p-6 text-center">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <ExternalLink className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-semibold">Banner Pack</h4>
                      <p className="text-sm text-muted-foreground">
                        300x250, 728x90, 160x600
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                    <CardContent className="p-6 text-center">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <ExternalLink className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-semibold">Logo Pack</h4>
                      <p className="text-sm text-muted-foreground">
                        PNG, SVG, Various sizes
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                    <CardContent className="p-6 text-center">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <ExternalLink className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-semibold">Social Media Kit</h4>
                      <p className="text-sm text-muted-foreground">
                        Posts, Stories, Templates
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
