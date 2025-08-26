-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('passport', 'photo', 'financial', 'employment', 'travel')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  application TEXT,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for documents
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Users can view their own documents
CREATE POLICY "Users can view own documents" ON documents
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own documents
CREATE POLICY "Users can insert own documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own documents
CREATE POLICY "Users can update own documents" ON documents
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own documents
CREATE POLICY "Users can delete own documents" ON documents
  FOR DELETE USING (auth.uid() = user_id);

-- Admins can view all documents
CREATE POLICY "Admins can view all documents" ON documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Admins can update any document status
CREATE POLICY "Admins can update document status" ON documents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Create storage policies
CREATE POLICY "Users can upload their own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view their own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Admins can view all documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_documents_updated_at 
  BEFORE UPDATE ON documents 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();