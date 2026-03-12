"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { 
  CheckCircle, 
  Link2, 
  Unlink, 
  Bell, 
  MessageSquare, 
  Package,
  Trophy,
  Gift,
  Loader2,
  Copy,
  Check,
  ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DiscordConnectProps {
  className?: string
  initialConnected?: boolean
  discordUsername?: string
  discordId?: string
}

export function DiscordConnect({ 
  className, 
  initialConnected = false,
  discordUsername,
  discordId 
}: DiscordConnectProps) {
  const [isConnected, setIsConnected] = useState(initialConnected)
  const [isConnecting, setIsConnecting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    messages: true,
    deliveries: true,
    achievements: true,
    promotions: false,
  })

  const handleConnect = async () => {
    setIsConnecting(true)
    // In production, this would redirect to Discord OAuth
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsConnected(true)
    setIsConnecting(false)
  }

  const handleDisconnect = async () => {
    setIsConnecting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsConnected(false)
    setIsConnecting(false)
  }

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const botCommands = [
    { command: "!status [order-id]", description: "Check order status" },
    { command: "!orders", description: "View recent orders" },
    { command: "!points", description: "Check loyalty points" },
    { command: "!referral", description: "Get referral link" },
    { command: "!help", description: "Show all commands" },
  ]

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="border-b bg-[#5865F2]/5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5865F2]">
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              Discord Integration
              {isConnected && (
                <Badge className="bg-emerald-500 text-white">Connected</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Get order updates and support directly in Discord
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
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5865F2]">
                  <span className="text-sm font-bold text-white">
                    {discordUsername?.[0]?.toUpperCase() || "D"}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{discordUsername || "Discord User"}</p>
                  <p className="text-xs text-muted-foreground">ID: {discordId || "123456789"}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDisconnect}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Unlink className="mr-2 h-4 w-4" />
                )}
                Disconnect
              </Button>
            </div>

            {/* Notification Settings */}
            <div className="space-y-4">
              <h4 className="font-medium">Notification Preferences</h4>
              <div className="space-y-3">
                {[
                  { key: "orderUpdates", label: "Order Updates", icon: Package, desc: "Status changes and progress" },
                  { key: "messages", label: "Messages", icon: MessageSquare, desc: "Designer messages" },
                  { key: "deliveries", label: "Deliveries", icon: CheckCircle, desc: "When files are ready" },
                  { key: "achievements", label: "Achievements", icon: Trophy, desc: "Badges and milestones" },
                  { key: "promotions", label: "Promotions", icon: Gift, desc: "Deals and discounts" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label htmlFor={item.key} className="text-sm font-medium">
                          {item.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <Switch
                      id={item.key}
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={(checked) =>
                        setNotifications(prev => ({ ...prev, [item.key]: checked }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Bot Commands */}
            <div className="space-y-3">
              <h4 className="font-medium">Bot Commands</h4>
              <div className="space-y-2">
                {botCommands.map((cmd) => (
                  <div
                    key={cmd.command}
                    className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <code className="rounded bg-background px-2 py-1 text-xs font-mono">
                        {cmd.command}
                      </code>
                      <span className="text-sm text-muted-foreground">{cmd.description}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyCommand(cmd.command)}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Join Server */}
            <Button variant="outline" className="w-full" asChild>
              <a href="https://discord.gg/visoryx" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Join Our Discord Server
              </a>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-muted-foreground">
                Connect your Discord account to receive real-time notifications, 
                access exclusive channels, and use bot commands.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: Bell, label: "Real-time Notifications" },
                { icon: MessageSquare, label: "Direct Designer Chat" },
                { icon: Trophy, label: "Achievement Alerts" },
                { icon: Gift, label: "Exclusive Rewards" },
              ].map((feature) => (
                <div
                  key={feature.label}
                  className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3"
                >
                  <feature.icon className="h-5 w-5 text-[#5865F2]" />
                  <span className="text-sm">{feature.label}</span>
                </div>
              ))}
            </div>

            <Button 
              className="w-full bg-[#5865F2] hover:bg-[#4752C4]"
              onClick={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Link2 className="mr-2 h-4 w-4" />
              )}
              Connect Discord Account
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
