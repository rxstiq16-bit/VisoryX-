import { PortfolioAdminWrapper } from "@/components/admin/portfolio-admin-wrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio Admin | VisoryX",
  description: "Manage your portfolio designs",
};

export default function PortfolioAdminPage() {
  return (
    <div className="p-6 lg:p-8">
      <PortfolioAdminWrapper />
    </div>
  );
}
