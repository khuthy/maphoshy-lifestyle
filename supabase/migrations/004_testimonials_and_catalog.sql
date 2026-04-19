-- Maphoshy Lifestyle — Testimonials & Catalog
-- Migration: 004_testimonials_and_catalog
-- Adds testimonials CMS table and catalog fields to portfolio_items

-- ============================================================
-- TABLE: testimonials
-- ============================================================
create table if not exists public.testimonials (
  id            uuid primary key default gen_random_uuid(),
  quote         text not null,
  author        text not null,
  service       text not null default '',
  initials      text not null default '',
  display_order integer not null default 0,
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

alter table public.testimonials enable row level security;

-- Anyone can read active testimonials (needed by the public website)
create policy "Public read active testimonials"
  on public.testimonials for select
  using (active = true);

-- Only service role can write
create policy "Service role full access testimonials"
  on public.testimonials for all
  using (auth.role() = 'service_role');

create index testimonials_order_idx  on public.testimonials (display_order);
create index testimonials_active_idx on public.testimonials (active);

-- ============================================================
-- Seed default testimonials (from the hardcoded home page)
-- ============================================================
insert into public.testimonials (quote, author, service, initials, display_order, active)
values
  ('Maphoshy Lifestyle transformed the way I see myself. I walked out of our session feeling like a completely different woman — confident, put-together and ready for anything.',
   'Thandeka M.', 'Personal Style Consultation', 'TM', 1, true),
  ('I was sceptical about a personal stylist but they just get it. They listened, they understood my lifestyle and the results were beyond anything I imagined.',
   'Nomsa K.', 'Wardrobe Curation', 'NK', 2, true),
  ('The custom dress they made for my daughter''s graduation was perfect. Every detail was exactly right. We''ll be back for every occasion.',
   'Grace D.', 'Custom Design', 'GD', 3, true)
on conflict do nothing;

-- ============================================================
-- Extend portfolio_items with catalog fields
-- ============================================================
alter table public.portfolio_items
  add column if not exists price_range    text,
  add column if not exists show_in_catalog boolean not null default false;

create index if not exists portfolio_items_catalog_idx on public.portfolio_items (show_in_catalog);
