import { supabase } from '../supabase'
import type { User } from '../types/database'

export interface SignUpData {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface SignInData {
  email: string
  password: string
}

export class AuthService {
  // Sign up new user
  static async signUp(data: SignUpData) {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          role: 'user', // Default role
        },
      },
    })

    if (error) {
      console.error('Error signing up:', error)
      throw new Error(error.message)
    }

    return authData
  }

  // Sign in user
  static async signIn(data: SignInData) {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      console.error('Error signing in:', error)
      throw new Error(error.message)
    }

    return authData
  }

  // Sign out user
  static async signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error signing out:', error)
      // Don't throw error if there's no session to sign out from
      if (error.message !== 'Auth session missing!') {
        throw new Error(error.message)
      }
      // If session is missing, user is already signed out, so continue silently
    }
  }

  // Get current user session
  static async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Error getting session:', error)
      throw new Error(error.message)
    }

    return session
  }

  // Get current user
  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      console.error('Error getting user:', error)
      throw new Error(error.message)
    }

    return user
  }

  // Get user profile from auth.users
  static async getUserProfile(userId: string): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.admin.getUserById(userId)

    if (error) {
      console.error('Error fetching user profile:', error)
      throw new Error('Failed to fetch user profile')
    }

    return user ? {
      id: user.id,
      email: user.email!,
      user_metadata: user.user_metadata || {},
      created_at: user.created_at,
      updated_at: user.updated_at
    } : null
  }

  // Update user metadata
  static async updateUserProfile(userId: string, updates: Partial<User['user_metadata']>): Promise<User> {
    const { data: { user }, error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: updates
    })

    if (error) {
      console.error('Error updating profile:', error)
      throw new Error('Failed to update profile')
    }

    return {
      id: user!.id,
      email: user!.email!,
      user_metadata: user!.user_metadata || {},
      created_at: user!.created_at,
      updated_at: user!.updated_at
    }
  }

  // Get all users (admin only)
  static async getAllUsers(): Promise<User[]> {
    const { data: { users }, error } = await supabase.auth.admin.listUsers()

    if (error) {
      console.error('Error fetching users:', error)
      throw new Error('Failed to fetch users')
    }

    return users?.map(user => ({
      id: user.id,
      email: user.email!,
      user_metadata: user.user_metadata || {},
      created_at: user.created_at,
      updated_at: user.updated_at
    })) || []
  }

  // Update user role (admin only)
  static async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<User> {
    const { data: { user }, error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role }
    })

    if (error) {
      console.error('Error updating user role:', error)
      throw new Error('Failed to update user role')
    }

    return {
      id: user!.id,
      email: user!.email!,
      user_metadata: user!.user_metadata || {},
      created_at: user!.created_at,
      updated_at: user!.updated_at
    }
  }

  // Reset password
  static async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      console.error('Error resetting password:', error)
      throw new Error(error.message)
    }
  }

  // Update password
  static async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      console.error('Error updating password:', error)
      throw new Error(error.message)
    }
  }

  // Subscribe to auth state changes
  static onAuthStateChange(callback: (event: any, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}