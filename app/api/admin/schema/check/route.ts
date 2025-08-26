import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
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
    // Get table structure by trying to select all columns from an empty result set
    const { data, error } = await supabaseAdmin
      .from('documents')
      .select('*')
      .limit(0)
    
    if (error) {
      console.error('Schema check error:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to check schema',
        details: error
      }, { status: 500 })
    }

    // Get one document to see its structure
    const { data: sampleDoc, error: sampleError } = await supabaseAdmin
      .from('documents')
      .select('*')
      .limit(1)
      .single()
    
    return NextResponse.json({
      success: true,
      message: 'Schema check complete',
      sampleDocument: sampleDoc,
      sampleDocumentKeys: sampleDoc ? Object.keys(sampleDoc) : []
    })
    
  } catch (error) {
    console.error('Schema check error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to check schema',
      details: error
    }, { status: 500 })
  }
}