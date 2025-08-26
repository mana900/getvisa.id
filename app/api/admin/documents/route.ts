import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/types/database'

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)


export async function GET() {
  try {
    // Fetch real documents from Supabase with user and application info
    const { data: documents, error } = await supabaseAdmin
      .from('documents')
      .select(`
        *,
        visa_applications!inner(
          id,
          user_id,
          status
        )
      `)
      .order('uploaded_at', { ascending: false })

    if (error) {
      console.error('Error fetching documents:', error)
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
    }

    // Get all unique user IDs from documents
    const userIds = [...new Set(documents.map(doc => doc.visa_applications.user_id))]
    
    // Fetch user details for all users
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers()
    if (userError) {
      console.error('Error fetching users:', error)
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 })
    }

    // Create a map of user ID to user info
    const userMap = new Map()
    userData.users.forEach(user => {
      userMap.set(user.id, {
        email: user.email,
        firstName: user.user_metadata?.first_name || 'N/A',
        lastName: user.user_metadata?.last_name || 'N/A'
      })
    })

    // Transform documents to include user information
    const transformedDocuments = documents.map(doc => {
      const user = userMap.get(doc.visa_applications.user_id)
      return {
        id: doc.id,
        name: doc.filename,
        size: doc.file_size,
        type: doc.mime_type?.split('/')[1]?.toUpperCase() || 'FILE',
        status: doc.status,
        category: doc.category,
        uploadDate: doc.uploaded_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        applicant: user ? `${user.firstName} ${user.lastName}`.trim() : 'Unknown User',
        application: 'Visa Application', // Could be enhanced to include actual visa type
        userId: doc.visa_applications.user_id,
        userEmail: user?.email || 'unknown@email.com',
        rejectionReason: doc.rejection_reason || undefined,
        reviewedAt: doc.reviewed_at || undefined,
        reviewedBy: doc.reviewed_by || undefined
      }
    })

    return NextResponse.json(transformedDocuments)
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }
}