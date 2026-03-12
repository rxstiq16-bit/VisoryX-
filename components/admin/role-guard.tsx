"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface RoleGuardProps {
  allowedRoles: string[]
  children: React.ReactNode
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { profile, isLoading } = useAuth()
  const router = useRouter()

  const hasAccess = profile?.roles?.some((r: string) => allowedRoles.includes(r))

  useEffect(() => {
    if (!isLoading && profile && !hasAccess) {
      router.replace("/admin/dashboard")
    }
  }, [isLoading, profile, hasAccess, router])

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-sm font-medium">Access Denied</p>
        <p className="text-xs mt-1">You do not have permission to view this page.</p>
      </div>
    )
  }

  return <>{children}</>
}
