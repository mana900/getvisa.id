-- Add rejection_reason column to documents table
ALTER TABLE documents ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Add reviewed_at and reviewed_by columns for audit trail
ALTER TABLE documents ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id);