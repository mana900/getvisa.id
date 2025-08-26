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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id

    // First, get the document details to verify it exists and get the file path
    const { data: document, error: docError } = await supabaseAdmin
      .from('documents')
      .select(`
        *,
        visa_applications!inner(
          id,
          user_id
        )
      `)
      .eq('id', documentId)
      .single()

    if (docError || !document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Generate a signed URL for the document that expires in 1 hour
    const { data: signedUrlData, error: urlError } = await supabaseAdmin.storage
      .from('documents')
      .createSignedUrl(document.file_path, 3600) // 1 hour expiry

    if (urlError) {
      console.error('Error generating signed URL:', urlError)
      return NextResponse.json(
        { error: 'Failed to generate document URL' },
        { status: 500 }
      )
    }

    // Return the signed URL
    return NextResponse.json({
      url: signedUrlData.signedUrl,
      filename: document.filename,
      contentType: document.mime_type
    })

  } catch (error) {
    console.error('Error generating document view URL:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}