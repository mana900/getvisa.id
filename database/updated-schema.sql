-- Updated schema using auth.users instead of custom profiles table
-- This removes RLS policy conflicts and follows Supabase best practices

-- Drop existing problematic tables and policies if they exist
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS visa_applications CASCADE;

-- Create visa_applications table (updated to reference auth.users directly)
CREATE TABLE IF NOT EXISTS visa_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  visa_type_id UUID REFERENCES visa_types(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'processing')),
  application_data JSONB DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table for file storage (updated to reference auth.users)
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
CREATE INDEX IF NOT EXISTS visa_applications_user_id_idx ON visa_applications(user_id);
CREATE INDEX IF NOT EXISTS visa_applications_status_idx ON visa_applications(status);
CREATE INDEX IF NOT EXISTS documents_application_id_idx ON documents(application_id);

-- Enable RLS on new tables (visa_types RLS remains disabled for admin interface)
ALTER TABLE visa_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for visa_applications (using auth.users)
CREATE POLICY "Users can view their own applications" ON visa_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own applications" ON visa_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" ON visa_applications
  FOR UPDATE USING (auth.uid() = user_id);

-- Admin policy for visa_applications (check user metadata for admin role)
CREATE POLICY "Admins can manage all applications" ON visa_applications
  FOR ALL USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

-- RLS Policies for documents (using auth.users)
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

-- Admin policy for documents
CREATE POLICY "Admins can manage all documents" ON documents
  FOR ALL USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

-- Update updated_at timestamp function (reuse existing function)
CREATE TRIGGER update_visa_applications_updated_at 
  BEFORE UPDATE ON visa_applications 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Storage policies (update to use auth.users metadata)
-- Drop existing storage policies first
DROP POLICY IF EXISTS "Users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage all documents" ON storage.objects;

-- Create updated storage policies
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
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );