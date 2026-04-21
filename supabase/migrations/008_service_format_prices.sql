-- Add per-format pricing to service_content
-- Used by services that offer both video call and in-person sessions at different rates

ALTER TABLE public.service_content
  ADD COLUMN IF NOT EXISTS price_video_call text,
  ADD COLUMN IF NOT EXISTS price_in_person  text;
