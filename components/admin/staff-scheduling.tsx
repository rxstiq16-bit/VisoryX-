"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, Plus, ChevronLeft, ChevronRight, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, addDays, startOfWeek, isSameDay } from "date-fns"

interface Shift {
  id: string
  staffId: string
  staffName: string
  staffAvatar?: string
  date: Date
  startTime: string
  endTime: string
  type: "regular" | "overtime" | "on-call"
  status: "scheduled" | "confirmed" | "completed" | "absent"
}

interface StaffMember {
  id: string
  name: string
  avatar?: string
  role: string
  department: string
  hoursThisWeek: number
  maxHours: number
}

export function StaffScheduling() {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [isAddingShift, setIsAddingShift] = useState(false)

  const staff: StaffMember[] = [
    { id: "1", name: "Alex Designer", role: "Senior Designer", department: "Design", hoursThisWeek: 32, maxHours: 40 },
    { id: "2", name: "Sam Artist", role: "Graphic Designer", department: "Design", hoursThisWeek: 28, maxHours: 40 },
    { id: "3", name: "Jordan Dev", role: "UI Designer", department: "Design", hoursThisWeek: 40, maxHours: 40 },
    { id: "4", name: "Taylor Support", role: "Customer Support", department: "Support", hoursThisWeek: 20, maxHours: 30 },
  ]

  const shifts: Shift[] = [
    { id: "1", staffId: "1", staffName: "Alex Designer", date: addDays(currentWeek, 0), startTime: "09:00", endTime: "17:00", type: "regular", status: "confirmed" },
    { id: "2", staffId: "1", staffName: "Alex Designer", date: addDays(currentWeek, 1), startTime: "09:00", endTime: "17:00", type: "regular", status: "scheduled" },
    { id: "3", staffId: "2", staffName: "Sam Artist", date: addDays(currentWeek, 0), startTime: "10:00", endTime: "18:00", type: "regular", status: "confirmed" },
    { id: "4", staffId: "2", staffName: "Sam Artist", date: addDays(currentWeek, 2), startTime: "10:00", endTime: "18:00", type: "regular", status: "scheduled" },
    { id: "5", staffId: "3", staffName: "Jordan Dev", date: addDays(currentWeek, 1), startTime: "08:00", endTime: "16:00", type: "regular", status: "confirmed" },
    { id: "6", staffId: "4", staffName: "Taylor Support", date: addDays(currentWeek, 3), startTime: "12:00", endTime: "20:00", type: "on-call", status: "scheduled" },
  ]

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i))

  const getShiftsForDayAndStaff = (date: Date, staffId: string) => {
    return shifts.filter(s => s.staffId === staffId && isSameDay(s.date, date))
  }

  const getShiftColor = (type: Shift["type"]) => {
    switch (type) {
      case "regular": return "bg-primary/20 text-primary border-primary/30"
      case "overtime": return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
      case "on-call": return "bg-orange-500/20 text-orange-600 border-orange-500/30"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setCurrentWeek(addDays(currentWeek, -7))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold">
            {format(currentWeek, "MMM d")} - {format(addDays(currentWeek, 6), "MMM d, yyyy")}
          </h3>
          <Button variant="outline" size="icon" onClick={() => setCurrentWeek(addDays(currentWeek, 7))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Dialog open={isAddingShift} onOpenChange={setIsAddingShift}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Shift
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Shift</DialogTitle>
              <DialogDescription>Schedule a new shift for a staff member</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Staff Member</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff" />
                  </SelectTrigger>
                  <SelectContent>
                    {staff.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Date</Label>
                <Input type="date" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Start Time</Label>
                  <Input type="time" defaultValue="09:00" />
                </div>
                <div className="grid gap-2">
                  <Label>End Time</Label>
                  <Input type="time" defaultValue="17:00" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Shift Type</Label>
                <Select defaultValue="regular">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="overtime">Overtime</SelectItem>
                    <SelectItem value="on-call">On-Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingShift(false)}>Cancel</Button>
              <Button onClick={() => setIsAddingShift(false)}>Add Shift</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Schedule Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left font-medium w-48">Staff</th>
                  {weekDays.map((day) => (
                    <th key={day.toISOString()} className="p-4 text-center font-medium min-w-32">
                      <div className="text-sm text-muted-foreground">{format(day, "EEE")}</div>
                      <div className={cn(
                        "text-lg",
                        isSameDay(day, new Date()) && "text-primary font-bold"
                      )}>
                        {format(day, "d")}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member.id} className="border-b">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{member.name}</div>
                          <div className="text-xs text-muted-foreground">{member.hoursThisWeek}h / {member.maxHours}h</div>
                        </div>
                      </div>
                    </td>
                    {weekDays.map((day) => {
                      const dayShifts = getShiftsForDayAndStaff(day, member.id)
                      return (
                        <td key={day.toISOString()} className="p-2 text-center">
                          {dayShifts.map((shift) => (
                            <div
                              key={shift.id}
                              className={cn(
                                "text-xs p-2 rounded border mb-1 cursor-pointer hover:opacity-80",
                                getShiftColor(shift.type)
                              )}
                            >
                              <div className="font-medium">{shift.startTime} - {shift.endTime}</div>
                              <div className="capitalize">{shift.type}</div>
                            </div>
                          ))}
                          {dayShifts.length === 0 && (
                            <Button variant="ghost" size="sm" className="w-full h-12 border-dashed border-2 text-muted-foreground">
                              <Plus className="h-3 w-3" />
                            </Button>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Staff Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        {staff.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar>
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-xs text-muted-foreground">{member.role}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hours this week</span>
                  <span className="font-medium">{member.hoursThisWeek}h</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full",
                      member.hoursThisWeek >= member.maxHours ? "bg-yellow-500" : "bg-primary"
                    )}
                    style={{ width: `${(member.hoursThisWeek / member.maxHours) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  {member.maxHours - member.hoursThisWeek}h remaining
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
