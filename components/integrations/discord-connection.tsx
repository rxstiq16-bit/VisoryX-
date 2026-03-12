"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Loader2, Link as LinkIcon, Unlink, CheckCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

interface DiscordConnection {
  discord_id: string
  discord_username: string
  discord_avatar?: string
  is_verified: boolean
  connected_at: string
}

export function DiscordConnection() {
  const [connection, setConnection] = useState<DiscordConnection | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)
  const [showUnlinkDialog, setShowUnlinkDialog] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    const fetchConnection = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setIsLoading(false)
        return
      }

      const { data } = await supabase
        .from("discord_connections")
        .select("discord_id, discord_username, discord_avatar, is_verified, connected_at")
        .eq("user_id", user.id)
        .single()

      setConnection(data)
      setIsLoading(false)
    }

    fetchConnection()

    // Check for success/error in URL
    const params = new URLSearchParams(window.location.search)
    const success = params.get("success")
    const error = params.get("error")

    if (success === "discord_linked") {
      toast({
        title: "Discord Connected",
        description: "Your Discord account has been successfully linked!",
      })
      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname)
      fetchConnection()
    } else if (error) {
      toast({
        title: "Connection Failed",
        description: decodeURIComponent(error).replace(/_/g, " "),
        variant: "destructive",
      })
      window.history.replaceState({}, "", window.location.pathname)
    }
  }, [supabase, toast])

  const handleConnect = () => {
    setIsConnecting(true)
    window.location.href = "/api/auth/discord"
  }

  const handleUnlink = async () => {
    try {
      const response = await fetch("/api/auth/discord", { method: "DELETE" })

      if (response.ok) {
        setConnection(null)
        toast({
          title: "Discord Disconnected",
          description: "Your Discord account has been unlinked",
        })
      } else {
        throw new Error("Failed to unlink")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unlink Discord account",
        variant: "destructive",
      })
    } finally {
      setShowUnlinkDialog(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#5865F2] flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </div>
            <div>
              <CardTitle className="text-lg">Discord</CardTitle>
              <CardDescription>
                Link your Discord account for notifications
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {connection ? (
            <div className="space-y-4">
              {/* Connected Account */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                {connection.discord_avatar ? (
                  <Image
                    src={connection.discord_avatar}
                    alt="Discord Avatar"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#5865F2] flex items-center justify-center text-white font-bold">
                    {connection.discord_username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{connection.discord_username}</span>
                    {connection.is_verified && (
                      <Badge variant="secondary" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Connected {new Date(connection.connected_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Benefits</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Receive order updates via Discord DM
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Get message notifications instantly
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Access exclusive Discord channels
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open("https://discord.gg/visoryx", "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Join Server
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowUnlinkDialog(true)}
                >
                  <Unlink className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Connect your Discord account to receive real-time notifications about your orders,
                messages, and exclusive updates.
              </p>

              <Button onClick={handleConnect} disabled={isConnecting} className="w-full">
                {isConnecting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <LinkIcon className="h-4 w-4 mr-2" />
                )}
                Connect Discord
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Unlink Confirmation Dialog */}
      <AlertDialog open={showUnlinkDialog} onOpenChange={setShowUnlinkDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Discord?</AlertDialogTitle>
            <AlertDialogDescription>
              You will no longer receive Discord notifications for your orders and messages.
              You can reconnect at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnlink} className="bg-destructive text-destructive-foreground">
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
