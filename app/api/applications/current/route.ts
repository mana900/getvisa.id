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

    // Get or create visa application for this user
    let { data: application, error: appError } = await supabase
      .from('visa_applications')
      .select('*')
      .eq('user_id', user.id)
      .order('submitted_at', { ascending: false })
      .limit(1)
      .single()

    if (appError && appError.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Failed to fetch application' },
        { status: 500 }
      )
    }

    // If no application exists, create one
    if (!application) {
      // First, get a default visa type (we'll use the first available one)
      const { data: visaTypes, error: visaError } = await supabase
        .from('visa_types')
        .select('id')
        .limit(1)
        .single()

      if (visaError || !visaTypes) {
        return NextResponse.json(
          { error: 'No visa types available' },
          { status: 500 }
        )
      }

      const { data: newApplication, error: createError } = await supabase
        .from('visa_applications')
        .insert({
          user_id: user.id,
          visa_type_id: visaTypes.id,
          status: 'pending',
          application_data: {}
        })
        .select()
        .single()

      if (createError) {
        return NextResponse.json(
          { error: 'Failed to create application' },
          { status: 500 }
        )
      }

      application = newApplication
    }

    return NextResponse.json({
      application,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.user_metadata?.first_name || '',
        lastName: user.user_metadata?.last_name || ''
      }
    })

  } catch (error) {
    console.error('Application fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}