import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { StatusDashboard } from "@/components/status-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Status | VisoryX",
  description: "Check the current status of VisoryX services and operations.",
};

export default function StatusPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <StatusDashboard />
      </main>
      <Footer />
    </div>
  );
}
