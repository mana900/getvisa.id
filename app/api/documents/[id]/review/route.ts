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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id
    const { status, rejectionReason, reviewedBy } = await request.json()

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "approved" or "rejected"' },
        { status: 400 }
      )
    }

    if (status === 'rejected' && !rejectionReason) {
      return NextResponse.json(
        { error: 'Rejection reason is required when rejecting a document' },
        { status: 400 }
      )
    }

    if (!reviewedBy) {
      return NextResponse.json(
        { error: 'Reviewer ID is required' },
        { status: 400 }
      )
    }

    // First, verify the document exists
    const { data: document, error: docError } = await supabaseAdmin
      .from('documents')
      .select('id, filename, status')
      .eq('id', documentId)
      .single()

    if (docError || !document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Now we can update all fields since the columns exist
    const updateData: any = {
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewedBy,
      updated_at: new Date().toISOString()
    }

    // Add rejection reason if rejecting, clear it if approving
    if (status === 'rejected' && rejectionReason) {
      updateData.rejection_reason = rejectionReason
    } else if (status === 'approved') {
      updateData.rejection_reason = null
    }

    const { data: updatedDoc, error: updateError } = await supabaseAdmin
      .from('documents')
      .update(updateData)
      .eq('id', documentId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating document:', updateError)
      return NextResponse.json(
        { error: 'Failed to update document status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Document ${status} successfully`,
      document: updatedDoc,
      rejectionReason: status === 'rejected' ? rejectionReason : null
    })

  } catch (error) {
    console.error('Error reviewing document:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}