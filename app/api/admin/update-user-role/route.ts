import { NextRequest, NextResponse } from 'next/server'
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

export async function POST(request: NextRequest) {
  try {
    const { email, role } = await request.json()
    
    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 })
    }

    // Get user by email
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      console.error('Error listing users:', listError)
      return NextResponse.json({ error: 'Failed to find user' }, { status: 500 })
    }

    const user = users.users.find(u => u.email === email)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user role
    const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        role: role,
        first_name: user.user_metadata?.first_name,
        last_name: user.user_metadata?.last_name
      }
    })

    if (updateError) {
      console.error('Error updating user role:', updateError)
      return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `User ${email} role updated to ${role}`,
      user: updatedUser.user
    })
    
  } catch (error: any) {
    console.error('Error updating user role:', error)
    return NextResponse.json({ 
      error: error.message || 'Internal server error'
    }, { status: 500 })
  }
}