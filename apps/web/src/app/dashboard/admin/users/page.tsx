'use client'

import { useState } from 'react'
import Image from 'next/image'

import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, MoreVertical, Shield, User, Brush } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const MOCK_USERS = [
  { id: '1', name: 'Arjun Sharma', email: 'arjun@creator.com', role: 'creator', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun', downloads: 0, items: 24, joined: '2025-01-15', status: 'active' },
  { id: '2', name: 'Priya Patel', email: 'priya@creator.com', role: 'creator', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya', downloads: 0, items: 18, joined: '2025-02-20', status: 'active' },
  { id: '3', name: 'Customer 1', email: 'customer1@example.com', role: 'customer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c1', downloads: 47, items: 0, joined: '2025-03-10', status: 'active' },
  { id: '4', name: 'Customer 2', email: 'customer2@example.com', role: 'customer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c2', downloads: 23, items: 0, joined: '2025-04-05', status: 'active' },
  { id: '5', name: 'Rahul Kumar', email: 'rahul@creator.com', role: 'creator', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul', downloads: 0, items: 31, joined: '2025-01-28', status: 'active' },
  { id: '6', name: 'Vikram Nair', email: 'vikram@creator.com', role: 'creator', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikram', downloads: 0, items: 12, joined: '2025-05-01', status: 'suspended' },
]

const roleConfig = {
  admin: { label: 'Admin', icon: Shield, color: 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400' },
  creator: { label: 'Creator', icon: Brush, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400' },
  customer: { label: 'Customer', icon: User, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400' },
}

export default function AdminUsersPage() {
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  const filtered = MOCK_USERS.filter((u) => {
    const matchQ = !query || u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())
    const matchR = roleFilter === 'all' || u.role === roleFilter
    return matchQ && matchR
  })

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-muted-foreground text-sm">Manage platform users and roles</p>
          </div>
          <Button variant="brand" size="sm">+ Invite User</Button>
        </div>

        <div className="flex gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users..." className="pl-9" />
          </div>
          <div className="flex gap-2">
            {['all', 'admin', 'creator', 'customer'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors capitalize ${roleFilter === r ? 'bg-brand-500 text-white border-brand-500' : 'hover:bg-muted'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">User</th>
                <th className="text-left px-4 py-3 font-medium">Role</th>
                <th className="text-left px-4 py-3 font-medium">Downloads / Items</th>
                <th className="text-left px-4 py-3 font-medium">Joined</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((user) => {
                const rc = roleConfig[user.role as keyof typeof roleConfig]
                return (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Image src={user.avatar} alt={user.name} width={32} height={32} className="rounded-full" />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${rc.color}`}>
                        <rc.icon className="h-3 w-3" />
                        {rc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.role === 'creator' ? `${user.items} items` : `${user.downloads} downloads`}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(user.joined)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="p-1 rounded hover:bg-muted transition-colors">
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No users found</div>
          )}
        </div>
    </div>
  )
}
