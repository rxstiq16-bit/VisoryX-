"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { PortfolioAdmin } from "./portfolio-admin";

// Helper to check if user has a specific role
function hasRole(roles: string[] | undefined, role: string): boolean {
  return roles?.includes(role) || roles?.includes('executive') || false;
}

export function PortfolioAdminWrapper() {
  const router = useRouter();
  const { user, profile, isLoading, signOut } = useAuth();

  // Auth is handled by admin layout

  const handleLogout = async () => {
    await signOut();
    router.push("/admin/login");
  };

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="pt-20">
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-primary">
                  Admin Panel
                </p>
                <h1
                  className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Manage Portfolio
                </h1>
                <p className="mt-4 text-muted-foreground">
                  Add, edit, or remove designs from your portfolio.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
          <PortfolioAdmin />
        </div>
      </section>
    </main>
  );
}
