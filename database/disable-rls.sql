-- Temporarily disable RLS for testing
-- This should only be used for development/testing

-- Disable RLS on visa_types table
ALTER TABLE visa_types DISABLE ROW LEVEL SECURITY;

-- Disable RLS on profiles table  
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Note: In production, you should have proper RLS policies enabled
-- For now, this allows the admin interface to work without authentication