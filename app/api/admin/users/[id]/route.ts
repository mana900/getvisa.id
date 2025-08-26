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

// GET - Get single user
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data: user, error } = await supabaseAdmin.auth.admin.getUserById(params.id)

    if (error) {
      console.error('Error fetching user:', error)
      return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
    }

    if (!user.user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user.user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

// PUT - Update user
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { email, firstName, lastName, role } = await request.json()

    if (!email || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(params.id, {
      email,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        role: role || 'user'
      }
    })

    if (error) {
      console.error('Error updating user:', error)
      return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 500 })
    }

    return NextResponse.json(data.user)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

// DELETE - Delete user
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(params.id)

    if (error) {
      console.error('Error deleting user:', error)
      return NextResponse.json({ error: error.message || 'Failed to delete user' }, { status: 500 })
    }

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}