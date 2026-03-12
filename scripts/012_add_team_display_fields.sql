-- Add team display fields to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS show_on_team BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS team_title TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS team_bio TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS team_sort_order INTEGER DEFAULT 0;
