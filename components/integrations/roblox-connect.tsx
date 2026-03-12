"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  CheckCircle, 
  Link2, 
  Unlink, 
  Loader2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Gamepad2,
  CreditCard,
  Image as ImageIcon
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RobloxConnectProps {
  className?: string
  initialConnected?: boolean
  robloxUsername?: string
  robloxId?: string
}

export function RobloxConnect({ 
  className, 
  initialConnected = false,
  robloxUsername,
  robloxId 
}: RobloxConnectProps) {
  const [isConnected, setIsConnected] = useState(initialConnected)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStep, setVerificationStep] = useState<"input" | "verify" | "success">("input")
  const [username, setUsername] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [copied, setCopied] = useState(false)
  const generatedCode = "VISORYX-" + Math.random().toString(36).substring(2, 8).toUpperCase()

  const handleStartVerification = () => {
    if (!username) return
    setVerificationCode(generatedCode)
    setVerificationStep("verify")
  }

  const handleVerify = async () => {
    setIsVerifying(true)
    // In production, this would verify the code in user's Roblox profile
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsConnected(true)
    setIsVerifying(false)
    setVerificationStep("success")
  }

  const handleDisconnect = async () => {
    setIsVerifying(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsConnected(false)
    setIsVerifying(false)
    setVerificationStep("input")
    setUsername("")
  }

  const copyCode = () => {
    navigator.clipboard.writeText(verificationCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="border-b bg-[#00A2FF]/5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#00A2FF] to-[#FF6B6B]">
            <Gamepad2 className="h-7 w-7 text-white" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              Roblox Integration
              {isConnected && (
                <Badge className="bg-emerald-500 text-white">Verified</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Link your Roblox account for seamless ordering
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isConnected ? (
          <div className="space-y-6">
            {/* Connected Account */}
            <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#00A2FF] to-[#FF6B6B]">
                  <span className="text-sm font-bold text-white">
                    {robloxUsername?.[0]?.toUpperCase() || username[0]?.toUpperCase() || "R"}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{robloxUsername || username || "Roblox User"}</p>
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  </div>
                  <p className="text-xs text-muted-foreground">ID: {robloxId || "123456789"}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDisconnect}
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Unlink className="mr-2 h-4 w-4" />
                )}
                Disconnect
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h4 className="font-medium">Available Features</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { icon: CreditCard, label: "Pay with Robux", desc: "Use gamepasses" },
                  { icon: ImageIcon, label: "Auto-Upload", desc: "Decals & assets" },
                  { icon: Gamepad2, label: "Game Services", desc: "Icons & thumbnails" },
                  { icon: CheckCircle, label: "Quick Delivery", desc: "Direct to Roblox" },
                ].map((feature) => (
                  <div
                    key={feature.label}
                    className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3"
                  >
                    <div className="rounded-lg bg-primary/10 p-2">
                      <feature.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{feature.label}</p>
                      <p className="text-xs text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* View Profile */}
            <Button variant="outline" className="w-full" asChild>
              <a 
                href={`https://www.roblox.com/users/${robloxId || "123456789"}/profile`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Roblox Profile
              </a>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {verificationStep === "input" && (
              <>
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Link your Roblox account to pay with Robux, get direct asset delivery, 
                    and access exclusive Roblox-specific services.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="roblox-username">Roblox Username</Label>
                    <Input
                      id="roblox-username"
                      placeholder="Enter your Roblox username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>

                  <Button 
                    className="w-full"
                    onClick={handleStartVerification}
                    disabled={!username}
                  >
                    <Link2 className="mr-2 h-4 w-4" />
                    Start Verification
                  </Button>
                </div>
              </>
            )}

            {verificationStep === "verify" && (
              <>
                <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <p className="mb-3 text-sm text-muted-foreground">
                    Add this code to your Roblox profile description:
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <code className="rounded-lg bg-background px-4 py-2 font-mono text-lg font-bold">
                      {verificationCode}
                    </code>
                    <Button variant="outline" size="icon" onClick={copyCode}>
                      {copied ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Instructions:</p>
                  <ol className="list-inside list-decimal space-y-1">
                    <li>Go to your Roblox profile settings</li>
                    <li>Add the code above to your description</li>
                    <li>Click verify below</li>
                    <li>Remove the code after verification</li>
                  </ol>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setVerificationStep("input")}
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={handleVerify}
                    disabled={isVerifying}
                  >
                    {isVerifying ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Verify Account
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
