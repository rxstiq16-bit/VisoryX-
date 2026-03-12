import { createClient } from "@/lib/supabase/client";

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  designer: string;
  madeFor: string;
  image: string;
  createdAt?: string;
}

interface DbPortfolioItem {
  id: string;
  title: string;
  category: string;
  designer: string;
  made_for: string;
  image: string | null;
  created_at: string;
}

function mapFromDb(item: DbPortfolioItem): PortfolioItem {
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    designer: item.designer,
    madeFor: item.made_for,
    image: item.image || "",
    createdAt: item.created_at,
  };
}

export const defaultPortfolio: PortfolioItem[] = [
  {
    id: "default-1",
    title: "FSR - Staff Charger",
    category: "ERLC Liveries",
    designer: "VisoryX",
    madeFor: "Florida State Roleplay",
    image: "/portfolio/fsr-livery.png",
  },
  {
    id: "default-2",
    title: "SFRP - Server Logo",
    category: "Logo Design",
    designer: "VisoryX",
    madeFor: "SFRP Community",
    image: "/portfolio/sfrp-logo.png",
  },
  {
    id: "default-3",
    title: "NJSRP - Server Logo",
    category: "Logo Design",
    designer: "VisoryX",
    madeFor: "NJSRP Community",
    image: "/portfolio/logo-njsrp.png",
  },
  {
    id: "default-4",
    title: "Montgomery County Sheriff",
    category: "ERLC Liveries",
    designer: "VisoryX",
    madeFor: "Montgomery County RP",
    image: "/portfolio/livery-sheriff.png",
  },
  {
    id: "default-5",
    title: "Astro - Brand Logo",
    category: "Logo Design",
    designer: "VisoryX",
    madeFor: "Astro",
    image: "/portfolio/logo-astro-a.png",
  },
  {
    id: "default-6",
    title: "AD - Monogram Logo",
    category: "Logo Design",
    designer: "VisoryX",
    madeFor: "Astro Designs",
    image: "/portfolio/logo-astro-ad.png",
  },
  {
    id: "default-7",
    title: "FSRP - Command Truck",
    category: "ERLC Liveries",
    designer: "VisoryX",
    madeFor: "Florida State Roleplay",
    image: "/portfolio/livery-fsrp-truck.png",
  },
  {
    id: "default-8",
    title: "LNG - Bold Logotype",
    category: "Logo Design",
    designer: "VisoryX",
    madeFor: "LNG",
    image: "/portfolio/logo-lng.png",
  },
  {
    id: "default-9",
    title: "3D Letter Concept",
    category: "Logo Design",
    designer: "VisoryX",
    madeFor: "Concept Work",
    image: "/portfolio/logo-3d-letter.png",
  },
  {
    id: "default-10",
    title: "Infinity Designs - Invite Banner",
    category: "Banners",
    designer: "VisoryX",
    madeFor: "Infinity Designs",
    image: "/portfolio/banner-infinity.jpg",
  },
];

export async function getPortfolio(): Promise<PortfolioItem[]> {
  const supabase = createClient();
  if (!supabase) return defaultPortfolio;
  
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching portfolio:", error);
    return defaultPortfolio;
  }

  const dbItems = (data || []).map(mapFromDb);
  return dbItems.length > 0 ? dbItems : defaultPortfolio;
}

export async function addPortfolioItem(item: Omit<PortfolioItem, "id">): Promise<PortfolioItem | null> {
  const supabase = createClient();
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from("portfolio_items")
    .insert({
      title: item.title,
      category: item.category,
      designer: item.designer,
      made_for: item.madeFor,
      image: item.image || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding portfolio item:", error);
    return null;
  }

  return mapFromDb(data);
}

export async function updatePortfolioItem(id: string, updates: Partial<PortfolioItem>): Promise<void> {
  const supabase = createClient();
  if (!supabase) return;
  
  const dbUpdates: Record<string, unknown> = {};
  
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.designer !== undefined) dbUpdates.designer = updates.designer;
  if (updates.madeFor !== undefined) dbUpdates.made_for = updates.madeFor;
  if (updates.image !== undefined) dbUpdates.image = updates.image;

  const { error } = await supabase
    .from("portfolio_items")
    .update(dbUpdates)
    .eq("id", id);

  if (error) {
    console.error("Error updating portfolio item:", error);
  }
}

export async function deletePortfolioItem(id: string): Promise<void> {
  const supabase = createClient();
  if (!supabase) return;
  
  const { error } = await supabase
    .from("portfolio_items")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting portfolio item:", error);
  }
}
