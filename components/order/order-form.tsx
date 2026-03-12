"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Shield,
  ChevronDown,
  MessageSquare,
  Palette,
  CreditCard,
  Gamepad2,
  Briefcase,
  Megaphone,
  Package,
  DollarSign,
  Copy,
  CheckCircle,
  LogIn,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { createTicket, type OrderType } from "@/lib/ticket-store";
import { createOrder } from "@/lib/orders";
import { PRODUCTS, formatPrice, formatRobux } from "@/lib/products";
import { StripeCheckout } from "@/components/checkout/stripe-checkout";
import { useAuth } from "@/components/auth-provider";
import { ServiceStatusBadges } from "@/components/service-status-badges";
import type { Service } from "@/lib/services";

// Fetcher for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Map services from DB to Product format for compatibility
function serviceToProduct(service: Service) {
  return {
    id: service.slug,
    name: service.name,
    description: service.short_description || service.description || "",
    priceInCents: Math.round(service.base_price * 100), // Convert dollars to cents
    robuxPrice: Math.round(service.base_price * 80), // 1 USD ≈ 80 Robux
    category: service.category,
  };
}

const serviceCategories = [
  {
    id: "branding",
    name: "Branding & Identity",
    icon: Palette,
    description: "Logos, brand kits & visual identity",
  },
  {
    id: "community",
    name: "Community & Discord",
    icon: MessageSquare,
    description: "Server setups, bots & community assets",
  },
  {
    id: "gaming",
    name: "Gaming & Creator Packs",
    icon: Gamepad2,
    description: "Liveries, overlays, thumbnails & esports graphics",
  },
  {
    id: "business",
    name: "Business & Startup Kits",
    icon: Briefcase,
    description: "Pitch decks, business cards & professional graphics",
  },
  {
    id: "marketing",
    name: "Marketing & Social Media",
    icon: Megaphone,
    description: "Social posts, ads, banners & promo graphics",
  },
  {
    id: "bundles",
    name: "Bundle Packages",
    icon: Package,
    description: "Save with our curated service bundles",
  },
];

const steps = [
  { id: 1, name: "Select Service" },
  { id: 2, name: "Project Details" },
  { id: 3, name: "Payment" },
  { id: 4, name: "Confirmation" },
];

