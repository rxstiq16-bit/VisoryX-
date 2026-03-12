"use client";

import { createClient } from "@/lib/supabase/client";

export interface Review {
  id: string;
  customerName: string;
  designerName: string;
  review: string;
  rating: number;
  service?: string;
  response?: string;
  orderId?: string;
  status?: string;
  createdAt: string;
}

interface DbReview {
  id: string;
  customer_name: string;
  designer_name: string;
  review: string;
  rating: number;
  service: string | null;
  response: string | null;
  order_id: string | null;
  status: string | null;
  created_at: string;
}

function mapDbToReview(db: DbReview): Review {
  return {
    id: db.id,
    customerName: db.customer_name,
    designerName: db.designer_name,
    review: db.review,
    rating: db.rating,
    service: db.service || undefined,
    response: db.response || undefined,
    orderId: db.order_id || undefined,
    status: db.status || undefined,
    createdAt: db.created_at,
  };
}

export async function getReviews(): Promise<Review[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
    return (data || []).map(mapDbToReview);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return [];
  }
}

export async function addReview(review: Omit<Review, "id" | "createdAt">): Promise<Review | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        customer_name: review.customerName,
        designer_name: review.designerName,
        review: review.review,
        rating: review.rating,
        service: review.service || null,
        status: "published",
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding review:", error);
      return null;
    }
    return mapDbToReview(data);
  } catch (err) {
    console.error("Error adding review:", err);
    return null;
  }
}

export async function updateReview(id: string, updates: Partial<Omit<Review, "id">>): Promise<Review | null> {
  try {
    const supabase = createClient();
    const updateData: Record<string, unknown> = {};
    if (updates.customerName !== undefined) updateData.customer_name = updates.customerName;
    if (updates.designerName !== undefined) updateData.designer_name = updates.designerName;
    if (updates.review !== undefined) updateData.review = updates.review;
    if (updates.rating !== undefined) updateData.rating = updates.rating;
    if (updates.service !== undefined) updateData.service = updates.service;
    if (updates.response !== undefined) updateData.response = updates.response;

    const { data, error } = await supabase
      .from("reviews")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating review:", error);
      return null;
    }
    return mapDbToReview(data);
  } catch (err) {
    console.error("Error updating review:", err);
    return null;
  }
}

export async function deleteReview(id: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting review:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error deleting review:", err);
    return false;
  }
}
