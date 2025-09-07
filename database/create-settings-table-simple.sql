-- Create settings table for application configuration
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for settings key lookup
CREATE INDEX IF NOT EXISTS settings_key_idx ON settings(key);

-- For now, let's disable RLS to get basic functionality working
-- You can enable it later with proper admin role setup
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
  ('whatsapp_number', '', 'WhatsApp number for visa consultation messages'),
  ('whatsapp_message_template', 'I''d like to apply for Visa - ({countryName}) - ({visaType}) - ', 'WhatsApp message template for visa consultations')
ON CONFLICT (key) DO NOTHING;