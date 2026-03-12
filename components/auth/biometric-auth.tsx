"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Fingerprint, Smartphone, Shield, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BiometricCredential {
  id: string
  type: "fingerprint" | "face"
  deviceName: string
  createdAt: Date
  lastUsed?: Date
}

export function BiometricAuth() {
  const { toast } = useToast()
  const [isSupported, setIsSupported] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [credentials, setCredentials] = useState<BiometricCredential[]>([])

  useEffect(() => {
    // Check if WebAuthn is supported
    const checkSupport = async () => {
      if (window.PublicKeyCredential) {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        setIsSupported(available)
      }
    }
    checkSupport()

    // Load existing credentials (mock)
    setCredentials([
      {
        id: "1",
        type: "fingerprint",
        deviceName: "iPhone 15 Pro",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ])
    setIsEnabled(true)
  }, [])

  const registerBiometric = async () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Biometric authentication is not available on this device.",
        variant: "destructive",
      })
      return
    }

    setIsRegistering(true)

    try {
      // In production, this would use the WebAuthn API
      // const credential = await navigator.credentials.create({...})
      
      // Simulate registration
      await new Promise(resolve => setTimeout(resolve, 2000))

      const newCredential: BiometricCredential = {
        id: Math.random().toString(),
        type: "fingerprint",
        deviceName: navigator.userAgent.includes("iPhone") ? "iPhone" : 
                    navigator.userAgent.includes("Android") ? "Android Device" : 
                    "This Device",
        createdAt: new Date(),
      }

      setCredentials([...credentials, newCredential])
      setIsEnabled(true)

      toast({
        title: "Biometric Registered",
        description: "You can now use biometrics to sign in.",
      })
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Could not register biometric. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRegistering(false)
    }
  }

  const removeBiometric = (credentialId: string) => {
    setCredentials(credentials.filter(c => c.id !== credentialId))
    if (credentials.length <= 1) {
      setIsEnabled(false)
    }
    toast({
      title: "Biometric Removed",
      description: "The biometric credential has been removed.",
    })
  }

  const authenticateWithBiometric = async () => {
    if (!isSupported || credentials.length === 0) return

    try {
      // In production, this would use the WebAuthn API
      // const assertion = await navigator.credentials.get({...})
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Authenticated",
        description: "Biometric authentication successful.",
      })
      
      return true
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Biometric authentication failed. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5" />
            Biometric Authentication
          </CardTitle>
          <CardDescription>
            Use Face ID, Touch ID, or fingerprint to sign in quickly and securely
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Support Status */}
          <div className="flex items-center gap-3 rounded-lg border p-4">
            {isSupported ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">Biometrics Available</div>
                  <div className="text-sm text-muted-foreground">
                    Your device supports biometric authentication
                  </div>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="font-medium">Biometrics Not Available</div>
                  <div className="text-sm text-muted-foreground">
                    Your device or browser doesn't support biometric authentication
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Enable Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Biometric Sign-in</Label>
              <p className="text-sm text-muted-foreground">
                Skip password entry using your biometrics
              </p>
            </div>
            <Switch 
              checked={isEnabled && credentials.length > 0} 
              onCheckedChange={setIsEnabled}
              disabled={!isSupported || credentials.length === 0}
            />
          </div>

          {/* Register New */}
          {isSupported && (
            <Button 
              onClick={registerBiometric} 
              disabled={isRegistering}
              className="w-full"
            >
              {isRegistering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Fingerprint className="mr-2 h-4 w-4" />
                  Register This Device
                </>
              )}
            </Button>
          )}

          {/* Registered Devices */}
          {credentials.length > 0 && (
            <div className="space-y-3">
              <Label>Registered Devices</Label>
              {credentials.map((cred) => (
                <div
                  key={cred.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      {cred.type === "fingerprint" ? (
                        <Fingerprint className="h-5 w-5 text-primary" />
                      ) : (
                        <Smartphone className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{cred.deviceName}</div>
                      <div className="text-xs text-muted-foreground">
                        Added {cred.createdAt.toLocaleDateString()}
                        {cred.lastUsed && ` - Last used ${cred.lastUsed.toLocaleDateString()}`}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeBiometric(cred.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Security Info */}
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">How it works</p>
                <p className="mt-1">
                  Your biometric data never leaves your device. We use industry-standard 
                  WebAuthn protocol to verify your identity securely without storing 
                  sensitive biometric information on our servers.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for using biometric auth in other components
export function useBiometricAuth() {
  const [isAvailable, setIsAvailable] = useState(false)

  useEffect(() => {
    const check = async () => {
      if (window.PublicKeyCredential) {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        setIsAvailable(available)
      }
    }
    check()
  }, [])

  const authenticate = async (): Promise<boolean> => {
    if (!isAvailable) return false

    try {
      // WebAuthn authentication would go here
      await new Promise(resolve => setTimeout(resolve, 1000))
      return true
    } catch {
      return false
    }
  }

  return { isAvailable, authenticate }
}
