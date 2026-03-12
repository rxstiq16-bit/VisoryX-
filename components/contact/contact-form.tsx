"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { addContactSubmission } from "@/lib/contact-store";

const inquiryTypes = [
  { id: "general", label: "General" },
  { id: "custom", label: "Custom Project" },
  { id: "business", label: "Business" },
  { id: "support", label: "Support" },
];

export function ContactForm() {
  const [inquiryType, setInquiryType] = useState("general");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await addContactSubmission({ name: formData.name, email: formData.email, subject: formData.subject, message: formData.message, inquiryType });
    setIsSubmitting(false);
    if (result) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-card p-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/5">
          <Check className="h-10 w-10 text-primary" />
        </div>
        <h3 className="mt-8 text-3xl font-extrabold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Message Sent!</h3>
        <p className="mt-4 text-muted-foreground leading-relaxed">Thank you for reaching out. We will get back to you within 24-48 hours.</p>
        <Button onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", subject: "", message: "" }); }} variant="outline" className="mt-10 rounded-full px-8 h-12">
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-8 lg:p-12">
      <h2 className="text-2xl font-extrabold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Send us a message</h2>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">Fill out the form and we will respond as soon as possible.</p>

      {/* Inquiry Type */}
      <div className="mt-10">
        <Label className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Inquiry Type</Label>
        <div className="mt-4 flex flex-wrap gap-2">
          {inquiryTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setInquiryType(type.id)}
              className={cn(
                "rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300",
                inquiryType === type.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5"
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 space-y-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="space-y-3">
            <Label htmlFor="contact-name" className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Full Name</Label>
            <Input id="contact-name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" className="h-13 rounded-xl bg-background border-border/50 focus:border-primary/50 transition-colors" />
          </div>
          <div className="space-y-3">
            <Label htmlFor="contact-email" className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Email</Label>
            <Input id="contact-email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" className="h-13 rounded-xl bg-background border-border/50 focus:border-primary/50 transition-colors" />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="contact-subject" className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Subject</Label>
          <Input id="contact-subject" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="How can we help you?" className="h-13 rounded-xl bg-background border-border/50 focus:border-primary/50 transition-colors" />
        </div>

        <div className="space-y-3">
          <Label htmlFor="contact-message" className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Message</Label>
          <Textarea id="contact-message" rows={6} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Tell us more about your project..." className="rounded-xl bg-background border-border/50 focus:border-primary/50 transition-colors" />
        </div>

        <Button type="submit" className="magnetic-btn rounded-full px-10 h-14 text-xs font-bold uppercase tracking-[0.15em]" disabled={isSubmitting}>
          {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>) : (<><Send className="mr-2 h-4 w-4" />Send Message</>)}
        </Button>
      </form>
    </div>
  );
}
