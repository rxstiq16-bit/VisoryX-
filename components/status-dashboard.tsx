"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, XCircle, Clock, Activity, Megaphone, Sparkles, Info, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";

type ServiceStatus = "operational" | "degraded" | "outage" | "maintenance";

interface Service {
  name: string;
  status: ServiceStatus;
  description: string;
  uptime: string;
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "promo";
  status: string;
  priority: string;
  link: string | null;
  link_text: string | null;
  created_at: string;
  expires_at: string | null;
}

const defaultServices: Service[] = [
  { name: "Order System", status: "operational", description: "Accepting and processing orders", uptime: "99.9%" },
  { name: "Payment Processing (USD)", status: "operational", description: "Stripe checkout and payments", uptime: "99.9%" },
  { name: "Payment Processing (Robux)", status: "operational", description: "Robux payments via gamepass", uptime: "99.8%" },
  { name: "Design Ticket System", status: "operational", description: "Ticket creation and messaging", uptime: "99.9%" },
  { name: "File Delivery", status: "operational", description: "File uploads and deliveries", uptime: "99.7%" },
  { name: "Website & Dashboard", status: "operational", description: "Main website and admin panel", uptime: "99.9%" },
];

const statusConfig = {
  operational: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-500", label: "Operational" },
  degraded: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500", label: "Degraded" },
  outage: { icon: XCircle, color: "text-red-500", bg: "bg-red-500", label: "Outage" },
  maintenance: { icon: Clock, color: "text-blue-500", bg: "bg-blue-500", label: "Maintenance" },
};

const announcementConfig: Record<string, { icon: typeof Info; color: string; bg: string; border: string }> = {
  info: { icon: Info, color: "text-sky-400", bg: "bg-sky-500/5", border: "border-sky-500/20" },
  warning: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/5", border: "border-amber-500/20" },
  success: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/5", border: "border-emerald-500/20" },
  promo: { icon: Sparkles, color: "text-primary", bg: "bg-primary/5", border: "border-primary/20" },
};

function getOverallStatus(servicesList: Service[], hasWarnings: boolean): ServiceStatus {
  if (servicesList.some((s) => s.status === "outage")) return "outage";
  if (servicesList.some((s) => s.status === "degraded") || hasWarnings) return "degraded";
  if (servicesList.some((s) => s.status === "maintenance")) return "maintenance";
  return "operational";
}

function mapServiceStatus(status: string): ServiceStatus {
  if (status === "open") return "operational";
  if (status === "delayed") return "degraded";
  if (status === "closed") return "outage";
  return "operational";
}

export function StatusDashboard() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();

        // Fetch service statuses from Supabase
        const { data: svcData } = await supabase
          .from("service_statuses")
          .select("*")
          .order("label");

        if (svcData && svcData.length > 0) {
          setServices(svcData.map((s: { label: string; status: string; message: string }) => ({
            name: s.label,
            status: mapServiceStatus(s.status),
            description: s.message || "",
            uptime: "",
          })));
        }

        // Fetch announcements
        const { data } = await supabase
          .from("announcements")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false });

        if (data) {
          const now = new Date();
          setAnnouncements(
            data.filter((a: Announcement) => !a.expires_at || new Date(a.expires_at) > now)
          );
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const hasWarnings = announcements.some((a) => a.type === "warning");
  const overall = getOverallStatus(services, hasWarnings);
  const overallConfig = statusConfig[overall];
  const OverallIcon = overallConfig.icon;

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 mb-6">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">System Status</span>
          </div>
          <h1
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Service Status
          </h1>
        </div>

        {/* Overall Status */}
        <div
          className={cn(
            "mt-10 rounded-2xl border-2 p-6 text-center",
            overall === "operational"
              ? "border-green-500/30 bg-green-500/5"
              : overall === "degraded"
                ? "border-amber-500/30 bg-amber-500/5"
                : "border-red-500/30 bg-red-500/5"
          )}
        >
          <OverallIcon className={cn("h-10 w-10 mx-auto", overallConfig.color)} />
          <h2 className={cn("mt-3 text-2xl font-bold", overallConfig.color)} style={{ fontFamily: "var(--font-display)" }}>
            {overall === "operational"
              ? "All Systems Operational"
              : overall === "degraded"
                ? "Some Systems Degraded"
                : "System Outage Detected"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Last checked: {new Date().toLocaleString()}
          </p>
        </div>

        {/* Active Announcements */}
        {loading ? (
          <div className="mt-10 flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : announcements.length > 0 && (
          <div className="mt-10 space-y-3">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
              <Megaphone className="h-5 w-5 text-primary" />
              Active Announcements
            </h3>
            <div className="space-y-3">
              {announcements.map((ann) => {
                const config = announcementConfig[ann.type] || announcementConfig.info;
                const Icon = config.icon;
                return (
                  <div
                    key={ann.id}
                    className={cn("rounded-xl border p-5", config.bg, config.border)}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", config.color)} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm text-foreground">{ann.title}</h4>
                          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium capitalize", config.color, config.bg)}>
                            {ann.type}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{ann.message}</p>
                        {ann.link && (
                          <a
                            href={ann.link}
                            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline mt-2"
                          >
                            {ann.link_text || "Learn more"} &rarr;
                          </a>
                        )}
                        <p className="text-xs text-muted-foreground/50 mt-2">
                          Posted {format(new Date(ann.created_at), "MMM d, yyyy 'at' h:mm a")}
                          {ann.expires_at && (
                            <> &middot; Expires {format(new Date(ann.expires_at), "MMM d, yyyy")}</>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Services List */}
        <div className="mt-10 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-6 py-4">
            <h3 className="font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
              Services
            </h3>
          </div>
          <div className="divide-y divide-border">
            {services.map((service) => {
              const config = statusConfig[service.status];
              const Icon = config.icon;
              return (
                <div key={service.name} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <div className="font-medium text-foreground">{service.name}</div>
                    {service.description && <div className="text-sm text-muted-foreground">{service.description}</div>}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium", `${config.bg}/10 ${config.color}`)}>
                      <Icon className="h-3 w-3" />
                      {config.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Uptime bar (last 30 days visual) */}
        <div className="mt-10 rounded-2xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "var(--font-display)" }}>
            30-Day Uptime
          </h3>
          <div className="flex gap-0.5">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-8 flex-1 rounded-sm transition-colors hover:opacity-80",
                  i === 24 ? "bg-amber-500" : "bg-green-500"
                )}
                title={`Day ${i + 1}: ${i === 24 ? "Degraded" : "Operational"}`}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </div>
      </div>
    </section>
  );
}
