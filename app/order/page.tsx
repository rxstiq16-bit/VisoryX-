import { OrderPageClient } from "./order-page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Place an Order | VisoryX",
  description: "Start your design project with VisoryX. Select your service, provide details, and let us bring your vision to life.",
};

export default function OrderPage() {
  return <OrderPageClient />;
}
