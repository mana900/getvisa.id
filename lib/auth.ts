import { createContext, useContext } from 'react'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'user'
  avatar?: string
  createdAt: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (userData: RegisterData) => Promise<boolean>
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Mock user data for development
export const mockUsers = [
  {
    id: '1',
    email: 'admin@getvisa.id',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin' as const,
    password: 'admin123',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2', 
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user' as const,
    password: 'user123',
    createdAt: '2024-01-15T00:00:00Z'
  }
]

export const validateCredentials = (email: string, password: string): User | null => {
  const user = mockUsers.find(u => u.email === email && u.password === password)
  if (user) {
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  return null
}