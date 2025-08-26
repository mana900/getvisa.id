import { NextRequest, NextResponse } from 'next/server'
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // First, verify the document exists and belongs to the user
    const { data: document, error: docError } = await supabaseAdmin
      .from('documents')
      .select(`
        id,
        filename,
        file_path,
        visa_applications!inner(
          id,
          user_id
        )
      `)
      .eq('id', documentId)
      .eq('visa_applications.user_id', userId)
      .single()

    if (docError || !document) {
      return NextResponse.json(
        { error: 'Document not found or access denied' },
        { status: 404 }
      )
    }

    // Delete file from Supabase Storage
    const { error: storageError } = await supabaseAdmin.storage
      .from('documents')
      .remove([document.file_path])

    if (storageError) {
      console.error('Error deleting file from storage:', storageError)
      // Continue with database deletion even if storage deletion fails
    }

    // Delete document record from database
    const { error: deleteError } = await supabaseAdmin
      .from('documents')
      .delete()
      .eq('id', documentId)

    if (deleteError) {
      console.error('Error deleting document from database:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete document from database' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}