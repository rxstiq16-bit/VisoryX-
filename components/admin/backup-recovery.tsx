"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Download, Upload, Clock, CheckCircle, AlertTriangle, 
  HardDrive, RefreshCw, Calendar, Shield, Trash2
} from "lucide-react"

interface Backup {
  id: string
  type: "full" | "incremental" | "manual"
  size: string
  createdAt: Date
  status: "completed" | "in_progress" | "failed"
  items: { orders: number; users: number; files: number; settings: number }
}

export function BackupRecovery() {
  const [autoBackup, setAutoBackup] = useState(true)
  const [backupFrequency, setBackupFrequency] = useState("daily")
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [backupProgress, setBackupProgress] = useState(0)

  const backups: Backup[] = [
    {
      id: "1",
      type: "full",
      size: "2.4 GB",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "completed",
      items: { orders: 1547, users: 892, files: 3421, settings: 156 },
    },
    {
      id: "2",
      type: "incremental",
      size: "156 MB",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: "completed",
      items: { orders: 23, users: 5, files: 89, settings: 3 },
    },
    {
      id: "3",
      type: "manual",
      size: "2.3 GB",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: "completed",
      items: { orders: 1520, users: 880, files: 3300, settings: 150 },
    },
  ]

  const startBackup = async () => {
    setIsBackingUp(true)
    setBackupProgress(0)
    
    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsBackingUp(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const restoreBackup = (backupId: string) => {
    // Would trigger restore process
    console.log("Restoring backup:", backupId)
  }

  const getStatusIcon = (status: Backup["status"]) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in_progress": return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
      case "failed": return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
  }

  const getTypeColor = (type: Backup["type"]) => {
    switch (type) {
      case "full": return "bg-blue-500/10 text-blue-500"
      case "incremental": return "bg-green-500/10 text-green-500"
      case "manual": return "bg-purple-500/10 text-purple-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 hours ago</div>
            <p className="text-xs text-muted-foreground">Full backup - 2.4 GB</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">12.8 GB total storage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Retention</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30 days</div>
            <p className="text-xs text-muted-foreground">Auto-delete after</p>
          </CardContent>
        </Card>
      </div>

      {/* Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Backup Settings
          </CardTitle>
          <CardDescription>Configure automatic backups and retention policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatic Backups</Label>
              <p className="text-sm text-muted-foreground">
                Automatically create backups on a schedule
              </p>
            </div>
            <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
          </div>

          {autoBackup && (
            <div className="space-y-2">
              <Label>Backup Frequency</Label>
              <select
                value={backupFrequency}
                onChange={(e) => setBackupFrequency(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2"
              >
                <option value="hourly">Every hour</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={startBackup} disabled={isBackingUp}>
              {isBackingUp ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Backing up...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Create Backup Now
                </>
              )}
            </Button>
          </div>

          {isBackingUp && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Backup in progress...</span>
                <span>{backupProgress}%</span>
              </div>
              <Progress value={backupProgress} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <CardTitle>Backup History</CardTitle>
          <CardDescription>View and restore from previous backups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {backups.map((backup) => (
              <div
                key={backup.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(backup.status)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {backup.createdAt.toLocaleDateString()} {backup.createdAt.toLocaleTimeString()}
                      </span>
                      <Badge className={getTypeColor(backup.type)}>
                        {backup.type}
                      </Badge>
                      <Badge variant="outline">{backup.size}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {backup.items.orders} orders, {backup.items.users} users, {backup.items.files} files
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => restoreBackup(backup.id)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Restore
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
