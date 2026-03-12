"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, TrendingDown, Users, DollarSign, Mail, Phone, ArrowRight, RefreshCw } from "lucide-react"

interface ChurnRiskCustomer {
  id: string
  name: string
  email: string
  avatar?: string
  riskScore: number
  lastOrder: string
  orderCount: number
  lifetimeValue: number
  riskFactors: string[]
  recommendedAction: string
}

const atRiskCustomers: ChurnRiskCustomer[] = [
  {
    id: "1",
    name: "Alex Thompson",
    email: "alex@example.com",
    riskScore: 87,
    lastOrder: "45 days ago",
    orderCount: 8,
    lifetimeValue: 1240,
    riskFactors: ["No activity in 45 days", "Decreased order frequency", "Lower engagement"],
    recommendedAction: "Send re-engagement email with personalized offer",
  },
  {
    id: "2",
    name: "Jamie Wilson",
    email: "jamie@example.com",
    riskScore: 72,
    lastOrder: "32 days ago",
    orderCount: 4,
    lifetimeValue: 520,
    riskFactors: ["Support ticket unresolved", "Last order had revision"],
    recommendedAction: "Follow up on support ticket and offer discount",
  },
  {
    id: "3",
    name: "Morgan Lee",
    email: "morgan@example.com",
    riskScore: 65,
    lastOrder: "28 days ago",
    orderCount: 12,
    lifetimeValue: 2150,
    riskFactors: ["Cancelled subscription", "Browsing but not buying"],
    recommendedAction: "Personal outreach from account manager",
  },
  {
    id: "4",
    name: "Casey Brown",
    email: "casey@example.com",
    riskScore: 58,
    lastOrder: "21 days ago",
    orderCount: 3,
    lifetimeValue: 380,
    riskFactors: ["Low engagement rate", "Single category purchases"],
    recommendedAction: "Send category recommendations email",
  },
  {
    id: "5",
    name: "Taylor Smith",
    email: "taylor@example.com",
    riskScore: 54,
    lastOrder: "18 days ago",
    orderCount: 6,
    lifetimeValue: 890,
    riskFactors: ["Price sensitivity signals", "Cart abandonment"],
    recommendedAction: "Send loyalty discount code",
  },
]

const getRiskColor = (score: number) => {
  if (score >= 75) return "text-red-500 bg-red-500"
  if (score >= 50) return "text-yellow-500 bg-yellow-500"
  return "text-green-500 bg-green-500"
}

const getRiskLabel = (score: number) => {
  if (score >= 75) return "High Risk"
  if (score >= 50) return "Medium Risk"
  return "Low Risk"
}

export function ChurnPrediction() {
  const highRisk = atRiskCustomers.filter((c) => c.riskScore >= 75).length
  const mediumRisk = atRiskCustomers.filter((c) => c.riskScore >= 50 && c.riskScore < 75).length
  const totalAtRisk = atRiskCustomers.length
  const revenueAtRisk = atRiskCustomers.reduce((sum, c) => sum + c.lifetimeValue, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Churn Prediction</h2>
          <p className="text-muted-foreground">AI-powered customer retention insights</p>
        </div>
        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Analysis
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{highRisk}</p>
                <p className="text-sm text-muted-foreground">High Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <TrendingDown className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mediumRisk}</p>
                <p className="text-sm text-muted-foreground">Medium Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalAtRisk}</p>
                <p className="text-sm text-muted-foreground">Total At Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <DollarSign className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">${revenueAtRisk.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Revenue at Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>At-Risk Customers</CardTitle>
          <CardDescription>Customers predicted to churn based on behavioral analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead>LTV</TableHead>
                <TableHead>Risk Factors</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {atRiskCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={customer.avatar} />
                        <AvatarFallback>{customer.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${getRiskColor(customer.riskScore).split(" ")[0]}`}>{customer.riskScore}%</span>
                        <Badge className={getRiskColor(customer.riskScore).split(" ")[1]}>{getRiskLabel(customer.riskScore)}</Badge>
                      </div>
                      <Progress value={customer.riskScore} className="h-1.5" />
                    </div>
                  </TableCell>
                  <TableCell>{customer.lastOrder}</TableCell>
                  <TableCell>${customer.lifetimeValue}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {customer.riskFactors.map((factor, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{factor}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" title="Send email">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Call">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        View
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
          <CardDescription>AI-suggested interventions to prevent churn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {atRiskCustomers.slice(0, 3).map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={customer.avatar} />
                    <AvatarFallback>{customer.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.recommendedAction}</p>
                  </div>
                </div>
                <Button size="sm">Take Action</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
