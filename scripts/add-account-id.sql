-- Add account_id column for human-readable unique account identifiers
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS account_id TEXT UNIQUE;

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS profiles_account_id_idx ON public.profiles(account_id);

-- Generate account IDs for existing profiles that don't have one
-- Format: VX-XXXXXX (6 random alphanumeric chars)
UPDATE public.profiles 
SET account_id = 'VX-' || upper(substr(md5(random()::text || id::text), 1, 6))
WHERE account_id IS NULL;

-- Make account_id NOT NULL after backfill
ALTER TABLE public.profiles 
ALTER COLUMN account_id SET NOT NULL;

-- Create a function to auto-generate account_id for new profiles
CREATE OR REPLACE FUNCTION generate_account_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.account_id IS NULL THEN
    NEW.account_id := 'VX-' || upper(substr(md5(random()::text || NEW.id::text), 1, 6));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-assign account_id on insert
DROP TRIGGER IF EXISTS set_account_id ON public.profiles;
CREATE TRIGGER set_account_id
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION generate_account_id();
