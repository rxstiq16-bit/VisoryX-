"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { BackupRecovery } from "@/components/admin/backup-recovery"

export default function AdminBackupsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Backup & Recovery</h1>
          <p className="text-muted-foreground">
            Manage automated backups and restore data when needed
          </p>
        </div>
        <BackupRecovery />
      </div>
    </AdminLayout>
  )
}
