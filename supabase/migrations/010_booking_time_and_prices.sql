-- ── Add time slot columns to bookings ────────────────────────────────────────
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS preferred_time         text,          -- e.g. "09:00"
  ADD COLUMN IF NOT EXISTS session_duration_hours numeric(3, 1); -- e.g. 1.5

-- ── Set consultation prices for all services ──────────────────────────────────
-- R 250 video call / R 350 in-person for every service (current rates as of 2025)
UPDATE public.service_content
SET
  price_video_call = 'R 250',
  price_in_person  = 'R 350';
