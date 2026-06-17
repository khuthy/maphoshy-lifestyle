-- Maphoshy Lifestyle — Home Page Sections Images
-- Migration: 012_home_page_images
-- Standalone table for the About section (3 slots) and Portfolio Preview (5 slots)
-- on the home page, managed independently of portfolio_items.

CREATE TABLE IF NOT EXISTS public.home_page_images (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  section     text        NOT NULL CHECK (section IN ('about', 'portfolio_preview')),
  slot_number integer     NOT NULL CHECK (slot_number >= 1 AND slot_number <= 5),
  src         text        NOT NULL,
  alt         text        NOT NULL DEFAULT '',
  label       text        NOT NULL DEFAULT '',
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (section, slot_number)
);

ALTER TABLE public.home_page_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read home_page_images"
  ON public.home_page_images FOR SELECT USING (true);

CREATE POLICY "Service role full access home_page_images"
  ON public.home_page_images FOR ALL USING (auth.role() = 'service_role');
