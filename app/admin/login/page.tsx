import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AdminLogin } from "@/components/admin/admin-login";

export const metadata = {
  title: "Admin Login | VisoryX",
  description: "Login to access the VisoryX admin panel",
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <AdminLogin />
      <Footer />
    </main>
  );
}
