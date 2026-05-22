-- ─── Influencer Applications Table ────────────────────────────────────────────
create table if not exists public.influencer_applications (
  id                        uuid primary key default gen_random_uuid(),

  -- Profile
  full_name                 text not null,
  email                     text not null,
  instagram_handle          text not null unique,
  other_platforms           text,
  niche                     text not null,

  -- Reach
  reach_bracket             text not null,   -- '1k-5k', '5k-10k', etc.
  avg_likes                 int default 0,
  avg_comments              int default 0,
  post_frequency            text,

  -- AI Collab
  ai_tools                  text[] default '{}',
  recent_collab_brand       text,
  recent_collab_url         text,
  recent_collab_description text,
  portfolio_url             text,
  why_join                  text not null,

  -- Admin fields
  status                    text not null default 'pending',  -- pending | approved | rejected
  credits_if_approved       int not null default 50,
  admin_notes               text,
  reviewed_by               text,
  reviewed_at               timestamptz,

  applied_at                timestamptz not null default now(),
  created_at                timestamptz not null default now()
);

-- Indexes
create index if not exists idx_influencer_status on public.influencer_applications(status);
create index if not exists idx_influencer_email  on public.influencer_applications(email);

-- RLS
alter table public.influencer_applications enable row level security;

-- Anyone can insert (apply)
create policy "Anyone can apply" on public.influencer_applications
  for insert with check (true);

-- Only service role can read/update (admin via API)
create policy "Service role full access" on public.influencer_applications
  for all using (true);
