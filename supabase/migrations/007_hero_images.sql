-- Maphoshy Lifestyle — Hero Images
-- Migration: 007_hero_images
-- Adds show_in_hero flag to portfolio_items so the client can pick
-- up to 4 images to feature in the hero mosaic on the home page.

ALTER TABLE public.portfolio_items
  ADD COLUMN IF NOT EXISTS show_in_hero boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS portfolio_items_hero_idx ON public.portfolio_items (show_in_hero);
