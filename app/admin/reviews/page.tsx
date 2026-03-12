import { Suspense } from "react";
import { ReviewsAdmin } from "@/components/admin/reviews-admin";

export const metadata = {
  title: "Reviews | VisoryX Admin",
  description: "Manage customer reviews",
};

export default function ReviewsAdminPage() {
  return (
    <div className="p-6 lg:p-8">
      <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
        <ReviewsAdmin />
      </Suspense>
    </div>
  );
}
