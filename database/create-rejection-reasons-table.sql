-- Create a simple table to store document rejection reasons
-- This is a workaround until we can add columns to the main documents table

CREATE TABLE IF NOT EXISTS document_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('approved', 'rejected')),
  rejection_reason TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_document_reviews_document_id ON document_reviews(document_id);
CREATE INDEX IF NOT EXISTS idx_document_reviews_reviewed_at ON document_reviews(reviewed_at DESC);