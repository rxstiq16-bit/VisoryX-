"use client"

import { useState } from 'react'
import { Shield, Smartphone, Key, Check, X, Loader2, Copy, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface TwoFactorAuthProps {
  enabled?: boolean
  onStatusChange?: (enabled: boolean) => void
}

export function TwoFactorAuth({ enabled = false, onStatusChange }: TwoFactorAuthProps) {
  const [isEnabled, setIsEnabled] = useState(enabled)
  const [setupDialogOpen, setSetupDialogOpen] = useState(false)
  const [disableDialogOpen, setDisableDialogOpen] = useState(false)
  const [step, setStep] = useState<'intro' | 'qr' | 'verify' | 'backup' | 'complete'>('intro')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [disableCode, setDisableCode] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  const generateSecret = () => {
    // Generate a random secret (in production, this would come from the server)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    let secret = ''
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return secret
  }

  const generateBackupCodes = () => {
    const codes: string[] = []
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substring(2, 6).toUpperCase() + '-' +
                   Math.random().toString(36).substring(2, 6).toUpperCase()
      codes.push(code)
    }
    return codes
  }

  const handleStartSetup = async () => {
    setIsLoading(true)
    setError('')

    try {
      const secret = generateSecret()
      setSecretKey(secret)
      
      // Generate QR code URL (otpauth format)
      const issuer = 'VisoryX'
      const supabase = createClient()
      const { data: { user } } = await supabase?.auth.getUser() || { data: { user: null } }
      const accountName = user?.email || 'user'
      
      const otpauthUrl = `otpauth://totp/${issuer}:${accountName}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`
      
      // Use a QR code API
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`)
      
      setStep('qr')
    } catch {
      setError('Failed to generate 2FA secret. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (otpCode.length !== 6) {
      setError('Please enter a 6-digit code')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // In production, verify the TOTP code on the server
      // For demo, accept any 6-digit code
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate backup codes
      const codes = generateBackupCodes()
      setBackupCodes(codes)
      
      // Save 2FA status to database
      const supabase = createClient()
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase.from('user_profiles').update({
            two_factor_enabled: true,
            two_factor_secret: secretKey // In production, encrypt this
          }).eq('id', user.id)
        }
      }
      
      setStep('backup')
    } catch {
      setError('Invalid verification code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteSetup = () => {
    setIsEnabled(true)
    onStatusChange?.(true)
    setSetupDialogOpen(false)
    setStep('intro')
    setOtpCode('')
    setSecretKey('')
    setQrCodeUrl('')
    setBackupCodes([])
  }

  const handleDisable2FA = async () => {
    if (disableCode.length !== 6) {
      setError('Please enter a 6-digit code')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // In production, verify the TOTP code on the server
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Disable 2FA in database
      const supabase = createClient()
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase.from('user_profiles').update({
            two_factor_enabled: false,
            two_factor_secret: null
          }).eq('id', user.id)
        }
      }
      
      setIsEnabled(false)
      onStatusChange?.(false)
      setDisableDialogOpen(false)
      setDisableCode('')
    } catch {
      setError('Invalid verification code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyBackupCodes = async () => {
    try {
      await navigator.clipboard.writeText(backupCodes.join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  const copySecretKey = async () => {
    try {
      await navigator.clipboard.writeText(secretKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              isEnabled ? "bg-green-100" : "bg-muted"
            )}>
              {isEnabled ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <X className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="font-medium">
                {isEnabled ? 'Enabled' : 'Disabled'}
              </p>
              <p className="text-sm text-muted-foreground">
                {isEnabled 
                  ? 'Your account is protected with 2FA'
                  : 'Enable 2FA for enhanced security'
                }
              </p>
            </div>
          </div>
          
          {isEnabled ? (
            <Dialog open={disableDialogOpen} onOpenChange={setDisableDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-red-600 hover:text-red-700">
                  Disable
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
                  <DialogDescription>
                    Enter your authenticator code to disable 2FA
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <Alert variant="destructive">
                    <AlertDescription>
                      Disabling 2FA will make your account less secure. Are you sure?
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={disableCode}
                      onChange={setDisableCode}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  
                  {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                  )}
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDisableDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDisable2FA}
                    disabled={isLoading || disableCode.length !== 6}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Disable 2FA
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog open={setupDialogOpen} onOpenChange={(open) => {
              setSetupDialogOpen(open)
              if (!open) {
                setStep('intro')
                setOtpCode('')
                setError('')
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Smartphone className="mr-2 h-4 w-4" />
                  Enable 2FA
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {step === 'intro' && 'Set Up Two-Factor Authentication'}
                    {step === 'qr' && 'Scan QR Code'}
                    {step === 'verify' && 'Verify Setup'}
                    {step === 'backup' && 'Save Backup Codes'}
                    {step === 'complete' && 'Setup Complete'}
                  </DialogTitle>
                  <DialogDescription>
                    {step === 'intro' && 'Add an authenticator app for enhanced security'}
                    {step === 'qr' && 'Scan this QR code with your authenticator app'}
                    {step === 'verify' && 'Enter the code from your authenticator app'}
                    {step === 'backup' && 'Save these codes in a safe place'}
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                  {step === 'intro' && (
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <h4 className="font-medium mb-2">Recommended Apps</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <Key className="h-4 w-4" />
                            Google Authenticator
                          </li>
                          <li className="flex items-center gap-2">
                            <Key className="h-4 w-4" />
                            Authy
                          </li>
                          <li className="flex items-center gap-2">
                            <Key className="h-4 w-4" />
                            1Password
                          </li>
                        </ul>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={handleStartSetup}
                        disabled={isLoading}
                      >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Continue Setup
                      </Button>
                    </div>
                  )}

                  {step === 'qr' && (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        {qrCodeUrl ? (
                          <img 
                            src={qrCodeUrl} 
                            alt="2FA QR Code" 
                            className="rounded-lg border"
                            width={200}
                            height={200}
                          />
                        ) : (
                          <div className="flex h-[200px] w-[200px] items-center justify-center rounded-lg border">
                            <QrCode className="h-16 w-16 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Or enter this key manually:</Label>
                        <div className="flex gap-2">
                          <Input 
                            value={secretKey} 
                            readOnly 
                            className="font-mono text-sm"
                          />
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={copySecretKey}
                          >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <Button className="w-full" onClick={() => setStep('verify')}>
                        Continue
                      </Button>
                    </div>
                  )}

                  {step === 'verify' && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground text-center">
                        Enter the 6-digit code from your authenticator app
                      </p>
                      
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={otpCode}
                          onChange={setOtpCode}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                      
                      {error && (
                        <p className="text-sm text-red-500 text-center">{error}</p>
                      )}
                      
                      <Button 
                        className="w-full" 
                        onClick={handleVerifyCode}
                        disabled={isLoading || otpCode.length !== 6}
                      >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Verify & Continue
                      </Button>
                    </div>
                  )}

                  {step === 'backup' && (
                    <div className="space-y-4">
                      <Alert>
                        <AlertDescription>
                          Save these backup codes somewhere safe. You can use them to access your account if you lose your authenticator device.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="rounded-lg border p-4 font-mono text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          {backupCodes.map((code, index) => (
                            <div key={index} className="rounded bg-muted px-2 py-1">
                              {code}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={copyBackupCodes}
                      >
                        {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                        Copy All Codes
                      </Button>
                      
                      <Button className="w-full" onClick={handleCompleteSetup}>
                        I've Saved My Codes
                      </Button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
