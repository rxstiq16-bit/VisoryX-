"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  DollarSign, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  Clock,
  FileText,
  Send,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PayrollEntry {
  id: string
  staffId: string
  staffName: string
  staffAvatar?: string
  role: string
  hoursWorked: number
  hourlyRate: number
  overtimeHours: number
  overtimeRate: number
  bonuses: number
  deductions: number
  grossPay: number
  netPay: number
  status: "pending" | "approved" | "paid" | "disputed"
}

export function Payroll() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024-03")

  const payrollData: PayrollEntry[] = [
    {
      id: "1",
      staffId: "1",
      staffName: "Alex Designer",
      role: "Senior Designer",
      hoursWorked: 160,
      hourlyRate: 45,
      overtimeHours: 8,
      overtimeRate: 67.5,
      bonuses: 500,
      deductions: 1200,
      grossPay: 8240,
      netPay: 7040,
      status: "approved",
    },
    {
      id: "2",
      staffId: "2",
      staffName: "Sam Artist",
      role: "Graphic Designer",
      hoursWorked: 152,
      hourlyRate: 35,
      overtimeHours: 0,
      overtimeRate: 52.5,
      bonuses: 200,
      deductions: 950,
      grossPay: 5520,
      netPay: 4570,
      status: "pending",
    },
    {
      id: "3",
      staffId: "3",
      staffName: "Jordan Dev",
      role: "UI Designer",
      hoursWorked: 168,
      hourlyRate: 40,
      overtimeHours: 12,
      overtimeRate: 60,
      bonuses: 300,
      deductions: 1100,
      grossPay: 7740,
      netPay: 6640,
      status: "paid",
    },
    {
      id: "4",
      staffId: "4",
      staffName: "Taylor Support",
      role: "Customer Support",
      hoursWorked: 120,
      hourlyRate: 25,
      overtimeHours: 4,
      overtimeRate: 37.5,
      bonuses: 100,
      deductions: 600,
      grossPay: 3250,
      netPay: 2650,
      status: "disputed",
    },
  ]

  const totalGross = payrollData.reduce((sum, p) => sum + p.grossPay, 0)
  const totalNet = payrollData.reduce((sum, p) => sum + p.netPay, 0)
  const totalHours = payrollData.reduce((sum, p) => sum + p.hoursWorked + p.overtimeHours, 0)

  const getStatusBadge = (status: PayrollEntry["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "approved":
        return <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">Approved</Badge>
      case "paid":
        return <Badge className="bg-green-500/20 text-green-600 border-green-500/30">Paid</Badge>
      case "disputed":
        return <Badge className="bg-red-500/20 text-red-600 border-red-500/30">Disputed</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Gross Pay</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalGross.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8.2% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Net Pay</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalNet.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">After deductions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours}</div>
            <p className="text-xs text-muted-foreground">Across all staff</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Staff Count</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payrollData.length}</div>
            <p className="text-xs text-muted-foreground">Active this period</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-03">March 2024</SelectItem>
              <SelectItem value="2024-02">February 2024</SelectItem>
              <SelectItem value="2024-01">January 2024</SelectItem>
            </SelectContent>
          </Select>
          <Input type="search" placeholder="Search staff..." className="w-64" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button>
            <Send className="h-4 w-4 mr-2" />
            Process Payroll
          </Button>
        </div>
      </div>

      {/* Payroll Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead className="text-right">Hours</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Overtime</TableHead>
                <TableHead className="text-right">Bonuses</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Gross Pay</TableHead>
                <TableHead className="text-right">Net Pay</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollData.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={entry.staffAvatar} />
                        <AvatarFallback>{entry.staffName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{entry.staffName}</div>
                        <div className="text-xs text-muted-foreground">{entry.role}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{entry.hoursWorked}h</TableCell>
                  <TableCell className="text-right">${entry.hourlyRate}/hr</TableCell>
                  <TableCell className="text-right">
                    {entry.overtimeHours > 0 ? (
                      <span className="text-yellow-600">{entry.overtimeHours}h @ ${entry.overtimeRate}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-green-600">+${entry.bonuses}</TableCell>
                  <TableCell className="text-right text-red-600">-${entry.deductions}</TableCell>
                  <TableCell className="text-right font-medium">${entry.grossPay.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-bold">${entry.netPay.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(entry.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {entry.status === "pending" && (
                        <Button variant="ghost" size="sm">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
