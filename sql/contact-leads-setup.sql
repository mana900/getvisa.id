-- Create contact_leads table to store user contact information
CREATE TABLE IF NOT EXISTS contact_leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  visa_type VARCHAR(100) NOT NULL,
  visa_id UUID,
  price INTEGER,
  whatsapp_clicked BOOLEAN DEFAULT FALSE,
  whatsapp_clicked_at TIMESTAMP WITH TIME ZONE,
  source VARCHAR(50) DEFAULT 'visa_detail_page',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_leads ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
DROP POLICY IF EXISTS "contact_leads_admin_policy" ON contact_leads;
CREATE POLICY "contact_leads_admin_policy" ON contact_leads
FOR ALL USING (true);

-- Create updated_at trigger (if update_updated_at_column function exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        DROP TRIGGER IF EXISTS update_contact_leads_updated_at ON contact_leads;
        CREATE TRIGGER update_contact_leads_updated_at
            BEFORE UPDATE ON contact_leads
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;