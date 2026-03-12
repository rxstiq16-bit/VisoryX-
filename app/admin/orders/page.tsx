import { Suspense } from "react";
import { OrdersAdmin } from "@/components/admin/orders-admin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Orders | VisoryX Admin",
  description: "View and manage submitted orders",
};

export default function OrdersAdminPage() {
  return (
    <div className="p-6 lg:p-8">
      <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
        <OrdersAdmin />
      </Suspense>
    </div>
  );
}
