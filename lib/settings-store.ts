"use client";

export type OrderStatus = "open" | "delayed" | "closed";

export interface ServiceStatus {
  status: OrderStatus;
  message: string;
}

export interface SiteSettings {
  branding: ServiceStatus;
  community: ServiceStatus;
  gaming: ServiceStatus;
  business: ServiceStatus;
  marketing: ServiceStatus;
  uiAssets: ServiceStatus;
  courses: ServiceStatus;
  companyName: string;
  logoUrl: string | null;
}

const SETTINGS_KEY = "visoryx_settings";

const defaultSettings: SiteSettings = {
  branding: { status: "open", message: "" },
  community: { status: "open", message: "" },
  gaming: { status: "open", message: "" },
  business: { status: "open", message: "" },
  marketing: { status: "open", message: "" },
  uiAssets: { status: "open", message: "" },
  courses: { status: "open", message: "" },
  companyName: "VisoryX",
  logoUrl: null,
};

export function getSettings(): SiteSettings {
  if (typeof window === "undefined") return defaultSettings;
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (!stored) return defaultSettings;
  try {
    return JSON.parse(stored);
  } catch {
    return defaultSettings;
  }
}

export function updateSettings(settings: Partial<SiteSettings>): SiteSettings {
  const current = getSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  return updated;
}

export function getOrderStatusInfo(status: OrderStatus): {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  dotColor: string;
} {
  switch (status) {
    case "open":
      return {
        label: "Open",
        description: "No backup, accepting orders",
        color: "text-green-600",
        bgColor: "bg-green-500/10 border-green-500/30",
        dotColor: "bg-green-500",
      };
    case "delayed":
      return {
        label: "Delayed",
        description: "Open but may be delayed",
        color: "text-yellow-600",
        bgColor: "bg-yellow-500/10 border-yellow-500/30",
        dotColor: "bg-yellow-500",
      };
    case "closed":
      return {
        label: "Closed",
        description: "Cannot order at this time",
        color: "text-red-600",
        bgColor: "bg-red-500/10 border-red-500/30",
        dotColor: "bg-red-500",
      };
  }
}
