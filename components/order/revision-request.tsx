"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Send, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Revision {
  id: string;
  ticketId: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "rejected";
  createdAt: string;
  completedAt?: string;
  response?: string;
}

export function RevisionRequest({
  ticketId,
  revisions = [],
  maxRevisions = 3,
  onSubmitRevision,
}: {
  ticketId: string;
  revisions?: Revision[];
  maxRevisions?: number;
  onSubmitRevision?: (description: string) => void;
}) {
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const usedRevisions = revisions.length;
  const remainingRevisions = maxRevisions - usedRevisions;
  const canRequest = remainingRevisions > 0;

  const handleSubmit = async () => {
    if (!description.trim() || !onSubmitRevision) return;
    setIsSubmitting(true);
    onSubmitRevision(description);
    setDescription("");
    setIsSubmitting(false);
  };

  const getStatusIcon = (status: Revision["status"]) => {
    switch (status) {
      case "pending": return <Clock className="h-3.5 w-3.5 text-amber-500" />;
      case "in-progress": return <RotateCcw className="h-3.5 w-3.5 text-blue-500 animate-spin" />;
      case "completed": return <CheckCircle className="h-3.5 w-3.5 text-green-500" />;
      case "rejected": return <AlertCircle className="h-3.5 w-3.5 text-red-500" />;
    }
  };

  const getStatusColor = (status: Revision["status"]) => {
    switch (status) {
      case "pending": return "bg-amber-500/10 text-amber-500";
      case "in-progress": return "bg-blue-500/10 text-blue-500";
      case "completed": return "bg-green-500/10 text-green-500";
      case "rejected": return "bg-red-500/10 text-red-500";
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-lg font-semibold text-foreground flex items-center gap-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <RotateCcw className="h-5 w-5 text-primary" />
          Revisions
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {usedRevisions}/{maxRevisions} used
          </span>
          <div className="flex gap-1">
            {Array.from({ length: maxRevisions }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-2 w-6 rounded-full",
                  i < usedRevisions ? "bg-primary" : "bg-border"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Previous revisions */}
      {revisions.length > 0 && (
        <div className="space-y-3 mb-6">
          {revisions.map((rev) => (
            <div key={rev.id} className="rounded-lg border border-border bg-secondary/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  Revision #{revisions.indexOf(rev) + 1}
                </span>
                <Badge className={getStatusColor(rev.status)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(rev.status)}
                    {rev.status.charAt(0).toUpperCase() + rev.status.slice(1)}
                  </span>
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{rev.description}</p>
              {rev.response && (
                <div className="mt-2 rounded-lg bg-primary/5 p-3 text-sm">
                  <span className="font-medium text-primary">Designer response: </span>
                  <span className="text-foreground">{rev.response}</span>
                </div>
              )}
              <div className="mt-2 text-xs text-muted-foreground">
                {new Date(rev.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New revision form */}
      {canRequest ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="revision-desc">What changes would you like?</Label>
            <Textarea
              id="revision-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the specific changes you'd like made..."
              rows={3}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {remainingRevisions} revision{remainingRevisions !== 1 ? "s" : ""} remaining
            </span>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!description.trim() || isSubmitting}
              className="gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              Submit Revision
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-amber-500/10 p-4 text-center">
          <AlertCircle className="h-5 w-5 text-amber-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-amber-500">
            All revisions used
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Additional revisions may be available at an extra cost. Contact us for details.
          </p>
        </div>
      )}
    </div>
  );
}
