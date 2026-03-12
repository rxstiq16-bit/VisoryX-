"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Save, X, Upload, ImageIcon, Grid, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getPortfolio,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  type PortfolioItem,
} from "@/lib/portfolio-store";
import Image from "next/image";

const categories = [
  "Logo Design", "Branding", "Discord", "ERLC Liveries",
  "Gaming & Creator", "Social Media", "Banners", "Business", "UI & Assets", "Marketing",
];

export function PortfolioAdmin() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: "", category: "", designer: "Jonathan Drake Jr", madeFor: "", image: "",
  });

  useEffect(() => {
    const load = async () => {
      const items = await getPortfolio();
      setPortfolio(items);
      setIsLoading(false);
    };
    load();
  }, []);

  const refreshPortfolio = async () => {
    const items = await getPortfolio();
    setPortfolio(items);
  };

  const openAddDialog = () => {
    setEditingItem(null);
    setFormData({ title: "", category: "", designer: "Jonathan Drake Jr", madeFor: "", image: "" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title, category: item.category, designer: item.designer,
      madeFor: item.madeFor, image: item.image,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      await updatePortfolioItem(editingItem.id, formData);
    } else {
      await addPortfolioItem(formData);
    }
    await refreshPortfolio();
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this design?")) {
      await deletePortfolioItem(id);
      await refreshPortfolio();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Category counts
  const categoryCounts = portfolio.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Grid className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{portfolio.length} Designs</p>
            <p className="text-xs text-muted-foreground">{Object.keys(categoryCounts).length} categories</p>
          </div>
        </div>
        <Button onClick={openAddDialog} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Design
        </Button>
      </div>

      {/* Category pills */}
      {Object.keys(categoryCounts).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryCounts).map(([cat, count]) => (
            <Badge key={cat} variant="outline" className="border-border/50 text-xs text-muted-foreground">
              {cat} <span className="ml-1 text-primary">{count}</span>
            </Badge>
          ))}
        </div>
      )}

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {portfolio.map((item) => (
          <Card key={item.id} className="group border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
            <div className="aspect-[4/3] relative overflow-hidden bg-muted/30">
              {item.image ? (
                <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                </div>
              )}
              {/* Overlay actions */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                <Button size="icon" variant="secondary" className="h-9 w-9" onClick={() => openEditDialog(item)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="destructive" className="h-9 w-9" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <Badge variant="outline" className="mb-2 border-primary/20 text-[10px] font-bold uppercase tracking-wider text-primary">
                {item.category}
              </Badge>
              <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">For {item.madeFor} &middot; By {item.designer}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {portfolio.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 py-16">
          <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
          <p className="mt-4 text-sm font-medium text-foreground">No designs yet</p>
          <p className="text-xs text-muted-foreground">Add your first design to showcase your work</p>
          <Button onClick={openAddDialog} size="sm" className="mt-4 gap-2">
            <Plus className="h-3.5 w-3.5" />
            Add Design
          </Button>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{editingItem ? "Edit Design" : "Add New Design"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-2">
            <div className="space-y-2">
              <Label>Design Image</Label>
              <div className="flex flex-col gap-3">
                {formData.image && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border/50">
                    <Image src={formData.image} alt="Preview" fill className="object-cover" />
                    <Button type="button" size="icon" variant="destructive" className="absolute right-2 top-2 h-6 w-6" onClick={() => setFormData({ ...formData, image: "" })}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <label className="block">
                  <div className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/50 py-4 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary">
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <Input placeholder="Or paste image URL" value={formData.image.startsWith("data:") ? "" : formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Design Name</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., LCPD Crown Victoria Livery" required />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })} required>
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Designer</Label>
              <Input value={formData.designer} onChange={(e) => setFormData({ ...formData, designer: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Made For</Label>
              <Input value={formData.madeFor} onChange={(e) => setFormData({ ...formData, madeFor: e.target.value })} placeholder="e.g., Liberty County Roleplay" required />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" />
                {editingItem ? "Save Changes" : "Add Design"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
