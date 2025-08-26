-- Drop the profiles-related trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Drop profiles-related trigger
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Drop policies that reference profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Drop the profiles table
DROP TABLE IF EXISTS profiles CASCADE;