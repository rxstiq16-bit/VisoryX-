"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Loader2,
  Link as LinkIcon,
  Unlink,
  CheckCircle,
  Copy,
  ExternalLink,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
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

interface RobloxConnection {
  roblox_id: number
  roblox_username: string
  roblox_display_name: string
  roblox_avatar?: string
  is_verified: boolean
  verification_code?: string
  connected_at: string
}

export function RobloxConnection() {
  const [connection, setConnection] = useState<RobloxConnection | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationCode, setVerificationCode] = useState<string | null>(null)
  const [showUnlinkDialog, setShowUnlinkDialog] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = createClient()

  const fetchConnection = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setIsLoading(false)
      return
    }

    const { data } = await supabase
      .from("roblox_connections")
      .select("*")
      .eq("user_id", user.id)
      .single()

    setConnection(data)
    if (data && !data.is_verified && data.verification_code) {
      setVerificationCode(data.verification_code)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchConnection()
  }, [supabase])

  const handleStartVerification = async () => {
    if (!username.trim()) return

    setIsConnecting(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/roblox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      })

      const result = await response.json()

      if (result.success) {
        setVerificationCode(result.code)
        toast({
          title: "Verification Started",
          description: "Add the code to your Roblox profile to complete verification",
        })
        fetchConnection()
      } else {
        setError(result.error || "Failed to start verification")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleVerify = async () => {
    setIsVerifying(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/roblox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify" }),
      })

      const result = await response.json()

      if (result.success) {
        setVerificationCode(null)
        toast({
          title: "Roblox Verified",
          description: "Your Roblox account has been successfully linked!",
        })
        fetchConnection()
      } else {
        setError(result.error || "Verification failed")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleUnlink = async () => {
    try {
      const response = await fetch("/api/auth/roblox", { method: "DELETE" })

      if (response.ok) {
        setConnection(null)
        setVerificationCode(null)
        setUsername("")
        toast({
          title: "Roblox Disconnected",
          description: "Your Roblox account has been unlinked",
        })
      } else {
        throw new Error("Failed to unlink")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unlink Roblox account",
        variant: "destructive",
      })
    } finally {
      setShowUnlinkDialog(false)
    }
  }

  const copyCode = () => {
    if (verificationCode) {
      navigator.clipboard.writeText(verificationCode)
      toast({
        title: "Copied!",
        description: "Verification code copied to clipboard",
      })
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
            <div className="w-10 h-10 rounded-lg bg-[#FF5A5F] flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M5.164 0L.16 18.928l18.836 5.072L24 5.072 5.164 0zm7.468 17.804l-4.98-1.332 1.328-4.98 4.98 1.332-1.328 4.98z" />
              </svg>
            </div>
            <div>
              <CardTitle className="text-lg">Roblox</CardTitle>
              <CardDescription>
                Verify your Roblox account for game integrations
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {connection?.is_verified ? (
            <div className="space-y-4">
              {/* Verified Account */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                {connection.roblox_avatar ? (
                  <Image
                    src={connection.roblox_avatar}
                    alt="Roblox Avatar"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#FF5A5F] flex items-center justify-center text-white font-bold">
                    {connection.roblox_display_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{connection.roblox_display_name}</span>
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    @{connection.roblox_username}
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Benefits</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Claim in-game rewards for orders
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Display badges in supported games
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Exclusive Roblox developer perks
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    window.open(
                      `https://www.roblox.com/users/${connection.roblox_id}/profile`,
                      "_blank"
                    )
                  }
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Profile
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
          ) : verificationCode ? (
            <div className="space-y-4">
              {/* Pending Verification */}
              <Alert>
                <AlertDescription>
                  <p className="font-medium mb-2">Verification Required</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add this code anywhere in your Roblox profile description, then click verify:
                  </p>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg font-mono">
                    <span className="flex-1 text-lg">{verificationCode}</span>
                    <Button variant="ghost" size="icon" onClick={copyCode}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    window.open(
                      `https://www.roblox.com/users/${connection?.roblox_id}/profile`,
                      "_blank"
                    )
                  }
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button onClick={handleVerify} disabled={isVerifying}>
                  {isVerifying ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Verify
                </Button>
              </div>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setVerificationCode(null)
                  setConnection(null)
                }}
              >
                Cancel & Try Different Account
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Link your Roblox account to unlock exclusive in-game rewards and verify your
                ownership of games and assets.
              </p>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Input
                  placeholder="Enter your Roblox username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleStartVerification()}
                />
                <Button onClick={handleStartVerification} disabled={isConnecting || !username.trim()}>
                  {isConnecting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LinkIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Unlink Confirmation Dialog */}
      <AlertDialog open={showUnlinkDialog} onOpenChange={setShowUnlinkDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Roblox?</AlertDialogTitle>
            <AlertDialogDescription>
              You will lose access to Roblox-specific features and in-game rewards.
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
