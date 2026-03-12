create table if not exists public.form_invitations (
  id uuid default gen_random_uuid() primary key,
  token text unique not null,
  form_type text not null,
  recipient_name text,
  recipient_email text,
  recipient_discord text,
  sent_via text default 'link',
  message text,
  prefill_data jsonb default '{}',
  created_by text,
  created_at timestamptz default now(),
  expires_at timestamptz,
  status text default 'pending',
  completed_at timestamptz,
  submission_id uuid
);

alter table public.form_invitations enable row level security;
create policy "Allow all for authenticated" on public.form_invitations for all to authenticated using (true) with check (true);
create policy "Allow anon read by token" on public.form_invitations for select to anon using (true);
create policy "Allow anon update by token" on public.form_invitations for update to anon using (true) with check (true);
