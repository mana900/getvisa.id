const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createSettingsTable() {
  try {
    console.log('Checking if settings table exists...')
    
    // Try to query the settings table to see if it exists
    const { data: existingData, error: existingError } = await supabase
      .from('settings')
      .select('count(*)', { count: 'exact', head: true })
    
    if (!existingError) {
      console.log('Settings table already exists!')
      console.log('Current settings count:', existingData)
      return
    }
    
    console.log('Settings table does not exist. Please create it manually in your Supabase dashboard.')
    console.log('Run this SQL in your Supabase SQL editor:')
    console.log(`
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
-- Only admins can manage settings
CREATE POLICY "Admins can manage all settings" ON settings
  FOR ALL USING (
    (auth.jwt() ->> 'user_metadata'->>'role') = 'admin'
  );

-- Create trigger for updated_at (if update_updated_at_column function exists)
CREATE TRIGGER update_settings_updated_at 
  BEFORE UPDATE ON settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
  ('whatsapp_number', '', 'WhatsApp number for visa consultation messages'),
  ('whatsapp_message_template', 'I''d like to apply for Visa - ({countryName}) - ({visaType}) - ', 'WhatsApp message template for visa consultations')
ON CONFLICT (key) DO NOTHING;
    `)
    
  } catch (error) {
    console.error('Unexpected error:', error)
    process.exit(1)
  }
}

createSettingsTable()