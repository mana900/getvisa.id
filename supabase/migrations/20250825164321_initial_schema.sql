-- Enable RLS (Row Level Security)
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create users table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create visa_types table
CREATE TABLE IF NOT EXISTS visa_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country TEXT NOT NULL,
  country_code TEXT NOT NULL,
  flag TEXT NOT NULL,
  visa_type TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  processing_time TEXT NOT NULL,
  duration TEXT NOT NULL,
  validity TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  overview JSONB DEFAULT '{}'::jsonb,
  eligibility TEXT[] DEFAULT ARRAY[]::TEXT[],
  timeline JSONB DEFAULT '[]'::jsonb,
  documents TEXT[] DEFAULT ARRAY[]::TEXT[],
  faqs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create visa_applications table
CREATE TABLE IF NOT EXISTS visa_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  visa_type_id UUID REFERENCES visa_types(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'processing')),
  application_data JSONB DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table for file storage
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES visa_applications(id) ON DELETE CASCADE NOT NULL,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS visa_types_country_code_idx ON visa_types(country_code);
CREATE INDEX IF NOT EXISTS visa_types_is_active_idx ON visa_types(is_active);
CREATE INDEX IF NOT EXISTS visa_applications_user_id_idx ON visa_applications(user_id);
CREATE INDEX IF NOT EXISTS visa_applications_status_idx ON visa_applications(status);
CREATE INDEX IF NOT EXISTS documents_application_id_idx ON documents(application_id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admin can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Visa types policies (public read, admin write)
CREATE POLICY "Anyone can view active visa types" ON visa_types
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage visa types" ON visa_types
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Visa applications policies
CREATE POLICY "Users can view their own applications" ON visa_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own applications" ON visa_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" ON visa_applications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all applications" ON visa_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Documents policies
CREATE POLICY "Users can view their own documents" ON documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM visa_applications 
      WHERE id = documents.application_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload documents for their applications" ON documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM visa_applications 
      WHERE id = documents.application_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all documents" ON documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Functions

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visa_types_updated_at 
  BEFORE UPDATE ON visa_types 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visa_applications_updated_at 
  BEFORE UPDATE ON visa_applications 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Storage policies
CREATE POLICY "Users can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can manage all documents" ON storage.objects
  FOR ALL USING (
    bucket_id = 'documents' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );