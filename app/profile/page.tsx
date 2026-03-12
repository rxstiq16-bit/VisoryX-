"use client"

import React, { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Camera, Save, Loader2, ImageIcon } from "lucide-react"
import { toast } from "sonner"

const statusOptions = [
  { value: "online", label: "Online", color: "bg-green-500" },
  { value: "away", label: "Away", color: "bg-yellow-500" },
  { value: "busy", label: "Busy", color: "bg-red-500" },
  { value: "offline", label: "Offline", color: "bg-muted-foreground" },
]

const roleColors: Record<string, string> = {
  executive: "bg-amber-500/15 text-amber-600 border-0",
  director: "bg-red-500/15 text-red-600 border-0",
  operations_manager: "bg-blue-500/15 text-blue-600 border-0",
  community_moderator: "bg-cyan-500/15 text-cyan-600 border-0",
  design_lead: "bg-teal-500/15 text-teal-600 border-0",
  designer: "bg-purple-500/15 text-purple-600 border-0",
  client: "bg-secondary text-secondary-foreground",
}

const roleLabel = (role: string) => role.replace(/_/g, " ")

function getSupabase() {
  return createClient()
}

export default function ProfilePage() {
  const { user, profile, isLoading: authLoading, refreshProfile } = useAuth()
  const supabase = getSupabase()

  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [statusMessage, setStatusMessage] = useState("")
  const [status, setStatus] = useState("online")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [bannerUrl, setBannerUrl] = useState<string | null>(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [orderNotifications, setOrderNotifications] = useState(true)

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "")
      setStatusMessage(profile.status_message || "")
      setStatus(profile.status || "online")
      setAvatarUrl(profile.avatar_url)
      setBannerUrl(profile.banner_url)
      setNotificationsEnabled(profile.notifications_enabled ?? true)
      setOrderNotifications(profile.order_notifications ?? true)
    }
  }, [profile])

  const handleSaveProfile = async () => {
    if (!user) return
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          status_message: statusMessage,
          status,
          avatar_url: avatarUrl,
          banner_url: bannerUrl,
          notifications_enabled: notificationsEnabled,
          order_notifications: orderNotifications,
        })
        .eq("id", user.id)
      if (error) throw error
      await refreshProfile()
      toast.success("Profile updated")
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setIsUploading(true)
    try {
      const fileExt = file.name.split(".").pop()
      const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`
      const { error: uploadError } = await getSupabase().storage
        .from("avatars")
        .upload(filePath, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data } = getSupabase().storage.from("avatars").getPublicUrl(filePath)
      setAvatarUrl(data.publicUrl)
      toast.success("Avatar uploaded - click Save to apply")
    } catch {
      toast.error("Failed to upload avatar")
    } finally {
      setIsUploading(false)
    }
  }

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setIsUploading(true)
    try {
      const fileExt = file.name.split(".").pop()
      const filePath = `${user.id}/banner-${Date.now()}.${fileExt}`
      const { error: uploadError } = await getSupabase().storage
        .from("banners")
        .upload(filePath, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data } = getSupabase().storage.from("banners").getPublicUrl(filePath)
      setBannerUrl(data.publicUrl)
      toast.success("Banner uploaded - click Save to apply")
    } catch {
      toast.error("Failed to upload banner")
    } finally {
      setIsUploading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
          {/* Skeleton banner */}
          <div className="relative mb-20">
            <div className="h-40 md:h-48 w-full rounded-xl bg-muted animate-pulse" />
            <div className="absolute -bottom-14 left-6">
              <div className="h-24 w-24 md:h-28 md:w-28 rounded-full bg-muted-foreground/20 border-4 border-background animate-pulse" />
            </div>
          </div>
          {/* Skeleton form */}
          <div className="space-y-4">
            <div className="h-8 w-48 rounded bg-muted animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-20 rounded bg-muted/60 animate-pulse" />
                  <div className="h-10 rounded-md bg-muted/40 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto max-w-4xl px-4 py-20">
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">You need to be logged in to view your profile.</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  const currentStatus = statusOptions.find(s => s.value === status) || statusOptions[0]
  const roles = profile.roles || ["client"]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
        {/* Banner + Avatar */}
        <div className="relative mb-20 overflow-visible">
          <div
            className="h-40 md:h-48 w-full rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 relative group overflow-hidden shadow-lg"
            style={bannerUrl ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
          >
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <div className="flex flex-col items-center gap-2 text-white">
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs font-medium">Change Banner</span>
              </div>
              <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" disabled={isUploading} />
            </label>
          </div>
          <div className="absolute -bottom-14 left-6">
            <div className="relative group">
              <Avatar className="h-24 w-24 md:h-28 md:w-28 border-4 border-background shadow-xl">
                <AvatarImage src={avatarUrl || undefined} alt={profile.username} />
                <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                  {profile.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="h-5 w-5 text-white" />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={isUploading} />
              </label>
              <div className={`absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full border-[3px] border-background ${currentStatus.color}`} />
            </div>
          </div>
        </div>


        {/* Name + Roles */}
        <div className="mb-8 px-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {profile.display_name || profile.username}
              </h1>
              <p className="text-sm text-muted-foreground">@{profile.username}</p>
              {statusMessage && (
                <p className="text-sm text-muted-foreground mt-1 italic">&ldquo;{statusMessage}&rdquo;</p>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {roles.map((role: string) => (
                <Badge key={role} className={`${roleColors[role] || roleColors.client} capitalize text-xs`}>
                  {roleLabel(role)}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your display name" />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${option.color}`} />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="statusMessage">Status Message</Label>
              <Textarea id="statusMessage" value={statusMessage} onChange={(e) => setStatusMessage(e.target.value)} placeholder="What's on your mind?" rows={2} className="resize-none" />
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Notifications</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">All Notifications</p>
                  <p className="text-xs text-muted-foreground">Master toggle</p>
                </div>
                <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Order Updates</p>
                  <p className="text-xs text-muted-foreground">Status changes on your orders</p>
                </div>
                <Switch checked={orderNotifications} onCheckedChange={setOrderNotifications} disabled={!notificationsEnabled} />
              </div>
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                ) : (
                  <><Save className="mr-2 h-4 w-4" />Save Changes</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
