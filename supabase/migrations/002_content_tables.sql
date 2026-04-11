-- Maphoshy Lifestyle — Content Tables
-- Migration: 002_content_tables
-- Adds CMS tables for portfolio, services, pricing and FAQs

-- ============================================================
-- TABLE: portfolio_items
-- ============================================================
create table if not exists public.portfolio_items (
  id            uuid primary key default gen_random_uuid(),
  src           text not null,
  alt           text not null,
  category      text not null check (
    category in ('styling', 'custom_garment', 'alteration', 'corporate', 'event')
  ),
  label         text not null,
  display_order integer not null default 0,
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

alter table public.portfolio_items enable row level security;

-- Anyone can read active portfolio items (needed by the public website)
create policy "Public read active portfolio"
  on public.portfolio_items for select
  using (active = true);

-- Only service role can write
create policy "Service role full access portfolio"
  on public.portfolio_items for all
  using (auth.role() = 'service_role');

create index portfolio_items_category_idx    on public.portfolio_items (category);
create index portfolio_items_order_idx       on public.portfolio_items (display_order);
create index portfolio_items_active_idx      on public.portfolio_items (active);

-- ============================================================
-- TABLE: service_content
-- ============================================================
create table if not exists public.service_content (
  id          uuid primary key default gen_random_uuid(),
  service_key text not null unique check (
    service_key in ('consultation', 'wardrobe', 'shopping', 'corporate', 'event', 'custom_garment')
  ),
  title       text not null,
  description text not null,
  includes    text[] not null default '{}',
  price_from  text not null,
  booking_key text not null,
  icon_name   text not null default 'Sparkles',
  updated_at  timestamptz not null default now()
);

alter table public.service_content enable row level security;

create policy "Public read service_content"
  on public.service_content for select
  using (true);

create policy "Service role full access service_content"
  on public.service_content for all
  using (auth.role() = 'service_role');

-- ============================================================
-- TABLE: pricing_entries
-- ============================================================
create table if not exists public.pricing_entries (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  description   text not null,
  price         text not null,
  note          text,
  highlight     boolean not null default false,
  booking_key   text not null,
  display_order integer not null default 0,
  active        boolean not null default true
);

alter table public.pricing_entries enable row level security;

create policy "Public read active pricing"
  on public.pricing_entries for select
  using (active = true);

create policy "Service role full access pricing"
  on public.pricing_entries for all
  using (auth.role() = 'service_role');

create index pricing_entries_order_idx on public.pricing_entries (display_order);

-- ============================================================
-- TABLE: faqs
-- ============================================================
create table if not exists public.faqs (
  id            uuid primary key default gen_random_uuid(),
  question      text not null,
  answer        text not null,
  display_order integer not null default 0,
  active        boolean not null default true
);

alter table public.faqs enable row level security;

create policy "Public read active faqs"
  on public.faqs for select
  using (active = true);

create policy "Service role full access faqs"
  on public.faqs for all
  using (auth.role() = 'service_role');

create index faqs_order_idx on public.faqs (display_order);
