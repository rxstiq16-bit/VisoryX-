"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  Calendar,
  Star,
  MoreHorizontal,
  Grid,
  List
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface StaffMember {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  role: string
  department: string
  location: string
  startDate: string
  status: "active" | "on-leave" | "inactive"
  skills: string[]
  rating: number
  completedOrders: number
}

export function StaffDirectory() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [isAddingStaff, setIsAddingStaff] = useState(false)

  const staff: StaffMember[] = [
    {
      id: "1",
      name: "Alex Designer",
      email: "alex@visoryx.com",
      phone: "+1 (555) 123-4567",
      role: "Senior Designer",
      department: "Design",
      location: "New York, NY",
      startDate: "2022-03-15",
      status: "active",
      skills: ["Logo Design", "Branding", "ERLC Liveries"],
      rating: 4.9,
      completedOrders: 342,
    },
    {
      id: "2",
      name: "Sam Artist",
      email: "sam@visoryx.com",
      phone: "+1 (555) 234-5678",
      role: "Graphic Designer",
      department: "Design",
      location: "Los Angeles, CA",
      startDate: "2023-01-10",
      status: "active",
      skills: ["Illustrations", "UI Design", "Discord Graphics"],
      rating: 4.7,
      completedOrders: 156,
    },
    {
      id: "3",
      name: "Jordan Dev",
      email: "jordan@visoryx.com",
      phone: "+1 (555) 345-6789",
      role: "UI Designer",
      department: "Design",
      location: "Chicago, IL",
      startDate: "2022-08-20",
      status: "on-leave",
      skills: ["Web Design", "Figma", "Prototyping"],
      rating: 4.8,
      completedOrders: 234,
    },
    {
      id: "4",
      name: "Taylor Support",
      email: "taylor@visoryx.com",
      phone: "+1 (555) 456-7890",
      role: "Customer Support",
      department: "Support",
      location: "Remote",
      startDate: "2023-06-01",
      status: "active",
      skills: ["Customer Service", "Dispute Resolution", "Communication"],
      rating: 4.6,
      completedOrders: 0,
    },
  ]

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || member.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  const getStatusColor = (status: StaffMember["status"]) => {
    switch (status) {
      case "active": return "bg-green-500"
      case "on-leave": return "bg-yellow-500"
      case "inactive": return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Support">Support</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={isAddingStaff} onOpenChange={setIsAddingStaff}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogDescription>Add a new team member to the directory</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Full Name</Label>
                  <Input placeholder="Enter name" />
                </div>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="email@visoryx.com" />
                </div>
                <div className="grid gap-2">
                  <Label>Role</Label>
                  <Input placeholder="e.g., Graphic Designer" />
                </div>
                <div className="grid gap-2">
                  <Label>Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingStaff(false)}>Cancel</Button>
                <Button onClick={() => setIsAddingStaff(false)}>Add Staff</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Staff Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStaff.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                        getStatusColor(member.status)
                      )} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Assign Orders</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {member.email}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    {member.department}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {member.location}
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{member.rating}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {member.completedOrders} orders completed
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {member.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {member.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{member.skills.length - 3}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredStaff.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
                        getStatusColor(member.status)
                      )} />
                    </div>
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role} - {member.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{member.rating}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{member.completedOrders} orders</div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
