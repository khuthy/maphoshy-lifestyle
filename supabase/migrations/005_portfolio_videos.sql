-- Maphoshy Lifestyle — Portfolio Videos
-- Migration: 005_portfolio_videos
-- Adds a portfolio_videos table for TikTok embed management

create table if not exists public.portfolio_videos (
  id            uuid primary key default gen_random_uuid(),
  tiktok_url    text not null,
  title         text not null default '',
  display_order integer not null default 0,
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

alter table public.portfolio_videos enable row level security;

-- Anyone can read active videos (needed by the public portfolio page)
create policy "Public read active videos"
  on public.portfolio_videos for select
  using (active = true);

-- Only service role can write
create policy "Service role full access videos"
  on public.portfolio_videos for all
  using (auth.role() = 'service_role');

create index portfolio_videos_order_idx  on public.portfolio_videos (display_order);
create index portfolio_videos_active_idx on public.portfolio_videos (active);
