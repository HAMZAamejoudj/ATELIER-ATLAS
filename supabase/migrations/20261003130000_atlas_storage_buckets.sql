-- Storage buckets for ATELIER ATLAS admin

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('atlas-site', 'atlas-site', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('atlas-products', 'atlas-products', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('atlas-blog', 'atlas-blog', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public_read_atlas_site" ON storage.objects
  FOR SELECT USING (bucket_id = 'atlas-site');

CREATE POLICY "public_read_atlas_products" ON storage.objects
  FOR SELECT USING (bucket_id = 'atlas-products');

CREATE POLICY "public_read_atlas_blog" ON storage.objects
  FOR SELECT USING (bucket_id = 'atlas-blog');
