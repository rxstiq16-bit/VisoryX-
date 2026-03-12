import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { TicketView } from "@/components/tickets/ticket-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Design Ticket | VisoryX",
  description: "View and communicate about your design order",
};

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <TicketView ticketId={id} />
      <Footer />
    </main>
  );
}
