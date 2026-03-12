"use client";

import { createClient } from "@/lib/supabase/client";

// Role types - mapped from Supabase profile roles
export type UserRole = "executive" | "director" | "operations_manager" | "community_moderator" | "design_lead" | "designer" | "client";

// Generate a deterministic account ID from UUID (VX-XXXXXX format)
export function generateAccountId(uuid: string): string {
  const hex = uuid.replace(/-/g, "").slice(0, 6).toUpperCase();
  return `VX-${hex}`;
}

// Profile type from Supabase
export interface Profile {
  id: string;
  username: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  banner_url?: string | null;
  roles: string[];
  role?: string; // Legacy single role field
  status?: string;
  availability?: string;
  account_id?: string;
  created_at: string;
}

// Legacy User interface for backward compatibility
export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  roles: UserRole[];
  createdAt: string;
  avatarUrl?: string | null;
  accountId: string;
}

// Convert Supabase profile to legacy User format
export function profileToUser(profile: Profile): User {
  // Handle both roles array and legacy role string
  const roles = profile.roles || (profile.role ? [profile.role] : ["customer"]);
  
  return {
    id: profile.id,
    name: profile.display_name || profile.username,
    email: profile.email,
    username: profile.username,
    roles: roles as UserRole[],
    createdAt: profile.created_at,
    avatarUrl: profile.avatar_url,
    accountId: profile.account_id || generateAccountId(profile.id),
  };
}

// Fetch all users/profiles from Supabase
export async function getUsers(): Promise<User[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching users:", error);
    return [];
  }

  return data.map(profileToUser);
}

// Fetch a single user by ID
export async function getUserById(id: string): Promise<User | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return profileToUser(data);
}

// Fetch user by username
export async function getUserByUsername(username: string): Promise<User | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username.toLowerCase())
    .single();

  if (error || !data) {
    return null;
  }

  return profileToUser(data);
}

// Update user profile
export async function updateUser(
  id: string,
  updates: Partial<{ display_name: string; avatar_url: string; roles: string[] }>
): Promise<User | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    console.error("Error updating user:", error);
    return null;
  }

  return profileToUser(data);
}

// Update user roles (admin only)
export async function updateUserRole(id: string, role: string | string[]): Promise<boolean> {
  const supabase = createClient();
  const roles = Array.isArray(role) ? role : [role];
  const { error } = await supabase
    .from("profiles")
    .update({ roles })
    .eq("id", id);

  if (error) {
    console.error("Error updating user role:", error);
    return false;
  }

  return true;
}

// Check if user has specific role
export function hasRole(user: User | null, role: UserRole): boolean {
  if (!user || !user.roles) return false;
  // Executive & Director have all permissions
  if (user.roles.includes("executive") || user.roles.includes("director")) return true;
  return user.roles.includes(role);
}

// Check if user has any of the specified roles
export function hasAnyRole(user: User | null, roles: UserRole[]): boolean {
  if (!user || !user.roles) return false;
  // Executive & Director have all permissions
  if (user.roles.includes("executive") || user.roles.includes("director")) return true;
  return roles.some((role) => user.roles.includes(role));
}

// Check if user is executive
export function isExecutive(user: User | null): boolean {
  if (!user || !user.roles) return false;
  return user.roles.includes("executive");
}

// Check if user is admin-level (executive or director)
export function isAdmin(user: User | null): boolean {
  if (!user || !user.roles) return false;
  return user.roles.includes("executive") || user.roles.includes("director");
}

// Check if user is staff (any role above client)
export function isStaff(user: User | null): boolean {
  if (!user || !user.roles) return false;
  return user.roles.some(r => ["executive", "director", "operations_manager", "community_moderator", "design_lead", "designer"].includes(r));
}

// Legacy functions kept for backward compatibility
const CURRENT_USER_KEY = "visoryx_current_user";

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  if (!stored) return null;
  return JSON.parse(stored);
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function logoutUser(): void {
  setCurrentUser(null);
}

// Login user by email (legacy compatibility - now uses Supabase auth)
export async function loginUser(email: string): Promise<User | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email.toLowerCase())
    .single();

  if (error || !data) {
    return null;
  }

  const user = profileToUser(data);
  setCurrentUser(user);
  return user;
}

// Add user (legacy compatibility - creates profile in Supabase)
export async function addUser(user: Omit<User, "id" | "createdAt">): Promise<User | null> {
  // Note: In the new auth system, users are created via Supabase Auth signup
  // This function is kept for backward compatibility but may not work without auth
  console.warn("addUser is deprecated. Use Supabase Auth signup instead.");
  
  const supabase = createClient();
  const newUser = {
    id: crypto.randomUUID(),
    username: user.username || user.email.split("@")[0],
    email: user.email,
    display_name: user.name,
    roles: user.roles || ["customer"],
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("profiles")
    .insert(newUser)
    .select()
    .single();

  if (error || !data) {
    console.error("Error adding user:", error);
    return null;
  }

  return profileToUser(data);
}

// Delete user (legacy compatibility)
export async function deleteUser(id: string): Promise<boolean> {
  // Note: Deleting from profiles table - the auth.users entry would need admin SDK
  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting user:", error);
    return false;
  }

  return true;
}
