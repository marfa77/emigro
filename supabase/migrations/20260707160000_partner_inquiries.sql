-- Partner recruitment inquiries from provider directory placements

CREATE TABLE IF NOT EXISTS emigro_partner_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  telegram TEXT,
  website TEXT,
  countries TEXT,
  services TEXT,
  message TEXT,
  corridor_slug TEXT,
  topic_key TEXT,
  placement TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS emigro_partner_inquiries_created_idx
  ON emigro_partner_inquiries (created_at DESC);

ALTER TABLE emigro_partner_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_partner_inquiries" ON emigro_partner_inquiries;
CREATE POLICY "anon_insert_partner_inquiries" ON emigro_partner_inquiries
  FOR INSERT WITH CHECK (true);
