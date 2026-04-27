-- Customer-submitted testimonials with auto-expiry after 3 months

ALTER TABLE public.testimonials
  ADD COLUMN IF NOT EXISTS submitted_by_customer boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS pending_approval      boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS expires_at            timestamptz;

-- Refresh public read policy: exclude pending and expired testimonials
DROP POLICY IF EXISTS "Public read active testimonials" ON public.testimonials;

CREATE POLICY "Public read active testimonials"
  ON public.testimonials FOR SELECT
  USING (
    active = true
    AND pending_approval = false
    AND (expires_at IS NULL OR expires_at > now())
  );

-- Allow anonymous users to insert customer submissions (pending only)
CREATE POLICY "Public insert customer testimonials"
  ON public.testimonials FOR INSERT
  WITH CHECK (
    submitted_by_customer = true
    AND pending_approval = true
    AND active = false
  );

CREATE INDEX IF NOT EXISTS testimonials_pending_idx    ON public.testimonials (pending_approval);
CREATE INDEX IF NOT EXISTS testimonials_expires_at_idx ON public.testimonials (expires_at);
