-- Maphoshy Lifestyle — Portfolio Storage Bucket
-- Migration: 011_portfolio_storage_bucket
-- Creates a public Supabase Storage bucket for portfolio images.

-- Create the bucket (public = URLs are accessible without auth)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio',
  'portfolio',
  true,
  10485760,   -- 10 MB per file
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read files (public bucket)
CREATE POLICY IF NOT EXISTS "Public read portfolio storage"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio');

-- Allow the service role (API routes) to upload, update, delete
CREATE POLICY IF NOT EXISTS "Service role manage portfolio storage"
  ON storage.objects FOR ALL
  USING (bucket_id = 'portfolio' AND auth.role() = 'service_role')
  WITH CHECK (bucket_id = 'portfolio' AND auth.role() = 'service_role');
