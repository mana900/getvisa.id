# Supabase Setup Guide

This guide will help you set up Supabase for your GetVisa.ID application.

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and API keys

## Environment Variables

Your `.env.local` file should contain:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Database Setup

### Step 1: Run the Schema

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Execute the SQL script

This will create:
- `profiles` table for user information
- `visa_types` table for visa data
- `visa_applications` table for user applications
- `documents` table for file uploads
- Row Level Security (RLS) policies
- Storage bucket for document uploads

### Step 2: Migrate Initial Data

Run the data migration script to populate your database with initial visa types:

```bash
npm run migrate-data
```

Or manually run:

```bash
npx ts-node scripts/migrate-data.ts
```

### Step 3: Create Admin User

1. Sign up through your application
2. Go to Supabase dashboard → Authentication → Users
3. Find your user and note the User ID
4. Go to SQL Editor and run:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'your-user-id-here';
```

## Storage Setup

The schema automatically creates a `documents` storage bucket with proper policies for user file uploads.

### Storage Policies

- Users can only upload/view their own documents
- Admins can view all documents
- Files are organized by user ID in folders

## Authentication Features

✅ **User Registration & Login**
✅ **Password Reset**
✅ **Role-based Access Control** (User/Admin)
✅ **Profile Management**
✅ **Session Management**

## Database Features

✅ **Visa Types Management**
✅ **User Applications**
✅ **Document Storage**
✅ **Row Level Security**
✅ **Real-time Subscriptions**

## API Services

The application includes these service classes:

- `AuthService` - Authentication and user management
- `VisaService` - Visa types CRUD operations
- `ApplicationService` - Visa application management (to be implemented)
- `DocumentService` - File upload/download (to be implemented)

## Security

- All tables use Row Level Security (RLS)
- Users can only access their own data
- Admins have full access to manage the system
- File uploads are secured by user ID

## Testing

After setup, you can test:

1. User registration/login
2. Admin panel access (after setting role to admin)
3. Visa types management
4. File uploads (once implemented)

## Troubleshooting

### Common Issues

1. **Environment variables not loading**
   - Make sure `.env.local` is in the root directory
   - Restart your development server

2. **Database connection errors**
   - Verify your Supabase URL and keys
   - Check if the schema was executed properly

3. **RLS policy errors**
   - Ensure users are properly authenticated
   - Check user roles in the profiles table

4. **File upload errors**
   - Verify storage bucket exists
   - Check storage policies are properly set

## Next Steps

1. Update components to use Supabase services
2. Implement real-time features
3. Add email notifications
4. Set up automated backups