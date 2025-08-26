import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/types/database'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.nextUrl.searchParams.get('userEmail')

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      )
    }

    // Get user by email
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers()
    if (userError) {
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      )
    }

    const user = userData.users.find(u => u.email === userEmail)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Fetch user's documents through their visa applications
    const { data: documents, error } = await supabase
      .from('documents')
      .select(`
        *,
        visa_applications!inner(
          id,
          user_id,
          status
        )
      `)
      .eq('visa_applications.user_id', user.id)
      .order('uploaded_at', { ascending: false })

    if (error) {
      console.error('Error fetching user documents:', error)
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
    }

    // Transform documents to match dashboard format
    const transformedDocuments = documents.map(doc => ({
      id: doc.id,
      name: doc.filename,
      size: doc.file_size,
      type: doc.mime_type?.split('/')[1]?.toUpperCase() || 'FILE',
      status: doc.status,
      category: doc.category,
      uploadDate: doc.uploaded_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      applicant: `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || 'User',
      application: 'Visa Application',
      rejectionReason: doc.rejection_reason || undefined,
      reviewedAt: doc.reviewed_at || undefined,
      reviewedBy: doc.reviewed_by || undefined
    }))

    return NextResponse.json(transformedDocuments)

  } catch (error) {
    console.error('Error fetching user documents:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}