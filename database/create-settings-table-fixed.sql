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

-- Enable RLS for settings table
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for settings
-- Only admins can manage settings (fixed JSON operator)
CREATE POLICY "Admins can manage all settings" ON settings
  FOR ALL USING (
    auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
  );

-- Create trigger for updated_at (only if the function exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        CREATE TRIGGER update_settings_updated_at 
        BEFORE UPDATE ON settings 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
  ('whatsapp_number', '', 'WhatsApp number for visa consultation messages'),
  ('whatsapp_message_template', 'I''d like to apply for Visa - ({countryName}) - ({visaType}) - ', 'WhatsApp message template for visa consultations')
ON CONFLICT (key) DO NOTHING;