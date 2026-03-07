-- ============================================
-- Leads Tracker — Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'new',
  service_need TEXT NOT NULL DEFAULT 'warranties',
  company_name TEXT NOT NULL DEFAULT '',
  industry TEXT NOT NULL DEFAULT 'others',
  main_products TEXT NOT NULL DEFAULT '',
  phone1 TEXT NOT NULL DEFAULT '',
  phone1_type TEXT NOT NULL DEFAULT 'idk',
  phone2 TEXT NOT NULL DEFAULT '',
  phone2_type TEXT NOT NULL DEFAULT 'idk',
  whatsapp_number TEXT NOT NULL DEFAULT '',
  task TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  date_added TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public access for now)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read"  ON leads FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON leads FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete" ON leads FOR DELETE USING (true);

-- Index for faster sorting
CREATE INDEX IF NOT EXISTS idx_leads_date_added ON leads (date_added DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_industry ON leads (industry);
