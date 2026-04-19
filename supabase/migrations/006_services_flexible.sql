-- Maphoshy Lifestyle — Flexible Services
-- Migration: 006_services_flexible
-- Removes the hardcoded service_key check constraint so new services can be added freely.
-- Adds display_order and active columns for ordering and visibility control.

-- Drop the restrictive CHECK so any service_key value is allowed
ALTER TABLE public.service_content
  DROP CONSTRAINT IF EXISTS service_content_service_key_check;

-- Add display_order for manual ordering
ALTER TABLE public.service_content
  ADD COLUMN IF NOT EXISTS display_order integer not null default 0;

-- Add active flag for show/hide
ALTER TABLE public.service_content
  ADD COLUMN IF NOT EXISTS active boolean not null default true;

-- Seed display_order for the six built-in services
UPDATE public.service_content SET display_order = CASE service_key
  WHEN 'consultation'   THEN 1
  WHEN 'wardrobe'       THEN 2
  WHEN 'shopping'       THEN 3
  WHEN 'corporate'      THEN 4
  WHEN 'event'          THEN 5
  WHEN 'custom_garment' THEN 6
  ELSE 99
END;

CREATE INDEX IF NOT EXISTS service_content_order_idx  ON public.service_content (display_order);
CREATE INDEX IF NOT EXISTS service_content_active_idx ON public.service_content (active);
