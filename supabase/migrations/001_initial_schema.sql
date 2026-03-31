-- Maphoshy Lifestyle — Initial Schema
-- Migration: 001_initial_schema
-- Created: 2026-03-31

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLE: bookings
-- ============================================================
create table if not exists public.bookings (
  id                  uuid primary key default gen_random_uuid(),
  reference           text unique not null,
  created_at          timestamptz not null default now(),
  client_name         text not null,
  client_email        text not null,
  client_phone        text not null,
  service_type        text not null check (
    service_type in (
      'consultation',
      'wardrobe',
      'shopping',
      'corporate',
      'event',
      'custom_garment',
      'alteration',
      'style_discovery'
    )
  ),
  service_details     jsonb,
  preferred_date      date,
  amount              numeric(10, 2) not null,
  payment_status      text not null default 'pending' check (
    payment_status in ('pending', 'paid', 'failed', 'cancelled')
  ),
  payfast_payment_id  text,
  notes               text,
  session_format      text check (
    session_format in ('video_call', 'in_person')
  )
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.bookings enable row level security;

-- Service role (used by API routes) has full access
create policy "Service role full access"
  on public.bookings
  for all
  using (auth.role() = 'service_role');

-- Anon users cannot read or write bookings
-- (all booking creation is done server-side via service role)

-- ============================================================
-- INDEXES
-- ============================================================
create index bookings_reference_idx on public.bookings (reference);
create index bookings_created_at_idx on public.bookings (created_at desc);
create index bookings_payment_status_idx on public.bookings (payment_status);
create index bookings_service_type_idx on public.bookings (service_type);
create index bookings_client_email_idx on public.bookings (client_email);
