"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { User } from "@/lib/types/database"
import { Search, UserPlus, Edit, Trash2, Shield, User as UserIcon } from "lucide-react"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users')
        if (response.ok) {
          const userData = await response.json()
          setUsers(userData)
        }
      } catch (error) {
        console.error('Failed to fetch users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user =>
    (user.user_metadata?.first_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (user.user_metadata?.last_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  )

  const getRoleBadge = (role: string) => {
    return role === 'admin' 
      ? "bg-red-100 text-red-800"
      : "bg-blue-100 text-blue-800"
  }

  const getRoleIcon = (role: string) => {
    return role === 'admin' ? Shield : UserIcon
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('User deleted successfully!')
        // Refresh the users list
        setUsers(prev => prev.filter(user => user.id !== userId))
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to delete user'}`)
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error deleting user')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <Link href="/admin/users/add">
          <Button className="bg-red-600 hover:bg-red-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Users ({filteredUsers.length})</CardTitle>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Created</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const role = user.user_metadata?.role || 'user'
                    const RoleIcon = getRoleIcon(role)
                    const firstName = user.user_metadata?.first_name || 'N/A'
                    const lastName = user.user_metadata?.last_name || 'N/A'
                    return (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {firstName[0]}{lastName[0]}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {firstName} {lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{user.email}</td>
                        <td className="py-3 px-4">
                          <Badge className={`${getRoleBadge(role)} flex items-center gap-1 w-fit`}>
                            <RoleIcon className="w-3 h-3" />
                            {role}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Link href={`/admin/users/${user.id}/edit`}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteUser(user.id, `${firstName} ${lastName}`)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}