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

export async function POST() {
  try {
    console.log('Starting database schema update...')
    
    // Add rejection_reason column
    const { data: data1, error: error1 } = await supabaseAdmin
      .from('documents')
      .select('rejection_reason')
      .limit(1)
    
    if (error1 && error1.code === '42703') {
      console.log('Adding rejection_reason column...')
      // Column doesn't exist, we need to add it via SQL
      // Since we can't execute DDL directly, we'll return instructions
      return NextResponse.json({
        success: false,
        message: 'Schema update needed',
        instructions: [
          'The following columns need to be added to the documents table:',
          '1. ALTER TABLE documents ADD COLUMN rejection_reason TEXT;',
          '2. ALTER TABLE documents ADD COLUMN reviewed_at TIMESTAMP WITH TIME ZONE;',
          '3. ALTER TABLE documents ADD COLUMN reviewed_by UUID REFERENCES auth.users(id);',
          '',
          'Please run these SQL commands in your Supabase dashboard under SQL Editor.',
          'After adding the columns, the document review system will work fully.'
        ]
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Schema appears to be up to date'
    })
    
  } catch (error) {
    console.error('Schema update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to check/update schema',
      details: error
    }, { status: 500 })
  }
}