export function OrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  // Fetch services from database
  const { data: dbServices, isLoading: servicesLoading } = useSWR<Service[]>(
    "/api/services",
    fetcher,
    { revalidateOnFocus: false }
  );

  // Map DB services to products format, fallback to static products
  const products = dbServices && dbServices.length > 0
    ? dbServices.map(serviceToProduct)
    : PRODUCTS;

  // Pre-select product from URL param (e.g. /order?product=logo-design)
  useEffect(() => {
    const productParam = searchParams.get("product");
    if (productParam && products.length > 0) {
      const matchedProduct = products.find(p => p.id === productParam);
      if (matchedProduct) {
        setSelectedProduct(matchedProduct.id);
        setCurrentStep(2);
      }
    }
  }, [searchParams, products]);
  const [paymentMethod, setPaymentMethod] = useState<"usd" | "robux" | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [robuxCopied, setRobuxCopied] = useState(false);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    description: "",
    timeline: "",
    reference: "",
    robloxUsername: "",
  });

  // Auto-fill from authenticated user profile
  useEffect(() => {
    if (profile) {
      setFormData((f) => ({
        ...f,
        name: f.name || profile.display_name || profile.username || "",
        email: f.email || profile.email || "",
      }));
    }
  }, [profile]);

  const product = products.find((p) => p.id === selectedProduct);

  const handleNext = () => {
    // Require login before proceeding past service selection
    if (currentStep === 1 && !user) {
      setShowAuthGate(true);
      return;
    }
    setShowAuthGate(false);
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getOrderType = (): OrderType => {
    if (!product) return "branding";
    const cat = product.category;
    if (cat === "bundles") return "branding";
    return cat as OrderType;
  };

  const handleRobuxConfirm = async () => {
    await submitOrder();
  };

  const submitOrder = async () => {
    if (!product) return;

    const order = await createOrder({
      user_id: user?.id || null,
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: null,
      service_type: product.name,
      description: `${formData.description}\n\nProject: ${formData.company || "Untitled"}\nTimeline: ${formData.timeline || "Not specified"}\nReferences: ${formData.reference || "None"}${formData.robloxUsername ? `\nRoblox: ${formData.robloxUsername}` : ""}`,
      status: "pending",
      priority: "normal",
      assigned_to: null,
      estimated_completion: null,
      actual_completion: null,
      price: product.priceInCents / 100,
      paid: paymentMethod === "usd",
      payment_method: paymentMethod === "usd" ? "stripe" : "robux",
      payment_date: paymentMethod === "usd" ? new Date().toISOString() : null,
      tracking_number: `VX-${Date.now().toString(36).toUpperCase()}`,
    });

    const customerId = `customer-${Date.now()}`;
    const ticket = await createTicket(
      order?.id || `temp-${Date.now()}`,
      customerId,
      formData.name,
      formData.email,
      getOrderType(),
      {
        service: product.name,
        package: paymentMethod === "robux" ? `Robux (${formatRobux(product.robuxPrice)})` : `USD (${formatPrice(product.priceInCents)})`,
        projectName: formData.company || "Untitled Project",
        description: formData.description,
        additionalNotes: `Payment: ${paymentMethod?.toUpperCase()}\nTimeline: ${formData.timeline || "Not specified"}\nReferences: ${formData.reference || "None provided"}${formData.robloxUsername ? `\nRoblox Username: ${formData.robloxUsername}` : ""}`,
      }
    );

    if (ticket) {
      localStorage.setItem(`ticket_guest_${ticket.id}`, customerId);
      localStorage.setItem("last_created_ticket", ticket.id);
      setTicketId(ticket.id);
    }

    setPaymentComplete(true);
    setCurrentStep(4);
  };

  const copyRobuxAmount = () => {
    if (product) {
      navigator.clipboard.writeText(product.robuxPrice.toString());
      setRobuxCopied(true);
      setTimeout(() => setRobuxCopied(false), 2000);
    }
  };

  return (
    <section className="py-20 lg:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">

        {/* Progress Steps */}
        <div className="mb-14">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-1 flex-col items-center">
                <div className="flex items-center w-full">
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300",
                      currentStep > step.id
                        ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : currentStep === step.id
                          ? "border-primary text-primary"
                          : "border-border/50 text-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn("h-0.5 flex-1 mx-3 rounded-full transition-colors", currentStep > step.id ? "bg-primary" : "bg-border/30")} />
                  )}
                </div>
                <span className={cn("mt-3 text-[10px] font-bold uppercase tracking-[0.15em] hidden sm:block transition-colors", currentStep >= step.id ? "text-foreground" : "text-muted-foreground/50")}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="rounded-2xl border border-border/30 bg-card p-8 lg:p-12 shadow-xl shadow-primary/[0.02]">
          {/* Step 1: Select Service */}
          {currentStep === 1 && (
            <div>
              <ServiceStatusBadges compact />
              <h2 className="mt-4 text-xl font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                Select a Service
              </h2>
              <p className="mt-2 text-muted-foreground">
                Choose the design service you need. Prices shown in USD and Robux.
              </p>

              {servicesLoading && (
                <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading services...</span>
                </div>
              )}

              <div className="mt-6 space-y-4">
                {serviceCategories.map((category) => {
                  const IconComponent = category.icon;
                  const categoryProducts = products.filter((p) => p.category === category.id);
                  if (categoryProducts.length === 0) return null;
                  const hasSelectedProduct = categoryProducts.some((p) => p.id === selectedProduct);
                  return (
                    <Collapsible key={category.id} defaultOpen={hasSelectedProduct}>
                      <CollapsibleTrigger className="w-full">
                        <div
                          className={cn(
                            "flex items-center justify-between rounded-xl border p-4 transition-all",
                            hasSelectedProduct
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                              <IconComponent className="h-5 w-5 text-primary" />
                            </div>
                            <div className="text-left">
                              <div className="font-medium text-foreground">{category.name}</div>
                              <div className="text-sm text-muted-foreground">{category.description}</div>
                            </div>
                          </div>
                          <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200" />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-2 ml-4 space-y-2 border-l-2 border-border pl-4">
                          {categoryProducts.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setSelectedProduct(p.id)}
                              className={cn(
                                "flex w-full items-center justify-between rounded-lg border p-3 text-left transition-all",
                                selectedProduct === p.id
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-foreground">{p.name}</div>
                                <div className="text-sm text-muted-foreground truncate">{p.description}</div>
                              </div>
                              <div className="flex items-center gap-4 ml-4">
                                <div className="text-right">
                                  <div className="font-semibold text-primary">{formatPrice(p.priceInCents)}</div>
                                  <div className="text-xs text-muted-foreground">{formatRobux(p.robuxPrice)}</div>
                                </div>
                                <div
                                  className={cn(
                                    "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
                                    selectedProduct === p.id
                                      ? "border-primary bg-primary"
                                      : "border-border"
                                  )}
                                >
                                  {selectedProduct === p.id && (
                                    <Check className="h-3 w-3 text-primary-foreground" />
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Project Details */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                Project Details
              </h2>
              <p className="mt-2 text-muted-foreground">
                Tell us about your project so we can deliver exactly what you need.
              </p>

              {/* Selected service summary */}
              {product && (
                <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">{product.name}</div>
                      <div className="text-sm text-muted-foreground">{product.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{formatPrice(product.priceInCents)}</div>
                      <div className="text-xs text-muted-foreground">{formatRobux(product.robuxPrice)}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company / Brand Name</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Your company or brand name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your project, goals, and any specific requirements..."
                  />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="timeline">Preferred Timeline</Label>
                    <Input
                      id="timeline"
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      placeholder="e.g., 2 weeks"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reference">Reference / Inspiration Links</Label>
                    <Input
                      id="reference"
                      value={formData.reference}
                      onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                Choose Payment Method
              </h2>
              <p className="mt-2 text-muted-foreground">
                Pay with USD via card or choose Robux.
              </p>

              {/* Order summary */}
              {product && (
                <div className="mt-4 rounded-lg border border-border bg-secondary/30 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">Order Summary</div>
                      <div className="mt-1 font-medium text-foreground">{product.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{formatPrice(product.priceInCents)}</div>
                      <div className="text-xs text-muted-foreground">or {formatRobux(product.robuxPrice)}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment method selection */}
              {!paymentMethod && (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("usd")}
                    className="flex flex-col items-center gap-3 rounded-xl border-2 border-border p-6 transition-all hover:border-primary hover:bg-primary/5"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
                      <CreditCard className="h-7 w-7 text-green-500" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-foreground">Pay with USD</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Credit/Debit card via Stripe
                      </div>
                      {product && (
                        <div className="mt-2 text-lg font-bold text-green-500">{formatPrice(product.priceInCents)}</div>
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("robux")}
                    className="flex flex-col items-center gap-3 rounded-xl border-2 border-border p-6 transition-all hover:border-primary hover:bg-primary/5"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <DollarSign className="h-7 w-7 text-primary" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-foreground">Pay with Robux</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Via Roblox gamepass or donation
                      </div>
                      {product && (
                        <div className="mt-2 text-lg font-bold text-primary">{formatRobux(product.robuxPrice)}</div>
                      )}
                    </div>
                  </button>
                </div>
              )}

              {/* USD Payment - Stripe Embedded Checkout */}
              {paymentMethod === "usd" && product && (
                <div className="mt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-medium text-foreground">Secure Card Payment</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPaymentMethod(null)}
                      className="text-muted-foreground"
                    >
                      Change method
                    </Button>
                  </div>
                  <div className="rounded-xl border border-border overflow-hidden">
                    <StripeCheckout
                      productId={product.id}
                      customerEmail={formData.email}
                      customerName={formData.name}
                      onComplete={() => {
                        submitOrder();
                      }}
                    />
                  </div>
                  <p className="mt-3 text-center text-sm text-muted-foreground">
                    Complete payment above. Your order will be created automatically.
                  </p>
                </div>
              )}

              {/* Robux Payment */}
              {paymentMethod === "robux" && product && (
                <div className="mt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-medium text-foreground">Robux Payment</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPaymentMethod(null)}
                      className="text-muted-foreground"
                    >
                      Change method
                    </Button>
                  </div>

                  <div className="rounded-xl border border-border bg-secondary/30 p-6 space-y-6">
                    {/* Roblox username field */}
                    <div className="space-y-2">
                      <Label htmlFor="roblox-username">Your Roblox Username *</Label>
                      <Input
                        id="roblox-username"
                        value={formData.robloxUsername}
                        onChange={(e) => setFormData({ ...formData, robloxUsername: e.target.value })}
                        placeholder="YourRobloxUsername"
                      />
                    </div>

                    {/* Amount to send */}
                    <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                      <div className="text-sm text-muted-foreground mb-1">Amount to send</div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>
                          {formatRobux(product.robuxPrice)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyRobuxAmount}
                          className="gap-1.5 bg-transparent"
                        >
                          {robuxCopied ? <CheckCircle className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          {robuxCopied ? "Copied" : "Copy"}
                        </Button>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">How to pay with Robux:</h4>
                      <ol className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex gap-2">
                          <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">1</span>
                          <span>Go to our Roblox gamepass (link will be provided in your ticket)</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">2</span>
                          <span>Purchase the gamepass for <strong className="text-foreground">{formatRobux(product.robuxPrice)}</strong></span>
                        </li>
                        <li className="flex gap-2">
                          <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">3</span>
                          <span>Your ticket will be created and a designer will verify payment</span>
                        </li>
                      </ol>
                    </div>

                    <Button
                      onClick={handleRobuxConfirm}
                      disabled={!formData.robloxUsername}
                      className="w-full gap-2"
                    >
                      <DollarSign className="h-4 w-4" />
                      Confirm Robux Order
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="text-center py-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h2
                className="mt-6 text-2xl font-semibold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Order Submitted!
              </h2>
              <p className="mt-2 text-muted-foreground">
                Thank you for your order. A private design ticket has been created for your project.
              </p>

              {ticketId && (
                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Ticket className="h-4 w-4" />
                  Ticket ID: {ticketId}
                </div>
              )}

              <div className="mt-8 rounded-xl border border-border bg-secondary/30 p-6">
                <div className="text-sm text-muted-foreground">Order Summary</div>
                <div className="mt-4 space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium text-foreground">{product?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment</span>
                    <span className="font-medium text-foreground">
                      {paymentMethod === "robux"
                        ? `Robux (${product ? formatRobux(product.robuxPrice) : ""})`
                        : `USD (${product ? formatPrice(product.priceInCents) : ""})`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium text-foreground">{formData.email || "--"}</span>
                  </div>
                  {formData.robloxUsername && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Roblox Username</span>
                      <span className="font-medium text-foreground">{formData.robloxUsername}</span>
                    </div>
                  )}
                </div>
              </div>

              {ticketId && (
                <div className="mt-6">
                  <Button
                    onClick={() => router.push(`/tickets/${ticketId}`)}
                    className="gap-2"
                  >
                    <Ticket className="h-4 w-4" />
                    View Your Ticket
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Auth Gate */}
          {showAuthGate && !user && (
            <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <LogIn className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-foreground">Sign in to continue</h4>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    You need an account to place an order. This links your order to your dashboard so you can track progress and download files.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link href="/auth/login?redirect=/order">
                      <Button size="sm" className="gap-2">
                        <LogIn className="h-3.5 w-3.5" />
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup?redirect=/order">
                      <Button variant="outline" size="sm">
                        Create Account
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep < 3 && (
            <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !selectedProduct) ||
                  (currentStep === 2 && (!formData.name || !formData.email || !formData.description))
                }
                className="gap-2"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Back button on payment step */}
          {currentStep === 3 && !paymentMethod && (
            <div className="mt-8 border-t border-border pt-6">
              <Button variant="ghost" onClick={handleBack} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </div>
          )}
        </div>

        {/* Trust Badge */}
        <div className="mt-10 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground/50">
          <Shield className="h-4 w-4" />
          <span>Your information is secure and never shared</span>
        </div>
      </div>
    </section>
  );
}
