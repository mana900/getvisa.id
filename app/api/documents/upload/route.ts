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

export async function POST(request: NextRequest) {
  try {
    // Get the form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string
    const userId = formData.get('userId') as string
    const applicationId = formData.get('applicationId') as string

    if (!file || !category || !userId || !applicationId) {
      return NextResponse.json(
        { error: 'File, category, userId, and applicationId are required' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPG, PNG, DOC, and DOCX files are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Generate unique file path
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${userId}/${applicationId}/${category}/${fileName}`

    // Convert File to ArrayBuffer then to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, buffer, {
        contentType: file.type,
        duplex: 'half'
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file to storage' },
        { status: 500 }
      )
    }

    // Save document record to database
    const { data: documentData, error: dbError } = await supabase
      .from('documents')
      .insert({
        application_id: applicationId,
        filename: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        category: category,
        status: 'pending'
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database insert error:', dbError)
      // Clean up uploaded file if database insert fails
      await supabase.storage.from('documents').remove([filePath])
      return NextResponse.json(
        { error: 'Failed to save document record' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      document: documentData,
      message: 'File uploaded successfully'
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}