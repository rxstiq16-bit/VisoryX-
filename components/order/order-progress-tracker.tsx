"use client";

import { CheckCircle, Circle, Clock, Loader2, Package, Paintbrush, Send, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type OrderStage =
  | "submitted"
  | "payment-verified"
  | "assigned"
  | "in-progress"
  | "review"
  | "revisions"
  | "completed"
  | "delivered";

const stages: { id: OrderStage; label: string; description: string; icon: typeof Circle }[] = [
  { id: "submitted", label: "Order Submitted", description: "Your order has been received", icon: Send },
  { id: "payment-verified", label: "Payment Verified", description: "Payment confirmed", icon: CheckCircle },
  { id: "assigned", label: "Designer Assigned", description: "A designer is working on your project", icon: Paintbrush },
  { id: "in-progress", label: "In Progress", description: "Your design is being created", icon: Loader2 },
  { id: "review", label: "Ready for Review", description: "Your design is ready to review", icon: Star },
  { id: "revisions", label: "Revisions", description: "Applying your feedback", icon: Clock },
  { id: "completed", label: "Completed", description: "Design finalized", icon: Package },
  { id: "delivered", label: "Delivered", description: "Files sent to you", icon: CheckCircle },
];

function getStageIndex(stage: OrderStage): number {
  return stages.findIndex((s) => s.id === stage);
}

export function OrderProgressTracker({
  currentStage,
  className,
}: {
  currentStage: OrderStage;
  className?: string;
}) {
  const currentIndex = getStageIndex(currentStage);

  return (
    <div className={cn("rounded-xl border border-border bg-card p-6", className)}>
      <h3
        className="text-lg font-semibold text-foreground mb-6"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Order Progress
      </h3>
      <div className="relative">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;

          return (
            <div key={stage.id} className="flex gap-4 pb-6 last:pb-0">
              {/* Vertical line + dot */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    isComplete && "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-primary bg-primary/10 text-primary",
                    isFuture && "border-border bg-background text-muted-foreground"
                  )}
                >
                  {isComplete ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Icon className={cn("h-4 w-4", isCurrent && "animate-pulse")} />
                  )}
                </div>
                {index < stages.length - 1 && (
                  <div
                    className={cn(
                      "w-0.5 flex-1 min-h-6",
                      index < currentIndex ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className="pb-2">
                <div
                  className={cn(
                    "font-medium",
                    isComplete && "text-primary",
                    isCurrent && "text-foreground",
                    isFuture && "text-muted-foreground"
                  )}
                >
                  {stage.label}
                  {isCurrent && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      Current
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">{stage.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
